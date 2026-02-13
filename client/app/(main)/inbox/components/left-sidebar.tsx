"use client";
import React from "react";
import Header from "./header";
import SearchForm from "./SearchForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useSession } from "next-auth/react";
import timeAgo from "@/lib/time-ago";
import SearchedConversation from "./searched-conversation";
import { IConversation, IUser, IUsersConversation } from "@/types";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useGetConversationsQuery } from "@/redux/features/conversation/conversationApi";
import { Skeleton } from "@/components/ui/skeleton";
import Conversation from "./conversation";

const LeftSidebar = () => {
  const [isActiveSearch, setIsActiveSearch] = React.useState(false);
  const [searchedUser, setSearchedUser] = React.useState<IUser[]>([]);
  const [inp, setInp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const session = useSession();
  const pathname = usePathname();

  const { data, isLoading: isLoadingConversations } = useGetConversationsQuery({
    page: 1,
    limit: 10,
    search: "",
  });
  const conversations = data?.conversations || [];
  return (
    <div className="w-[360px] min-w-[360px] border-r flex flex-col">
      <div className="p-4 space-y-4">
        <div className="">
          <Header />
        </div>

        <SearchForm
          isActiveSearch={isActiveSearch}
          setIsActiveSearch={setIsActiveSearch}
          setSearchedUser={setSearchedUser}
          setIsLoading={setIsLoading}
          setInp={setInp}
          inp={inp}
        />
        {/* {conversations.length === 0 && <Friends />} */}
      </div>
      <div className="flex-1 overflow-auto px-2">
        {isActiveSearch ? (
          <SearchedConversation
            users={searchedUser}
            setUsers={setSearchedUser}
            inputValue={inp}
            setInputValue={setInp}
            isLoading={isLoading}
            setSearched={setIsActiveSearch}
          />
        ) : isLoadingConversations ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton
                  key={i}
                  className="size-[50px] rounded-full"
                ></Skeleton>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-2 w-25" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          conversations.map((conversation) => {
            const isSeenByOther =
              conversation.lastMessage?.sender?.id !== "2" &&
              conversation.lastMessage?.status === "unseen";

            return (
              <Conversation
                key={conversation.id}
                conversation={conversation}
                isSeenByOther={isSeenByOther}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

const LastMessage = ({
  message,
}: {
  message: { content: string; sender: { id: string }; createdAt: string };
}) => {
  const session = useSession();
  if (!message) return null;

  const isSeenByOther = false;
  return (
    <div
      className={`flex gap-2 ${
        !isSeenByOther ? "opacity-70" : "opacity-100 font-bold"
      }`}
    >
      <p className="text-xs opacity-70">
        {message?.sender?.id === session.data?.user.id && "You:"}{" "}
        {message?.content
          ?.slice(0, 28)
          ?.concat(message?.content?.length > 28 ? "..." : "")}
      </p>
      <div className="text-xs opacity-70">
        . {timeAgo(new Date(message?.createdAt), "1m")}
      </div>
    </div>
  );
};

export default LeftSidebar;
