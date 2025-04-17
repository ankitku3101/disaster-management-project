// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  clerkUserId: string; // Clerk User ID
  phoneNumber: string;
  location: string;
}

const userSchema = new Schema<IUser>({
  clerkUserId: {
    type: String,
    required: true,
    unique: true, 
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
