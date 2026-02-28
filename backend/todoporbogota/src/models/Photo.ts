import { Schema, model, Document, Types } from "mongoose";

export interface IPhoto extends Document {
    title: string;
    image: string;
    location: string;
    tags: string[];
    status: "pending" | "approved" | "rejected";
    submittedBy: Types.ObjectId;
    reviewedBy?: Types.ObjectId;
    reviewNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PhotoSchema = new Schema(
    {
        title: { type: String, required: true },
        image: { type: String, required: true },
        location: { type: String, required: true },
        tags: [{ type: String }],
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewNote: { type: String },
    },
    { timestamps: true }
);

PhotoSchema.index({ status: 1 });
PhotoSchema.index({ submittedBy: 1 });
PhotoSchema.index({ tags: 1 });

export const Photo = model<IPhoto>("Photo", PhotoSchema);
