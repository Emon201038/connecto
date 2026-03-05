import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/server-fetch";
import Posts from "@/components/modules/post/posts";
import { auth } from "@/lib/auth";

const NewsFeed = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const res = await serverFetch.get("/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();

  return <Posts meta={data?.meta} posts={data?.data} />;
};

export default NewsFeed;
