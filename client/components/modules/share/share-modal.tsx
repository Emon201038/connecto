"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  X,
  ChevronDown,
  ChevronRight,
  Smile,
  Globe,
  MessageCircle,
  Link2,
  Users,
  User,
  ChevronLeft,
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const messengerContacts = [
  { id: 1, name: "soulmate", avatar: "/couple-avatar.png", hasHeart: true },
  {
    id: 2,
    name: "Tanjina Aktar",
    avatar: "/woman-with-save-palestine-badge.jpg",
  },
  { id: 3, name: "Md Bayzid", avatar: "/man-with-sunglasses-avatar.jpg" },
  { id: 4, name: "Md Arafat", avatar: "/man-outdoor-avatar.jpg" },
  { id: 5, name: "CSE-A2 Group O...", avatar: "/group-chat-avatar.jpg" },
  { id: 6, name: "Jowel Sarkar", avatar: "/casual-man-avatar.png" },
  { id: 7, name: "Md Arafat", avatar: "/man-outdoor-avatar.jpg" },
  { id: 8, name: "CSE-A2 Group O...", avatar: "/group-chat-avatar.jpg" },
  { id: 9, name: "Jowel Sarkar", avatar: "/casual-man-avatar.png" },
];

const shareOptions = [
  { id: 1, name: "Messenger", icon: MessageCircle },
  {
    id: 2,
    name: "WhatsApp",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: 3,
    name: "Your story",
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
  { id: 4, name: "Copy link", icon: Link2 },
  { id: 5, name: "Group", icon: Users },
  { id: 6, name: "Friend's profile", icon: User },
];

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ open, onOpenChange }: ShareModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const AVATAR_WIDTH = 72;
  const STEP = 4;

  const updateScrollButtons = () => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    if (!open) return;

    const timeout = setTimeout(() => {
      const el = containerRef.current;
      if (!el) return;

      updateScrollButtons();
      el.addEventListener("scroll", updateScrollButtons);
    }, 0);

    return () => clearTimeout(timeout);
  }, [open]);

  const scrollNext = () => {
    containerRef.current?.scrollBy({
      left: AVATAR_WIDTH * STEP,
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    containerRef.current?.scrollBy({
      left: -AVATAR_WIDTH * STEP,
      behavior: "smooth",
    });
  };
  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="rounded-xl rounded-b-none md:rounded-b-xl bg-accent overflow-hidden md:h-auto h-[70vh]">
        {/* Header */}
        <ResponsiveDialogHeader className="p-4 border-b border-[#3a3b3c] relative">
          <ResponsiveDialogTitle className="text-xl font-bold text-center ">
            Share
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        {/* User Info Section */}
        <div className="p-4 pb-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/male-user-avatar-blue.jpg" />
              <AvatarFallback className="bg-blue-600">EH</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[15px] ">
                Emdadul Hoque Emon
              </span>
              <div className="flex items-center gap-2">
                <span className="bg-[#3a3b3c] text-[#e4e6eb] text-xs px-2 py-0.5 rounded-md">
                  Feed
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1  text-xs px-2 py-0.5 rounded-md transition-colors">
                      <Globe className="h-3 w-3" />
                      <span>Public</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="">
                    <DropdownMenuItem className=" cursor-pointer">
                      <Globe className="h-4 w-4 mr-2" /> Public
                    </DropdownMenuItem>
                    <DropdownMenuItem className=" cursor-pointer">
                      <Users className="h-4 w-4 mr-2" /> Friends
                    </DropdownMenuItem>
                    <DropdownMenuItem className=" cursor-pointer">
                      <User className="h-4 w-4 mr-2" /> Only me
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <div className=" py-3">
          <div className="flex items-start px-4">
            <Textarea
              placeholder="Say something about this..."
              className=" bg-transparent dark:bg-transparent text-[#b0b3b8] placeholder-[#b0b3b8] resize-none outline-none text-[15px] min-h-[40px] border-none focus-visible:ring-0 bg-none focus-visible:ring-offset-0 shadow-none"
              rows={2}
              name="caption"
            />
            <button className="p-2 hover:bg-[#3a3b3c] rounded-full transition-colors">
              <Smile className="h-6 w-6 text-[#b0b3b8]" />
            </button>
          </div>
        </div>

        {/* Share Now Button */}
        <div className="px-4 pb-4 flex justify-end items-center">
          <Button className="bg-[#0866ff] hover:bg-[#1877f2]  font-semibold h-10 rounded-lg">
            Share now
          </Button>
        </div>

        {/* Send in Messenger Section */}
        <div className="border-t pt-4 border-[#3a3b3c] w-full ">
          <h3 className="font-semibold text-[15px]  mb-3">Send in Messenger</h3>
          <div className="relative ">
            {/* <ScrollArea className="w-full whitespace-nowrap"> */}
            <div
              ref={containerRef}
              className="flex gap-4 pb-2 overflow-x-auto max-w-122 w-full"
            >
              {messengerContacts.map((contact) => (
                <button
                  key={contact.id}
                  className="flex flex-col items-center gap-1.5 w-18 shrink-0"
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-transparent">
                      <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-[#3a3b3c] ">
                        {contact.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs text-[#e4e6eb] text-center w-full truncate">
                    {contact.name}
                  </span>
                </button>
              ))}
            </div>
            {canScrollLeft && (
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#3a3b3c] hover:bg-[#4a4b4c] flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5 " />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={scrollNext}
                className="
      absolute right-0 top-1/2 -translate-y-1/2
      w-8 h-8 rounded-full
      bg-[#3a3b3c] hover:bg-[#4a4b4c]
      flex items-center justify-center
    "
              >
                <ChevronRight className="h-5 w-5 " />
              </button>
            )}
          </div>
        </div>

        {/* Share To Section */}
        <div className="border-[#3a3b3c]">
          <h3 className="font-semibold text-[15px]  mb-3">Share to</h3>
          <div className="flex gap-4 ">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.id}
                  className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <div className="w-12 h-12 rounded-full bg-[#3a3b3c] flex items-center justify-center hover:bg-[#4a4b4c] transition-colors">
                    <IconComponent className="h-6 w-6 " />
                  </div>
                  <span className="text-xs text-[#e4e6eb] text-center w-16 leading-tight">
                    {option.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
