"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";

import { toast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";

interface Params {
    upvotes: number;
    hasUpvoted: boolean;
    downvotes: number;
    hasDownvoted: boolean;
}

const Votes = ({ upvotes, hasUpvoted, downvotes, hasDownvoted }: Params) => {
    const [isLoading, setIsLoading] = useState(false);

    const session = useSession();
    const userId = session.data?.user?.id;

    const handleVote = async (voteType: "upvote" | "downvote") => {
        if (!userId)
            return toast({
                title: "Please login to vote",
                description: "Only logged in users can vote",
            });
        setIsLoading(true);

        try {
            const successMessage =
                voteType === "upvote"
                    ? `Upvote ${!hasUpvoted ? "added" : "removed"} successfully`
                    : `Downvote ${!hasDownvoted ? "added" : "removed"} successfully`;

            toast({
                title: successMessage,
                description: `Your ${voteType} has been recorded.`,
            });
        } catch (error) {
            toast({
                title: "Failed to submit vote",
                description:
                    "An error occurred while submitting your vote. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex-center gap-2.5">
            <div className="flex-center gap-1.5">
                <Image
                    src={
                        hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"
                    }
                    alt="upvote"
                    width={18}
                    height={18}
                    className={`cursor-pointer ${isLoading && "opacity-50"}`}
                    aria-label="Upvote"
                    onClick={() => !isLoading && handleVote("upvote")}
                />

                <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
                    <p className="subtle-medium text-dark400_light900">
                        {formatNumber(upvotes)}
                    </p>
                </div>
            </div>
            <div className="flex-center gap-1.5">
                <Image
                    src={
                        hasDownvoted
                            ? "/icons/downvoted.svg"
                            : "/icons/downvote.svg"
                    }
                    alt="downvote"
                    width={18}
                    height={18}
                    className={`cursor-pointer ${isLoading && "opacity-50"}`}
                    aria-label="Downvote"
                    onClick={() => !isLoading && handleVote("downvote")}
                />

                <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
                    <p className="subtle-medium text-dark400_light900">
                        {formatNumber(downvotes)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Votes;
