"use client";
import React from "react";
import Header from "./header";
import SearchForm from "./SearchForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { IUser } from "@/types";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SearchedConversation from "./searched-conversation";
import { useGetConversationsQuery } from "@/redux/features/conversation/conversationApi";
import { Skeleton } from "@/components/ui/skeleton";
import Conversation from "./conversation";

interface IConversation {
  id: string;
  avatar: string;
  title: string;
  members: {
    user: {
      fullName: string;
    };
    emoji: string;
    role: string;
    theme: string;
  }[];
}

const ConversationList = () => {
  const [isActiveSearch, setIsActiveSearch] = React.useState(false);
  const [searchedUser, setSearchedUser] = React.useState<IUser[]>([]);
  const [inp, setInp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const { data, isLoading: isLoadingConversations } = useGetConversationsQuery(
    {
      page: page,
      limit: 15,
      search: "",
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const conversations = data?.conversations || [];
  return (
    <div className="p-3  space-y-4 overflow-hidden bg-background rounded-sm h-full">
      <div className=" py-2">
        <Header />
      </div>
      <SearchForm
        inp={inp}
        setInp={setInp}
        isActiveSearch={isActiveSearch}
        setIsActiveSearch={setIsActiveSearch}
        setIsLoading={setIsLoading}
        setSearchedUser={setSearchedUser}
      />

      <div className="overflow-y-auto h-full">
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

export default ConversationList;
