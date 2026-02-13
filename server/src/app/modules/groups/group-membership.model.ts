import { model, Schema } from "mongoose";
import { IGroupMembership, GroupRole } from "./group.interface";

const membershipSchema = new Schema<IGroupMembership>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: Object.values(GroupRole),
      default: GroupRole.MEMBER,
    },
    joinedAt: { type: Date, default: Date.now },
    mutedUntil: Date,
    isBanned: { type: Boolean, default: false },
    banReason: String,
  },
  { timestamps: true }
);

membershipSchema.index({ group: 1, user: 1 }, { unique: true });

export const GroupMembership = model<IGroupMembership>(
  "GroupMembership",
  membershipSchema
);
