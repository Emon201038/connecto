"use client";
import { IConversationMember, IMessage } from "@/types";
import { useSession } from "next-auth/react";
import { Like } from "./RightSideBar";
import { EmojiDisplay } from "@/components/Emoji";

interface TextMessageProps {
  message: IMessage;
}

const EmojiMessage = ({ message }: TextMessageProps) => {
  const session = useSession();

  return (
    <div
      className={`relative flex items-center gap-2 ${
        message.sender.id === session?.data?.user?.id
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`flex w-full ${
          message.sender.id === session?.data?.user?.id
            ? "flex-row-reverse"
            : "flex-row"
        }`}
      >
        {message.content === "LIKE" ? (
          <Like className="size-9" />
        ) : (
          <div>
            <EmojiDisplay emoji={message.content} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiMessage;
