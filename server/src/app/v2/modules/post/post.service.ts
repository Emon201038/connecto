import streamifier from "streamifier";
import { Prisma } from "../../../../../prisma/generated/browser";
import prisma from "../../../config/db";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { postSearchableFields } from "./post.constant";
import {
  UploadedFile,
  uploadStreamToCloudinary,
} from "../../../../app/utils/upload-cloudinary";
import cloudinary from "../../../../app/lib/cloudinary";

const getPostsFromDB = async (options: any, filters: any, userId?: string) => {
  const { limit, sortBy, sortOrder } =
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
    cursor: options?.cursor ? { id: options?.cursor } : undefined,
    skip: options?.cursor ? 1 : undefined,
    orderBy: sortBy
      ? {
          [sortBy]: sortOrder,
        }
      : [{ createdAt: "desc" }, { id: "desc" }],
    take: limit + 1,
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
      attachments: {
        select: {
          id: true,
          url: true,
          pubId: true,
        },
      },
      _count: {
        select: {
          comments: true,
          reactions: true,
          shares: true,
        },
      },
    },
  });

  const postIds = posts.map((p) => p.id);

  const reactionSummary =
    posts.length > 0
      ? await prisma.reaction.groupBy({
          by: ["postId", "type"],
          where: {
            postId: { in: postIds },
          },
          _count: {
            type: true,
          },
        })
      : [];

  const reactionMap: Record<string, any[]> = {};

  reactionSummary.forEach((r) => {
    if (!reactionMap[r.postId!]) {
      reactionMap[r.postId!] = [];
    }

    reactionMap[r.postId!].push({
      type: r.type,
      count: r._count.type,
    });
  });

  const meta = {
    nextCursor: posts.length > limit ? posts[posts.length - 1].id : null,
    hasMore: posts.length > limit,
  };
  const hasMore = posts.length > limit;

  if (hasMore) {
    posts.pop();
  }

  return {
    meta,
    data: posts.map(({ reactions, ...post }) => {
      const myReaction = reactions[0] ?? null;

      return {
        ...post,
        reactionSummary: reactionMap[post.id] || [],
        myReaction,
      };
    }),
  };
};

const createPost = async (
  payload: any,
  files: Express.Multer.File[],
  userId: string,
) => {
  const { content, type, privacy, entities, feelings } = payload;

  let uploadedImages: UploadedFile[] = [];

  try {
    if (files?.length) {
      uploadedImages = await Promise.all(
        files.map((file) => {
          const stream = streamifier.createReadStream(file.buffer);
          return uploadStreamToCloudinary(stream, "posts", "image");
        }),
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          content,
          type: type.toUpperCase(),
          privacy,
          feelingsType: feelings?.type,
          feelingsText: feelings?.text,
          feelingsEmoji: feelings?.emoji,
          authorId: userId,
          attachments: uploadedImages.length
            ? {
                createMany: {
                  data: uploadedImages.map((image) => ({
                    url: image.url,
                    pubId: image.pub_id,
                  })),
                },
              }
            : undefined,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
          attachments: true,
          _count: {
            select: {
              comments: true,
              reactions: true,
              shares: true,
            },
          },
        },
      });

      if (entities?.length) {
        const postEntitiesData: any[] = [];

        for (const entity of entities) {
          if (entity.type === "hashtag") {
            const hashtag = await tx.hashtag.upsert({
              where: { name: entity.text.toLowerCase() },
              update: { useCount: { increment: 1 } },
              create: { name: entity.text.toLowerCase(), useCount: 1 },
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
      }

      return post;
    });

    return result;
  } catch (error) {
    if (uploadedImages.length) {
      await Promise.all(
        uploadedImages.map((img) => cloudinary.uploader.destroy(img.pub_id)),
      );
    }

    throw error;
  }
};

export const PostService = { getPostsFromDB, createPost };
