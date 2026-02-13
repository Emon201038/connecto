// utils/uploadFiles.ts
import { FileUpload } from "graphql-upload-ts";
import { uploadStreamToCloudinary, UploadedFile } from "./upload-cloudinary";

export async function uploadFilesToCloudinary(
  files: Promise<FileUpload> | FileUpload | any[], // allow Upload objects
  folder: string
): Promise<UploadedFile | UploadedFile[]> {
  const fileArray = Array.isArray(files) ? files : [files];

  // Convert Upload objects to actual FileUpload promises
  const normalized = fileArray.map((f) => {
    if (!f) return null;
    // If it's an Apollo Upload wrapper, it has .promise or .file
    if (typeof (f as any).promise === "object") {
      return (f as any).promise; // use promise directly
    }
    return f; // already a promise or FileUpload
  });

  // Wait for all FileUpload promises to resolve
  const resolvedFiles = await Promise.all(normalized);

  // Upload each file
  const uploads = await Promise.all(
    resolvedFiles.map(async (file) => {
      if (!file) return null;
      const { createReadStream, mimetype } = file;
      const stream = createReadStream();
      const resourceType = mimetype.startsWith("video") ? "video" : "image";
      return uploadStreamToCloudinary(stream, folder, resourceType);
    })
  );

  const cleanUploads = uploads.filter(Boolean) as UploadedFile[];

  return Array.isArray(files) ? cleanUploads : cleanUploads[0];
}
