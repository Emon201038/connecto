import PostCard from "@/components/modules/post/post-card";
import { IPost } from "@/interface/post.interface";
import { serverFetch } from "@/lib/server-fetch";
import Login from "./login";

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
    <div className="w-screen mx-auto">
      <div className="space-y-4 max-w-lg w-full mx-auto">
        <Login />
        {data?.data?.map((post: IPost) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default page;
