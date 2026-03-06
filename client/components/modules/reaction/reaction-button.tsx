"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ReactionTargetType,
  ReactionType,
} from "@/interface/reaction.interface";
import { toast } from "sonner";
import { useTogglePostReactionMutation } from "@/redux/features/reaction/reactionApi";

interface ReactionButtonProps {
  userReaction?: ReactionType | null;
  children: React.ReactNode;
  className?: string;
  targetId: string;
  postId?: string;
  reactionFor: ReactionTargetType;
}

const reactions = [
  {
    type: ReactionType.LIKE,
    icon: "/images/like.svg",
    label: "Like",
    color: "text-blue-500",
  },
  {
    type: ReactionType.LOVE,
    icon: "/images/love.svg",
    label: "Love",
    color: "text-red-500",
  },
  {
    type: ReactionType.HAHA,
    icon: "/images/haha.svg",
    label: "Haha",
    color: "text-yellow-500",
  },
  {
    type: ReactionType.WOW,
    icon: "/images/wow.svg",
    label: "Wow",
    color: "text-yellow-500",
  },
  {
    type: ReactionType.SAD,
    icon: "/images/sad.svg",
    label: "Sad",
    color: "text-yellow-500",
  },
  {
    type: ReactionType.ANGRY,
    icon: "/images/angry.svg",
    label: "Angry",
    color: "text-red-500",
  },
];

export function ReactionButton2({
  userReaction,
  children,
  className,
  targetId,
  postId,
  reactionFor,
}: ReactionButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [pickerPosition, setPickerPosition] = useState<"top" | "bottom">("top");

  const [toggleReaction] = useTogglePostReactionMutation();

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
    if (userReaction) {
      handleReactionSelect(userReaction as ReactionType);
    } else {
      handleReactionSelect(ReactionType.LIKE);
    }
  };

  const handleReactionSelect = async (reaction: ReactionType) => {
    try {
      setShowPicker(false);
      const obj = {
        type: reaction,
        reactionFor: reactionFor,
        targetId: targetId,
        postId: postId,
      };
      await toggleReaction(obj).unwrap();
    } catch (error) {
      toast.error("Failed to react");
    } finally {
    }
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
          className,
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
            "absolute left-0 transform translate-x-0 rounded-full shadow-lg p-1 flex z-110 animate-in fade-in-0 zoom-in-95 duration-200 max-w-xs bg-background border ",
            pickerPosition === "top" ? "bottom-full mb-0" : "top-full mt-0",
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
                  pickerPosition === "top" ? "-top-6" : "-bottom-6",
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
