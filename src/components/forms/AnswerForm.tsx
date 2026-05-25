"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    // FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { AnswerSchema } from "@/lib/validations";

const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

interface Props {
    questionId: string;
    questionTitle: string;
    questionContent: string;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
    const [isAnswering, startAnsweringTransition] = useTransition();
    const [isAISubmitting, setIsAISubmitting] = useState(false);

    const session = useSession();

    const editorRef = useRef<MDXEditorMethods>(null);

    const form = useForm<z.infer<typeof AnswerSchema>>({
        resolver: zodResolver(AnswerSchema),
        defaultValues: { content: "" },
    });

    const handleSubmit = async (value: z.infer<typeof AnswerSchema>) => {
        startAnsweringTransition(async () => {
            const result = await createAnswer({
                questionId,
                content: value.content,
            });

            if (result.success) {
                form.reset();

                toast({
                    title: "Success",
                    description: "Your answer has been posted successfully.",
                });

                if (editorRef.current) {
                    editorRef.current.setMarkdown("");
                }
            } else {
                toast({
                    title: "Error",
                    description:
                        result.error?.message ||
                        "An error occurred while posting your answer.",
                    variant: "destructive",
                });
            }
        });
    };

    const generateAIAnswer = async () => {
        if (session.status !== "authenticated") {
            return toast({
                title: "Unauthorized",
                description: "You must be logged in to generate an AI answer.",
            });
        }
        setIsAISubmitting(true);

        const userAnswer = editorRef.current?.getMarkdown();

        try {
            const { success, data, error } = await api.ai.getAnswer(
                questionTitle,
                questionContent,
                userAnswer,
            );

            // const { success, data, error } = {
            //     success: true,
            //     data: "This is a sample AI-generated answer. Replace this with actual API response.",
            //     error: null,
            // };

            if (!success) {
                return toast({
                    title: "Error",
                    description:
                        error?.message ||
                        "An error occurred while generating AI answer.",
                    variant: "destructive",
                });
            }

            const formattedAnswer = data
                .replace(/<br>/g, " ")
                .toString()
                .trim();

            if (editorRef.current) {
                editorRef.current.setMarkdown(formattedAnswer);

                form.setValue("content", formattedAnswer);
                form.trigger("content");
            }

            toast({
                title: "Success",
                description: "AI answer generated successfully.",
            });
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "An error occurred while generating AI answer.",
                variant: "destructive",
            });
        } finally {
            setIsAISubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
                <h4 className="paragraph-semibold text-dark400_light800">
                    Write your answer here
                </h4>
                <Button
                    className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
                    disabled={isAISubmitting}
                    onClick={generateAIAnswer}
                >
                    {isAISubmitting ? (
                        <>
                            <ReloadIcon className="mr-2 size-4 animate-spin" />
                            AI Generating...
                        </>
                    ) : (
                        <>
                            <Image
                                src="/icons/stars.svg"
                                alt="Generate with AI"
                                width={12}
                                height={12}
                                className="object-contain"
                            />
                            Generate AI Answer
                        </>
                    )}
                </Button>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="mt-6 flex w-full flex-col gap-10"
                >
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem className="flex w-full flex-col gap-3 mt-3.5">
                                <FormControl>
                                    <Editor
                                        value={field.value}
                                        editorRef={editorRef}
                                        fieldChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="primary-gradient w-fit"
                        >
                            {isAnswering ? (
                                <>
                                    <ReloadIcon className="mr-2 size-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post Answer"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AnswerForm;
