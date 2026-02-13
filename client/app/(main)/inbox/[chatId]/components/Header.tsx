import { Button } from "@/components/ui/button";
import { ArrowLeft, Info, Phone, Video } from "lucide-react";
import React from "react";
import BackButton from "./BackButton";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { ApolloError, gql } from '@apollo/client'
// import apolloServerClient from '@/lib/apolloClientServer'
// import { Conversation } from '../../type'
import { redirect } from "next/navigation";
import InfoButton from "./InfoButton";
import { IConversationMember } from "@/types";

// const GET_CONVERSATION_BY_ID = gql`
//   query Conversation($conversationId: ID!) {
//     conversation(id: $conversationId) {
//       id
//       participants {
//         id
//         fullName
//         firstName
//         profilePicture {
//           url
//           pub_id
//         }
//       }
//       logo {
//         url
//         pub_id
//       }
//     }
//   }
// `;

// const getConversationById = async (conversationId: string): Promise<{ conversation?: Conversation; error?: ApolloError }> => {
//   "use server";
//   try {
//     const client = await apolloServerClient()
//     const res = await client.query<{ conversation?: Conversation; error?: ApolloError }>({
//       query: GET_CONVERSATION_BY_ID,
//       variables: { conversationId }
//     });
//     if (res.error) throw res.error
//     return res.data
//   } catch (error) {
//     return error as { error: ApolloError }
//   }
// }

const Header = ({ conversation }: { conversation: IConversationMember }) => {
  // const user = await getSession();
  // if (!user?.id) redirect("/login?callback=/inbox/" + conversationId)

  // const conversationRes = await getConversationById(conversationId);
  // if (conversationRes.error && !conversationRes.conversation) return <div>Something went wrong while fetching the conversation</div>;

  // const conversation = conversationRes!.conversation

  return (
    <div className="px-4 py-3 border-b flex items-center justify-between h-[52px]">
      <div className="flex items-center gap-3">
        <BackButton toHref={"/inbox"} className="md:hidden">
          <ArrowLeft className="h-6 w-6" />
        </BackButton>
        <Avatar className="h-9 w-9 rounded-full">
          <AvatarImage
            className="rounded-full aspect-square"
            src={
              conversation.user?.profilePicture?.url ||
              "/images/default-profile.jpeg"
            }
          />
          <AvatarFallback>{conversation.nickname.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{conversation.nickname}</div>
          <div className="text-sm text-muted-foreground text-ellipsis whitespace-nowrap">
            Active now
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="w-5 h-5" />
        </Button>
        <InfoButton />
      </div>
    </div>
  );
};

export default Header;
