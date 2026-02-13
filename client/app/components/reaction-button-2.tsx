"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

interface ReactionButtonProps {
  userReaction?: "like" | "love" | "haha" | "wow" | "sad" | "angry" | null;
  onReaction: (
    reaction: "like" | "love" | "haha" | "wow" | "sad" | "angry" | null
  ) => void;
  children: React.ReactNode;
  className?: string;
  handleButtonClick?: () => void;
}

const reactions = [
  {
    type: "like" as const,
    icon: "/images/like.svg",
    label: "Like",
    color: "text-blue-500",
  },
  {
    type: "love" as const,
    icon: "/images/love.svg",
    label: "Love",
    color: "text-red-500",
  },
  {
    type: "haha" as const,
    icon: "/images/haha.svg",
    label: "Haha",
    color: "text-yellow-500",
  },
  {
    type: "wow" as const,
    icon: "/images/wow.svg",
    label: "Wow",
    color: "text-yellow-500",
  },
  {
    type: "sad" as const,
    icon: "/images/sad.svg",
    label: "Sad",
    color: "text-yellow-500",
  },
  {
    type: "angry" as const,
    icon: "/images/angry.svg",
    label: "Angry",
    color: "text-red-500",
  },
];

export function ReactionButton2({
  userReaction,
  onReaction,
  children,
  className,
  handleButtonClick,
}: ReactionButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [pickerPosition, setPickerPosition] = useState<"top" | "bottom">("top");

  const calculatePickerPosition = () => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceAbove = buttonRect.top;
    const spaceBelow = viewportHeight - buttonRect.bottom;

    // If there's more space below or if we're in the top half, show below
    if (spaceBelow > spaceAbove || buttonRect.top < viewportHeight / 2) {
      setPickerPosition("bottom");
    } else {
      setPickerPosition("top");
    }
  };

  const handleMouseEnter = () => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      calculatePickerPosition();
      setShowPicker(true);
    }, 800); // 1000ms delay for long hover
  };

  const handleMouseLeave = () => {
    // Clear the hover timeout if user leaves before picker shows
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Delay hiding the picker to allow mouse movement to picker
    hideTimeoutRef.current = setTimeout(() => {
      setShowPicker(false);
    }, 300);
  };

  const handleTouchStart = () => {
    longPressTimeoutRef.current = setTimeout(() => {
      calculatePickerPosition();
      setShowPicker(true);
    }, 800); // 800ms for long press on mobile
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };

  const handlePickerMouseEnter = () => {
    // Cancel any pending hide timeout when entering picker
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  const handlePickerMouseLeave = () => {
    // Hide picker immediately when leaving picker area
    setShowPicker(false);
  };

  const handleClick = () => {
    if (showPicker) {
      setShowPicker(false);
      return;
    }

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // If user has already reacted, remove reaction
    handleButtonClick?.();
  };

  const handleReactionSelect = (reaction: (typeof reactions)[0]["type"]) => {
    onReaction(reaction);
    setShowPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showPicker &&
        buttonRef.current &&
        pickerRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    const handleScroll = () => {
      if (showPicker) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true); // Use capture to catch all scroll events
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showPicker]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
    };
  }, []);

  const currentReaction = reactions.find((r) => r.type === userReaction);

  return (
    <div className="relative flex justify-center items-center">
      <Button
        ref={buttonRef}
        variant="ghost"
        className={cn(
          "flex-1 transition-colors duration-200",
          userReaction
            ? "text-primary hover:text-primary"
            : "text-muted-foreground hover:text-foreground",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {children}
      </Button>

      {/* Reaction Picker */}
      {showPicker && (
        <motion.div
          ref={pickerRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={cn(
            "absolute left-0 transform -translate-x-0 rounded-full shadow-lg p-1 flex z-[110] animate-in fade-in-0 zoom-in-95 duration-200 max-w-xs bg-background border ",
            pickerPosition === "top" ? "bottom-full mb-0" : "top-full mt-0"
          )}
          onMouseEnter={handlePickerMouseEnter}
          onMouseLeave={handlePickerMouseLeave}
        >
          {reactions.map((reaction) => (
            <motion.div
              key={reaction.type}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full flex items-center justify-center relative group/reaction"
              onClick={() => handleReactionSelect(reaction.type)}
              title={reaction.label}
            >
              <Image
                src={reaction.icon || "/placeholder.svg"}
                alt={reaction.label}
                width={34}
                height={34}
                className="text-xl"
              />
              <div
                className={cn(
                  "absolute opacity-0 group-hover/reaction:opacity-100 transition-opacity bg-black text-white text-xs rounded px-1 py-0.5 capitalize",
                  pickerPosition === "top" ? "-top-6" : "-bottom-6"
                )}
              >
                {reaction.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
