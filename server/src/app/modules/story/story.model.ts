import { model, Schema } from "mongoose";
import { IStory } from "./story.interface";

const storySchema = new Schema<IStory>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    reactions: [{ type: Schema.Types.ObjectId, ref: "Reaction" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Story = model<IStory>("Story", storySchema);
export default Story;
