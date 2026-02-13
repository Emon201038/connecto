"use client";
import PostCard from "@/components/post-card";
import { useGetPostsQuery } from "@/redux/features/post/postApi";
import React from "react";
import { LoadingFeed } from "@/components/loading-feed";
import { useSession } from "next-auth/react";

const Posts = () => {
  const session = useSession();

  const { data: posts, isLoading } = useGetPostsQuery(
    { page: 1, limit: 15, authorization: session?.data?.accessToken },
    {
      refetchOnMountOrArgChange: true,
      skip: false,
    }
  );

  if (isLoading) {
    return <LoadingFeed />;
  }
  return (
    <div className="space-y-4">
      {posts?.data.posts?.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
