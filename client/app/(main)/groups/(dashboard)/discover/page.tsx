"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useGroupsQuery } from "@/redux/features/group/groupApi";
import Image from "next/image";
import React from "react";
import defaultImage from "@/../public/images/groups-default-cover-photo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import JoinButton from "./JoinButton";
import { Skeleton } from "@/components/ui/skeleton";

const DiscoverPage = () => {
  const { data: res, isLoading } = useGroupsQuery({
    limit: 12,
    page: 1,
    search: "",
  });

  return (
    <div className="w-full mx-auto md:p-16 p-4">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full mx-auto mt-12 md:mt-0">
        {isLoading &&
          // <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full mx-auto">
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-0 shadow-md w-full">
              <CardContent className="px-0">
                <div className="flex flex-col items-center w-full gap-0 !px-0 p-0">
                  <div className="relative w-full">
                    <Skeleton className="w-full min-h-[110px] object-cover rounded-t-md aspect-video" />
                  </div>
                  <div className="flex-1 w-full p-4 space-y-1">
                    <Skeleton className="font-bold text-lg h-5" />
                    <Skeleton className="font-bold text-lg h-3" />
                  </div>
                  <div className="w-full px-4 pb-4">
                    <Skeleton className="w-full h-7 " />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

        {res?.data?.groups &&
          res?.data?.groups?.length > 0 &&
          res.data.groups.map((group) => (
            <Card key={group.id} className="p-0 w-full h-full shadow-md">
              <CardContent className="px-0">
                <div className="flex flex-col items-center  gap-0 w-full h-full !px-0 p-0">
                  <div className="w-full h-full relative">
                    <Image
                      width={200}
                      height={200}
                      placeholder="blur"
                      src={group?.coverPhoto?.url || defaultImage}
                      alt="online"
                      className="w-full h-full object-cover rounded-t-md aspect-video"
                    />
                  </div>
                  <div className="flex-1 w-full p-4">
                    <Link href={`/groups/${group.id}`}>
                      <h1 className="font-bold text-lg">{group.name}</h1>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {group.memberCount} Members
                    </p>
                  </div>
                  <div className="px-4 w-full pb-4">
                    {group.joined ? (
                      <Button
                        className="bg-[#ebf5ff] text-primary w-full hover:bg-muted hover:text-primary"
                        asChild
                      >
                        <Link href={`/groups/${group.id}`}>Visit</Link>
                      </Button>
                    ) : (
                      <JoinButton groupId={group.id} />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default DiscoverPage;
