import { userApi } from "@/redux/features/user/userApi";
import { IMeta } from "@/lib/type";
import { baseApi } from "@/redux/baseApi";
import { IResponse, IUser } from "@/types";

export const friendApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    pendingRequests: builder.query<
      IResponse<{
        pendingRequests: {
          friendshipId: string;
          status: string;
          user: IUser;
        }[];
        meta: IMeta;
      }>,
      { cookie?: string }
    >({
      query: (arg) => ({
        url: "/",
        method: "POST",
        body: {
          query: `query GetPendingRequests($page: Int, $limit:Int,$search:String){
          pendingRequests(page: $page,limit: $limit, search: $search) {
            users {
              status
              friendshipId
              user {
                id
                firstName
                lastName
                fullName
                username
                profilePicture {
                  pub_id
                  url
                }
              }
            }
            meta {
              limit
              page
              totalPage
              totalResult
              prevPage
              nextPage
            }
          }
        }`,
        },
        headers: {
          "Content-Type": "application/json",
          cookie: arg.cookie || "",
        },
        credentials: "include",
      }),
      transformResponse: (response: {
        data: {
          pendingRequests: {
            users: { friendshipId: string; status: string; user: IUser }[];
            meta: IMeta;
          };
        };
        errors: { message: string }[];
      }) => {
        return {
          data: {
            pendingRequests: response.data.pendingRequests.users,
            meta: response.data.pendingRequests.meta,
          },
          errors: response.errors,
        };
      },
    }),
    myFriends: builder.query<
      IResponse<{
        myFriends: { user: IUser; status: string; friendshipId: string }[];
        meta: IMeta;
      }>,
      { cookie?: string }
    >({
      query: (arg) => ({
        url: "/",
        method: "POST",
        body: {
          query: `query GetMyFriends($page: Int, $limit:Int,$search:String){
            myFriends(page: $page,limit: $limit, search: $search) {
              users {
                status
                friendshipId
                user {
                  id
                  firstName
                  lastName
                  fullName
                  username
                  profilePicture {
                    pub_id
                    url
                  }
                }
              }
              meta {
                limit
                page
                totalPage
                totalResult
                prevPage
                nextPage
              }
            }
          }`,
        },
        headers: {
          "Content-Type": "application/json",
          cookie: arg.cookie || "",
        },
        credentials: "include",
      }),
      transformResponse: (response: {
        data: {
          myFriends: {
            users: { status: string; user: IUser; friendshipId: string }[];
            meta: IMeta;
          };
        };
        errors: { message: string }[];
      }) => ({
        data: {
          myFriends: response.data.myFriends.users,
          meta: response.data.myFriends.meta,
        },
        errors: response.errors,
      }),
    }),
    getSuggestedUsers: builder.query<
      IResponse<{ users: IUser[]; meta: IMeta }>,
      { cookie?: string; search?: string; page?: number; limit?: number }
    >({
      query: ({ cookie, page = 1, limit = 10, search = "" }) => ({
        url: "/",
        method: "POST",
        body: {
          query: `query SuggestedUsers($page: Int, $limit: Int, $search: String) {
            suggestedUser(page: $page, limit: $limit, search: $search) {
              users {
                id
                firstName
                lastName
                fullName
                username
                profilePicture {
                  url
                  pub_id
                }
              }
              meta {
                totalResult
                page
                limit
              }
            }
          }`,
          variables: { page, limit, search },
        },
        headers: {
          "Content-Type": "application/json",
          cookie: cookie || "",
        },
        credentials: "include",
      }),
      transformResponse: (response: {
        data: { suggestedUser: { users: IUser[]; meta: IMeta } };
        errors: { message: string }[];
      }) => {
        return { data: response.data.suggestedUser, errors: response.errors };
      },
    }),
    sendFriendRequest: builder.mutation<IUser, { recipientId: string }>({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `mutation SendFriendRequest($recipientId: ID!) {
            sendFriendRequest(recipientId: $recipientId) {
              id
            }
          }`,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    acceptFriendRequest: builder.mutation<IUser, { requestId: string }>({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `mutation AcceptFriendRequest($requestId: ID!) {
            acceptFriendRequest(requestId: $requestId)  {
              id
            }
          }`,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
    deleteFriendRequest: builder.mutation<IUser, { requestId: string }>({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `mutation DeleteFriendRequest($requestId: ID!) {
            deleteFriendRequest(requestId: $requestId) 
          }`,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  usePendingRequestsQuery,
  useMyFriendsQuery,
  useGetSuggestedUsersQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useDeleteFriendRequestMutation,
} = friendApi;
