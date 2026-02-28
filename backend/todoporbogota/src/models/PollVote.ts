import { Schema, model, Document, Types } from "mongoose";

export interface IPollVote extends Document {
    poll: Types.ObjectId;
    user: Types.ObjectId;
    optionId: string;
    createdAt: Date;
    updatedAt: Date;
}

const PollVoteSchema = new Schema(
    {
        poll: { type: Schema.Types.ObjectId, ref: "Poll", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        optionId: { type: String, required: true },
    },
    { timestamps: true }
);

// Un usuario solo puede votar una vez por encuesta
PollVoteSchema.index({ poll: 1, user: 1 }, { unique: true });

export const PollVote = model<IPollVote>("PollVote", PollVoteSchema);
