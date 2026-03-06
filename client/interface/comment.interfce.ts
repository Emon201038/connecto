import { IUser } from "@/types";
import { IPost } from "./post.interface";
import { ReactionType } from "./reaction.interface";
import { ReactionSummary } from ".";

export interface IComment {
  id: string;
  postId: string;
  post: IPost;
  text: string;
  parentId: string | null;
  author: IUser;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  mentions: string[];
  hash_tags: string[];
  reactionCount: number;
  replyCount: number;
  reactions: { user: { id: string }; emoji: string }[];
  _count: {
    reactions: number;
    comments: number;
    shares: number;
  };
  myReaction: { type: ReactionType } | null;
  reactionSummary: ReactionSummary[];
}
