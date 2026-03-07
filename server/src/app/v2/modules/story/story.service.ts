import streamifier from "streamifier";
import {
  UploadedFile,
  uploadStreamToCloudinary,
} from "../../../../app/utils/upload-cloudinary";
import { generateAndUploadStory } from "../../../../app/helpers/textToImage";
import prisma from "../../../../app/config/db";
import { Story, User } from "../../../../../prisma/generated/client";

const createStory = async (
  payload: any,
  userId: string,
  file?: Express.Multer.File,
) => {
  console.log(payload);
  let uploadedImage: UploadedFile;
  if (payload.type === "TEXT") {
    const image = await generateAndUploadStory(payload);
    uploadedImage = image;
  } else {
    const stream = streamifier.createReadStream(file!.buffer);
    uploadedImage = await uploadStreamToCloudinary(
      stream,
      "connecto/stories",
      "image",
    );
  }

  if (file) {
  }

  const story = await prisma.story.create({
    data: {
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      mediaUrl: uploadedImage.url,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          fullName: true,
          username: true,
        },
      },
      reactions: {
        select: {
          id: true,
          type: true,
          userId: true,
        },
      },
    },
  });

  return story;
};

const getAllStories = async (userId: string) => {
  const stories = await prisma.story.findMany({
    where: {
      isDeleted: false,
      // expiresAt: {
      //   gt: new Date(),
      // },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  // Group stories by user
  const groupedMap = stories.reduce((acc: any, { user, ...story }) => {
    if (!acc[story.userId]) {
      acc[story.userId] = {
        user: user,
        stories: [],
      };
    }
    acc[story.userId].stories.push(story);
    return acc;
  }, {});

  let grouped = Object.values<{
    user: (typeof stories)[0]["user"];
    stories: any[];
  }>(groupedMap);

  // Put current user's stories first
  grouped.sort((a, b) =>
    a.user.id === userId ? -1 : b.user.id === userId ? 1 : 0,
  );

  return grouped;
};

export const StoryService = { createStory, getAllStories };
