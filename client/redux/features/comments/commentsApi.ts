import { IComment } from "@/interface/comment.interfce";
import { IMeta } from "@/lib/type";
import { baseApi } from "@/redux/baseApi";
import { IResponse } from "@/types";
import { postApi } from "../post/postApi";

export const commentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<
      IResponse<{ comments: IComment[]; meta: IMeta }>,
      { post: string; page?: number; limit?: number }
    >({
      query: ({ post, page = 1, limit = 15 }) => ({
        url: `/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query: `
            query($post: ID!,$page: Int,$limit: Int) {
              comments(post: $post, page: $page, limit: $limit) {
                comments {
                  id
                  parent {
                    id
                  }
                  post {
                    id
                  }
                  text
                  replyCount
                  reactionCount
                  createdAt
                  updatedAt
                  reactionSummary {
                    count
                    reactionType
                  }
                  myReaction {
                    type
                  }
                  entities {
                    offset
                    end
                    type
                    target {
                      ...on User {
                        id
                        fullName
                      }
                      ...on Hashtag{
                        id
                        tag
                      }
                    }
                  }
                  author {
                    fullName
                    username
                    id
                    profilePicture {
                      pub_id
                      url
                    }
                  }
                }
                meta {
                  page
                  totalPage
                  totalResult
                }
              }
            }`,
          variables: { post, page, limit },
        }),
      }),
      // transform response data
      transformResponse: (
        response: IResponse<{ comments: { comments: IComment[]; meta: IMeta } }>
      ) => ({
        data: {
          comments: response.data.comments.comments,
          meta: response.data.comments.meta,
        },
        errors: response.errors,
      }),
      // provide a stable cache key
      serializeQueryArgs: ({ queryArgs }) => {
        return { post: queryArgs.post }; // only postId matters
      },
      // merge new pages into same cache
      merge: (currentCache, newCache, { arg }) => {
        if (arg.page === 1) {
          // replace first page
          currentCache.data.comments = newCache.data.comments;
          currentCache.data.meta = newCache.data.meta;
        } else {
          // append new comments (infinite scroll style)
          currentCache.data.comments.push(...newCache.data.comments);
          currentCache.data.meta = newCache.data.meta;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.post !== previousArg?.post;
      },
    }),
    addComment: builder.mutation<IResponse<IComment>, any>({
      query: (data) => ({
        url: `/`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query: `
            mutation CreateComment($post: ID!, $text: String!, $parent: ID, $entities: [EntityInput]) {
              createComment(post: $post, text: $text, parent: $parent, entities: $entities) {
                id
                post {
                  id
                }
                text
                replyCount
                reactionCount
                createdAt
                updatedAt
                parent {
                  id
                }
                reactionSummary {
                  count
                  reactionType
                }
                myReaction {
                  type
                }
                entities {
                  offset
                  end
                  type
                  target {
                    ...on User {
                      id
                      fullName
                    }
                    ...on Hashtag{
                      id
                      tag
                    }
                  }
                }
                author {
                  fullName
                  username
                  id
                  profilePicture {
                    pub_id
                    url
                  }
                }
              }
            }`,
          variables: data,
        }),
      }),
      transformResponse: (
        response: IResponse<{ createComment: IComment }>
      ) => ({
        data: response.data.createComment,
        errors: response.errors,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const newComment = data?.data;

          if (!newComment) return;

          dispatch(
            commentsApi.util.updateQueryData(
              "getComments",
              { post: arg.post }, // stable key
              (draft) => {
                draft.data.comments.unshift(newComment);
                draft.data.meta.totalResult += 1;
              }
            )
          );

          dispatch(
            postApi.util.updateQueryData(
              "getPosts",
              { page: 1, limit: 15 },
              (draft) => {
                const postIndex = draft.data.posts.findIndex(
                  (p) => p.id === arg.post
                );
                if (postIndex === -1) return;
                draft.data.posts[postIndex].commentCount += 1;
              }
            )
          );
        } catch (err) {
          console.error("cache update failed", err);
        }
      },
    }),
  }),
});

export const { useGetCommentsQuery, useAddCommentMutation } = commentsApi;
