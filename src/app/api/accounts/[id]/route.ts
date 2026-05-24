import { NextResponse } from "next/server";
import { z } from "zod";

import Account from "@/app/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/htpp-error";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";

// GET /api/accounts/[id]
export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Account");

    try {
        await dbConnect();
        const account = await Account.findById(id);
        if (!account) throw new NotFoundError("Account");

        return NextResponse.json(
            { success: true, data: account },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// DELETE /api/accounts/[id]
export async function DELETE(
    _: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        const account = await Account.findByIdAndDelete(id);
        if (!account) throw new NotFoundError("Account");

        return NextResponse.json(
            { success: true, data: account },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}

// PUT /api/accounts/[id]
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    if (!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        const body = await request.json();

        const validatedData = AccountSchema.partial().safeParse(body);

        if (!validatedData.success) {
            throw new ValidationError(
                z.flattenError(validatedData.error).fieldErrors,
            );
        }

        const updatedAccount = await Account.findByIdAndUpdate(
            id,
            validatedData,
            { returnDocument: "after" },
        );

        if (!updatedAccount) throw new NotFoundError("Account");

        return NextResponse.json(
            { success: true, data: updatedAccount },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
