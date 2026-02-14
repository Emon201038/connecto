import { baseApi } from "@/redux/baseApi";
import { IConversation, IConversationMember, IResponse } from "@/types";
import { userApi } from "../user/userApi";
import { IMeta } from "@/lib/type";

export const conversationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<
      { conversations: IConversation[] },
      { page: number; limit: number; search: string }
    >({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: "/",
        method: "POST",
        body: {
          query: `query GetConversations($page: Int, $limit: Int, $search: String) {
            myConversations(page: $page, limit: $limit, search: $search) {
              conversations {
                id
                avatar
                title
                unreadCount
                lastMessage {
                  content
                  type
                  createdAt
                  sender {
                    id
                  }
                }
                members {
                  user {
                    fullName
                  }
                  emoji
                  role
                  theme
                }
              }
              meta {
                totalResult
                page
                limit
              }
            }
          }`,
          variables: {
            page,
            limit,
            search,
          },
        },
      }),
      transformResponse: (response: {
        data: {
          myConversations: { conversations: IConversation[]; meta: IMeta };
        };
      }) => ({
        conversations: response.data.myConversations.conversations,
        meta: response.data.myConversations.meta,
      }),
    }),
    getConversationInfo: builder.query<IConversationMember, { id: string }>({
      query: (args) => ({
        url: "/",
        method: "POST",
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
            conversationId: args.id,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        data: { conversationInfo: IConversationMember };
      }) => response.data.conversationInfo,
    }),
    createDirectConversation: builder.mutation<
      { conversation: IConversation },
      { participantId: string; inputValue: string }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `mutation CreateDirectConversation($participantId: ID!) {
            createDirectConversation(participantId: $participantId) {
              id
            }
          }`,
          variables: {
            participantId: credentials.participantId,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        data: { createDirectConversation: IConversation };
      }) => ({ conversation: response.data.createDirectConversation }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          const res = await queryFulfilled;
          dispatch(
            userApi.util.updateQueryData(
              "getUsers",
              {
                search: args.inputValue,
                additionalFields: `conversation { 
                  id
                  hasConversation
                  lastMessage {
                    content
                    sender {
                      _id
                    }
                  }
                }`,
              },
              (draft) => {
                const userIndex = draft.data.users.findIndex(
                  (u) => u.id === args.participantId
                );
                if (userIndex === -1) return;
                draft.data.users[userIndex].conversation.id =
                  res.data.conversation?.id;
                draft.data.users[userIndex].conversation.hasConversation = true;
              }
            )
          );
        } catch (error) {}
      },
    }),
    updateEmoji: builder.mutation<IConversation, { id: string; emoji: string }>(
      {
        query: (credentials) => ({
          url: "/",
          method: "POST",
          body: {
            query: `mutation UpdateEmoji($id: ID!, $emoji: String!) {
              updateEmoji(id: $id, emoji: $emoji) {
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
              id: credentials.id,
              emoji: credentials.emoji,
            },
          },
          headers: {
            "Content-Type": "application/json",
          },
        }),
        onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
          const patch = dispatch(
            conversationApi.util.updateQueryData(
              "getConversationInfo",
              { id: args.id },
              (draft) => {
                draft.emoji = args.emoji;
              }
            )
          );
          try {
            await queryFulfilled;
          } catch (error) {
            patch.undo();
            console.log(error);
          }
        },
      }
    ),
  }),
});

export const {
  useGetConversationsQuery,
  useCreateDirectConversationMutation,
  useUpdateEmojiMutation,
  useGetConversationInfoQuery,
} = conversationApi;
