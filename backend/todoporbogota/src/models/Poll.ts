import { Schema, model, Document, Types } from "mongoose";

export interface IPollOption {
    optionId: string;
    text: string;
    votes: number;
}

export interface IPoll extends Document {
    question: string;
    options: IPollOption[];
    totalVotes: number;
    active: boolean;
    status: "pending" | "approved" | "rejected";
    createdBy: Types.ObjectId;
    reviewedBy?: Types.ObjectId;
    reviewNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PollOptionSchema = new Schema(
    {
        optionId: { type: String, required: true },
        text: { type: String, required: true },
        votes: { type: Number, default: 0 },
    },
    { _id: false }
);

const PollSchema = new Schema(
    {
        question: { type: String, required: true },
        options: {
            type: [PollOptionSchema],
            required: true,
            validate: {
                validator: (v: IPollOption[]) => v.length >= 2,
                message: "Una encuesta debe tener al menos 2 opciones.",
            },
        },
        totalVotes: { type: Number, default: 0 },
        active: { type: Boolean, default: true },
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

PollSchema.index({ status: 1, active: 1 });

export const Poll = model<IPoll>("Poll", PollSchema);
