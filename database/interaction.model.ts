import { Schema, models, model, Types } from 'mongoose';

interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  contentType: "question" | "answer";
}

const InteractionSchema = new Schema<IInteraction>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true},
  actionId: { type: Schema.Types.ObjectId, required: true},
  contentType: { type: String, enum: ["question", "answer"], required: true},
}, { timestamps: true });

const Interaction = models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction