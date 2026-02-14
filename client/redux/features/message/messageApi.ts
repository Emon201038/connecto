import { IMeta } from "@/lib/type";
import { baseApi } from "@/redux/baseApi";
import { IMessage, IMessageType } from "@/types";
import { conversationApi } from "../conversation/conversationApi";

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query<
      { messages: IMessage[]; meta: IMeta },
      { conversationId: string; page: number; limit: number; search: string }
    >({
      query: (args) => ({
        url: "/",
        method: "POST",
        body: {
          query: `query GetMessages($conversationId: ID!, $page: Int, $limit: Int, $search: String) {
        messages(conversationId: $conversationId, page: $page, limit: $limit, search: $search) {
          messages {
            id
            type
            sender {
              id
              fullName
              profilePicture {
                url
              }
            }
            content
            createdAt
          }
          meta {
            totalResult
            totalPage
            page
            limit
          }
        }
      }`,
          variables: {
            conversationId: args.conversationId,
            page: args.page,
            limit: args.limit,
            search: args.search,
          },
        },
      }),
      transformResponse: (response: {
        data: { messages: { messages: IMessage[]; meta: IMeta } };
      }) => response.data.messages,

      // ---- Infinite scroll setup ----
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.conversationId}`,

      merge: (currentCache, newCache, { arg }) => {
        if (!currentCache) return newCache;

        if (arg.page === 1) {
          currentCache.messages = newCache.messages;
        } else {
          // Merge and remove duplicates based on message.id
          const allMessages = [
            ...(currentCache.messages || []),
            ...newCache.messages,
          ];

          const uniqueMessages = Array.from(
            new Map(allMessages.map((m) => [m.id, m])).values()
          );

          currentCache.messages = uniqueMessages;
        }

        currentCache.meta = newCache.meta;
      },

      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.conversationId !== previousArg?.conversationId ||
          currentArg?.search !== previousArg?.search
        );
      },
    }),

    sendMessage: builder.mutation<
      IMessage,
      {
        conversationId: string;
        content: string;
        type: IMessageType;
        replyTo?: string;
        sender: string;
        createdAt: string;
        id: string;
      }
    >({
      query: (args) => ({
        url: "/",
        method: "POST",
        body: {
          query: `mutation SendMessage($content: String!, $conversationId: ID!, $type: MessageType!, $replyTo: ID) {
            sendMessage(content: $content, conversationId: $conversationId, type: $type, replyTo: $replyTo) {
              type
              id
              content
              sender {
                fullName
                id
                profilePicture {
                  url
                }
              }
            }
          }`,
          variables: {
            content: args.content,
            conversationId: args.conversationId,
            type: args.type,
            replyTo: args.replyTo,
          },
        },
      }),
      transformResponse: (response: { data: { sendMessage: IMessage } }) =>
        response.data.sendMessage,
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        const patch1 = dispatch(
          messageApi.util.updateQueryData(
            "getMessages",
            {
              conversationId: args.conversationId,
              page: 1,
              limit: 20,
              search: "",
            },
            (draft) => {
              draft.messages.unshift({
                ...args,
                sender: { id: args.sender },
              } as unknown as IMessage);
            }
          )
        );

        const patch2 = dispatch(
          conversationApi.util.updateQueryData(
            "getConversations",
            { page: 1, limit: 10, search: "" },
            (draft) => {
              const conversation = draft.conversations.find(
                (c) => c.id === args.conversationId
              );
              if (conversation) {
                conversation.lastMessage = {
                  ...args,
                  sender: { id: args.sender },
                } as unknown as IMessage;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          console.log(error);
          patch1.undo();
          patch2.undo();
        }
      },
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = messageApi;
