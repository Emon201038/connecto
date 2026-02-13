import { model, Schema } from "mongoose";
import { IGroup, GroupType, GroupPrivacy } from "./group.interface";

const groupSchema = new Schema<IGroup>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, sparse: true, index: true },
    description: String,
    type: {
      type: String,
      enum: Object.values(GroupType),
      default: GroupType.FACEBOOK,
    },
    privacy: {
      type: String,
      enum: Object.values(GroupPrivacy),
      default: GroupPrivacy.PRIVATE,
    },
    coverPhoto: { url: String, pub_id: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    memberCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
    settings: {
      requirePostApproval: { type: Boolean, default: false },
      whoCanPost: {
        type: String,
        enum: ["ANY_MEMBER", "ADMINS_MODS"],
        default: "ANY_MEMBER",
      },
    },
  },
  { timestamps: true }
);

groupSchema.index({ name: "text", description: "text" });

export const Group = model<IGroup>("Group", groupSchema);
