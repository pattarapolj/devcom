import { model, models, Schema } from "mongoose"

interface IAccount {
  userId: Schema.Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  authProvider: string;
  authProviderId: string;
}

const AccountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  image: { type: String},
  password: { type: String },
  authProvider: { type: String, required: true },
  authProviderId: { type: String, required: true, unique: true },
}, { timestamps: true });

const Account = models?.Account || model<IAccount>("Account", AccountSchema)

export default Account