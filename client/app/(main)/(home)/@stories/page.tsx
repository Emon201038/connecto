"use client";
import { StoriesContainer } from "@/components/story-container";
import { useGetStoriesQuery } from "@/redux/features/story/storyApi";
import { Plus } from "lucide-react";
import React from "react";

const StoryPage = () => {
  const [page, setPage] = React.useState(1);
  const { data, isLoading } = useGetStoriesQuery(
    { page, limit: 20 },
    { refetchOnMountOrArgChange: true, skip: false }
  );

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide relative px-0">
      <StoriesContainer
        stories={data?.data?.stories || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StoryPage;
