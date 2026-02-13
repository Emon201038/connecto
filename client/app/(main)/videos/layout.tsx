import { VideoSidebar } from "@/components/video-sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex mt-24 md:mt-12">
      {/* Left Sidebar - hidden on mobile */}
      <div className="hidden md:block w-[360px] fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <VideoSidebar />
      </div>
      <div className="w-full md:w-[100%_-_360px] md:ml-[360px] md:px-20 mx-auto relative right-0 ">
        {children}
      </div>
    </div>
  );
};

export default layout;
