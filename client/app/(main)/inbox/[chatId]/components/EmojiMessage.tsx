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
import { Like } from "./RightSideBar";
import { EmojiDisplay } from "@/components/Emoji";

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

const EmojiMessage = ({ message, conversation }: TextMessageProps) => {
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
        {message.content === "LIKE" ? (
          <Like className="size-9" />
        ) : (
          <div>
            <EmojiDisplay emoji={message.content} />
          </div>
        )}
        <div
          className={`${showButtons ? "flex" : "hidden"} items-center gap-px ${
            message.sender.id === session?.data?.user?.id
              ? "flex-row-reverse"
              : "flex-row"
          }`}
        >
          <Popover
            open={showReactionsModal}
            onOpenChange={setShowReactionsModal}
          >
            <PopoverTrigger>
              <Button
                asChild
                onMouseEnter={() => setShowButtons(true)}
                onMouseLeave={() => {
                  if (!showReactionsModal) setShowButtons(false);
                }}
                onClick={() => setShowReactionsModal(true)}
                variant={"ghost"}
                className="relative rounded-full size-7 p-1"
              >
                <SmileIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              ref={popoverRef}
              className={`${
                showReactionsModal ? "block" : "hidden"
              } p-0 border-none shadow-none`}
            >
              <div
                // initial={{ scale: 0.8, opacity: 0 }}
                // animate={{ scale: 1, opacity: 1 }}
                // exit={{ scale: 0.8, opacity: 0 }}
                // transition={{ type: "spring", damping: 20, stiffness: 300 }}
                style={{
                  pointerEvents: "auto",
                }}
                className="bg-background rounded-full shadow-lg border p-1 flex items-center gap-0"
              >
                {reactions.map((reaction) => (
                  <button
                    key={reaction.name}
                    // whileHover={{ scale: 1.3 }}
                    // whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center relative group"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowReactionsModal(false);
                      setShowButtons(false);
                      // onReactionSelect(reaction.name, e)
                      // onClose()
                    }}
                  >
                    <span className="text-2xl">{reaction.emoji}</span>
                    <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs rounded px-1 py-0.5 capitalize">
                      {reaction.name}
                    </div>
                  </button>
                ))}
                <button
                  // whileHover={{ scale: 1.3 }}
                  // whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center relative group"
                >
                  <PlusIcon />
                </button>
              </div>
            </PopoverContent>
          </Popover>
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
                    className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1 cursor-pointer font-semibold"
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

export default EmojiMessage;
