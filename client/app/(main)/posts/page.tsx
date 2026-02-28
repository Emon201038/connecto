import PostCard from "@/components/modules/post/post-card";
import { IPost } from "@/interface/post.interface";
import { serverFetch } from "@/lib/server-fetch";

const page = async () => {
  const res = await serverFetch.get("/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await res.json();

  console.log(data);
  return (
    <div className="space-y-4">
      {data?.data?.map((post: IPost) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default page;
