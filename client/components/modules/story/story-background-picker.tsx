"use client";

import { STORY_BACKGROUNDS } from "@/constants/themes";
import { cn } from "@/lib/utils";

interface Props {
  selected: string;
  onChange: (id: string) => void;
}

export default function StoryBackgroundPicker({ selected, onChange }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {STORY_BACKGROUNDS.map((bg) => {
        const style =
          bg.type === "gradient"
            ? {
                background: `linear-gradient(135deg, ${bg!.colors!.join(",")})`,
              }
            : { background: bg.color };

        return (
          <button
            key={bg.id}
            onClick={() => onChange(bg.id)}
            className={cn(
              "h-10 w-10 rounded-full border-2 transition-all shrink-0",
              selected === bg.id
                ? "border-white scale-110"
                : "border-transparent",
            )}
            style={style}
          />
        );
      })}
    </div>
  );
}
