import { Schema, model, Document, Types } from "mongoose";

export interface IIniciativa extends Document {
    title: string;
    description: string;
    category: string;
    locality: string;
    image?: string;
    images: string[];
    featured: boolean;
    status: "pending" | "approved" | "rejected";
    participants: number;
    startDate?: Date;
    endDate?: Date;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    tags: string[];
    submittedBy: Types.ObjectId;
    reviewedBy?: Types.ObjectId;
    reviewedAt?: Date;
    reviewNote?: string;
    historial: { autor: string; fecha: string; texto: string }[];
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
        images: { type: [String], default: [] },
        featured: { type: Boolean, default: false },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        participants: { type: Number, default: 0 },
        startDate: { type: Date },
        endDate: { type: Date },
        contactEmail: { type: String },
        contactPhone: { type: String },
        address: { type: String },
        tags: { type: [String], default: [] },
        submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
        reviewedAt: { type: Date },
        reviewNote: { type: String },
        historial: {
            type: [
                {
                    autor: String,
                    fecha: String,
                    texto: String,
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

IniciativaSchema.index({ status: 1 });
IniciativaSchema.index({ submittedBy: 1 });
IniciativaSchema.index({ category: 1, locality: 1 });
IniciativaSchema.index({ createdAt: -1 });
IniciativaSchema.index({ featured: 1, status: 1 });

export const Iniciativa = model<IIniciativa>("Iniciativa", IniciativaSchema);
