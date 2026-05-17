import { NextResponse } from "next/server";
import { z } from "zod";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/htpp-error";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

import { APIErrorResponse } from "@/global";
import User from "@/app/database/user.model";



export async function GET() {
  try {
    await dbConnect();
    
    const users = await User.find();

    return NextResponse.json({
      success: true,
      data: users
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

    const validatedData = UserSchema.safeParse(body);

    if(validatedData.error) {
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const existingUsername = await User.findOne({ username });
    if (existingUsername) throw new Error("Username already exists");

    const newUser = await User.create(validatedData.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
    

  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}