import { IReaction, ReactionType } from "@/interface/reaction.interface";
import { baseApi } from "@/redux/baseApi";
import { IResponse } from "@/types";
import { postApi } from "../post/postApi";
import { ta } from "date-fns/locale";
import { commentsApi } from "../comments/commentsApi";

export const reactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    togglePostReaction: builder.mutation<
      IResponse<IReaction>,
      Record<string, string>
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
          variables: data,
        }),
      }),
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        // optimistic cache update start
        const patchResult = dispatch(
          postApi.util.updateQueryData(
            "getPosts",
            { page: 1, limit: 15 },
            (draft) => {
              const postIndex = draft.data.posts.findIndex(
                (p) => p.id === arg.target,
              );
              if (postIndex === -1) return;

              const targetedPost = draft.data.posts[postIndex];
              const myReaction = targetedPost?.myReaction?.type;
              const reactionIndex = targetedPost.reactionSummary.findIndex(
                (r) => r.reactionType === arg.type,
              );

              if (myReaction) {
                if (myReaction === arg.type) {
                  // remove my reaction
                  targetedPost.myReaction = null;
                  targetedPost.reactionCount -= 1;

                  // decrement summary count
                  const existing = targetedPost.reactionSummary.find(
                    (r) => r.reactionType === myReaction,
                  );
                  if (existing) existing.count -= 1;
                } else {
                  // change my reaction
                  targetedPost!.myReaction!.type = arg.type as ReactionType;

                  // decrement old one
                  const old = targetedPost.reactionSummary.find(
                    (r) => r.reactionType === myReaction,
                  );
                  if (old) old.count -= 1;

                  // increment or add new one
                  if (reactionIndex !== -1) {
                    targetedPost.reactionSummary[reactionIndex].count += 1;
                  } else {
                    targetedPost.reactionSummary.push({
                      count: 1,
                      reactionType: arg.type as ReactionType,
                    });
                  }
                }
              } else {
                // first time reacting
                targetedPost.myReaction = {
                  type: arg.type as ReactionType,
                };
                targetedPost.reactionCount += 1;

                if (reactionIndex !== -1) {
                  targetedPost.reactionSummary[reactionIndex].count += 1;
                } else {
                  targetedPost.reactionSummary.push({
                    count: 1,
                    reactionType: arg.type as ReactionType,
                  });
                }
              }
            },
          ),
        );
        // optimistic cache update end

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log(error);
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
      onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
        // optimistic cache update start
        const patchResult = dispatch(
          commentsApi.util.updateQueryData(
            "getComments",
            { post: arg.post },
            (draft) => {
              const commentIndex = draft.data.comments.findIndex(
                (p) => p.id === arg.target,
              );
              if (commentIndex === -1) return;

              const targetedComment = draft.data.comments[commentIndex];
              const myReaction = targetedComment?.myReaction?.type;
              const reactionIndex = targetedComment.reactionSummary.findIndex(
                (r) => r.reactionType === arg.type,
              );

              if (myReaction) {
                if (myReaction === arg.type) {
                  // remove my reaction
                  targetedComment.myReaction = null;
                  targetedComment.reactionCount -= 1;

                  // decrement summary count
                  const existing = targetedComment.reactionSummary.find(
                    (r) => r.reactionType === myReaction,
                  );
                  if (existing) existing.count -= 1;
                } else {
                  // change my reaction
                  targetedComment!.myReaction!.type = arg.type as ReactionType;

                  // decrement old one
                  const old = targetedComment.reactionSummary.find(
                    (r) => r.reactionType === myReaction,
                  );
                  if (old) old.count -= 1;

                  // increment or add new one
                  if (reactionIndex !== -1) {
                    targetedComment.reactionSummary[reactionIndex].count += 1;
                  } else {
                    targetedComment.reactionSummary.push({
                      count: 1,
                      reactionType: arg.type as ReactionType,
                    });
                  }
                }
              } else {
                // first time reacting
                targetedComment.myReaction = {
                  type: arg.type as ReactionType,
                };
                targetedComment.reactionCount += 1;

                if (reactionIndex !== -1) {
                  targetedComment.reactionSummary[reactionIndex].count += 1;
                } else {
                  targetedComment.reactionSummary.push({
                    count: 1,
                    reactionType: arg.type as ReactionType,
                  });
                }
              }
            },
          ),
        );
        // optimistic cache update end

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.log(error);
        }
      },
    }),
    toggleMessageReaction: builder.mutation<
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
      IResponse<IReaction[]>,
      { target: string; type?: ReactionType }
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
            query GetReactions($type: ReactionType, $target: ID!) {
              getReactions(type: $type, target: $target) {
                id
                type
                user {
                  id
                  fullName
                  username
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
      transformResponse: (
        response: IResponse<{ getReactions: IReaction[] }>,
      ) => ({
        data: response.data.getReactions,
        errors: response.errors,
      }),
    }),
  }),
});

export const {
  useTogglePostReactionMutation,
  useToggleCommentReactionMutation,
  useToggleMessageReactionMutation,
  useGetReactionsQuery,
} = reactionApi;
