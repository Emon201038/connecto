import React from "react";
import { AudioData } from "./audio-analyzer";

export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  fullName?: string;
  phone: string;
  email?: string;
  password?: string;
  profilePhoto?: {
    url: string;
    pub_id: string;
  };
  posts?: PostType[];
  followers?: User[];
  friends?: User[];
  conversations?: ConversationType[];
}

export interface PostType<AuthorType = string> {
  id: string;
  type: "image" | "video" | "text";
  content: string;
  author: AuthorType;
  attachments?: {
    url: string;
    pub_id: string;
  };
  createdAt: string;
  share: { user: { id: string } }[];
  reactions: { user: { id: string }; emoji: string }[];
  reactionCount: number;
  commentCount: number;
  myReaction: {
    reactionType: "LIKE" | "CARE" | "WOW" | "LOVE" | "HAHA" | "SAD" | "ANGRY";
  } | null;
  reactionSummary: {
    count: number;
    reactionType: "LIKE" | "CARE" | "WOW" | "LOVE" | "HAHA" | "SAD" | "ANGRY";
  }[];
  comments: TComment[];
  tags: { id: string; fullName: string }[];
  feelings?: {
    type: string | null;
    emoji: string | null;
    text: string | null;
  };
}

export interface TComment {
  id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
  parentId?: string | null;
  post: {
    id: string;
  };
  author: {
    id: string;
    fullName: string;
    profilePicture: {
      url: string;
      pub_id: string;
    };
  };
  replyCount: number;
  reactionCount: number;
  replies: TComment[];
  myReaction: {
    reactionType: "LIKE" | "CARE" | "WOW" | "LOVE" | "HAHA" | "SAD" | "ANGRY";
    targetId?: string;
    targetType?: string;
    userId?: string;
  } | null;
  reactionSummary: {
    count: number;
    reactionType: "LIKE" | "CARE" | "WOW" | "LOVE" | "HAHA" | "SAD" | "ANGRY";
  }[];
}

export interface Conversation {
  id: string;
  participants: Partial<User>[];
  messages: Partial<Message>[];
  createdAt: Date;
  updatedAt: Date;
  type: "group" | "private";
  status: "active" | "archived";
}

export interface Message {
  id: string;
  type: "text" | "image" | "video" | "audio" | "voice";
  conversation?: Partial<Conversation>;
  sender: Partial<User>;
  content: string;
  attachment?: {
    url: string;
    pub_id: string;
  };
  image?: string;
  video?: string;
  voice?: string;
  duration?: number;
  status?: string;
  createdAt: string;
  audioData?: any;
}

export interface PostsResponse<AuthorType = string> {
  success: boolean;
  message: string;
  payload: PostType<AuthorType>[];
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export interface IMeta {
  totalResult: number;
  totalPage: number;
  page: number;
  limit: number;
}
