import React from "react";

import { EMPTY_ANSWERS } from "@/constants/states";

import AnswerCard from "../cards/AnswerCard";
import DataRenderer from "../DataRenderer";

interface Props extends ActionResponse<Answer[]> {
    totalAnswers: number;
}

const AllAnswers = ({ data, error, success, totalAnswers }: Props) => {
    return (
        <div className="mt-11">
            <div className="flex items-center justify-between">
                <h3 className="primary-text-gradient">
                    {totalAnswers} Answer{totalAnswers === 1 ? "" : "s"}
                </h3>
                <p className="">Filters</p>
            </div>
            <DataRenderer
                success={success}
                error={error}
                data={data}
                empty={EMPTY_ANSWERS}
                render={(answers) =>
                    answers.map((answer) => (
                        <AnswerCard key={answer._id} {...answer} />
                    ))
                }
            />
        </div>
    );
};

export default AllAnswers;
