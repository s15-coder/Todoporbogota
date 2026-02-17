import { Schema, model, Document } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  googleId: { type: String }, // Identificador único de Google
}, { timestamps: true });

export const User = model('User', UserSchema);