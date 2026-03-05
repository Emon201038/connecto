import { VideoSidebar } from "@/components/modules/video/video-sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex mt-24 md:mt-12">
      {/* Left Sidebar - hidden on mobile */}
      <div className="hidden md:block w-90 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <VideoSidebar />
      </div>
      <div className="w-full md:w-[100%-360px] md:ml-90 md:px-20 mx-auto relative right-0 ">
        {children}
      </div>
    </div>
  );
};

export default layout;
