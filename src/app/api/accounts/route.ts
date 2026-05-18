import { NextResponse } from "next/server";
import { z } from "zod";

import Account from "@/app/database/account.model";
import { APIErrorResponse } from "@/global";
import handleError from "@/lib/handlers/error";
import { ForbiddenError, ValidationError } from "@/lib/htpp-error";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

export async function GET() {
  try {
    await dbConnect();
    
    const accounts = await Account.find();

    return NextResponse.json({
      success: true,
      data: accounts
    }, { status: 200 })
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// Create User
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = AccountSchema.safeParse(body);

    if(!validatedData.success) {
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
    }

    const existingAccount = await Account.findOne({ 
      provider: validatedData.data.authProvider,
      providerId: validatedData.data.authProviderId
    });

    if (existingAccount) throw new ForbiddenError("Account with this provider or ID already exists");

    const newAccount = await Account.create(validatedData);

    return NextResponse.json({ success: true, data: newAccount }, { status: 201 });
    

  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}