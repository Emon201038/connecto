"use client";
import { Card } from "@/components/ui/card";
import { IConversationMember, IMessage } from "@/types";
import { useSession } from "next-auth/react";
import { formatDate } from "../../../app/(main)/inbox/[chatId]/components/helper";

interface TextMessageProps {
  message: IMessage;
}

const TextMessage = ({ message }: TextMessageProps) => {
  const session = useSession();

  return (
    <div className={`relative max-w-[80%] flex gap-2 items-center`}>
      <Card
        className={`peer px-3 py-2 ${
          message.sender.id === session?.data?.user?.id
            ? "bg-primary text-primary-foreground dark:text-white "
            : "bg-transparent text-black dark:text-white"
        }`}
        // style={{
        //   backgroundColor: theme?.colors?.messageOutgoingBg,
        //   color: theme?.colors?.messageOutgoingText,
        // }}
      >
        <div
          className="text-sm tooltip"
          data-title={formatDate(new Date(parseInt(message?.createdAt)))}
          dir="left"
          dangerouslySetInnerHTML={{ __html: message?.content }}
        />
      </Card>
    </div>
  );
};

export default TextMessage;
