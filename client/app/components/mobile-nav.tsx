import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Settings } from "lucide-react";

import React from "react";

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu size={18} />
      </SheetTrigger>
      <SheetContent side="left" className="px-1">
        <SheetHeader>
          <SheetTitle className="sr-only">Chat Menu</SheetTitle>
          <SheetDescription className="sr-only text-sm text-muted-foreground">
            Select an option to continue
          </SheetDescription>
        </SheetHeader>

        <div className="pt-4 ">
          <div className="flex justify-between items-center px-2 py-1 hover:bg-slate-200/60 rounded-md mb-3">
            <div className="flex justify-start items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback>E</AvatarFallback>
              </Avatar>
              <h1>Emdadul Hoque Emon</h1>
            </div>
            <div>
              <Settings />
            </div>
          </div>
          <div className="flex justify-start items-center gap-2 px-2 py-1 hover:bg-slate-200/60 rounded-md space-y-2">
            <Avatar className="size-8">
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <h1>Chats</h1>
          </div>
          <div className="flex justify-start items-center gap-2 px-2 py-1 hover:bg-slate-200/60 rounded-md space-y-2">
            <Avatar className="size-8">
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <h1>Marketplace</h1>
          </div>
          <div className="flex justify-start items-center gap-2 px-2 py-1 hover:bg-slate-200/60 rounded-md space-y-2">
            <Avatar className="size-8">
              <AvatarFallback>E</AvatarFallback>
            </Avatar>
            <h1>Message Requests </h1>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
