"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ClipboardIcon,
  EllipsisVerticalIcon,
  ForwardIcon,
  PencilIcon,
  PlusIcon,
  SmileIcon,
  TrashIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { IConversationMember, IMessage } from "@/types";
import { useSession } from "next-auth/react";
import { messengerThemes } from "@/constants/themes";
import twemoji from "twemoji";
import { formatDate } from "./helper";
import MessageReactModal from "@/components/modules/reaction/MessageReactModal";

const reactions = [
  {
    name: "like",
    emoji: <Image src="/images/like.svg" alt="like" width={24} height={24} />,
    color: "#2078f4",
  },
  {
    name: "love",
    emoji: <Image src="/images/love.svg" alt="angry" width={24} height={24} />,
    color: "#f33e58",
  },
  {
    name: "haha",
    emoji: <Image src="/images/haha.svg" alt="angry" width={24} height={24} />,
    color: "#f7b125",
  },
  {
    name: "wow",
    emoji: <Image src="/images/wow.svg" alt="angry" width={24} height={24} />,
    color: "#f7b125",
  },
  {
    name: "sad",
    emoji: <Image src="/images/sad.svg" alt="angry" width={24} height={24} />,
    color: "#f7b125",
  },
  {
    name: "angry",
    emoji: <Image src="/images/angry.svg" alt="angry" width={24} height={24} />,
    color: "#e9710f",
  },
];

interface TextMessageProps {
  message: IMessage;
  conversation: IConversationMember;
}

const TextMessage = ({ message, conversation }: TextMessageProps) => {
  const [showButtons, setShowButtons] = React.useState(false);
  const [showReactionsModal, setShowReactionsModal] = React.useState(false);
  const [showMoreOptions, setShowMoreOptions] = React.useState(false);

  const popoverRef = React.useRef<HTMLDivElement | null>(null);

  const session = useSession();

  return (
    <div
      onMouseEnter={() => {
        setShowButtons(true);
      }}
      onMouseLeave={() => {
        if (!showReactionsModal && !showMoreOptions) setShowButtons(false);
      }}
      className={`relative mt-2 w-full flex gap-2 ${
        message.sender.id === session?.data?.user?.id
          ? "justify-end"
          : "justify-start"
      }`}
    >
      {message.sender.id !== session?.data?.user?.id && (
        <Avatar>
          <AvatarImage
            src={
              message?.sender?.profilePicture?.url ||
              "/images/default-profile.jpeg"
            }
          />
          <AvatarFallback>
            {message?.sender?.fullName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={`flex w-full ${
          message.sender.id === session?.data?.user?.id
            ? "flex-row-reverse"
            : "flex-row"
        }`}
      >
        {/* <Tooltip content={formatDate(new Date(parseInt(message?.createdAt)))}> */}
        <Card
          className={`peer px-3 py-2 max-w-[80%] ${
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
        {/* </Tooltip> */}
        <div
          className={`${showButtons ? "flex" : "hidden"} items-center gap-px ${
            message.sender.id === session?.data?.user?.id
              ? "flex-row-reverse"
              : "flex-row"
          }`}
        >
          <MessageReactModal
            showButtons={showButtons}
            setShowButtons={setShowButtons}
            showReactionsModal={showReactionsModal}
            setShowReactionsModal={setShowReactionsModal}
            messageId={message.id}
            ref={popoverRef}
          />
          {/* <Tooltip content="Reply" delayDuration={100} > */}
          <Button variant={"ghost"} className="rounded-full size-7 p-1">
            <ForwardIcon style={{ transform: "rotateY(180deg)" }} />
          </Button>
          {/* </Tooltip> */}

          <Popover open={showMoreOptions} onOpenChange={setShowMoreOptions}>
            <PopoverTrigger asChild>
              <Button variant={"ghost"} className="rounded-full size-7 p-1">
                <EllipsisVerticalIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-24 px-0.5 py-0.5">
              {[
                { name: "Edit" },
                {
                  name: "Forward",
                  icon: (
                    <ForwardIcon style={{ transform: "rotateY(180deg)" }} />
                  ),
                },
                { name: "Pin", icon: <ClipboardIcon /> },
                {
                  name:
                    message.sender.id === session?.data?.user?.id
                      ? "Delete"
                      : "Remove",
                  icon: <TrashIcon />,
                },
                { name: "Report", icon: <PencilIcon /> },
              ].map((option) => {
                if (
                  message.sender.id !== session?.data?.user?.id &&
                  option.name === "Edit"
                )
                  return;
                return (
                  <div
                    key={option.name}
                    className="flex items-center gap-2 hover:bg-muted px-2 py-1 cursor-pointer font-semibold"
                  >
                    <span>{option.name}</span>
                  </div>
                );
              })}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

const MessageText = ({ text }: { text: string }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(text, {
          folder: "svg",
          ext: ".svg",
        }),
      }}
      className="text-base leading-relaxed twemoji"
    />
  );
};

export default TextMessage;
