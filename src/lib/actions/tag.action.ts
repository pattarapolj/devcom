import { QueryFilter } from "mongoose";

import Question from "@/app/database/question.model";
import Tag from "@/app/database/tag.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../htpp-error";
import dbConnect from "../mongoose";
import { GetTagQuestionsSchema, PaginatedSearchSchema } from "../validations";

export async function getTags(
    params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchSchema,
    });

    if (validationResult instanceof Error)
        return handleError(validationResult) as ErrorResponse;

    const { page = 1, pageSize = 10, query, filter } = params;

    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const filterQuery: QueryFilter<typeof Tag> = {};

    if (query) {
        filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
    }

    let sortCriteria = {};

    switch (filter) {
        case "popular":
            sortCriteria = { questions: -1 };
            break;
        case "recent":
            sortCriteria = { createdAt: -1 };
            break;
        case "oldest":
            sortCriteria = { createdAt: 1 };
            break;
        case "name":
            sortCriteria = { name: 1 };
            break;
        default:
            sortCriteria = { questions: -1 };
            break;
    }

    try {
        const totalTags = await Tag.countDocuments(filterQuery);
        const tags = await Tag.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = skip + tags.length < totalTags;
        return {
            success: true,
            data: {
                tags: JSON.parse(JSON.stringify(tags)),
                isNext,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getTagQuestions(
    params: GetTagQuestionsParams,
): Promise<
    ActionResponse<{ tag: Tag; questions: Question[]; isNext: boolean }>
> {
    const validationResult = await action({
        params,
        schema: GetTagQuestionsSchema,
    });

    if (validationResult instanceof Error)
        return handleError(validationResult) as ErrorResponse;

    const { page = 1, pageSize = 10, query, tagId } = params;

    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    try {
        const tag = await Tag.findById(tagId);

        if (!tag) throw new NotFoundError("Tag");
        const filterQuery: QueryFilter<typeof Question> = {
            tags: { $in: [tagId] },
        };

        if (query) {
            filterQuery.title = { $regex: query, $options: "i" };
        }

        const totalQuestions = await Question.countDocuments(filterQuery);

        const questions = await Question.find(filterQuery)
            .select(
                "_id title views answers upvotes downvotes author createdAt",
            )
            .populate([
                {
                    path: "author",
                    select: "name image",
                },
                {
                    path: "tags",
                    select: "name",
                },
            ])
            .skip(skip)
            .limit(limit);

        const isNext = skip + questions.length < totalQuestions;

        return {
            success: true,
            data: {
                tag: JSON.parse(JSON.stringify(tag)),
                questions: JSON.parse(JSON.stringify(questions)),
                isNext,
            },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}

export async function getTopTags(): Promise<ActionResponse<{ tags: Tag[] }>> {
    try {
        await dbConnect();
        const tags = await Tag.find().sort({ questions: -1 }).limit(5);

        return {
            success: true,
            data: { tags: JSON.parse(JSON.stringify(tags)) },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
