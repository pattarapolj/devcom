import { Schema, model, models, Types, Document } from "mongoose";

interface IVote {
    author: Types.ObjectId;
    actionId: Types.ObjectId;
    actionType: "question" | "answer";
    voteType: "upvote" | "downvote";
}

export interface IVoteDoc extends IVote, Document {}

const VoteSchema = new Schema<IVote>(
    {
        author: { type: Schema.Types.ObjectId, refer: "User", required: true },
        actionId: { type: Schema.Types.ObjectId, required: true },
        actionType: {
            type: String,
            enum: ["question", "answer"],
            required: true,
        },
        voteType: {
            type: String,
            enum: ["upvote", "downvote"],
            required: true,
        },
    },
    { timestamps: true },
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
