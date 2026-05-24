"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { toast } from "@/hooks/use-toast";
import { toggleSaveQuestion } from "@/lib/actions/collection.action";

const SaveQuestion = ({ questionId }: { questionId: string }) => {
    const session = useSession();

    const userId = session?.data?.user?.id;
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (isLoading) return;
        if (!userId)
            return toast({
                title: "You must be logged in to save questions",
                variant: "destructive",
            });

        setIsLoading(true);
        try {
            const { success, data, error } = await toggleSaveQuestion({
                questionId,
            });
            if (!success) {
                throw new Error(
                    error?.message || "Failed to toggle save question",
                );
            }
            toast({
                title: `Question ${data?.saved ? "saved" : "removed from saved"} successfully`,
            });
        } catch (error) {
            toast({
                title: "An error occurred while saving the question",
                description:
                    error instanceof Error ? error.message : "Unknown error",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const hasSaved = false;

    return (
        <Image
            src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
            width={18}
            height={18}
            alt="Save"
            className={`cursor-pointer ${isLoading && "opacity-50"}`}
            aria-label="Save Question"
            onClick={handleSave}
        />
    );
};

export default SaveQuestion;
