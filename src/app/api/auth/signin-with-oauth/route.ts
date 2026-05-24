import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";
import { z } from "zod";

import Account from "@/app/database/account.model";
import User from "@/app/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/htpp-error";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

export async function POST(request: Request) {
    const { authProvider, authProviderId, user } = await request.json();

    await dbConnect();

    const session = await mongoose.startSession(); // Start a new session for transaction to ensure atomicity. if any operation fails, the transaction entire transaction will be rolled back.
    session.startTransaction();

    try {
        const validatedDate = SignInWithOAuthSchema.safeParse({
            authProvider,
            authProviderId,
            user,
        });
        if (!validatedDate.success) {
            throw new ValidationError(
                z.flattenError(validatedDate.error).fieldErrors,
            );
        }

        const { name, username, email, image } = user;

        const slugifiedUsername = slugify(username, {
            lower: true,
            strict: true,
            trim: true,
        });

        let existingUser = await User.findOne({ email }).session(session);

        if (!existingUser) {
            [existingUser] = await User.create(
                [{ name, username: slugifiedUsername, email, image }],
                { session },
            );
        } else {
            const updatedData: {
                name?: string;
                username?: string;
                image?: string;
            } = {};

            if (existingUser.name !== name) updatedData.name = name;
            if (existingUser.image !== image) updatedData.image = image;

            if (Object.keys(updatedData).length > 0) {
                await User.updateOne(
                    { _id: existingUser._id },
                    { $set: updatedData },
                ).session(session);
            }
        }
        const existingAccount = await Account.findOne({
            userId: existingUser._id,
            authProvider,
            authProviderId,
        }).session(session);

        if (!existingAccount) {
            await Account.create(
                [
                    {
                        userId: existingUser._id,
                        name,
                        image,
                        authProvider,
                        authProviderId,
                    },
                ],
                { session },
            );
        }

        await session.commitTransaction(); // Commit the transaction if all operations are successful
        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        await session.abortTransaction(); // Rollback the transaction in case of any error
        return handleError(error, "api") as APIErrorResponse;
    } finally {
        await session.endSession();
    }
}
