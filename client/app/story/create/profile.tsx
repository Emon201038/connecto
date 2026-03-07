"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMeQuery } from "@/redux/features/auth/authApi";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useSession } from "next-auth/react";
import React from "react";

const Profile = () => {
  const { data: session } = useMeQuery();
  return (
    <div className="flex gap-3 w-full items-center p-4 pt-2 pb-6">
      <Avatar className="size-15">
        <AvatarFallback>{session?.fullName?.charAt(0)}</AvatarFallback>
        <AvatarImage
          src={session?.profilePicture?.url || "/images/default-profile.jpeg"}
        />
      </Avatar>
      <h1 className="text-lg font-bold">{session?.fullName}</h1>
    </div>
  );
};

export default Profile;
