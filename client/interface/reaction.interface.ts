import { IMessage, IUser } from "@/types";
import { IPost } from "./post.interface";
import { IComment } from "./comment.interfce";

export enum ReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  CARE = "CARE",
  HAHA = "HAHA",
  WOW = "WOW",
  SAD = "SAD",
  ANGRY = "ANGRY",
}

export enum ReactionTargetType {
  POST = "Post",
  COMMENT = "Comment",
  MESSAGE = "Message",
}

export interface IReaction {
  id: string;
  user: IUser;
  target: IPost | IComment | IMessage | string | null;
  type: ReactionType;
  targetType: ReactionTargetType | null;
  createdAt: string | null;
  updatedAt: string | null;
}
