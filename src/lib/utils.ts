import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import techMap from "@/constants/techMap"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getDeviconClassnName = (techName: string) => {
    const normalizeTechName = techName.replace(/[ .]/g, "").toLowerCase()

return  techMap[normalizeTechName] 
        ? `${techMap[normalizeTechName]} colored`
        : `devicon-devicon-plain`;
}

export const getTimeStamp = (date: Date): string => {
    const seconds = Math.round((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 0) return "just now";
    if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"} ago`;

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const intervals: [Intl.RelativeTimeFormatUnit, number][] = [
        ["year", 31536000],
        ["month", 2592000],
        ["week", 604800],
        ["day", 86400],
        ["hour", 3600],
        ["minute", 60],
    ];

    for (const [unit, threshold] of intervals) {
        const count = Math.floor(seconds / threshold);
        if (count >= 1) return rtf.format(-count, unit);
    }

    return "just now";
};