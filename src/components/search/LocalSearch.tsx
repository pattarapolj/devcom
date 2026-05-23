"use client";

import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

import { formUrlQuery, removeKeyFromUrlQuery } from "@/lib/url";

import { Input } from "../ui/input";

interface Props {
    route: string;
    imgSrc: string;
    placeholder: string;
    otherClasses?: string;
    iconPosition?: "left" | "right";
}

const LocalSearch = ({
    route,
    imgSrc,
    placeholder,
    otherClasses,
    iconPosition = "left",
}: Props) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("query") || "";

    const [searchQuery, setSearchQuery] = useState(query);

    const searchParamsStr = searchParams.toString();
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            // Update the search query in the URL when it changes
            console.log("pathName: ", pathname, "route: ", route);
            if (searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParamsStr,
                    key: "query",
                    value: searchQuery,
                });
                router.push(newUrl, { scroll: false });
            } else {
                // If searchQuery is empty, remove the 'query' parameter from the URL
                if (pathname === route) {
                    const newUrl = removeKeyFromUrlQuery({
                        params: searchParamsStr,
                        keysToRemove: ["query"],
                    });
                    router.push(newUrl, { scroll: false });
                }
            }
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, router, route, searchParamsStr, pathname]);

    return (
        <div
            className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
        >
            {iconPosition === "left" && (
                <Image
                    src={imgSrc}
                    width={24}
                    height={24}
                    alt="Search"
                    className="cursor-pointer"
                />
            )}
            <Input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
            />
            {iconPosition === "right" && (
                <Image
                    src={imgSrc}
                    width={15}
                    height={15}
                    alt="Search"
                    className="cursor-pointer"
                />
            )}
        </div>
    );
};

export default LocalSearch;
