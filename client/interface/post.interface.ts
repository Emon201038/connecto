import { IUser } from "@/types";
import { IComment } from "./comment.interfce";
import { IReaction, ReactionType } from "./reaction.interface";
import { IGroup } from "./group.interface";

export enum PostType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  LINK = "link",
}

export enum PostPrivacy {
  PUBLIC = "PUBLIC",
  FRIENDS = "FRIENDS",
  ONLY_ME = "ONLY_ME",
}

export interface IPostFeelings {
  type: string;
  emoji: string;
  text: string;
}

export interface IEntity {
  offset: number;
  end: number;
  type: string;
  id?: string;
  tag?: string;
}

export interface IPost {
  id: string;
  type: PostType;
  content: string;
  author: IUser;
  attachments?: {
    url: string;
    pub_id: string;
  }[];
  privacy: PostPrivacy;
  hash_tags: string[];
  tags: string[];
  feelings?: IPostFeelings;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  share: { user: { id: string } }[];
  reactions: { user: { id: string }; emoji: string }[];
  reactionCount: number;
  commentCount: number;
  shareCount: number;
  myReaction: { type: ReactionType } | null;
  reactionSummary: {
    count: number;
    reactionType: "LIKE" | "CARE" | "WOW" | "LOVE" | "HAHA" | "SAD" | "ANGRY";
  }[];
  comments: IComment[];
  group?: IGroup;
}

export interface ICreatePost {
  type: PostType;
  content: string;
  attachments: File[] | null | undefined;
  feelings?: IPostFeelings | null;
  entities?: IEntity[];
  privacy: PostPrivacy;
  group?: string;
}
