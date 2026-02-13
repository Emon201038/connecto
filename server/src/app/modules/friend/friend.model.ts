import { Schema, model } from "mongoose";
import { IFriendship, FriendRequestStatus } from "./friend.interface";

const friendshipSchema = new Schema<IFriendship>({
  requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: Object.values(FriendRequestStatus),
    default: FriendRequestStatus.PENDING,
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate friend requests
friendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export const Friendship = model<IFriendship>("Friendship", friendshipSchema);
