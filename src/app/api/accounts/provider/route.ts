
import { NextResponse } from "next/server";
import { z } from "zod";

import Account from "@/app/database/account.model";
import { APIErrorResponse } from "@/global";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/htpp-error";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const { authProviderId } = await request.json();

  try {
    await dbConnect();
    const validatedData = AccountSchema.partial().safeParse({ authProviderId });

    if (!validatedData.success) {
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
    }
    const account = await Account.findOne({ authProviderId });

    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });

  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}