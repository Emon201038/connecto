import Posts from "./components/post-wraper";
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const NewsFeed = async () => {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return <Posts />;
};

export default NewsFeed;
