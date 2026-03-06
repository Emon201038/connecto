import {
  IReaction,
  ReactionTargetType,
  ReactionType,
} from "@/interface/reaction.interface";
import { baseApi } from "@/redux/baseApi";
import { IResponse } from "@/types";
import { postApi } from "../post/postApi";
import { commentsApi } from "../comments/commentsApi";
import { messageApi } from "../message/messageApi";

const applyReactionUpdate = (
  item: any,
  arg: {
    type: ReactionType;
    targetId: string;
    postId?: string;
  },
) => {
  const currentReaction = item.myReaction?.type;

  const findIndex = (type: ReactionType) =>
    item.reactionSummary.findIndex((r: any) => r.type === type);

  const increase = (type: ReactionType) => {
    const index = findIndex(type);

    if (index === -1) {
      item.reactionSummary.push({
        type,
        count: 1,
      });
    } else {
      item.reactionSummary[index].count += 1;
    }
  };

  const decrease = (type: ReactionType) => {
    const index = findIndex(type);
    if (index === -1) return; // safety guard

    item.reactionSummary[index].count -= 1;

    if (item.reactionSummary[index].count <= 0) {
      item.reactionSummary.splice(index, 1);
    }
  };

  // Case 1: No previous reaction
  if (!currentReaction) {
    item.myReaction = arg;
    item._count.reactions += 1;
    increase(arg.type);
    return;
  }

  // Case 2: Same reaction → remove
  if (currentReaction === arg.type) {
    decrease(currentReaction);
    item.myReaction = null;
    item._count.reactions -= 1;
    return;
  }

  // Case 3: Switch reaction
  decrease(currentReaction);
  increase(arg.type);
  item.myReaction = arg;
};

export const reactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    togglePostReaction: builder.mutation<
      IReaction | { added: false },
      {
        type: ReactionType;
        reactionFor: ReactionTargetType;
        targetId: string;
        postId?: string;
      }
    >({
      query: (data) => ({
        url: "/api/v2/reactions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["REACTIONS"],
      transformResponse: (response: { data: IReaction | { added: false } }) =>
        response.data,
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        let patchResult;

        switch (arg.reactionFor) {
          case "POST": {
            patchResult = dispatch(
              postApi.util.updateQueryData("getAllPosts", {}, (draft) => {
                const post = draft.posts.find((p) => p.id === arg.targetId);
                if (!post) return;

                applyReactionUpdate(post, arg);
              }),
            );
            break;
          }

          case "COMMENT": {
            patchResult = dispatch(
              commentsApi.util.updateQueryData(
                "getComments",
                { postId: arg.postId! },
                (draft) => {
                  const comment = draft.comments.find(
                    (c) => c.id === arg.targetId,
                  );
                  if (!comment) return;

                  applyReactionUpdate(comment, arg);
                },
              ),
            );
            break;
          }

          case "MESSAGE": {
            patchResult = dispatch(
              messageApi.util.updateQueryData(
                "getMessages",
                {
                  conversationId: arg.targetId,
                  page: 1,
                  limit: 20,
                  search: "",
                },
                (draft) => {
                  const message = draft.messages.find(
                    (m) => m.id === arg.targetId,
                  );
                  if (!message) return;

                  applyReactionUpdate(message, arg);
                },
              ),
            );
            break;
          }
        }

        try {
          await queryFulfilled;
        } catch {
          patchResult?.undo();
        }
      },
    }),
    toggleCommentReaction: builder.mutation<
      IResponse<IReaction>,
      Record<string, string>
    >({
      query: ({ post, ...data }) => ({
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
          variables: data,
        }),
      }),
    }),

    getReactions: builder.query<
      IReaction[],
      {
        target: string;
        targetType?: ReactionTargetType;
        type?: ReactionType | null;
      }
    >({
      query: (data) => ({
        url: `/api/v2/reactions/${data.target}/${data.targetType?.toLowerCase()}?type=${data.type ?? ""}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      providesTags: ["REACTIONS"],
      transformResponse: (response: { data: IReaction[] }) => response.data,
    }),
  }),
});

export const {
  useTogglePostReactionMutation,
  useToggleCommentReactionMutation,
  useGetReactionsQuery,
} = reactionApi;
