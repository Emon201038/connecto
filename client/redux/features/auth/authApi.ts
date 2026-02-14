import { baseApi } from "@/redux/baseApi";
import { IResponse, IUser } from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<
      IResponse<{
        message: string;
        s_id: string | null;
        o_id: string | null;
        requires2FA: boolean;
      }>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password){
                message
                s_id
                o_id
                requires2FA
              }
          }`,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      transformResponse: (response: {
        data: {
          login: {
            message: string;
            s_id: string;
            o_id: string;
            requires2FA: boolean;
          };
        };
        errors: { message: string }[];
      }) => {
        return {
          data: response.data.login,
          errors: response.errors,
        };
      },
    }),
    register: build.mutation<
      IResponse<{ register: boolean }>,
      {
        firstName: string;
        lastName: string;
        email: string;
        gender: string;
        dateOfBirth: Date;
        phone?: string;
        password: string;
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
    logout: build.mutation<IResponse<boolean>, { cookie?: string }>({
      query: (payload) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation Logout {
              logout
          }`,
        },
        headers: {
          "Content-Type": "application/json",
          cookie: payload?.cookie || "",
        },
        credentials: "include",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(authApi.util.resetApiState());
        } catch (error) {}
      },
    }),
    saveLoginInfo: build.mutation({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation SaveLoginInfo($sessionId: String!) {
              saveLoginInfo(sessionId: $sessionId)
          }`,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    me: build.query<
      IResponse<Pick<
        IUser,
        "fullName" | "email" | "role" | "id" | "profilePicture"
      > | null>,
      void
    >({
      query: () => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            query GetSession {
              me {
                fullName
                id
                email
                profilePicture {
                  url
                  pub_id
                }
              }
            }
          `,
        },
        cache: "no-store",
        credentials: "include",
      }),
      transformResponse: (res: {
        data: {
          me: Pick<
            IUser,
            "fullName" | "email" | "role" | "id" | "profilePicture"
          >;
        };
        errors: { message: string }[];
      }) => {
        return { data: res.data.me, errors: res.errors };
      },
    }),
    sendResetCode: build.mutation<
      IResponse<{ sendResetCode: string }>,
      { email: string; id: string }
    >({
      query: (credentials) => ({
        url: "/",
        method: "POST",
        body: {
          query: `
            mutation SendResetCode($email: String!, $id:ID!) {
              sendResetCode(email: $email, id: $id)
          }`,
          variables: credentials,
        },
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }),
      transformResponse: (res: {
        data: {
          sendResetCode: string;
        };
        errors: { message: string }[];
      }) => {
        return {
          data: { sendResetCode: res.data.sendResetCode },
          errors: res.errors,
        };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useSaveLoginInfoMutation,
  useMeQuery,
  useSendResetCodeMutation,
} = authApi;
