import { Schema, Types } from "mongoose";

export enum FriendRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}

export interface IFriendship {
  requester: Types.ObjectId;
  recipient: Types.ObjectId;
  status: FriendRequestStatus;
  createdAt: Date;
}
