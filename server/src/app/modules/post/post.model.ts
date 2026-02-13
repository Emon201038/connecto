import { model, Schema } from "mongoose";
import { IPost, PostPrivacy, PostType } from "./post.interface";

const postSchema = new Schema<IPost>(
  {
    type: {
      type: String,
      enum: Object.values(PostType),
      required: true,
    },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    attachments: [{ url: String, pub_id: String }],
    privacy: { type: String, enum: Object.values(PostPrivacy), required: true },
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
    feelings: {
      type: {
        type: String,
      },
      emoji: String,
      text: String,
    },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    share: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Post = model<IPost>("Post", postSchema);

export default Post;
