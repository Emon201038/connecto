"use client";

import type React from "react";
import CommentThread from "./comment-thread";
import { IPost } from "@/interface/post.interface";
import { IComment } from "@/interface/comment.interfce";
import { IUser } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { serverFetch } from "@/lib/server-fetch";
import { toast } from "sonner";
import { useMeQuery } from "@/redux/features/auth/authApi";
import { useGetCommentsQuery } from "@/redux/features/comments/commentsApi";

export default function PostComments({
  post,
  onReply,
}: {
  post: IPost;
  onReply: (commentId: string, author: IComment["author"]) => void;
}) {
  const { data: session, isLoading: sessionLoading } = useMeQuery();
  const { data, isLoading } = useGetCommentsQuery({
    postId: post.id,
  });

  if (!post) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-4 py-6 flex gap-3 flex-col h-full">
        <div className="flex items-start gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-16 flex-1" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-14 flex-1" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto p-4 pt-0">
        {data?.comments?.length === 0 ? (
          <div className="text-sm text-muted-foreground h-full flex items-center justify-center">
            No comments yet
          </div>
        ) : (
          data?.comments
            ?.filter((c: IComment) => !c.parentId)
            ?.map((comment: IComment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                postAuthorId={post?.author.id}
                currentUser={session as IUser}
                onReply={onReply}
              />
            ))
        )}
      </div>
    </div>
  );
}
