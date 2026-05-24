import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import React, { Suspense } from "react";

import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { getTimeStamp, formatNumber } from "@/lib/utils";

const QuestionDetails = async ({ params }: RouteParams) => {
    after(async () => {
        await incrementViews({ questionId: id });
    });
    const { id } = await params;

    const { success, data: question } = await getQuestion({ questionId: id });

    if (!success || !question) return redirect(ROUTES.NOT_FOUND);

    const {
        success: answerSuccess,
        data: answerData,
        error: answerError,
    } = await getAnswers({
        questionId: id,
        page: 1,
        pageSize: 10,
        filter: "latest",
    });

    const hasVotedPromise = hasVoted({
        targetId: question._id,
        targetType: "question",
    });

    const { author, createdAt, answers, views, tags, content } = question;

    return (
        <>
            <div className="flex-start w-full flex-col">
                <div className="flex w-full flex-col-reverse justify-between">
                    <div className="flex items-center justify-start gap-1">
                        <UserAvatar
                            id={author._id}
                            name={author.name}
                            imageUrl={author.image || null}
                            className="size-[22px]"
                            fallbackClassName="text-[10px]"
                        />
                        <Link href={ROUTES.PROFILE(author._id)}>
                            <p className="paragraph-semibold text-dark300_light700">
                                {author.name}
                            </p>
                        </Link>
                    </div>
                    <div className="flex justify-end">
                        <Suspense fallback={<div>Loading...</div>}>
                            <Votes
                                upvotes={question.upvotes}
                                downvotes={question.downvotes}
                                targetType="question"
                                targetId={question._id}
                                hasVotedPromise={hasVotedPromise}
                            />
                        </Suspense>
                        <Suspense fallback={<div>Loading...</div>}>
                            <SaveQuestion questionId={question._id} />
                        </Suspense>
                    </div>
                </div>
                <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
                    {question.title}
                </h2>
            </div>
            <div className="mb-8 mt-5 flex flex-wrap gap-4">
                <Metric
                    imgUrl="/icons/clock.svg"
                    alt="Clock"
                    value={`asked ${getTimeStamp(new Date(createdAt))}`}
                    title=""
                    textStyles="small-regular text-dark400_light700"
                />
                <Metric
                    imgUrl="/icons/message.svg"
                    alt="Message"
                    value={answers}
                    title=""
                    textStyles="small-regular text-dark400_light700"
                />
                <Metric
                    imgUrl="/icons/eye.svg"
                    alt="Views"
                    value={formatNumber(views)}
                    title=""
                    textStyles="small-regular text-dark400_light700"
                />
            </div>
            <Preview content={content} />
            <div className="mt-8 flex flex-wrap gap-2">
                {tags.map((tag) => {
                    return (
                        <TagCard
                            key={tag._id}
                            _id={tag._id}
                            name={tag.name}
                            compact
                        />
                    );
                })}
            </div>

            <section className="my-5">
                <AllAnswers
                    data={answerData?.answers}
                    error={answerError}
                    success={answerSuccess}
                    totalAnswers={answerData?.totalAnswer || 0}
                />
            </section>

            <section className="my-5">
                <AnswerForm
                    questionId={question._id}
                    questionTitle={question.title}
                    questionContent={question.content}
                />
            </section>
        </>
    );
};

export default QuestionDetails;
