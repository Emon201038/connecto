"use client";
import { useGroupPostsQuery } from "@/redux/features/group/groupApi";
import React from "react";
import Posts from "./posts";

const GroupFeedPage = () => {
  const { data } = useGroupPostsQuery({ page: 1, limit: 10 });

  console.log(data);
  return (
    <div className="bg-muted w-full px-4">
      <Posts />
    </div>
  );
};

export default GroupFeedPage;
