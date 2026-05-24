"use server";

import { QueryFilter } from "mongoose";

import User from "@/app/database/user.model";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { PaginatedSearchSchema } from "../validations";

export async function GetUser(
    params: PaginatedSearchParams,
): Promise<ActionResponse<{ user: User[]; isNext: boolean }>> {
    const validationResult = await action({
        params,
        schema: PaginatedSearchSchema,
    });

    if (validationResult instanceof Error) {
        return handleError(validationResult) as ErrorResponse;
    }

    const {
        page = 1,
        pageSize = 10,
        query = "",
        filter,
    } = validationResult.params!;
    const skip = (Number(page) - 1) * Number(pageSize);
    const limit = Number(pageSize);

    const filterQuery: QueryFilter<typeof User> = {};

    if (query) {
        filterQuery.$or = [
            { name: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
        ];
    }

    let sortCriteria = {};

    switch (filter) {
        case "newest":
            sortCriteria = { createdAt: -1 };
            break;
        case "oldest":
            sortCriteria = { createdAt: 1 };
            break;
        case "popular":
            sortCriteria = { reputation: -1 };
            break;
        default:
            sortCriteria = { createdAt: -1 };
            break;
    }

    try {
        const totalUsers = await User.countDocuments(filterQuery);

        const users = await User.find(filterQuery)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);

        const isNext = skip + users.length < totalUsers;

        if (!users) {
            return { success: true, data: { user: [], isNext: false } };
        }

        return {
            success: true,
            data: { user: JSON.parse(JSON.stringify(users)), isNext },
        };
    } catch (error) {
        return handleError(error) as ErrorResponse;
    }
}
