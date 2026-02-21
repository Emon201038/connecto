"use client";

import type React from "react";
import CommentThread from "./comment-thread";
import { IPost } from "@/interface/post.interface";
import { IComment } from "@/interface/comment.interfce";
import { useGetCommentsQuery } from "@/redux/features/comments/commentsApi";
import { useSession } from "next-auth/react";
import { IUser } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostComments({
  post,
  onReply,
}: {
  post: IPost;
  onReply: (commentId: string, author: IComment["author"]) => void;
}) {
  const { data: comments, isLoading } = useGetCommentsQuery(
    { page: 1, limit: 15, post: post.id },
    {
      skip: !post.id,
      refetchOnMountOrArgChange: true,
    },
  );

  const session = useSession();

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
    <div className="p-4 pt-0 flex flex-col h-full justify-between">
      <div className="flex-1 py-2 md:max-h-75 overflow-y-auto">
        {comments?.data?.comments?.length === 0 ? (
          <div className="text-sm text-muted-foreground h-full flex items-center justify-center">
            No comments yet
          </div>
        ) : (
          comments?.data?.comments
            ?.filter((c: IComment) => !c.parent)
            ?.map((comment: IComment) => (
              <CommentThread
                key={comment.id}
                comment={comment}
                postAuthorId={post?.author.id}
                currentUser={session?.data?.user as unknown as IUser}
                onReply={onReply}
              />
            ))
        )}
      </div>
    </div>
  );
}
