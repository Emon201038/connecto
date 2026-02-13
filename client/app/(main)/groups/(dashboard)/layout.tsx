import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export const metadata = {
  title: "Groups | Connecto",
};

const GroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background flex mt-24 md:mt-12 h-[calc(100vh_-_96px)] md:h-[calc(100vh_-_56px)]">
      <Sidebar />
      <Topbar />
      <div className="md:ml-[360px] h-full w-full bg-muted">{children}</div>
    </div>
  );
};

export default GroupLayout;
