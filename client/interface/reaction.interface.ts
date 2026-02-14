import { IUser } from "@/types";
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

export interface IReaction extends Document {
  id: string;
  user: IUser | null;
  target: IPost | IComment | null;
  type: ReactionType | null;
  targetType: ReactionTargetType | null;
  createdAt: string | null;
  updatedAt: string | null;
}
