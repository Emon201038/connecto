"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ThumbsUp, Heart, Plus, ChevronLeft } from "lucide-react";
import Image from "next/image";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { useGetReactionsQuery } from "@/redux/features/reaction/reactionApi";
import { IReaction, ReactionType } from "@/interface/reaction.interface";
import { reactionEmojis } from "@/constants/emoji";
import Link from "next/link";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
// import { ScrollArea } from "@/components/ui/scroll-area"

type TReactionType = "ALL" | ReactionType;

interface User {
  id: number;
  name: string;
  avatar: string;
  reaction: ReactionType;
  reactionEmoji: React.ReactNode;
}

// const allReactions: User[] = [
//   {
//     id: 1,
//     name: "Joni Sarkar",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "like",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/like.svg" alt="like" />
//     ),
//   },
//   {
//     id: 2,
//     name: "Pranto Saha",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "love",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/love.svg" alt="love" />
//     ),
//   },
//   {
//     id: 3,
//     name: "Sharif Meyazi",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "like",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/like.svg" alt="like" />
//     ),
//   },
//   {
//     id: 4,
//     name: "Mohammad Shawon",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "care",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/care.svg" alt="like" />
//     ),
//   },
//   {
//     id: 5,
//     name: "Ahmed Riad",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "like",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/like.svg" alt="like" />
//     ),
//   },
//   {
//     id: 6,
//     name: "Md Zia Uddin",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "love",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/love.svg" alt="love" />
//     ),
//   },
//   {
//     id: 7,
//     name: "Md Soron",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "wow",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/wow.svg" alt="wow" />
//     ),
//   },
//   {
//     id: 8,
//     name: "Sarah Ahmed",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "sad",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/sad.svg" alt="sad" />
//     ),
//   },
//   {
//     id: 9,
//     name: "Karim Hassan",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "angry",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/angry.svg" alt="angry" />
//     ),
//   },
//   {
//     id: 10,
//     name: "Fatima Khan",
//     avatar: "/images/default-profile.jpeg",
//     reaction: "care",
//     reactionEmoji: (
//       <Image width={20} height={20} src="/images/care.svg" alt="like" />
//     ),
//   },
// ];

const reactionTabs = [
  {
    key: "ALL" as TReactionType,
    label: "All",
    icon: null,
    emoji: "",
    color: "text-blue-600",
  },
  {
    key: "LIKE" as TReactionType,
    label: "Like",
    icon: ThumbsUp,
    emoji: <Image width={20} height={20} src="/images/like.svg" alt="like" />,
    color: "text-blue-500",
  },
  {
    key: "LOVE" as TReactionType,
    label: "Love",
    icon: Heart,
    emoji: <Image width={20} height={20} src="/images/love.svg" alt="love" />,
    color: "text-red-500",
  },
  {
    key: "CARE" as TReactionType,
    label: "Care",
    icon: null,
    emoji: <Image width={20} height={20} src="/images/care.svg" alt="like" />,
    color: "text-orange-500",
  },
  {
    key: "WOW" as TReactionType,
    label: "Wow",
    icon: null,
    emoji: <Image width={20} height={20} src="/images/wow.svg" alt="wow" />,
    color: "text-yellow-500",
  },
  {
    key: "SAD" as TReactionType,
    label: "Sad",
    icon: null,
    emoji: <Image width={20} height={20} src="/images/sad.svg" alt="like" />,
    color: "text-yellow-600",
  },
  {
    key: "ANGRY" as TReactionType,
    label: "Angry",
    icon: null,
    emoji: <Image width={20} height={20} src="/images/angry.svg" alt="angry" />,
    color: "text-red-600",
  },
];

function LoadingSkeleton() {
  return (
    <div className="space-y-3 p-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
      ))}
    </div>
  );
}

interface ReactionsModalProps {
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  target: string;
}

export default function ReactorsModal({
  onClose,
  open,
  target,
}: ReactionsModalProps) {
  const [activeFilter, setActiveFilter] = useState<TReactionType>("ALL");

  const { data, isLoading } = useGetReactionsQuery(
    {
      target: target,
      type: activeFilter === "ALL" ? undefined : (activeFilter as ReactionType),
    },
    {
      skip: !target,
      refetchOnMountOrArgChange: true,
    },
  );

  const handleClose = (state: boolean) => {
    onClose(state);
    setTimeout(onClose, 200); // Wait for exit animation
  };

  if (isLoading) {
    return (
      <ResponsiveDialog open={open} onOpenChange={handleClose}>
        {/* Header */}
        <ResponsiveDialogContent>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle className="sr-only">f</ResponsiveDialogTitle>
            <div className="flex w-full items-center !gap-2 overflow-x-auto">
              {reactionTabs.map((tab) => (
                <Skeleton key={tab.key} className="w-10 h-8 rounded-md" />
              ))}
            </div>
            <LoadingSkeleton />
          </ResponsiveDialogHeader>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    );
  }

  const initialValue: Record<ReactionType, IReaction[]> = {
    LIKE: [],
    LOVE: [],
    CARE: [],
    HAHA: [],
    WOW: [],
    SAD: [],
    ANGRY: [],
  };

  const grouped = data?.data.reduce<Record<ReactionType, IReaction[]>>(
    (acc, reaction) => {
      if (!acc[reaction!.type as ReactionType]) {
        acc[reaction!.type as ReactionType] = [];
      }
      acc[reaction!.type as ReactionType].push(reaction);
      return acc;
    },
    initialValue,
  );

  const getReactionCount = (reactionType: TReactionType) => {
    if (reactionType === "ALL") return data?.data.length;
    return data?.data.filter((user) => user.type === reactionType).length;
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={handleClose}>
      {/* Header */}
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle className="sr-only">f</ResponsiveDialogTitle>
          <div className="flex w-full items-center !gap-2 overflow-x-auto">
            {reactionTabs.map((tab) => {
              const count = getReactionCount(tab.key as TReactionType);
              // Show all tabs, but dim the ones with 0 count

              const isActive = activeFilter === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFilter(tab.key);
                  }}
                  className={`flex flex-1 justify-center gap-1 items-center px-2 py-2 ransition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? `${
                          tab.key !== "ALL" &&
                          reactionEmojis[tab.key as ReactionType].classes.text
                        } border-b-2 border-current`
                      : count === 0 && tab.key !== "ALL"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                  disabled={count === 0 && tab.key !== "ALL"}
                >
                  {tab.key !== ("ALL" as TReactionType) && (
                    <>
                      {reactionEmojis[tab.key as ReactionType].emoji}
                      {
                        <span className="text-sm font-medium">
                          {
                            (data?.data || [])?.filter(
                              (r) => r.type === tab.key,
                            ).length
                          }
                        </span>
                      }
                    </>
                  )}
                  {tab.key === ("ALL" as TReactionType) && (
                    <>
                      <span className="text-sm font-medium">{tab.key}</span>

                      <span className="text-sm font-medium">
                        {(data?.data || []).length}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
          <div className="overflow-y-auto md:max-h-96 h-full pb-6">
            {/* scroll area */}
            <div className="space-y-1">
              {data?.data?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">😔</div>
                  <p>No reactions of this type yet</p>
                </div>
              ) : (
                data?.data?.map((reaction, index) => (
                  <div
                    key={reaction.id}
                    className="flex items-center justify-between p-3 hover:bg-accent transition-colors duration-150 animate-fadeIn"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href={`/${reaction.user?.username}`}
                      className="flex items-center space-x-3"
                    >
                      <div className="relative">
                        <Image
                          src={
                            reaction.user?.profilePicture?.url ||
                            "/images/default-profile.jpeg"
                          }
                          alt={reaction.user?.fullName || "User"}
                          width={40}
                          height={40}
                          className="rounded-full transition-transform duration-200 hover:scale-105"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                          <span className="text-xs">
                            {
                              reactionEmojis[reaction!.type as ReactionType]
                                .emoji
                            }
                          </span>
                        </div>
                      </div>
                      <span className="font-medium">
                        {reaction.user?.fullName}
                      </span>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.success("Feature not implemented yet", {
                          description: "This feature will be implemented soon",
                        });
                      }}
                      className="flex items-center space-x-1 hover:transition-all duration-200 hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add friend</span>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </ResponsiveDialogHeader>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
