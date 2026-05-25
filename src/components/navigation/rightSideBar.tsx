import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { getHotQuestions } from "@/lib/actions/question.action";

import TagCard from "../cards/TagCard";
import DataRenderer from "../DataRenderer";

const popularTags = [
    { _id: "1", name: "React", questions: 100 },
    { _id: "2", name: "JavaScript", questions: 200 },
    { _id: "3", name: "CSS", questions: 150 },
    { _id: "4", name: "HTML", questions: 120 },
    { _id: "5", name: "Node.js", questions: 80 },
    { _id: "6", name: "Next.js", questions: 90 },
    { _id: "7", name: "ZIG", questions: 70 },
];
const RightSideBar = async () => {
    const { success, data: hotQuestions, error } = await getHotQuestions();

    return (
        <section className="custom-scrollbar light-border background-light900_dark200 sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
            <div>
                <h3 className="h3-bold text-dark200_light900">Top Question</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    <DataRenderer
                        success={success}
                        error={error}
                        data={hotQuestions?.questions}
                        empty={{
                            title: "No hot questions",
                            message:
                                "There are no hot questions at the moment. Please check back later.",
                        }}
                        render={(hotQuestions) => (
                            <div className="mt-7 flex w-full flex-col gap-[30px]">
                                {hotQuestions.map(({ _id, title }) => (
                                    <Link
                                        key={_id}
                                        href={ROUTES.QUESTION(_id)}
                                        className="flex cursor-pointer items-center justify-between gap-7"
                                    >
                                        <p className="body-medium text-dark500_light700">
                                            {title}
                                        </p>
                                        <Image
                                            src="/icons/chevron-right.svg"
                                            alt="Chevron Right"
                                            width={20}
                                            height={20}
                                            className="invert-colors"
                                        />
                                    </Link>
                                ))}
                            </div>
                        )}
                    />
                </div>
            </div>
            {/* <div className='mt-16'>
                <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
                <div className='mt-7 flex flex-col gap-4'>
                    {popularTags.map(({ _id, name, questions }) => (
                        <TagCard
                            key={_id}
                            _id={_id}
                            name={name}
                            questions={questions}
                            showCount
                            compact
                        />
                    ))}
                </div>
            </div> */}
        </section>
    );
};

export default RightSideBar;
