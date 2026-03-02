import { paginationHelper } from "../../../../app/helpers/paginationHelper";
import prisma from "../../../../app/config/db";
import { Prisma } from "../../../../../prisma/generated/client";

const getComments = async (options: any, filters: Record<string, any>) => {
  const { limit, skip, sortBy, sortOrder, page } =
    paginationHelper.calculatePagination(options);

  const commentsAndConditions: Prisma.CommentWhereInput[] = [];
  commentsAndConditions.push({
    isDeleted: false,
  });

  if (filters.postId)
    commentsAndConditions.push({
      postId: filters.postId,
    });
  return await prisma.comment.findMany({
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    where: {
      AND: commentsAndConditions,
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
    },
  });
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
      await tx.commentEntity.createMany({
        data: commentEntitiesData,
      });
    }

    return comment;
  });
};

export const CommentService = { getComments, createComment };
