import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/htpp-error";
import { AIAnswerSchema } from "@/lib/validations";

export async function POST(req: Request) {
    const { question, content } = await req.json();

    try {
        const validationData = AIAnswerSchema.safeParse({ question, content });

        if (!validationData.success) {
            throw new ValidationError(
                z.flattenError(validationData.error).fieldErrors,
            );
        }

        const { text } = await generateText({
            model: openai("gpt-4.1-nano"),
            prompt: `Generate a markdown-formatted response to the following question: ${question} based on the provided content: ${content}`,
            system: "You are a help assistant for a programming Q&A platform. Your task is to generate clear, concise, and informative answers to users' programming questions based on the content provided. Ensure that your responses are well-structured, easy to understand, and directly address the user's question. Use markdown formatting to enhance readability, including code blocks for any code snippets. Always aim to provide accurate and helpful information to assist users in solving their programming issues. For code blocks use short-form smaller case language identifiers (e.g., js for JavaScript, py for Python, etc.",
        });
        return NextResponse.json(
            { success: true, data: { text } },
            { status: 200 },
        );
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse;
    }
}
