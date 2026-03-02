import { Schema, model, Document, Types } from "mongoose";

export interface IIniciativa extends Document {
    title: string;
    description: string;
    category: string;
    locality: string;
    image?: string;
    featured: boolean;
    status: "pending" | "approved" | "rejected";
    participants: number;
    startDate?: Date;
    submittedBy: Types.ObjectId;
    reviewedBy?: Types.ObjectId;
    reviewNote?: string;
    createdAt: Date;
    updatedAt: Date;
}

const IniciativaSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: [
                "Medio Ambiente",
                "Movilidad",
                "Cultura",
                "Arte Urbano",
                "Social",
                "Educación",
            ],
        },
        locality: { type: String, required: true },
        image: { type: String },
        featured: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        participants: { type: Number, default: 0 },
        startDate: { type: Date },
        submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewNote: { type: String },
    },
    { timestamps: true }
);

IniciativaSchema.index({ status: 1 });
IniciativaSchema.index({ submittedBy: 1 });
IniciativaSchema.index({ category: 1, locality: 1 });

export const Iniciativa = model<IIniciativa>("Iniciativa", IniciativaSchema);
