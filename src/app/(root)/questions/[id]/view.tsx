"use client";

import { useEffect } from "react";

import { toast } from "@/hooks/use-toast";
import { incrementViews } from "@/lib/actions/question.action";

const View = ({ questionId }: { questionId: string }) => {
    const handleIncrement = async () => {
        const result = await incrementViews({ questionId });
        if (result.success) {
            toast({
                title: "Success",
                description: "View incremented",
            });
        } else {
            toast({
                title: "Error",
                description:
                    result.error?.message || "Failed to increment view",
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        handleIncrement();
    }, []);

    return <></>;
};

export default View;
