"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ThumbsUp, MessageSquare, Share } from "lucide-react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IPost } from "@/interface/post.interface";
import { reactions as allReact } from "@/constants/reactions";
import { ReactionButton2 } from "../reaction/reaction-button";
import { ReactionTargetType } from "@/interface/reaction.interface";
import { ShareModal } from "../share/share-modal";
import CommentModal from "../comment/comment-modal";
import ReactorsModal from "../reaction/reactors-modal";

export default function PostFooter({ post }: { post: IPost }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReactorsModal, setShowReactorsModal] = useState(false);

  const topReactions = useMemo(() => {
    if (!post.reactionSummary) return [];
    return [...post.reactionSummary]
      .filter((r) => r.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [post.reactionSummary]);

  const myReactionConfig = useMemo(() => {
    return allReact.find((r) => r.type === post?.myReaction?.type);
  }, [post?.myReaction?.type]);

  return (
    <CardFooter className="flex flex-col items-start p-2 pt-0">
      <div className="flex w-full justify-between px-2 py-1 text-sm text-muted-foreground">
        {/* Reactors Modal Trigger */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowReactorsModal((prev) => !prev);
          }}
          className="flex gap-1 cursor-pointer"
        >
          <div className="flex cursor-pointer">
            {topReactions.map((reaction, index) => {
              const config = allReact.find((r) => r.type === reaction.type);
              return (
                <Image
                  key={reaction.type}
                  src={config?.src || "images/like.svg"}
                  alt="react"
                  width={16}
                  height={16}
                  className="relative"
                  style={{
                    marginLeft: index > 0 ? "-4px" : "0",
                    zIndex: 3 - index,
                  }}
                />
              );
            })}
          </div>
          <span className={`${post._count.reactions === 0 && "hidden"}`}>
            {post._count.reactions}
          </span>
        </div>
        <ReactorsModal
          type={ReactionTargetType.POST}
          targetId={post.id}
          open={showReactorsModal}
          onOpenChange={setShowReactorsModal}
          reactionSummary={post.reactionSummary}
        />

        <div className="flex gap-4">
          <span>{post._count.comments} comments</span>
          <span>{post._count.shares} shares</span>
        </div>
      </div>

      <Separator className="my-1 w-full" />

      <div className="grid grid-cols-3 w-full">
        <ReactionButton2
          className="w-full"
          targetId={post.id}
          reactionFor={ReactionTargetType.POST}
        >
          <div className="w-full p-1 flex justify-center items-center gap-2">
            {post.myReaction ? (
              <>
                <Image
                  src={myReactionConfig?.src || "images/like.svg"}
                  alt="react"
                  width={16}
                  height={16}
                />
                <p style={{ color: myReactionConfig?.text }}>
                  {myReactionConfig?.name}
                </p>
              </>
            ) : (
              <>
                <ThumbsUp />
                <p>Like</p>
              </>
            )}
          </div>
        </ReactionButton2>

        <CommentModal
          post={post}
          trigger={
            <Button variant="ghost" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Comment
            </Button>
          }
        />

        <ShareModal open={showShareModal} onOpenChange={setShowShareModal} />
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setShowShareModal((prev) => !prev)}
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </CardFooter>
  );
}
