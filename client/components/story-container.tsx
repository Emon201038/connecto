"use client";

import { useState } from "react";
import { StoryList } from "./story-list";
import { IStory, IUser } from "@/types";

interface IProps {
  stories: { stories: IStory[]; user: IUser }[];
  isLoading: boolean;
}

export function StoriesContainer({ stories, isLoading }: IProps) {
  const [selectedStory, setSelectedStory] = useState<{
    userIndex: number;
    storyIndex: number;
  } | null>(null);

  const handleStoryClick = (userIndex: number, storyIndex = 0) => {
    setSelectedStory({ userIndex, storyIndex });
  };

  return (
    <StoryList
      stories={stories}
      onStoryClick={handleStoryClick}
      isLoading={isLoading}
    />
  );
}
