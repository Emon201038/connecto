// utils/cloudinary.ts
import cloudinary from "../lib/cloudinary";

export interface UploadedFile {
  url: string;
  pub_id: string;
}

export const uploadStreamToCloudinary = (
  stream: NodeJS.ReadableStream,
  folder: string,
  resourceType: "auto" | "image" | "video" = "auto"
): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ url: result.secure_url, pub_id: result.public_id });
      }
    );
    stream.pipe(uploadStream);
  });
};
