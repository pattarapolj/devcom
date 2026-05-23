import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import techDescriptions from "@/constants/techDescription";
import techMap from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const normalizeTechName = (techName: string) =>
    techName.replace(/[ .]/g, "").toLowerCase();

export const getDeviconClassnName = (techName: string) => {
    const normalizedTechName = normalizeTechName(techName);

    return techMap[normalizedTechName]
        ? `${techMap[normalizedTechName]} colored`
        : `devicon-devicon-plain`;
};

export const getTechDescription = (techName: string) => {
    const normalizedTechName = normalizeTechName(techName);

    return techDescriptions[normalizedTechName] ?? `${techName} technology`;
};

export const getTimeStamp = (createdAt: Date): string => {
    const date = new Date(createdAt);
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

export const formatNumber = (number: number): string => {
    if (number >= 1e6)
        return (number / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (number >= 1e3)
        return (number / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return number.toString();
};
