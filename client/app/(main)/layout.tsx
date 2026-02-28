import CustomLink from "@/components/CustomLink";
import { Input } from "@/components/ui/input";
import { User, Users, Search, TvMinimalPlayIcon, Bell } from "lucide-react";

import React from "react";
import MessengerIcon from "@/components/icons/MessangerIcon";
import Link from "next/link";
import GridIcon from "@/components/icons/GridIcon";
import Tooltip from "@/components/Tooltip";
import HomeIcon from "@/components/icons/HomeIcon";
import { redirect } from "next/navigation";
import { ProfilePopover } from "@/components/profile-popover";
import { auth } from "@/auth";
import Image from "next/image";
import GroupIcon from "@/components/icons/Group";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }
  // if (session.user.role === "ADMIN") redirect("/admin");
  return (
    <div className="  min-h-[calc(100vh-96px)] md:min-h-[calc(100vh-56px)]">
      <header className="fixed dark:bg-[#1c1c1d] bg-white w-full top-0 z-10 shadow-sm">
        <div className="hidden md:block px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 h-14">
            <div className="flex items-center w-1/4">
              <Link href="/">
                <Image
                  src={"/images/connecto-short-logo.png"}
                  alt="Logo"
                  width={32}
                  height={32}
                  priority
                />
              </Link>
              <div className="ml-4 shrink-0">
                <Input
                  type="text"
                  placeholder="Search Connecto"
                  className="rounded-full  px-4 py-2 w-auto"
                />
              </div>
            </div>
            <nav className="flex w-1/2 h-12 sticky justify-between items-center *:flex-1 *:justify-center *:px-2">
              {/* <Tooltip content="Home"> */}
              <div data-title="Home" className="tooltip" dir="bottom">
                <CustomLink href="/">
                  <HomeIcon className="h-5 w-5" fill="currentColor" />
                </CustomLink>
              </div>
              <div
                data-title="Friends"
                className="tooltip"
                data-position="bottom"
              >
                <CustomLink href="/friends">
                  <Users className="h-5 w-5" />
                </CustomLink>
              </div>

              <div
                data-title="Group"
                className="tooltip"
                data-position="bottom"
              >
                <CustomLink href="/groups/feed">
                  <GroupIcon className="h-5 w-5" fill="currentColor" />
                </CustomLink>
              </div>

              <div
                data-title="Notifications"
                className="tooltip"
                data-position="bottom"
              >
                <CustomLink href="/notifications">
                  <Bell className="h-5 w-5" fill="currentColor" />
                </CustomLink>
              </div>
            </nav>
            <div className="flex justify-end items-center w-1/4 gap-2">
              <div
                data-title="Menu"
                data-position="bottom"
                className="size-10 rounded-full bg-[#e2e5eb] dark:bg-muted flex justify-center items-center cursor-pointer tooltip"
              >
                <GridIcon className="size-6" />
              </div>
              <div
                data-title="Messenger"
                data-position="bottom"
                className="size-10 rounded-full bg-[#e2e5eb] dark:bg-muted flex justify-center items-center tooltip"
              >
                <Link href="/inbox">
                  <MessengerIcon className="size-8" />
                </Link>
              </div>
              <div
                data-title="Menu"
                className="size-10 rounded-full bg-[#e2e5eb] dark:bg-muted flex justify-center items-center tooltip"
                data-position="bottom"
              >
                {/* <ProfileDropdown /> */}
                <ProfilePopover />
              </div>
            </div>
          </div>
        </div>
        <div className="flex md:hidden justify-between items-center py-2 px-4">
          <h1 className="text-blue-600 font-bold">Connecto</h1>
          <div className="flex justify-center items-center gap-4">
            <div
              data-title="Menu"
              data-position="bottom"
              className="size-10 rounded-full bg-[#e2e5eb] dark:bg-muted flex justify-center items-center cursor-pointer tooltip"
            >
              <GridIcon className="size-6" />
            </div>
            <div
              data-title="Search"
              data-position="bottom"
              className="size-10 rounded-full bg-[#e2e5eb] dark:bg-muted flex justify-center items-center tooltip"
            >
              <Search />
            </div>
            <div
              data-title="Messenger"
              data-position="bottom"
              className="size-10 rounded-full bg-[#e2e5eb] dark:bg-muted flex justify-center items-center tooltip"
            >
              <Link href="/inbox">
                <MessengerIcon className="size-8" />
              </Link>
            </div>
            <div
              data-title="Account"
              data-position="bottom"
              className="tooltip"
            >
              {/* <ProfileDropdown /> */}
              <ProfilePopover />
            </div>
          </div>
        </div>
        <div className="w-full md:hidden block">
          <nav className="flex dark:bg-[#1c1c1d] w-full h-10 sticky justify-between items-center border-b *:flex-1 *:justify-center *:px-2">
            <div data-title="Home" data-position="top" className="tooltip">
              <CustomLink href="/">
                <HomeIcon className="h-5 w-5" fill="currentColor" />
              </CustomLink>
            </div>
            <div data-title="Friends" data-position="top" className="tooltip">
              <CustomLink href="/friends">
                <Users className="h-5 w-5" />
              </CustomLink>
            </div>
            <div data-title="Group" data-position="top" className="tooltip">
              <CustomLink href="/groups/feed">
                <GroupIcon className="h-5 w-5" fill="currentColor" />
              </CustomLink>
            </div>
            <div data-title="Account" data-position="top" className="tooltip">
              <CustomLink href={`/${session?.user?.username}`}>
                <div className="size-7 flex justify-center items-center rounded-full border bg-slate-100">
                  <User className="h-5 w-5" />
                </div>
              </CustomLink>
            </div>
            <div
              data-title="Notifications"
              data-position="top"
              className="tooltip"
            >
              <CustomLink href="/notifications">
                <Bell className="h-5 w-5" fill="currentColor" />
              </CustomLink>
            </div>
          </nav>
        </div>
      </header>
      <div className="mt-24 md:mt-13.5">{children}</div>
    </div>
  );
};

export default layout;
