"use client";

import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { IStory, IUser } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export interface Story {
  id: string;
  userId: string;
  type: "image" | "video";
  content: string;
  duration: number;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  stories: Story[];
}
interface StoryListProps {
  stories: { stories: IStory[]; user: IUser }[];
  onStoryClick: (userIndex: number) => void;
  isLoading: boolean;
}

export function StoryList({
  stories,
  onStoryClick,
  isLoading,
}: StoryListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const router = useRouter();

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      return () => container.removeEventListener("scroll", checkScrollability);
    }
  }, []);

  useEffect(() => {
    // Check scrollability when component mounts or users change
    const timer = setTimeout(checkScrollability, 100);
    return () => clearTimeout(timer);
  }, [stories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 110 + 12; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: -cardWidth * 3,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 110 + 12; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: cardWidth * 3,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-5 top-1/2 -translate-y-1/2 z-1 bg-white/90 hover:bg-white shadow-lg rounded-full w-8 h-8"
          onClick={scrollLeft}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-5 top-1/2 -translate-y-1/2 z-1 bg-white/90 hover:bg-white shadow-lg rounded-full w-8 h-8"
          onClick={scrollRight}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div
          onClick={() => router.push("/story/create")}
          className="w-[112.5px] h-48 flex flex-col items-center justify-center rounded-xl shrink-0 relative cursor-pointer shadow"
        >
          <div className="relative w-full h-38 rounded-t-xl overflow-hidden">
            <Image
              src="/images/default-profile.svg"
              alt="user"
              fill
              className="object-cover h-38"
            />
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-primary rounded-full p-1">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div className="w-full h-12 bg-shade flex items-center justify-center rounded-b-xl">
            <span className="text-xs font-medium">Create story</span>
          </div>
        </div>
        {isLoading
          ? [1, 2, 3].map((_, index) => (
              <Skeleton
                key={index}
                className="w-27.5 h-48 animate-pulse"
              ></Skeleton>
            ))
          : stories.map((user, userIndex) => {
              const latestStory = user.stories[user.stories.length - 1];
              const timeAgo = formatDistanceToNow(latestStory.createdAt, {
                addSuffix: true,
              });

              return (
                <div
                  key={user.user.id}
                  className="shrink-0 cursor-pointer group w-27.5 h-48"
                  onClick={() => {
                    onStoryClick(userIndex);
                    toast.info("Coming soon...");
                  }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-linear-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    {/* Background image from latest story */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${latestStory.mediaUrl})`,
                      }}
                    >
                      <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Story ring indicator around avatar */}
                    <div className="absolute top-3 left-3">
                      <div className="relative">
                        <div className="bg-background rounded-full p-0.5">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={
                                user.user.profilePicture?.url ||
                                "/images/default-profile.jpeg"
                              }
                              alt={user.user.firstName}
                            />
                            <AvatarFallback className="text-xs">
                              {user.user.firstName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    </div>

                    {/* User info at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/80 to-black/20">
                      <p
                        className="text-white text-sm font-medium truncate drop-shadow-lg"
                        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}
                      >
                        {user.user.fullName}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
