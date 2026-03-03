import { serverFetch } from "@/lib/server-fetch";
import Posts from "@/components/modules/post/posts";

const page = async () => {
  const res = await serverFetch.get("/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();

  return (
    <div className="w-screen mx-auto py-6">
      <Posts meta={data?.meta} posts={data?.data} />
    </div>
  );
};

export default page;
