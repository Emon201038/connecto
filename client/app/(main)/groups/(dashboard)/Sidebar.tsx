"use client";
import { Input } from "@/components/ui/input";
import { Compass, Group, Newspaper, Plus, Search } from "lucide-react";
import React from "react";
import Link from "./Link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import NextLink from "next/link";

const Sidebar = () => {
  return (
    <div className="md:w-[360px] hidden md:block w-auto shadow py-4 overflow-y-auto fixed left-0 h-full">
      <div className="pb-1 flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold">Groups</h1>
      </div>
      <div className="mt-2 relative px-4">
        <Input
          type="text"
          role="search"
          placeholder="Search Groups"
          className="w-full rounded-full border-0 focus:border-0 focus:ring-0 focus:outline-0 outline-0 shadow-none bg-muted text-muted-foreground pl-8"
        />
        <Search
          className="absolute top-1/2 -translate-y-1/2 left-6 text-muted-foreground"
          size={18}
        />
      </div>
      <div className="flex flex-col mt-4 px-4">
        <Link href="/groups/feed" Icon={Newspaper}>
          Your Feed
        </Link>
        <Link href="/groups/discover" Icon={Compass}>
          Discover
        </Link>
        <Link href="/groups/joins" Icon={Group}>
          Your Groups
        </Link>
      </div>
      <div className="px-4">
        <NextLink href="/groups/create">
          <Button className="bg-[#ebf5ff] text-primary w-full hover:bg-muted hover:text-primary mt-4">
            <Plus className="w-4 h-4 mr-px" />
            Create Group
          </Button>
        </NextLink>
      </div>
      <div className="px-4">
        <Separator className="my-4 px-4" />
      </div>
      <div>
        <h1 className="text-lg font-semibold px-4 py-1">Groups you manage</h1>
        <div className="px-2">
          <div className="flex gap-2 items-center hover:bg-accent p-2 rounded-sm">
            <div className="w-12 h-12 rounded-md relative  px-1.5 py-1">
              <Image
                src={"/images/groups-default-cover-photo.png"}
                alt="logo"
                fill
                className="rounded-md aspect-square object-cover"
              />
            </div>
            <div className=" h-full flex items-start text-start align-top">
              <h1 className="align-top font-semibold text-sm">Group Name</h1>
            </div>
          </div>
          <div className="flex gap-2 items-center hover:bg-accent p-2 rounded-sm">
            <div className="w-12 h-12 rounded-md relative  px-1.5 py-1">
              <Image
                src={"/images/groups-default-cover-photo.png"}
                alt="logo"
                fill
                className="rounded-md aspect-square object-cover"
              />
            </div>
            <div className=" h-full flex items-start text-start align-top">
              <h1 className="align-top font-semibold text-sm">Group Name</h1>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <Separator className="my-4 px-4" />
      </div>
      <div>
        <h1 className="text-lg font-semibold px-4 py-1">
          Groups you&apos;ve joined
        </h1>
        <div className="px-2">
          <div className="flex gap-2 items-center hover:bg-accent p-2 rounded-sm">
            <div className="w-12 h-12 rounded-md relative  px-1.5 py-1">
              <Image
                src={"/images/groups-default-cover-photo.png"}
                alt="logo"
                fill
                className="rounded-md aspect-square object-cover"
              />
            </div>
            <div className=" h-full flex items-start text-start align-top">
              <h1 className="align-top font-semibold text-sm">Group Name</h1>
            </div>
          </div>
          <div className="flex gap-2 items-center hover:bg-accent p-2 rounded-sm">
            <div className="w-12 h-12 rounded-md relative  px-1.5 py-1">
              <Image
                src={"/images/groups-default-cover-photo.png"}
                alt="logo"
                fill
                className="rounded-md aspect-square object-cover"
              />
            </div>
            <div className=" h-full flex items-start text-start align-top">
              <h1 className="align-top font-semibold text-sm">Group Name</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
