import { useIsMobile } from "@/hooks/use-mobile";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { ThumbsUp } from "lucide-react";
import ReactionsModal from "./reactions-modal";
import { IPost } from "@/interface/post.interface";

const ReactionButton = ({ post: rootPost }: { post: IPost }) => {
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const likeButtonRef = useRef<HTMLButtonElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const isMobile = useIsMobile();
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { posts } = useAppSelector((state) => state.post);
  const post = posts.find((p) => p.id === rootPost.id) || rootPost;

  // Define the reactions with their emojis
  const reactionEmojis: Record<string, React.ReactNode> = {
    like: (
      <Image
        src="/images/like.svg"
        alt="like"
        width={18}
        height={18}
        priority
      />
    ),
    love: (
      <Image
        src="/images/love.svg"
        alt="love"
        width={18}
        height={18}
        priority
      />
    ),
    haha: (
      <Image
        src="/images/haha.svg"
        alt="haha"
        width={18}
        height={18}
        priority
      />
    ),
    wow: (
      <Image src="/images/wow.svg" alt="wow" width={18} height={18} priority />
    ),
    sad: (
      <Image src="/images/sad.svg" alt="sad" width={18} height={18} priority />
    ),
    angry: (
      <Image
        src="/images/angry.svg"
        alt="angry"
        width={18}
        height={18}
        priority
      />
    ),
  };

  // Define the reactions with their colors
  const reactionColors: Record<string, string> = {
    like: "text-blue-600",
    love: "text-red-500",
    haha: "text-yellow-500",
    wow: "text-yellow-500",
    sad: "text-yellow-500",
    angry: "text-orange-500",
  };

  const handleReactionSelect = (reaction: string) => {};

  const handleLikeClick = () => {
    if (!isLongPress) {
    }
    setIsLongPress(false);
  };

  // Update modal position based on button position
  const updateModalPosition = () => {
    if (likeButtonRef.current) {
      const rect = likeButtonRef.current.getBoundingClientRect();
      setModalPosition({ x: rect.left + rect.width / 2, y: rect.top });
    }
  };

  // Handle mouse/touch down for long press
  const handleMouseDown = () => {
    updateModalPosition();

    // Start timer for long press
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      setShowReactionsModal(true);
    }, 500); // 500ms for long press
  };

  // Handle mouse/touch up to clear timer
  const handleMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Handle mouse enter for hover
  const handleMouseEnter = () => {
    if (!isMobile) {
      updateModalPosition();

      // Start timer for hover
      hoverTimerRef.current = setTimeout(() => {
        setShowReactionsModal(true);
      }, 500); // 500ms hover delay
    }
  };

  // Handle mouse leave to clear hover timer
  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    handleMouseUp(); // Also clear long press timer
  };
  return (
    <>
      <Button
        ref={likeButtonRef}
        variant="ghost"
        onClick={handleLikeClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {post.myReaction ? (
          <>
            <span className="mr-2 text-lg text-white">
              {/* {reactionEmojis[post.myReaction.reactionType.toLowerCase()]} */}
            </span>
            <span className="capitalize">
              {/* {post.myReaction.reactionType.toLowerCase()} */}
            </span>
          </>
        ) : (
          <>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Like
          </>
        )}
      </Button>
      <ReactionsModal
        isOpen={showReactionsModal}
        onClose={() => setShowReactionsModal(false)}
        onReactionSelect={handleReactionSelect}
        position={modalPosition}
        ref={likeButtonRef}
      />
    </>
  );
};

export default ReactionButton;
