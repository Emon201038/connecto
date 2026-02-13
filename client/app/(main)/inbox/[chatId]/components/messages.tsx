"use client";
import React, {
  forwardRef,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetMessagesQuery } from "@/redux/features/message/messageApi";
import TextMessage from "./TextMessage";
import type { IConversationMember } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingMessages from "./loading";
import { Like } from "./RightSideBar";
import EmojiMessage from "./EmojiMessage";

const Messages = forwardRef<
  HTMLDivElement,
  { conversation: IConversationMember }
>(({ conversation }, ref) => {
  const params = useParams<{ chatId: string }>();
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState(false);

  const { data, isFetching, isLoading } = useGetMessagesQuery(
    { conversationId: params.chatId, page, limit: 20, search: "" },
    { refetchOnMountOrArgChange: true }
  );

  const messages = data?.messages || [];

  // update hasMore
  useEffect(() => {
    if (data?.meta) {
      setHasMore(!isLoading && data.meta.totalPage > page);
    }
  }, [data?.meta, page]);

  // intersection observer (load older)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.6 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // scroll to bottom when a new message is sent (not during pagination)
  const lastMessageRef = useRef<string | null>(null);
  useEffect(() => {
    if (!messages.length) return;

    const latestMessageId = messages[0]?.id; // since flex-col-reverse
    if (latestMessageId !== lastMessageRef.current) {
      lastMessageRef.current = latestMessageId;

      // only scroll if it's a new message (page 1)
      if (page === 1) {
        requestAnimationFrame(() => {
          scrollAreaRef.current?.scrollIntoView({ behavior: "smooth" });
        });
      }
    }
  }, [messages, page]);

  return (
    <div className="w-full h-full flex-1 overflow-auto flex flex-col-reverse p-4">
      {/* bottom spacer for scroll */}
      <div
        ref={(node) => {
          scrollAreaRef.current = node!;
          if (ref && typeof ref !== "function") ref.current = node!;
        }}
      />

      {/* messages */}
      {messages.map((message) => (
        <div id={message.id} key={message.id}>
          {message.type === "TEXT" && (
            <TextMessage message={message} conversation={conversation} />
          )}
          {message.type === "EMOJI" && (
            <EmojiMessage message={message} conversation={conversation} />
          )}
        </div>
      ))}

      {/* loader at top (for loading older messages) */}
      {hasMore && (
        <div ref={loaderRef} className="flex justify-center py-4">
          {<Loader2Icon className="animate-spin" />}
        </div>
      )}

      {isLoading && <LoadingMessages />}

      {conversation ? (
        <div className="flex flex-col items-center py-6 text-center">
          <Avatar className="size-15 rounded-full">
            <AvatarImage
              src={
                conversation.user?.profilePicture?.url ||
                "/images/default-profile.jpeg"
              }
            />
            <AvatarFallback>{conversation.nickname.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="font-semibold text-[17px] mt-2">
            {conversation.nickname}
          </h1>
          <p className="text-xs opacity-65 mt-1 max-w-sm">
            Messages and calls are secured with end-to-end encryption.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 text-center">
          <Skeleton className="size-15 rounded-full" />

          <Skeleton className="w-20 h-4 mt-2" />
          <p className="text-xs opacity-65 mt-1 max-w-sm">
            Messages and calls are secured with end-to-end encryption.
          </p>
        </div>
      )}
    </div>
  );
});

Messages.displayName = "Messages";

export default Messages;
