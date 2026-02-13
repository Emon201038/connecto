import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { friendApi } from "@/redux/features/friend/friendApi";
import { userApi } from "@/redux/features/user/userApi";
import { store } from "@/redux/store";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const res = await store.dispatch(
    friendApi.endpoints.myFriends.initiate({ cookie: undefined })
  );

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Friends</h3>
        <Link href="#" className="text-sm text-blue-600 hover:underline">
          See all
        </Link>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{0} friends</p>
      <div className="grid grid-cols-3 gap-1">
        {res?.data?.data?.myFriends?.map(({ user: friend }, index) => (
          <div key={index} className="flex flex-col">
            <div className="aspect-square bg-gray-200 rounded-md overflow-hidden">
              <Image
                src={
                  friend?.profilePicture?.url
                    ? friend?.profilePicture?.url
                    : "/images/default-profile.jpeg"
                }
                alt={`Friend ${index}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs mt-1 truncate">{friend?.fullName}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default page;
