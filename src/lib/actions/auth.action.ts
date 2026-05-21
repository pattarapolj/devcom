"use server"

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import { AuthCredentials } from '@/action';
import Account from '@/app/database/account.model';
import User from '@/app/database/user.model';
import { signIn } from '@/auth';
import { ActionResponse, ErrorResponse } from '@/global';

import actionHandler from '../handlers/action';
import handleError from '../handlers/error';
import { SignUpSchema } from '../validations';


export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse> {

  const validationResult = await actionHandler({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ name, username, email, password: hashedPassword }], { session });

    await Account.create([{ userId: newUser._id, name, authProvider: 'credentials', authProviderId: email, password: hashedPassword }], { session });


    await session.commitTransaction();

    await signIn('credentials', { email, password,  redirect: false });

    return { success: true };

  } catch (error) {
    session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }


}