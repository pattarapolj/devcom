
import { NextResponse } from "next/server";
import { z } from "zod";

import User from "@/app/database/user.model";
import { APIErrorResponse } from "@/global";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/htpp-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const { email } = await request.json();

  try {
    await dbConnect();
    const validatedData = UserSchema.partial().safeParse({ email });

    if (!validatedData.success) {
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
    }

    const user = await User.findOne({ email: validatedData.data.email });

    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });



  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}