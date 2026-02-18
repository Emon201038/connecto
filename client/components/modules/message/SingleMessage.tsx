"use client";
import EmojiMessage from "@/app/(main)/inbox/[chatId]/components/EmojiMessage";
import TextMessage from "@/app/(main)/inbox/[chatId]/components/TextMessage";
import { IConversationMember, IMessage } from "@/types";
import React from "react";
import MessageReactModal from "../reaction/MessageReactModal";
import { Button } from "@/components/ui/button";
import {
  ClipboardIcon,
  EllipsisVerticalIcon,
  ForwardIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = { message: IMessage; conversation: IConversationMember };

const SingleMessage = ({ message, conversation }: Props) => {
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
      id={message.id}
      className={`relative w-full mt-2 flex items-center gap-2  ${
        message.sender.id === session?.data?.user?.id
          ? "flex-row-reverse justify-start"
          : "flex-row"
      }`}
    >
      {message.sender.id !== session?.data?.user?.id && (
        <Avatar className="size-6">
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
      {message.type === "TEXT" && <TextMessage message={message} />}
      {message.type === "EMOJI" && <EmojiMessage message={message} />}
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
        <Button variant={"ghost"} className="rounded-full size-7 p-1">
          <ForwardIcon style={{ transform: "rotateY(180deg)" }} />
        </Button>

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
                icon: <ForwardIcon style={{ transform: "rotateY(180deg)" }} />,
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
  );
};

export default SingleMessage;
