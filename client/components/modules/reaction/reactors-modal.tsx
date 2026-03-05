"use client";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useGetReactionsQuery } from "@/redux/features/reaction/reactionApi";
import {
  ReactionTargetType,
  ReactionType,
} from "@/interface/reaction.interface";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import React, { useMemo, useState } from "react";
import { reactionEmojis } from "@/constants/emoji";

interface Props {
  postId: string;
  open: boolean;
  onOpenChange: (open: React.SetStateAction<boolean>) => void;
}

export default function ReactorsModal({ postId, open, onOpenChange }: Props) {
  const [currentTab, setCurrentTab] = useState<ReactionType | "ALL">("ALL");
  // 🔥 Only call API when modal is open
  const { data, isLoading } = useGetReactionsQuery(
    {
      target: postId,
      targetType: ReactionTargetType.POST,
      type: currentTab === "ALL" ? undefined : currentTab,
    },
    {
      skip: !open,
    },
  );

  const reactionTabs = useMemo(() => {
    return (
      data?.map((reaction) => {
        return {
          label: reaction.type as ReactionType | "ALL",
          src: `/images/${reaction.type.toLowerCase()}.svg`,
        };
      }) || []
    );
  }, [data]);

  const getReactionCount = (reactionType: ReactionType | "ALL") => {
    if (currentTab === "ALL") return data?.length || 0;
    return (
      data?.filter((reaction) => reaction.type === reactionType)?.length || 0
    );
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="pt-0">
        <ResponsiveDialogHeader className="sr-only">
          <ResponsiveDialogTitle>Reactions</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        {isLoading && (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin" />
          </div>
        )}

        <div className="space-y-3 mt-4 pb-1 max-h-100 overflow-y-auto">
          <div className="flex gap-1 justify-start items-center">
            {[
              { label: "ALL" as const, src: "/images/all.svg" },
              ...reactionTabs,
            ].map((tab) => {
              const count = getReactionCount(tab.label);
              const isActive = currentTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentTab(tab.label);
                  }}
                  className={`flex justify-center gap-1 items-center px-2 py-2 ransition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? `${
                          tab.label !== "ALL" &&
                          reactionEmojis[tab.label as ReactionType].classes.text
                        } border-b-2 border-current`
                      : count === 0 && tab.label !== "ALL"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:text-gray-800 "
                  }`}
                  disabled={count === 0 && tab.label !== "ALL"}
                >
                  {tab.label !== "ALL" && (
                    <>
                      {reactionEmojis[tab.label as ReactionType].emoji}
                      {
                        <span className="text-sm font-medium capitalize">
                          {tab.label}
                        </span>
                      }
                    </>
                  )}
                  {tab.label === "ALL" && (
                    <span className="text-sm font-medium">{tab.label}</span>
                  )}
                </button>
              );
            })}
          </div>
          {data?.map((reaction) => (
            <div key={reaction.id} className="flex items-center gap-3">
              <div className="size-10 relative">
                <Avatar className="size-10">
                  <AvatarImage src={reaction?.user?.profilePicture?.url} />
                  <AvatarFallback>
                    {reaction?.user?.fullName?.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -right-1 -bottom-0.5 size-4">
                  {reactionEmojis[reaction.type as ReactionType].emoji}
                </div>
              </div>
              <span>{reaction.user.fullName}</span>
            </div>
          ))}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
