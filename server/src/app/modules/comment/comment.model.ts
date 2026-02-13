import { model, Schema } from "mongoose";
import { IComment } from "./comment.interface";

const commentSchema = new Schema<IComment>(
  {
    text: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isDeleted: { type: Boolean, default: false },
    entities: [
      {
        type: {
          type: String,
          required: [true, " Entity type is required"],
        },
        offset: { type: Number, required: [true, "Offset is required"] },
        end: { type: Number, required: [true, "End is required"] },
        model: {
          type: String,
          required: [true, " Model is required for entity"],
          enum: ["User", "Hashtag"],
        },
        target: {
          type: Schema.Types.ObjectId,
          refPath: "entities.model",
          required: [true, "Entity target is required"],
        },
        text: { type: String, required: [true, "text is required"] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;
