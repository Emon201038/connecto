import { ICreatePost, IPost } from "@/interface/post.interface";
import { IResponse } from "@/types";
import { baseApi } from "@/redux/baseApi";

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query({
      query: ({
        id,
        postFields = `id content createdAt updatedAt`,
      }: {
        id: string;
        postFields?: string;
      }) => ({
        url: "/",
        body: {
          query: `
            query GetPost($id: ID!) {
              getPost(id: $id) {
                ${postFields}
              }
            }
          `,
          variables: { id },
        },
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      transformResponse: (response: {
        data: {
          getPost: {
            id: string;
            content: string;
            createdAt: string;
            updatedAt: string;
            reactions: {
              id: string;
              user: {
                id: string;
                profilePicture: {
                  url: string;
                  pub_id: string;
                };
                fullName: string;
              };
              emoji: string;
            }[];
          };
        };
      }) => response.data.getPost,
    }),
    getPosts: builder.query<
      IResponse<{
        posts: IPost[];
        meta: { total: number; page: number; limit: number };
      }>,
      { page?: number; limit?: number; authorization?: string }
    >({
      query: ({ page = 1, limit = 10, authorization }) => ({
        url: "/",
        body: JSON.stringify({
          query: `query { 
            posts(page: ${page}, limit: ${limit}) { 
              posts {
                id
                content
                createdAt
                updatedAt
                commentCount
                reactionCount
                shareCount
                feelings {
                  type
                  emoji
                  text
                }
                type
                attachments {
                  url
                  pub_id
                }
                reactionSummary {
                  count
                  reactionType
                }
                myReaction {
                  type
                }
                author {
                  id
                  fullName
                  username
                  profilePicture {
                    url
                    pub_id
                  }
                }
                group {
                  id
                  name
                  joined
                  coverPhoto {
                    url
                  }
                }
              }
              meta {
                totalResult
                page
                limit
                totalPage
              }
            }
          }`,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization,
        },
        credentials: "include",
      }),
      transformResponse: (
        response: IResponse<{
          posts: {
            posts: IPost[];
            meta: { total: number; page: number; limit: number };
          };
        }>
      ) => {
        return {
          data: {
            posts: response.data.posts.posts,
            meta: response.data.posts.meta,
          },
          errors: response.errors
            ? response.errors.map((err) => ({ message: err.message }))
            : [],
        };
      },
      transformErrorResponse: (response: any) => {
        return response;
      },
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newItems) => {
        return {
          ...newItems,
          posts: [...(currentCache?.data?.posts ?? []), ...newItems.data.posts],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        // Refetch if page param changes
        return currentArg?.page !== previousArg?.page;
      },
    }),
    createPost: builder.mutation<IResponse<IPost>, ICreatePost>({
      query: (input) => {
        const formData = new FormData();
        formData.append(
          "operations",
          JSON.stringify({
            query: `
            mutation CreatePost($input: CreatePostInput!) {
              createPost(input: $input) {
                id
                content
                createdAt
                updatedAt
                commentCount
                shareCount
                reactionCount
                feelings {
                  type
                  emoji
                  text
                }
                type
                attachments {
                  url
                  pub_id
                }
                reactionSummary {
                  count
                  reactionType
                }
                myReaction {
                  type
                }
                author {
                  id
                  fullName
                  username
                  profilePicture {
                    url
                    pub_id
                  }
                }
                group {
                  id
                  name
                  coverPhoto {
                    url
                  }
                }
              }
            }
          `,
            variables: {
              input: {
                ...input,
                attachments: Array.from(input.attachments || []).map(
                  () => null
                ),
              },
            },
          })
        );

        // 2. Map
        const map: Record<string, string[]> = {};
        Array.from(input.attachments || []).forEach((_, index) => {
          map[index] = [`variables.input.attachments.${index}`];
        });
        formData.append("map", JSON.stringify(map));

        // 3. Files
        Array.from(input.attachments || []).forEach((file, index) => {
          formData.append(index.toString(), file);
        });

        return {
          url: "/",
          body: formData,
          method: "POST",
          credentials: "include",
          headers: { "x-apollo-operation-name": "CreatePost" },
        };
      },
      transformResponse: (response: IResponse<{ createPost: IPost }>) => {
        return {
          data: response.data.createPost,
          errors: response.errors,
        };
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const post = await queryFulfilled;
          dispatch(
            postApi.util.updateQueryData(
              "getPosts",
              { page: 1, limit: 15 },
              (draft) => {
                draft.data.posts.unshift(post.data.data);
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useGetPostQuery,
  useGetPostsQuery,
  useLazyGetPostQuery,
  useCreatePostMutation,
} = postApi;
