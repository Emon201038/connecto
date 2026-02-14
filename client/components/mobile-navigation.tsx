"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, MessageSquare, ShoppingBag, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import LeftSidebar from "./left-sidebar"

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <div className="flex justify-around items-center h-16 px-4 border-t">
      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center space-y-1 h-full"
        asChild
      >
        <Link href="/">
          <Home
            className={`h-6 w-6 ${pathname === "/" ? "text-blue-600" : ""}`}
          />
          <span className="text-xs">Home</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center space-y-1 h-full"
        asChild
      >
        <Link href="/friends">
          <Users
            className={`h-6 w-6 ${
              pathname.startsWith("/friends") ? "text-blue-600" : ""
            }`}
          />
          <span className="text-xs">Friends</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center space-y-1 h-full relative"
        asChild
      >
        <Link href="/messages">
          <MessageSquare className="h-6 w-6" />
          <span className="absolute top-2 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
            5
          </span>
          <span className="text-xs">Chats</span>
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center space-y-1 h-full"
        asChild
      >
        <Link href="/marketplace">
          <ShoppingBag
            className={`h-6 w-6 ${
              pathname.startsWith("/marketplace") ? "text-blue-600" : ""
            }`}
          />
          <span className="text-xs">Market</span>
        </Link>
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="flex flex-col items-center justify-center space-y-1 h-full"
          >
            <Menu className="h-6 w-6" />
            <span className="text-xs">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-0">
          <div className="h-full overflow-y-auto">{/* <LeftSidebar /> */}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
