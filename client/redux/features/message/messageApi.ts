import { IMeta } from "@/lib/type";
import { baseApi } from "@/redux/baseApi";
import { IMessage, IMessageType, IResponse, IUser } from "@/types";
import { conversationApi } from "../conversation/conversationApi";
import {
  IReaction,
  ReactionTargetType,
  ReactionType,
} from "@/interface/reaction.interface";

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
            reactions {
              id
              user {
                id
                fullName
                profilePicture {
                  url
                }
              }
              type
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
      providesTags: ["GET_MESSAGES"],
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
            new Map(allMessages.map((m) => [m.id, m])).values(),
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
            },
          ),
        );

        const patch2 = dispatch(
          conversationApi.util.updateQueryData(
            "getConversations",
            { page: 1, limit: 10, search: "" },
            (draft) => {
              const conversation = draft.conversations.find(
                (c) => c.id === args.conversationId,
              );
              if (conversation) {
                conversation.lastMessage = {
                  ...args,
                  sender: { id: args.sender },
                } as unknown as IMessage;
              }
            },
          ),
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

    toggleMessageReaction: builder.mutation<
      IResponse<IReaction>,
      {
        conversationId: string;
        target: string;
        type: string;
        user: {
          id: string;
          fullName: string;
          profilePicture?: {
            url: string;
            pub_id: string;
          };
        };
      }
    >({
      query: (data) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query: `
            mutation ToggleReaction($type: ReactionType, $targetType: ReactionTargetType!, $target: ID!) {
              toggleReaction(type: $type, targetType: $targetType, target: $target) {
                id
                type
                user {
                  id
                  fullName
                  profilePicture {
                    url
                    pub_id
                  }
                }
              }
            }
          `,
          variables: {
            type: data.type,
            targetType: "Message",
            target: data.target,
          },
        }),
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch, getState }) => {
        const state = getState() as any;
        console.log("cache keys:", Object.keys(state.api.queries));
        console.log("looking for key:", `getMessages-${arg.conversationId}`);
        console.log("arg.conversationId:", arg.conversationId);
        console.log("arg:", JSON.stringify(arg));
        const patchResult = dispatch(
          messageApi.util.updateQueryData(
            "getMessages",
            // ✅ same pattern as sendMessage - full args object
            {
              conversationId: arg.conversationId,
              page: 1,
              limit: 20,
              search: "",
            },
            (draft) => {
              console.log("draft messages count:", draft?.messages?.length);
              console.log("looking for message id:", arg.target);

              const message = draft.messages.find((m) => m.id === arg.target);
              console.log("found message:", message);
              if (!message) return;

              const myReaction = message.reactions.find(
                (r) => r.user.id === arg.user.id,
              );

              if (myReaction) {
                if (myReaction.type === arg.type) {
                  message.reactions = message.reactions.filter(
                    (r) => r.user.id !== arg.user.id,
                  );
                } else {
                  myReaction.type = arg.type as ReactionType;
                }
              } else {
                message.reactions.push({
                  id: Date.now().toString(),
                  type: arg.type as ReactionType,
                  user: arg.user as IUser,
                  target: arg.target,
                  targetType: ReactionTargetType.MESSAGE,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                });
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useToggleMessageReactionMutation,
} = messageApi;
