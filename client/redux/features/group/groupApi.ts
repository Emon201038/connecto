import { IGroup } from "@/interface/group.interface";
import { IPost } from "@/interface/post.interface";
import { IMeta } from "@/lib/type";
import { baseApi } from "@/redux/baseApi";
import { IResponse } from "@/types";

export const groupApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createGroup: builder.mutation<
      IResponse<{ id: string }>,
      { input: { name: string; privacy: string } }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation CreateGroup($input: CreateGroupInput!) {
              createGroup(input: $input) {
                id
                name
                privacy
                createdAt
                updatedAt
              }
            }
          `,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      transformResponse: (res: {
        data: {
          createGroup: { id: string };
          errors: { message: string }[];
        };
        errors: { message: string }[];
      }) => ({
        data: res.data.createGroup,
        errors: res.errors,
      }),
    }),
    myGroups: builder.query<
      IResponse<{ groups: IGroup[]; meta: IMeta }>,
      { limit: number; page: number; search: string }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            query MyGroups($limit: Int, $page: Int, $search: String) {
              myGroups(limit: $limit, page: $page, search: $search) {
                groups {
                  id
                  name
                  privacy
                  memberCount
                  coverPhoto {
                    url
                  }
                  createdAt
                  updatedAt
                  joined
                }
                meta {
                  totalResult
                  totalPage
                  page
                  limit
                }
              }
            }
          `,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      transformResponse: (res: {
        data: {
          myGroups: { groups: IGroup[]; meta: IMeta };
          errors: { message: string }[];
        };
        errors: { message: string }[];
      }) => ({
        data: res.data.myGroups,
        errors: res.errors,
      }),
    }),
    groups: builder.query<
      IResponse<{ groups: IGroup[]; meta: IMeta }>,
      { limit: number; page: number; search: string }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            query Groups($limit: Int, $page: Int, $search: String) {
              groups(limit: $limit, page: $page, search: $search) {
                groups {
                  id
                  name
                  privacy
                  memberCount
                  coverPhoto {
                    url
                  }
                  createdAt
                  updatedAt
                  joined
                }
                meta {
                  totalResult
                  totalPage
                  page
                  limit
                }
              }
            }
          `,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      transformResponse: (res: {
        data: {
          groups: { groups: IGroup[]; meta: IMeta };
          errors: { message: string }[];
        };
        errors: { message: string }[];
      }) => ({
        data: res.data.groups,
        errors: res.errors,
      }),
    }),

    group: builder.query<IResponse<IGroup>, { id: string }>({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            query Group($id: ID!) {
              groupById(id: $id) {
                id
                name
                privacy
                memberCount
                coverPhoto {
                  url
                }
                createdAt
                updatedAt
                joined
              }
            }
          `,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      transformResponse: (res: {
        data: {
          groupById: IGroup;
          errors: { message: string }[];
        };
        errors: { message: string }[];
      }) => {
        return {
          data: res.data.groupById,
          errors: res.errors,
        };
      },
    }),

    joinGroup: builder.mutation<IResponse<IGroup>, { groupId: string }>({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation JoinGroup($groupId: ID!) {
              joinGroup(groupId: $groupId) {
                group {
                  id
                  name
                  privacy
                  memberCount
                  coverPhoto {
                    url
                  }
                  createdAt
                  updatedAt
                  joined
                }
              }
            }
          `,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      transformResponse: (res: {
        data: {
          joinGroup: { group: IGroup };
          errors: { message: string }[];
        };
        errors: { message: string }[];
      }) => ({
        data: res.data.joinGroup.group,
        errors: res.errors,
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            groupApi.util.updateQueryData(
              "groups",
              { page: 1, limit: 12, search: "" },
              (draft) => {
                const group = draft.data.groups.find(
                  (g) => g.id === arg.groupId
                );
                if (group) group.joined = true;
              }
            )
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),

    groupPosts: builder.query<
      IResponse<{ posts: IPost[]; meta: IMeta }>,
      { page: number; limit: number }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            query GroupPosts($page: Int, $limit: Int) {
              groupFeed( page: $page, limit: $limit) {
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
            }
          `,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (res: {
        data: {
          groupFeed: { posts: IPost[]; meta: IMeta };
          errors: { message: string }[];
        };
        errors: { message: string }[];
      }) => ({
        data: res.data.groupFeed,
        errors: res.errors,
      }),
    }),
    singleGroupPosts: builder.query<
      IResponse<{ posts: IPost[]; meta: IMeta }>,
      { page: number; limit: number; groupId: string }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            query SingleGroupPosts($page: Int, $limit: Int, $groupId: ID!) {
              groupPosts( page: $page, limit: $limit, groupId: $groupId) {
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
            }
          `,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (res: {
        data: {
          groupPosts: { posts: IPost[]; meta: IMeta };
          errors: { message: string }[];
        };
        errors: { message: string }[];
      }) => ({
        data: res.data.groupPosts,
        errors: res.errors,
      }),
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGroupsQuery,
  useJoinGroupMutation,
  useGroupPostsQuery,
  useMyGroupsQuery,
  useGroupQuery,
  useSingleGroupPostsQuery,
} = groupApi;
