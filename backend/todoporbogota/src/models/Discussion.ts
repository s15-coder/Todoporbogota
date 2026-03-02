import { Schema, model, Document, Types } from "mongoose";

export interface IDiscussion extends Document {
    prompt: string;
    responses: number;
    featured: boolean;
    status: "pending" | "approved" | "rejected";
    createdBy: Types.ObjectId;
    reviewedBy?: Types.ObjectId;
    reviewNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const DiscussionSchema = new Schema(
    {
        prompt: { type: String, required: true },
        responses: { type: Number, default: 0 },
        featured: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewNote: { type: String },
    },
    { timestamps: true }
);

DiscussionSchema.index({ status: 1 });

export const Discussion = model<IDiscussion>("Discussion", DiscussionSchema);
