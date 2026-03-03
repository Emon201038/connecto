import defaultImage from "@/public/images/default-profile.jpeg";
export const getProfileImageUrl = (image: string | undefined) => {
  if (image) {
    return image;
  }
  return defaultImage as unknown as Blob;
};

export const generateBlurUrl = (url: string) => {
  return url.replace("/upload/", "/upload/e_blur:10000,q_1,q_auto:low,f_webp/");
};
