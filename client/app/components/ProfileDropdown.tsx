import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  BadgeHelpIcon,
  ChevronDown,
  ChevronRightIcon,
  MessageSquareWarningIcon,
  Moon,
  Settings,
} from "lucide-react";
import LogoutButton from "./LogoutButton";
import { auth } from "@/auth";

const ProfileDropdown = async () => {
  const session = await auth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="relative">
          <Avatar className="size-10 ">
            <AvatarImage
              src={
                session?.user?.profilePicture?.url ||
                "/images/default-profile.jpeg"
              }
              alt="User"
            />
            <AvatarFallback>
              {session?.user?.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 -right-px size-3 bg-[#e2e5eb] rounded-full">
            <ChevronDown size={15} />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[360px]">
        <DropdownMenuLabel className="flex justify-start items-center">
          <Avatar className="size-9">
            <AvatarImage src={session?.user?.profilePicture?.url} alt="User" />
            <AvatarFallback>
              {session?.user?.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <p className="px-2">{session?.user?.fullName}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="*:font-semibold *:text-[15px] *:py-3 *:cursor-pointer">
          <DropdownMenuItem>
            <div className="size-9 bg-[#e2e5eb] rounded-full flex justify-center items-center">
              <Settings size={20} />
            </div>
            <span>Settings & privacy</span>
            <DropdownMenuShortcut>
              <ChevronRightIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="size-7 bg-[#e2e5eb] rounded-full flex justify-center items-center">
              <BadgeHelpIcon size={20} />
            </div>
            <span>Help & support</span>
            <DropdownMenuShortcut>
              <ChevronRightIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="size-7 bg-[#e2e5eb] rounded-full flex justify-center items-center">
              <Moon size={20} />
            </div>
            <span>Display & accessibility</span>
            <DropdownMenuShortcut>
              <ChevronRightIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="size-7 bg-[#e2e5eb] rounded-full flex justify-center items-center">
              <MessageSquareWarningIcon size={20} />
            </div>
            <span>Give feedback</span>
            <DropdownMenuShortcut>
              <ChevronRightIcon />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogoutButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
