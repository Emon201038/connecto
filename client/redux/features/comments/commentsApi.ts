import { IComment } from "@/interface/comment.interfce";
import { IMeta } from "@/lib/type";
import { baseApi } from "@/redux/baseApi";
import { IEntity } from "@/interface/post.interface";
import { postApi } from "../post/postApi";

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<
      { comments: IComment[]; meta: IMeta },
      { postId: string; limit?: number; cursor?: string }
    >({
      query: ({ postId, cursor, limit }) => ({
        url: `/api/v2/comments`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        params: {
          postId,
          ...(cursor && { cursor }),
          ...(limit && { limit }),
        },
      }),
      // transform response data
      transformResponse: (response: { data: IComment[]; meta: IMeta }) => ({
        comments: response.data,
        meta: response.meta,
      }),
      // provide a stable cache key
      serializeQueryArgs: ({ queryArgs }) => {
        return { post: queryArgs.postId }; // only postId matters
      },
      // merge new pages into same cache
      merge: (currentCache, newCache, { arg }) => {
        if (!arg.cursor) {
          // replace first page
          currentCache.comments = newCache.comments;
          currentCache.meta = newCache.meta;
        } else {
          // append new comments (infinite scroll style)
          currentCache.comments.push(...newCache.comments);
          currentCache.meta = newCache.meta;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.postId !== previousArg?.postId;
      },
    }),
    addComment: builder.mutation<
      IComment,
      {
        postId: string;
        text: string;
        entities?: IEntity[];
        parent?: string | null;
      }
    >({
      query: (data) => ({
        url: `/api/v2/comments`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: data,
      }),
      transformResponse: (response: { data: IComment }) => response.data,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data: newComment } = await queryFulfilled;

          dispatch(
            commentsApi.util.updateQueryData(
              "getComments",
              { postId: arg.postId }, // must match endpoint args
              (draft) => {
                draft.comments.unshift(newComment);
              },
            ),
          );

          dispatch(
            postApi.util.updateQueryData("getAllPosts", {}, (draft) => {
              const post = draft.posts.find((p) => p.id === arg.postId);
              if (!post) return;
              post._count.comments += 1;
            }),
          );
        } catch (err) {
          console.error("cache update failed", err);
        }
      },
    }),
  }),
});

export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi;
