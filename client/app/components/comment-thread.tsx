"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ThumbsUp, Heart, Laugh, Angry, Loader2 } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Balancer } from "react-wrap-balancer";
import timeAgo from "@/lib/time-ago";
import { useAppSelector } from "@/redux/hooks";
import { IComment } from "@/interface/comment.interfce";
import { HighlightHashtags } from "./highlight-hashtag";
import { ReactionButton2 } from "./reaction-button-2";
import { ReactionType } from "@/interface/reaction.interface";
import { useToggleCommentReactionMutation } from "@/redux/features/reaction/reactionApi";
import { toast } from "sonner";
import ReusableTooltip from "./Tooltip";
import Image from "next/image";
import ReactorsModal from "./reactors-modal";
import { IUser } from "@/types";

const reactions = [
  {
    name: "like",
    icon: ThumbsUp,
    color: "text-primary",
    fillColor: "fill-primary",
  },
  {
    name: "love",
    icon: Heart,
    color: "text-red-500",
    fillColor: "fill-red-500",
  },
  {
    name: "haha",
    icon: Laugh,
    color: "text-yellow-500",
    fillColor: "fill-yellow-500",
  },
  { name: "angry", icon: Angry, color: "text-orange-500", fillColor: null },
];
const reactionEmojis: Record<
  "LIKE" | "CARE" | "WOW" | "LOVE" | "HAHA" | "SAD" | "ANGRY",
  { emoji: React.ReactNode; bg: string; name: string; text: string }
> = {
  LIKE: {
    emoji: (
      <Image
        src="/images/like.svg"
        alt="love"
        width={16}
        height={16}
        priority
      />
    ),
    bg: "white",
    text: "#0866FF",
    name: "Like",
  },
  CARE: {
    emoji: (
      <Image
        src="/images/care.svg"
        alt="care"
        width={16}
        height={16}
        priority
      />
    ),
    bg: "white",
    name: "Care",
    text: "#887000",
  },
  LOVE: {
    emoji: <Image src="/images/love.svg" alt="love" width={16} height={16} />,
    bg: "white",
    name: "Love",
    text: "#DD2334",
  },
  HAHA: {
    emoji: <Image src="/images/haha.svg" alt="haha" width={16} height={16} />,
    bg: "white",
    name: "Haha",
    text: "#887000",
  },
  WOW: {
    emoji: <Image src="/images/wow.svg" alt="wow" width={16} height={16} />,
    bg: "white",
    name: "Wow",
    text: "#887000",
  },
  SAD: {
    emoji: <Image src="/images/sad.svg" alt="sad" width={16} height={16} />,
    bg: "white",
    name: "Sad",
    text: "#887000",
  },
  ANGRY: {
    emoji: <Image src="/images/angry.svg" alt="angry" width={16} height={16} />,
    bg: "white",
    name: "Angry",
    text: "orange",
  },
};

const CommentThread = ({
  comment,
  postAuthorId,
  currentUser,
  onReply,
}: {
  comment: IComment;
  postAuthorId: string;
  currentUser: IUser;
  onReply: (commentId: string, author: IComment["author"]) => void;
}) => {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const hoverTimeoutRef = useRef<number | null>(null);
  const [showingAllReplies, setShowingAllReplies] = useState(false);
  const { posts } = useAppSelector((state) => state.post);
  const selectedPost = posts.find((p) => p.id === comment.post.id);
  const [toggleReaction] = useToggleCommentReactionMutation();

  useEffect(() => {
    if (selectedPost) {
      if (
        comment.replyCount >
        selectedPost.comments.filter((c) => c.parentId === comment.id).length
      ) {
        setShowingAllReplies(false);
      } else {
        setShowingAllReplies(true);
      }
    }
  }, [selectedPost, comment]);

  const handleShowMoreReplies = async () => {};

  const handleReactionChange = async (reaction: ReactionType) => {
    try {
      const res = await toggleReaction({
        target: comment.id,
        targetType: "Comment",
        type: reaction,
        post: comment.post.id,
      }).unwrap();
    } catch (error) {
      toast.error("Failed to react");
    }
  };

  const handleReactionClick = async () => {
    if (comment.myReaction) {
      handleReactionChange(comment.myReaction.type as ReactionType);
    } else {
      handleReactionChange("LIKE" as ReactionType);
    }
  };

  return (
    <div id={`comment-${comment.id}`}>
      <div className="flex items-start gap-2">
        <Link href={`/${comment.author.username}`} className="flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                comment.author?.profilePicture?.url ||
                "/images/default-profile.jpeg"
              }
              alt={comment.author.fullName}
              data-ai-hint="user avatar"
            />
            <AvatarFallback>{comment.author.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-grow">
          <div className="relative group">
            <div className="w-fit">
              <div className="bg-muted px-3 py-2 rounded-xl text-sm">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${comment.author.username}`}
                    className="font-semibold hover:underline text-primary"
                  >
                    {comment.author.fullName}
                  </Link>
                  {comment.author.id === postAuthorId && (
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 text-muted-foreground px-1.5 py-0.5 rounded-md">
                      Author
                    </span>
                  )}
                </div>
                <div className="mt-1">
                  <Balancer>
                    <HighlightHashtags text={comment.text} />
                  </Balancer>
                </div>
              </div>
              <div className="w-full flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1">
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(Number(comment.createdAt))}
                  </span>
                  <ReactionButton2
                    onReaction={(e) =>
                      handleReactionChange(e?.toUpperCase() as ReactionType)
                    }
                    handleButtonClick={handleReactionClick}
                    className="w-fit hover:bg-none hover:bg-transparent dark:hover:bg-transparent p-0 !h-fit justify-center items-center"
                  >
                    <div
                      style={{
                        color: `${
                          comment.myReaction
                            ? reactionEmojis[
                                comment.myReaction.type as ReactionType
                              ].text
                            : "var(--muted-foreground)"
                        }`,
                      }}
                      className={cn(
                        "text-xs font-semibold hover:underline",
                        comment.myReaction
                          ? `text-[${
                              reactionEmojis[
                                comment.myReaction.type as ReactionType
                              ].text
                            }]`
                          : "text-muted-foreground"
                      )}
                    >
                      {comment.myReaction
                        ? reactionEmojis[
                            comment.myReaction.type as ReactionType
                          ].name
                        : "Like"}
                    </div>
                  </ReactionButton2>
                  <button
                    onClick={
                      () =>
                        toast.info("Feature not implemented yet", {
                          description: "Work in progress",
                        })
                      // onReply(comment.id, { ...comment.author })
                    }
                    className="text-xs font-semibold text-muted-foreground hover:underline"
                  >
                    Reply
                  </button>
                </div>
                <div
                  onClick={() => setShowModal(true)}
                  // onMouseEnter={() => handleGetReactors()}
                  className="flex justify-between items-center gap-1 cursor-pointer"
                >
                  <ReusableTooltip
                    content={
                      <div className="flex items-center justify-center">
                        {false ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <div className="flex gap-2 flex-col items-start">
                            {comment.reactionSummary.map((reaction, index) => (
                              <span
                                key={index}
                                className="text-xs flex gap-2 items-center"
                              >
                                {
                                  reactionEmojis[
                                    reaction.reactionType as ReactionType
                                  ].emoji
                                }{" "}
                                {reaction.count}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                  >
                    <button className="flex gap-1 cursor-pointer">
                      <div className="flex items-center justify-center rounded-full  text-white">
                        {comment.reactionSummary &&
                        comment?.reactionSummary.length > 0
                          ? [...comment.reactionSummary]
                              .sort((a, b) => b.count - a.count)
                              .filter((r) => r.count > 0)
                              .map((reaction, index) => (
                                <div
                                  key={reaction.reactionType}
                                  className={`relative`}
                                  style={{
                                    marginLeft: index > 0 ? "-4px" : "0",
                                    zIndex: 3 - index,
                                  }}
                                >
                                  {
                                    reactionEmojis[
                                      reaction.reactionType as ReactionType
                                    ].emoji
                                  }
                                </div>
                              ))
                          : null}
                      </div>
                      <p
                        className={`${
                          comment.reactionCount > 0 ? "block" : "hidden"
                        }`}
                      >
                        {comment.reactionCount}
                      </p>
                    </button>
                  </ReusableTooltip>
                </div>
              </div>
            </div>
          </div>

          {comment.replyCount > 0 && (
            <div className="pl-5 mt-2 space-y-2 border-l-2 border-muted/30 ml-4">
              {selectedPost?.comments
                ?.filter((c) => c.parentId === comment.id)
                .map((reply) => (
                  <div key={reply.id} className="relative">
                    <div className="absolute -left-[11px] top-4 w-5 h-px bg-muted/30"></div>
                    {/* {visibleReplies.map((c) => ( */}
                    <CommentThread
                      comment={reply as unknown as IComment}
                      postAuthorId={postAuthorId}
                      currentUser={currentUser}
                      onReply={onReply}
                    />
                    {/* ))} */}
                  </div>
                ))}
              {!showingAllReplies && (
                <button
                  onClick={handleShowMoreReplies}
                  className="text-xs font-semibold text-muted-foreground hover:underline px-3 flex items-center gap-1"
                >
                  <div className="w-4 h-px bg-muted-foreground"></div>
                  View{" "}
                  {comment.replyCount -
                    (selectedPost?.comments || []).filter(
                      (c) => c.parentId === comment.id
                    ).length}{" "}
                  more replies
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <ReactorsModal
          open={showModal}
          onClose={setShowModal}
          target={comment.id}
        />
      )}
    </div>
  );
};

// const ReactorsModal = ({
//   open,
//   onOpenChange,
// }: {
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
// }) => {
//   return (
//     <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
//       <ResponsiveDialogContent>
//         <ResponsiveDialogHeader>People who reacted</ResponsiveDialogHeader>
//       </ResponsiveDialogContent>
//     </ResponsiveDialog>
//   );
// };

export default CommentThread;
