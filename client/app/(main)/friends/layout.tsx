import React from "react";
import NavLink from "./components/nav-item";
import { Button } from "@/components/ui/button";
import { Settings2Icon, SettingsIcon } from "lucide-react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-[360px] md:block hidden h-full min-h-screen shadow">
        <div className="px-4 pt-4 pb-1 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Friends</h1>
          <Button variant={"ghost"} size={"icon"} className="rounded-full">
            <SettingsIcon />
          </Button>
        </div>
        <NavLink />
      </div>
      {children}
    </div>
  );
};

export default layout;
