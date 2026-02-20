import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LeftSidebar from "./components/left-sidebar";

export const metadata = {
  title: "Messenger | Connecto",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen overflow-hidden h-[calc(100vh_-_96px)] md:h-[calc(100vh_-_54px)]">
      <div className="hidden md:flex bg-background">
        {/* Left Sidebar */}
        <LeftSidebar />
      </div>
      {children}
    </div>
  );
};

export default layout;
