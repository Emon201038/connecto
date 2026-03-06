import { paginationHelper } from "../../../../app/helpers/paginationHelper";
import prisma from "../../../../app/config/db";
import { Prisma } from "../../../../../prisma/generated/client";

const getComments = async (
  options: any,
  filters: Record<string, any>,
  userId: string,
) => {
  const { limit, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const commentsAndConditions: Prisma.CommentWhereInput[] = [];
  commentsAndConditions.push({
    isDeleted: false,
  });

  if (filters.postId)
    commentsAndConditions.push({
      postId: filters.postId,
    });
  const comments = await prisma.comment.findMany({
    where: {
      AND: commentsAndConditions,
    },
    cursor: options?.cursor ? { id: options?.cursor } : undefined,
    skip: options?.cursor ? 1 : undefined,
    orderBy: sortBy
      ? {
          [sortBy]: sortOrder,
        }
      : [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,

    include: {
      author: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
          fullName: true,
        },
      },
      entities: {
        select: {
          id: true,
          type: true,
          text: true,
          offset: true,
          end: true,
        },
      },
      reactions: {
        where: {
          userId,
        },
        select: {
          type: true,
          reactionFor: true,
          targetId: true,
          userId: true,
        },
      },
      _count: {
        select: {
          reactions: true,
          replies: true,
        },
      },
    },
  });

  const commentIds = comments.map((p) => p.id);

  const reactionSummary =
    comments.length > 0
      ? await prisma.reaction.groupBy({
          by: ["commentId", "type"],
          where: {
            commentId: { in: commentIds },
          },
          _count: {
            type: true,
          },
        })
      : [];

  const reactionMap: Record<string, any[]> = {};

  reactionSummary.forEach((r) => {
    if (!reactionMap[r.commentId!]) {
      reactionMap[r.commentId!] = [];
    }

    reactionMap[r.commentId!].push({
      type: r.type,
      count: r._count.type,
    });
  });

  const meta = {
    nextCursor:
      comments.length > limit ? comments[comments.length - 1].id : null,
    hasMore: comments.length > limit,
  };
  const hasMore = comments.length > limit;

  if (hasMore) {
    comments.pop();
  }

  return {
    meta,
    data: comments.map(({ reactions, ...comment }) => {
      const myReaction = reactions[0] ?? null;

      return {
        ...comment,
        reactionSummary: reactionMap[comment.id] || [],
        myReaction,
      };
    }),
  };
};

const createComment = async (data: any) => {
  const { text, entities, userId } = data;

  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: {
        id: data.postId,
      },
    });

    if (!post) throw new Error("Post not found");

    const comment = await tx.comment.create({
      data: {
        text,
        authorId: userId as string,
        postId: data.postId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            fullName: true,
          },
        },
        entities: {
          select: {
            id: true,
            type: true,
            text: true,
            offset: true,
            end: true,
          },
        },
        _count: {
          select: {
            reactions: true,
            replies: true,
          },
        },
      },
    });

    if (!entities?.length) return comment;

    const commentEntitiesData: any[] = [];

    for (const entity of entities) {
      if (entity.type === "hashtag") {
        const normalizedText = entity.text;

        const hashtag = await tx.hashtag.upsert({
          where: { name: normalizedText },
          update: {
            useCount: { increment: 1 },
          },
          create: {
            name: normalizedText,
            useCount: 1,
          },
        });

        commentEntitiesData.push({
          commentId: comment.id,
          type: "hashtag",
          text: entity.text,
          offset: entity.offset,
          end: entity.end,
          hashtagId: hashtag.id,
        });
      }

      if (entity.type === "mention") {
        commentEntitiesData.push({
          commentId: comment.id,
          type: "mention",
          text: entity.text,
          offset: entity.offset,
          end: entity.end,
          userId: entity.target,
        });
      }
    }

    if (commentEntitiesData.length) {
      await tx.entity.createMany({
        data: commentEntitiesData,
      });
    }

    return comment;
  });
};

export const CommentService = { getComments, createComment };
