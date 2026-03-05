import React from "react";
import ChatArea from "./components/ChatArea";
import RightSideBar from "./components/RightSideBar";
import { auth } from "@/lib/auth";
import { IConversationMember } from "@/types";

const page = async ({ params }: { params: Promise<{ chatId: string }> }) => {
  const session = await auth();

  return (
    <div className="flex w-full h-full bg-shade md:space-x-4">
      {/* Main Chat Area */}

      <ChatArea session={session} />

      {/* Right Sidebar */}
      <RightSideBar />
    </div>
  );
};

export default page;
