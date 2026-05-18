import { model, models, Schema, Types, Document } from "mongoose"

export interface IAccount {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  authProvider: string;
  authProviderId: string;
}

export interface IAccountDoc extends IAccount, Document {}

const AccountSchema = new Schema<IAccount>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  image: { type: String},
  password: { type: String },
  authProvider: { type: String, required: true },
  authProviderId: { type: String, required: true, unique: true },
}, { timestamps: true });

const Account = models?.Account || model<IAccount>("Account", AccountSchema)

export default Account