"use client";
import { Button } from "@/components/ui/button";
import { IPost } from "@/interface/post.interface";
import { serverFetch } from "@/lib/server-fetch";
import { postApi, useGetAllPostsQuery } from "@/redux/features/post/postApi";
import { store } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PostCard from "./post-card";
import { LoadingFeed } from "./loading-feed";

interface IProps {
  meta: { hasMore: boolean; nextCursor: string | null };
  posts: IPost[];
}

const Posts = (initialData: IProps) => {
  useEffect(() => {
    if (initialData) {
      store.dispatch(
        postApi.util.upsertQueryData("getAllPosts", {}, initialData),
      );
    }
  }, [initialData]);
  const { data, isLoading } = useGetAllPostsQuery({});
  const router = useRouter();
  const handleClick = async () => {
    await serverFetch.post("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "fb1@example.com",
        password: "123456",
      }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    router.refresh();
  };

  if (isLoading) return <LoadingFeed />;

  return (
    <div className="space-y-4">
      <Button onClick={() => handleClick()}>Login</Button>
      {data?.posts &&
        data.posts?.map((post) => <PostCard key={post.id} post={post} />)}
    </div>
  );
};

export default Posts;
