import { Prisma } from "../../../../../prisma/generated/browser";
import { PostCreateInput } from "../../../../../prisma/generated/models";
import prisma from "../../../config/db";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { postSearchableFields } from "./post.constant";
import { CreatePostInput } from "./post.interface";

const getPostsFromDB = async (options: any, filters: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.PostWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: postSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filterData.authUsername) {
    andConditions.push({
      author: {
        username: {
          equals: filterData.authUsername,
        },
      },
    });
  }

  if (filterData.isDeleted) {
    andConditions.push({
      isDeleted: {
        equals:
          filterData.isDeleted === "true" || filterData.isDeleted === true,
      },
    });
  }

  if (filterData.groupId) {
    andConditions.push({
      group: {
        id: {
          equals: filterData.groupId,
        },
      },
    });
  }

  if (filterData.hashtag) {
    andConditions.push({
      entities: {
        some: {
          hashtag: {
            name: {
              equals: filterData.hashtag,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  const posts = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },
    omit: {
      authorId: true,
      groupId: true,
    },
    include: {
      entities: {
        select: {
          id: true,
          end: true,
          offset: true,
          type: true,
          text: true,
          hashtag: {
            select: {
              name: true,
              useCount: true,
              id: true,
            },
          },
        },
      },
      author: {
        select: {
          id: true,
          username: true,
          fullName: true,
        },
      },
      group: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    meta: {
      total,
      totalPages: Math.ceil(total / limit) || 0,
      page,
      limit,
    },
    data: posts,
  };
};

const createPost = async (payload: any, userId: string) => {
  const { content, type, privacy, entities, feelings } = payload;

  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.create({
      data: {
        content,
        type: type.toUpperCase(),
        privacy,
        feelingsType: feelings?.type,
        feelingsText: feelings?.text,
        feelingsEmoji: feelings?.emoji,
        authorId: userId,
      },
    });

    if (!entities?.length) return post;

    const postEntitiesData: any[] = [];

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

        postEntitiesData.push({
          postId: post.id,
          type: "hashtag",
          text: entity.text,
          offset: entity.offset,
          end: entity.end,
          hashtagId: hashtag.id,
        });
      }

      if (entity.type === "mention") {
        postEntitiesData.push({
          postId: post.id,
          type: "mention",
          text: entity.text,
          offset: entity.offset,
          end: entity.end,
          userId: entity.target,
        });
      }
    }

    if (postEntitiesData.length) {
      await tx.postEntity.createMany({
        data: postEntitiesData,
      });
    }

    return post;
  });
};

export const PostService = { getPostsFromDB, createPost };
