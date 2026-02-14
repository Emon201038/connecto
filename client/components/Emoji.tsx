"use client";

import Image from "next/image";
import { useState } from "react";

interface EmojiDisplayProps {
  emoji: string;
  size?: number;
}

export function EmojiDisplay({ emoji, size = 32 }: EmojiDisplayProps) {
  const [imgError, setImgError] = useState(false);

  if (!emoji) return null;

  const emojiUrl = `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${emoji}.png`;

  return imgError ? (
    <span style={{ fontSize: size - 5, lineHeight: 1 }}>{emoji}</span>
  ) : (
    <Image
      src={emojiUrl}
      alt={emoji}
      width={size}
      height={size}
      priority
      onError={() => setImgError(true)}
      draggable={false}
      style={{
        objectFit: "contain",
        width: size,
        height: size,
        verticalAlign: "middle",
        pointerEvents: "none",
      }}
    />
  );
}
