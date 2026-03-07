import { UploadedFile } from "../../../../app/utils/upload-cloudinary";
import { generateAndUploadStory } from "../../../../app/helpers/textToImage";

const createStory = async (payload: any) => {
  console.log(payload);
  let uploadedImages: UploadedFile;
  if (payload.type === "TEXT") {
    const image = await generateAndUploadStory(payload);
    console.log(image);
  }
  return payload;
};

export const StoryService = { createStory };
