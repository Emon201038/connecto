import { ProfilePopover } from "@/components/profile-popover";
import ReusableTooltip from "@/components/Tooltip";
import { Bell, GridIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Header = () => (
  <header className="flex justify-between items-center gap-2 h-14 px-4 fixed top-0 left-0 w-full bg-transparent z-10">
    <div className="flex gap-3 items-center">
      <Link
        href={"/"}
        className="size-10 bg-muted flex justify-center items-center rounded-full cursor-pointer"
      >
        <X />
      </Link>
      <Link
        href={"/"}
        className="size-10 bg-[#0274f9] flex justify-center items-center rounded-full cursor-pointer"
      >
        <Image
          width={30}
          height={30}
          alt="logo"
          src={"/images/connecto-short-logo.png"}
        />
      </Link>
    </div>
    <div className="flex gap-3 items-center">
      <ReusableTooltip content="Menu">
        <div className="size-10 rounded-full bg-secondary-btn-bg flex justify-center items-center cursor-pointer">
          <GridIcon className="size-6 text-secondary-btn-text" />
        </div>
      </ReusableTooltip>
      <ReusableTooltip content="Messenger">
        <div className="size-10 rounded-full bg-[#e2e5eb] dark:bg-muted flex justify-center items-center">
          <Bell fill="currentColor" size={24} />
        </div>
      </ReusableTooltip>
      <ReusableTooltip content="Account">
        <ProfilePopover />
      </ReusableTooltip>
    </div>
  </header>
);
