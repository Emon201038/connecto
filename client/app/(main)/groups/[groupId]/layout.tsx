import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, MoreHorizontal, Share } from "lucide-react";
import React from "react";
import Link from "./Link";
import CreatePostCard from "@/components/create-post-card";
import GroupIcon from "@/components/icons/Group";
import { store } from "@/redux/store";
import { groupApi } from "@/redux/features/group/groupApi";
import Image from "next/image";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) => {
  const { groupId } = await params;

  const res = await store.dispatch(
    groupApi.endpoints.group.initiate({ id: groupId })
  );

  const routes = [
    {
      label: "About",
      href: `/groups/${groupId}/about`,
      index: "about",
    },
    {
      label: "Discussion",
      href: `/groups/${groupId}`,
      index: "",
    },
    {
      label: "People",
      href: `/groups/${groupId}/members`,
      index: "members",
    },
  ];

  return (
    <div className="h-[calc(100vh_-_96px)] md:h-[calc(100vh_-_54px)] bg-background">
      <div className="flex h-full w-screen">
        {/* <div className="hidden md:block w-80 border-r border-sidebar-border h-full overflow-auto fixed top-24 md:top-14 left-0 z-10">
          <SidebarContent groupId={groupId} />
        </div> */}
        <div className="flex-col w-full ml-auto">
          <div className="relative w-full">
            <div className="h-36 lg:h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
              <Image
                src={
                  res.data?.data.coverPhoto?.url ||
                  "/images/groups-default-cover-photo.png"
                }
                alt="Group cover"
                className="w-full aspect-[16/9] object-cover"
                fill
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute bottom-4 right-4 hidden lg:flex"
              >
                <Camera className="w-4 h-4 mr-1" />
                Edit Cover
              </Button>
            </div>

            <div className="px-4 lg:px-6 py-4 bg-card border-b border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                      {res.data?.data.name}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <span className="capitalize">
                        {res.data?.data?.privacy.toLowerCase()}
                      </span>
                      group
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">
                        {res.data?.data?.memberCount} members
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-text"
                  >
                    <GroupIcon className="w-4 h-4" fill="currentColor" />
                    {res.data?.data?.joined ? "Joined" : "Join"} Group
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                  >
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Separator className="w-full h-px" />
              <div className="flex gap-2 items-center py-2 px-4">
                {routes.map((route) => (
                  <Link
                    index={route.index}
                    key={route.href}
                    href={route.href}
                    className=""
                  >
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 p-4 lg:p-6 max-w-2xl mx-auto">
            {res.data?.data?.joined && (
              <div className="mx-auto space-y-6">
                <CreatePostCard />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default layout;
