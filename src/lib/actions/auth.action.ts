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
import { NotFoundError } from '../htpp-error';
import { SignInSchema, SignUpSchema } from '../validations';


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

export async function signInWithCredentials(params: Pick<AuthCredentials, 'email' | 'password'>): Promise<ActionResponse> {

  console.log('Signing in with credentials:', params);

  const validationResult = await actionHandler({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) throw new NotFoundError("User");
    

    const existingAccount = await Account.findOne({ authProvider: 'credentials', authProviderId: email });
    if (!existingAccount) throw new NotFoundError("Account");
    
    const passwordMatch = await bcrypt.compare(password, existingAccount.password!);

    if (!passwordMatch) throw new Error("Invalid credentials");

    await signIn('credentials', { email, password,  redirect: false });

    return { success: true };

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

}