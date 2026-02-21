"use client";
import PostCard from "@/components/modules/post/post-card";
import { IPost } from "@/interface/post.interface";
import { useSession } from "@/providers/session";
import { useGetUserPostsQuery } from "@/redux/features/user/userApi";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Posts = ({ posts }: { posts: IPost[] }) => {
  const [page, setPage] = useState(1);

  const params = useParams<{ username: string }>();
  const { data, isLoading } = useGetUserPostsQuery(
    { username: params.username || "", page: page },
    { refetchOnMountOrArgChange: true, skip: false },
  );

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
