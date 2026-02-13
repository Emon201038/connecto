"use client";
import PostCard from "@/components/post-card";
import { IPost } from "@/interface/post.interface";
import React from "react";

const Posts = ({ posts }: { posts: IPost[] }) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
