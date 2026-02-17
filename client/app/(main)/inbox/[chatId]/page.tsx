import React from "react";
import ChatArea from "./components/ChatArea";
import RightSideBar from "./components/RightSideBar";
import { auth } from "@/auth";
import { IConversationMember } from "@/types";

const page = async ({ params }: { params: Promise<{ chatId: string }> }) => {
  const session = await auth();
  const { chatId } = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${session?.accessToken}`,
    },
    body: JSON.stringify({
      query: `query($conversationId: ID!) {
        conversationInfo(id: $conversationId) {
          emoji
          theme
          nickname
          id
          isMuted
          user {
            id
            username
            profilePicture {
              url
            }
          }
        }
      }`,
      variables: {
        conversationId: chatId,
      },
    }),
  });

  const data: { data: { conversationInfo: IConversationMember } } =
    await res.json();

  return (
    <div className="flex w-full h-full bg-shade md:space-x-4">
      {/* Main Chat Area */}

      <ChatArea />

      {/* Right Sidebar */}
      <RightSideBar />
    </div>
  );
};

export default page;
