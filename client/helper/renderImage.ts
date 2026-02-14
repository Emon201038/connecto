import defaultImage from "@/public/images/default-profile.jpeg";
export const getProfileImageUrl = (image: string | undefined) => {
  if (image) {
    return image;
  }
  return defaultImage as unknown as Blob;
};
