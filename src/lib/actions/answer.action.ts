"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import Answer, { IAnswerDoc } from "@/app/database/answer.model";
import Question from "@/app/database/question.model";
import ROUTES from "@/constants/routes";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../htpp-error";
import { AnswerServerSchema } from "../validations";

export async function createAnswer(
    params: CreateAnswerParams,
): Promise<ActionResponse<IAnswerDoc>> {
    const validationResult = await action({
        params,
        schema: AnswerServerSchema,
        authorize: true,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const { questionId, content } = params;

    const userId = validationResult?.session?.user?.id;

    const session = await mongoose.startSession();

    try {
        const question = await Question.findById(questionId);
        if (!question) throw new NotFoundError("Question");

        const [answer] = await Answer.create(
            [
                {
                    author: userId!,
                    question: questionId,
                    content,
                },
            ],
            session,
        );

        if (!answer) throw new Error("Failed to create answer");

        question.answers += 1;
        await question.save({ session });

        revalidatePath(ROUTES.QUESTION(questionId));

        return {
            success: true,
            data: JSON.parse(JSON.stringify(answer)),
        };
    } catch (error) {
        await session.abortTransaction();
        return handleError(error) as ErrorResponse;
    } finally {
        await session.endSession();
    }
}
