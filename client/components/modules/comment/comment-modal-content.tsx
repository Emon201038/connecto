import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import React from "react";
import PostComments from "./comments";
import { reactionEmojis } from "@/constants/emoji";
import Image from "next/image";
import { IPost } from "@/interface/post.interface";
import timeAgo from "@/lib/time-ago";
import { IUser } from "@/types";

interface IProps {
  post: IPost;
  handleReplyClick: (commentId: string, author: IUser) => void;
}

const CommentModalContent = ({ post, handleReplyClick }: IProps) => {
  return (
    <div className=" flex-1 h-full z-10">
      <div className="p-4 pb-3 gap-2 items-center hidden md:flex">
        <Link href={`/${post?.author?.username}`} className="shrink-0">
          <Avatar>
            <AvatarImage
              src={
                post.author?.profilePicture?.url ||
                "/images/default-profile.jpeg"
              }
              alt={post?.author?.fullName}
            />
            <AvatarFallback>
              {post?.author?.fullName?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 flex flex-col justify-center">
          <Link
            href={`/${post?.author?.username}`}
            className="font-medium text-sm"
          >
            {post?.author?.fullName}
          </Link>
          <span className="text-xs text-muted-foreground">
            {timeAgo(post.createdAt)}
          </span>
        </div>
      </div>
      <div className="px-4 pb-3 hidden md:block">
        <p>{post.content}</p>
      </div>

      {post?.attachments &&
        post.attachments.map((a) => (
          <div key={a.id} className="bg-gray-200 hidden md:block">
            <Image
              src={a.url || "/placeholder.svg"}
              alt="Post image"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      <div className="px-4 py-2 border-b hidden md:block">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center rounded-full  text-white">
              {post?.reactionSummary?.length &&
              post?.reactionSummary?.length > 0
                ? [...(post.reactionSummary as any)]
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 3)
                    .map((reaction, index) => (
                      <div
                        key={reaction.type}
                        className={`relative`}
                        style={{
                          marginLeft: index > 0 ? "-4px" : "0",
                          zIndex: 3 - index,
                        }}
                      >
                        {reactionEmojis[reaction.type as "LIKE"]?.emoji}
                      </div>
                    ))
                : null}
            </div>
          </div>
        </div>
      </div>
      <div className="md:border-t h-full pt-4 z-10">
        <PostComments post={post} onReply={handleReplyClick} />
      </div>
    </div>
  );
};

export default CommentModalContent;
