import { Prisma } from "../../../../../prisma/generated/client";

export interface CreatePostInput {
  content?: string;
  privacy: "PUBLIC" | "PRIVATE";
  group?: string;
  feelings?: {
    emoji: string;
    type: string;
    text: string;
  };
  entities: {
    end: number;
    offset: number;
    target: string;
    type: string;
    text: string;
  }[];
}

export type PostWithRelations = Prisma.PostGetPayload<{
  include: {
    entities: {
      select: {
        id: true;
        end: true;
        offset: true;
        type: true;
        text: true;
        hashtag: {
          select: {
            name: true;
            useCount: true;
            id: true;
          };
        };
      };
    };
    author: {
      select: {
        id: true;
        username: true;
        fullName: true;
      };
    };
    group: {
      select: {
        id: true;
        name: true;
      };
    };
    reactions: {
      select: {
        type: true;
        reactionFor: true;
        targetId: true;
        userId: true;
      };
    };
    _count: {
      select: {
        comments: true;
        reactions: true;
        shares: true;
      };
    };
  };
}>;
