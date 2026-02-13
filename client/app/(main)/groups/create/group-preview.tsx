"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { GalleryThumbnails, ImageIcon, Smile, Tag } from "lucide-react";
import Image from "next/image";
import React from "react";

const GroupPreview = ({ name, privacy }: { name: string; privacy: string }) => {
  const [previewMode, setPreviewMode] = React.useState<"mobile" | "desktop">(
    "desktop"
  );
  return (
    <div className="px-24 py-8 w-full h-full overflow-auto flex-1">
      <div
        className={cn(
          "h-full mx-auto  bg-normal shadow-lg rounded-md p-4 overflow-hidden border",
          previewMode === "desktop" ? "w-full" : "w-[554px]"
        )}
      >
        <div className="w-full flex justify-between items-center gap-4 mb-3">
          <p className="first-letter:capitalize">{previewMode} preview</p>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={previewMode === "desktop" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setPreviewMode("desktop")}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect
                  x="2"
                  y="4"
                  width="20"
                  height="16"
                  rx="2"
                  strokeWidth="2"
                />
                <path d="M8 20h8" strokeWidth="2" />
              </svg>
              Desktop
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "ghost"}
              size="sm"
              className="h-8 px-3 text-xs"
              onClick={() => setPreviewMode("mobile")}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect
                  x="5"
                  y="2"
                  width="14"
                  height="20"
                  rx="2"
                  strokeWidth="2"
                />
                <path d="M12 18h.01" strokeWidth="2" />
              </svg>
              Mobile
            </Button>
          </div>
        </div>
        <div className="w-full border rounded-md h-[calc(100%-50px)] overflow-auto">
          <div
            className={cn(
              "",
              previewMode === "desktop" ? "w-full" : "w-[554px]"
            )}
          >
            <Avatar className="h-auto max-h-[282px] aspect-video rounded-sm w-full grayscale-100 object-cover">
              <AvatarImage src={"/images/groups-default-cover-photo.png"} />
            </Avatar>
          </div>
          <div className="mt-6 px-4">
            <h1 className="text-xl font-extrabold">
              {name.trim().length > 0 ? name : "Group Name"}
            </h1>
            <div className="flex gap-2 items-center">
              <p>
                {privacy ? (
                  <span className="text-muted-foreground first-letter:uppercase capitalize">
                    {" "}
                    {privacy.toLowerCase()}
                    {" Group"}
                  </span>
                ) : (
                  "Group Privacy"
                )}
              </p>
              <p>·</p>
              <p>1 member</p>
            </div>
          </div>
          <div className="px-4">
            <Separator className=" w-full mt-12 shadow-md" />
          </div>
          <nav className="flex items-center py-2 *:px-6 *:py-2">
            <div>About</div>
            <div>Posts</div>
            <div>Members</div>
            <div>Events</div>
          </nav>
          <Separator />
          <div className="bg-shade p-6">
            <div className="bg-normal rounded-md p-4 ">
              <p className="opacity-50">About</p>
            </div>

            <div className="mt-6 bg-normal rounded-md p-4">
              <div className="flex justify-center items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/images/default-profile.jpeg" />
                </Avatar>
                <div className="flex-1  bg-shade rounded-full h-10 px-4 py-2 ">
                  <p className="opacity-50">What is on your mind</p>
                </div>
              </div>
              <div className="ml-14 mt-6  grid grid-cols-3">
                <div className="flex gap-2 opacity-35">
                  <ImageIcon />
                  <p>Photos/Videos</p>
                </div>
                <div className="flex gap-2 opacity-35">
                  <Tag />
                  <p>Tag People</p>
                </div>
                <div className="flex gap-2 opacity-35">
                  <Smile />
                  <p>Feelings/activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupPreview;
