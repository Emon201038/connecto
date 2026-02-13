import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ConversationList from "./components/conversations-list";

const page = () => {
  // const session = await auth();
  // if (!session?.user?.id) {
  //   redirect("/login?callback=/inbox");
  // }

  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `${session?.accessToken}`,
  //   },
  //   body: JSON.stringify({
  //     query: `
  //         query{
  //           myConversations {
  //             conversations {
  //               id
  //               avatar
  //               title
  //               members {
  //                 user {
  //                   fullName
  //                 }
  //                 emoji
  //                 role
  //                 theme
  //               }
  //             }
  //           }
  //         }
  //       `,
  //     context: {
  //       headers: {
  //         Authorization: `${session?.accessToken}`,
  //       },
  //     },
  //   }),
  // });

  // const data = await res.json();
  return (
    <div className="w-full overflow-hidden">
      <div className="hidden md:flex h-full w-full text-2xl font-bold justify-center items-center">
        Select a conversation to open a conversation
      </div>
      <div className="bg-shade p-4 h-full md:hidden">
        <ConversationList />
      </div>
    </div>
  );
};

export default page;
