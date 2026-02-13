"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface UserInfoCellProps {
  name: string;
  email: string;
  photo?: string;
}

export function UserInfoCell({ name, email, photo }: UserInfoCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-10">
        <AvatarFallback className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-semibold">
          {name?.charAt(0).toUpperCase()}
        </AvatarFallback>
        <AvatarImage src={photo} alt="name" />
      </Avatar>
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );
}
