import { z } from "zod";

export const SignInSchema = z.object({
    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Please provide a valid email address." }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long. " })
        .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long." })
        .max(30, { message: "Username cannot exceed 30 characters." })
        .regex(/^[a-zA-Z0-9_]+$/, {
            message:
                "Username can only contain letters, numbers, and underscores.",
        }),

    name: z
        .string()
        .min(1, { message: "Name is required." })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .regex(/^[a-zA-Z\s]+$/, {
            message: "Name can only contain letters and spaces.",
        }),

    email: z
        .string()
        .min(1, { message: "Email is required." })
        .email({ message: "Please provide a valid email address." }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(100, { message: "Password cannot exceed 100 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number.",
        })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain at least one special character.",
        }),
});

export const AskQuestionSchema = z.object({
    title: z
        .string()
        .min(1, { message: "Title is required." })
        .max(100, { message: "Title cannot exceed 100 characters." }),
    content: z.string().min(1, { message: "Content is required." }),
    tags: z
        .array(
            z
                .string()
                .min(1, { message: "Tag cannot be empty." })
                .max(30, { message: "Tag cannot exceed 30 characters." }),
        )
        .min(1, { message: "At least one tag is required." })
        .max(3, { message: "Cannot add more than 3 tags." }),
});

export const UserSchema = z.object({
    name: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Name is required" }),
    username: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(3, { message: "Username must be atleast 3 characters long" }),
    email: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .email({ message: "Please provide a valid email address" }),
    bio: z
        .string()
        .max(160, { message: "Bio cannot exceed 160 characters" })
        .optional(),
    image: z
        .url({ message: "Please provide a valid URL for the image" })
        .optional(),
    location: z
        .string()
        .max(100, { message: "Location cannot exceed 100 characters" })
        .optional(),
    portfolio: z
        .url({ message: "Please provide a valid URL for the portfolio" })
        .optional(),
    reputation: z.number().optional(),
});

export const AccountSchema = z.object({
    userId: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "User ID is required" }),
    name: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Name is required" }),
    image: z
        .url({ message: "Please provide a valid URL for the image" })
        .optional(),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .max(100, { message: "Password cannot exceed 100 characters." })
        .regex(/[A-Z]/, {
            message: "Password must contain at least one uppercase letter.",
        })
        .regex(/[a-z]/, {
            message: "Password must contain at least one lowercase letter.",
        })
        .regex(/[0-9]/, {
            message: "Password must contain at least one number.",
        })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Password must contain at least one special character.",
        })
        .optional(),
    authProvider: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Auth provider is required" }),
    authProviderId: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Auth provider ID is required" }),
});

export const SignInWithOAuthSchema = z.object({
    authProvider: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Auth provider is required" }),
    authProviderId: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Auth provider ID is required" }),
    user: z.object({
        name: z
            .string({
                error: (issue) =>
                    issue.input === undefined ? "Required" : undefined,
            })
            .min(1, { message: "Name is required" }),
        username: z
            .string({
                error: (issue) =>
                    issue.input === undefined ? "Required" : undefined,
            })
            .min(3, { message: "Username must be atleast 3 characters long" }),
        email: z.email({ message: "Please provide a valid email address" }),
        image: z
            .url({ message: "Please provide a valid URL for the image" })
            .optional(),
    }),
});

export const EditQuestionSchema = AskQuestionSchema.extend({
    questionId: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Question ID is required" }),
});

export const GetQuestionSchema = z.object({
    questionId: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Question ID is required" }),
});

export const PaginatedSearchSchema = z.object({
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().default(10),
    query: z.string().optional(),
    filter: z.string().optional(),
    sort: z.string().optional(),
});

export const GetTagQuestionsSchema = PaginatedSearchSchema.extend({
    tagId: z
        .string({
            error: (issue) =>
                issue.input === undefined ? "Required" : undefined,
        })
        .min(1, { message: "Tag ID is required" }),
});
