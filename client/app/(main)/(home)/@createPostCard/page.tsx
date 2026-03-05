import CreatePostCard from "@/components/modules/post/create-post-card";
import { auth } from "@/lib/auth";
import React from "react";

const page = async () => {
  const session = await auth();
  return <CreatePostCard session={session} />;
};

export default page;
