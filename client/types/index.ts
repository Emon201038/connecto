import { IReaction } from "@/interface/reaction.interface";

export interface IResponse<T = unknown> {
  data: T;
  errors: { message: string }[];
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  nickname: string;
  username: string;
  email: string;
  phone?: string;
  profilePicture: {
    url: string;
    pub_id: string;
  };
  coverPicture: {
    url: string;
    pub_id: string;
  };
  bio?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: Date;
  followers: IUser[];
  followings: IUser[];
  friends: IUser[];
  friendRequests: IUser[];
  conversation: {
    id: string;
    hasConversation: boolean;
    lastMessage?: {
      content: string;
      sender: {
        id: string;
      };
      status: "SENT" | "DELIVERED" | "SEEN";
    };
  };
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  isDeleted: boolean;
  isDisabled: boolean;
  deletedAt: string;
}

export type Entity = {
  type: "mention" | "hashtag";
  offset: number;
  end: number;
  target?: string;
  id?: string;
  tag?: string;
  name?: string;
  text?: string;
};

export type Suggestion = {
  id: string;
  name: string;
};

export interface IUsersConversation {
  id: string;
  fullName: string;
  profilePicture?: {
    url: string;
    pub_id: string;
  };
  conversation: {
    id?: string;
    hasConversation: boolean;
    lastMessage?: {
      content: string;
      sender: {
        id: string;
      };
      status: "SENT" | "DELIVERED" | "SEEN";
    };
  };
}

export interface IConversation {
  id: string;
  type: "DIRECT" | "GROUP";
  title: string;
  avatar: string;
  lastMessage: IMessage;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversationMember {
  id: string;
  conversation: IConversation;
  user: IUser;
  role: "ADMIN" | "MEMBER";

  nickname: string;
  theme: string;
  emoji: string;
  isMuted: boolean;
  isPinned: boolean;
  archived: boolean;

  joinedAt: Date;
  leftAt: Date;
}

export interface IMessage {
  id: string;
  conversation: IConversation;
  sender: IUser;
  replyTo?: IMessage;
  content: string;
  attachments: string[];
  deletedBy: IUser[];
  type: IMessageType;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export enum IMessageType {
  TEXT = "TEXT",
  EMOJI = "EMOJI",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE",
}

export interface IMessageStatus extends Document {
  id: string;
  message: IMessage;
  user: IUser;
  status: "SENT" | "DELIVERED" | "SEEN";
  seenAt?: Date;
  seenBy?: IUser[];
}

export interface IStory extends Document {
  mediaUrl: string;
  expiresAt: Date;
  viewers: IUser[];
  reactions: IReaction[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
