import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { IUser } from "@/types";
import React from "react";
import { AcceptButton, DeclineButton } from "../(home)/@requests/Button";
import Image from "next/image";
import defaultImage from "@/public/images/default-profile.jpeg";

interface Props {
  friend: IUser;
  children?: React.ReactNode;
}

const FriendCard: React.FC<Props> = ({ friend, children }) => {
  return (
    <Card
      key={friend.id}
      className="p-0 px-2 md:px-0 w-full h-full border-none md:border shadow-none md:shadow-md"
    >
      <CardContent className="px-0">
        <div className="flex md:flex-col flex-row items-center md:items-start gap-0 w-full h-full !px-0 p-0">
          <Avatar className="size-24 block md:hidden">
            <AvatarImage
              src={
                friend?.profilePicture?.url || "/images/default-profile.jpeg"
              }
            />
            <AvatarFallback>
              {friend.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="w-full h-full relative hidden md:block">
            <Image
              width={200}
              height={200}
              placeholder="blur"
              src={friend?.profilePicture?.url || defaultImage}
              alt="online"
              className="w-full h-full object-cover rounded-t-md "
            />
          </div>
          <div className="flex-1 w-full p-4">
            <h1 className="font-bold text-lg">{friend.fullName}</h1>
            <p className="text-sm text-muted-foreground">{0} mutual friends</p>
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
