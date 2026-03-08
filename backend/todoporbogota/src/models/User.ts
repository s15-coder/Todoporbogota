import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  facebookId?: string;
  role: "admin" | "moderator" | "citizen";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    googleId: { type: String },
    facebookId: { type: String },
    role: {
      type: String,
      enum: ["admin", "moderator", "citizen"],
      default: "citizen",
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);