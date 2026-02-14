"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

type CoverPhotoProps = {
  src?: string | null;
  alt?: string;
  containerClass?: string;
  imageClass?: string;
  children?: React.ReactNode;
};

export default function CoverPhoto({
  src,
  alt,
  containerClass,
  imageClass,
  children,
}: CoverPhotoProps) {
  const fallback = "/images/default-cover.jpeg";
  const [error, setError] = useState(false);

  // Decide which src to use
  const coverSrc = !error && src ? src : fallback;

  return (
    <div className={cn("relative w-full h-48", containerClass)}>
      <Image
        src={coverSrc}
        alt={alt ?? "Cover photo"}
        fill
        className={cn("object-cover", imageClass)}
        priority
        unoptimized // safer for /public images
        onError={() => setError(true)} // fallback if remote image fails
      />
      {children}
    </div>
  );
}
