// models/user.ts
import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  clerkUserId: string;
  phoneNumber: string;
  location: string;
}

const userSchema = new Schema<IUser>({
  clerkUserId: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  location: { type: String, required: true },
});

const User = model<IUser>("User", userSchema);

export default User;
