import { model, Schema } from "mongoose";
import {
  IReaction,
  ReactionTargetType,
  ReactionType,
} from "./reaction.interface";

const reactionSchema = new Schema<IReaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: Object.values(ReactionType), required: true },
    targetType: {
      type: String,
      enum: Object.values(ReactionTargetType),
      required: true,
    },
    target: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
  },
  {
    timestamps: true,
  }
);

reactionSchema.index({ targetType: 1, target: 1, user: 1 }, { unique: true });

reactionSchema.index({ targetType: 1, target: 1 });

const Reaction = model<IReaction>("Reaction", reactionSchema);
export default Reaction;
