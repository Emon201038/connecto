import { IMeta } from "@/lib/type";
import { baseApi } from "@/redux/baseApi";
import { IResponse, IStory, IUser } from "@/types";

export const storyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStories: builder.query<
      IResponse<{ stories: { stories: IStory[]; user: IUser }[]; meta: IMeta }>,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
              query {
                stories {
                  stories {
                    user {
                      id
                      firstName
                      fullName
                      profilePicture {
                        url
                      }
                    }
                    stories {
                      mediaUrl
                      expiresAt
                      isDeleted
                      createdAt
                    }
                  }
                  meta {
                    totalPage
                  }
                }
              }`,
          variables: {
            page,
            limit,
          },
        },
      }),
      providesTags: ["STORIES"],
      transformResponse: (
        response: IResponse<{
          stories: {
            stories: { stories: IStory[]; user: IUser }[];
            meta: IMeta;
          };
        }>
      ) => {
        return {
          data: {
            stories: response.data.stories.stories,
            meta: response.data.stories.meta,
          },
          errors: response.errors,
        };
      },
    }),
    createStory: builder.mutation<
      IResponse<{ id: string }>,
      { image: File; privacy?: string }
    >({
      query: (input) => {
        const formData = new FormData();

        formData.append(
          "operations",
          JSON.stringify({
            query: `
          mutation CreateStory($input: CreateStoryInput!) {
            createStory(input: $input) {
              id
            }
          }
        `,
            variables: {
              input: {
                image: null,
                privacy: input.privacy || "PUBLIC",
              },
            },
          })
        );

        formData.append(
          "map",
          JSON.stringify({ "0": ["variables.input.image"] })
        );
        formData.append("0", input.image);

        return {
          url: "/",
          method: "POST",
          body: formData,
          credentials: "include",
          headers: {
            "x-apollo-operation-name": "CreateStory",
          },
        };
      },

      transformResponse: (
        response: IResponse<{ createStory: { id: string } }>
      ) => ({
        data: response.data.createStory,
        errors: response.errors,
      }),
      invalidatesTags: ["STORIES"],
    }),
  }),
});

export const { useCreateStoryMutation, useGetStoriesQuery } = storyApi;
