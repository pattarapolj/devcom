import { Schema, models, model, Types, Document } from 'mongoose';

interface ITagQuestion {
  question: Types.ObjectId;
  tag: Types.ObjectId;
}

export interface ITagQuestionDoc extends ITagQuestion, Document {}

const TagQuestionSchema = new Schema<ITagQuestion>({
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true }
}, { timestamps: true });

const TagQuestion = models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion