"use client";
import { LoadingFeed } from "@/components/loading-feed";
import PostCard from "@/components/modules/post/post-card";
import { useGroupPostsQuery } from "@/redux/features/group/groupApi";
import { useSession } from "next-auth/react";
import React from "react";

const Posts = () => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useGroupPostsQuery({ page, limit: 15 });

  const session = useSession();
  return (
    <div className="w-full max-w-xl mx-auto space-y-6 py-6 mt-12 md:mt-0 h-full overflow-auto">
      {isLoading && <LoadingFeed />}
      {data?.data?.posts && data?.data?.posts?.length <= 0 ? (
        <h1 className="py-12 text-center text-lg">No posts available yet</h1>
      ) : (
        data?.data?.posts?.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default Posts;
