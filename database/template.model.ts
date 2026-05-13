import { Schema, models, model } from 'mongoose';

interface IModel {}

const ModelSchema = new Schema<IModel>({}, { timestamps: true });

const Model = models?.Question || model<IModel>("Model", ModelSchema);

export default Model