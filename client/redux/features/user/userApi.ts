import { IPost } from "@/interface/post.interface";
import { IMeta } from "@/lib/type";
import { baseApi } from "@/redux/baseApi";
import { IResponse, IUser, UserRole } from "@/types";

export const userApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<
      IResponse<{ users: IUser[]; meta: IMeta }>,
      Record<string, string | number>
    >({
      query: (args) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        credentials: "include",
        body: JSON.stringify({
          query: `query GetUsers($limit: Int, $page: Int, $search: String, $filter: UserFilterInput, $sortBy: String, $sortOrder: String) {
            users(limit: $limit, page: $page, search: $search, filter: $filter, sortBy: $sortBy, sortOrder: $sortOrder) {
              users {
                id
                firstName
                lastName
                fullName
                email
                profilePicture {
                  url
                  pub_id
                }
                ${args?.additionalFields}
              }
              meta {
                page
                limit
                totalPage
                totalResult
              }
            }
          }`,
          variables: args,
        }),
      }),
      transformResponse: (
        response: IResponse<{ users: { users: IUser[]; meta: IMeta } }>,
      ) => {
        return {
          data: {
            users: response.data.users.users,
            meta: response.data.users.meta,
          },
          errors: response.errors,
        };
      },
      transformErrorResponse: (response: any) => {
        return response;
      },
    }),
    getUserPosts: build.query<
      IResponse<{ posts: IPost[] }>,
      {
        cookie?: string;
        field?: string;
        username?: string;
        author?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (payload) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: payload?.cookie || "",
        },
        cache: "no-store",
        credentials: "include",
        body: JSON.stringify({
          query: `
            query Posts($search: String, $username: String, $author: ID, $page: Int, $limit: Int) {
              posts( search: $search, username: $username, author: $author, page: $page, limit: $limit) {
                posts {
                id
                content
                createdAt
                reactionCount
                shareCount
                reactionSummary {
                  count
                  reactionType
                }
                myReaction {
                  type
                }
                feelings {
                  type
                  emoji
                  text
                }
                  author {
                    id
                    fullName
                    username
                    email
                    profilePicture {
                      url
                      pub_id
                    }
                  }
                }
              }
            }`,
          variables: {
            username: payload?.username,
            search: payload?.field,
            author: payload?.author,
            page: payload?.page || 1,
            limit: payload?.limit || 10,
          },
        }),
      }),
      transformResponse: (response: {
        data: { posts: { posts: IPost[] } };
        errors: { message: string }[];
      }) => {
        return {
          data: { posts: response.data.posts.posts },
          errors: response.errors,
        };
      },
      transformErrorResponse: (response: any) => {
        return response;
      },
    }),
    getUserById: build.query<IResponse<IUser>, string>({
      query: (id) => ({
        url: "/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        credentials: "include",
        body: JSON.stringify({
          query: `query GetUserById($id: ID!) {
            user(id: $id) {
              id
              fullName
              email
              username
              phone
              profilePicture {
                url
                pub_id
              }
            }
          }`,
          variables: { id },
        }),
      }),
      transformResponse: (response: IResponse<{ user: IUser }>) => {
        return {
          data: response.data.user,
          errors: response.errors,
        };
      },
    }),
    createUser: build.mutation<
      IResponse<{ register: boolean }>,
      {
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        dateOfBirth: Date;
        phone?: string;
        password: string;
        role?: UserRole;
      }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!, $gender: String!, $phone: String, $dateOfBirth: String!) {
              register(email: $email, password: $password, firstName: $firstName,lastName: $lastName, gender: $gender, phone: $phone, dateOfBirth: $dateOfBirth)
          }`,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updateUser: build.mutation<
      IResponse<{ update: boolean }>,
      {
        id: string;
        firstName: string;
        lastName: string;
        gender: string;
        dateOfBirth: Date;
        phone: string;
        bio?: string;
        role?: UserRole;
      }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation UpdateUser($input: UpdateUserInput!) {
              updateUser(input: $input){
                id}
          }`,
          variables: {
            input: credentials,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
        next: {
          tags: ["USERS"],
        },
      }),
      transformResponse: (response: IResponse<{ update: boolean }>) => {
        console.log(response);
        return response;
      },
    }),
  }),
});

export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useGetUserPostsQuery,
  useLazyGetUserPostsQuery,
  useGetUserByIdQuery,
} = userApi;
