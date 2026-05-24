"use server";

import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

import Answer, { IAnswerDoc } from "@/app/database/answer.model";
import Question from "@/app/database/question.model";
import ROUTES from "@/constants/routes";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../htpp-error";
import { AnswerServerSchema, GetAnswerSchema } from "../validations";

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

export async function getAnswers(
    params: GetAnswerParams,
): Promise<
    ActionResponse<{ answers: Answer[]; isnext: boolean; totalAnswer: number }>
> {
    const validationResult = await action({
        params,
        schema: GetAnswerSchema,
    });

    if (validationResult instanceof Error)
        return handleError(validationResult) as ErrorResponse;

    const { questionId, page = 1, pageSize = 10, filter } = params;
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    let sortCriteria = {};

    switch (filter) {
        case "latest":
            sortCriteria = { createdAt: -1 };
            break;
        case "oldest":
            sortCriteria = { createdAt: 1 };
            break;
        case "popular":
            sortCriteria = { upvotes: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const totalAnswer = await Answer.countDocuments({
            question: questionId,
        });
        const answers = await Answer.find({ question: questionId })
            .populate("author", "_id name image")
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = skip + answers.length < totalAnswer;

        return {
            success: true,
            data: {
                answers: JSON.parse(JSON.stringify(answers)),
                isnext: isNext,
                totalAnswer,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
