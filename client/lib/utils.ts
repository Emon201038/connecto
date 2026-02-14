import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getBlurDataUrl(imageUrl: string) {
  const lowQualityUrl = imageUrl.replace(
    "/upload/",
    "/upload/e_blur:10000,q_1,q_auto:low,f_webp/"
  );
  const res = await fetch(lowQualityUrl);
  const buffer = await res.arrayBuffer();
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
}
