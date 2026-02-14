import { IUser } from "@/types";
import { IPost } from "./post.interface";

export interface IComment {
  id: string;
  post: IPost;
  text: string;
  parent: string | null;
  author: IUser;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  mentions: string[];
  hash_tags: string[];
  reactionCount: number;
  replyCount: number;
  reactions: { user: { id: string }; emoji: string }[];
  reactionSummary: { reactionType: string; count: number }[];
  myReaction: { type: string } | null;
}
