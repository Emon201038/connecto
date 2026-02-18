import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon, SmileIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

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

type Props = {
  showReactionsModal: boolean;
  setShowReactionsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showButtons: boolean;
  setShowButtons: React.Dispatch<React.SetStateAction<boolean>>;
  messageId: string;
};

const MessageReactModal = React.forwardRef<HTMLDivElement, Props>(
  (
    { showReactionsModal, setShowReactionsModal, setShowButtons, messageId },
    popoverRef,
  ) => {
    return (
      <Popover open={showReactionsModal} onOpenChange={setShowReactionsModal}>
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
          } p-0 border-none shadow-none bg-transparent`}
          onClick={(e) => e.preventDefault()}
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
                  console.log(reaction, messageId);
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
    );
  },
);

export default MessageReactModal;
