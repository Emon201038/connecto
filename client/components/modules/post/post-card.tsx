"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { IPost } from "@/interface/post.interface";
import PostHeader from "./post-header";
import PostBody from "./post-body";
import PostFooter from "./post-footer";

function PostCard({ post }: { post: IPost }) {
  return (
    <Card id={"post-" + post.id.toString()} className="p-0 gap-0">
      <PostHeader post={post} />
      <PostBody post={post} />
      <PostFooter post={post} />
    </Card>
  );
}

export default React.memo(PostCard);
