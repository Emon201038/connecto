import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { UserRole } from "./types";
// import { cookies } from "next/headers";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: UserRole;
      firstName: string;
      lastName: string;
      fullName: string;
      username: string;
      phone: string;
      emailVerified: Date;
      profilePicture?: {
        url: string;
        pub_id: string;
      };
      coverPicture?: {
        url: string;
        pub_id: string;
      };
    } & DefaultSession["user"];
  }
}

// ------------------
// GraphQL API Helpers
// ------------------
const serverUrl = process.env.NEXT_PUBLIC_API_URL;

async function graphqlRequest<T>(
  query: string,
  variables: Record<string, any>,
): Promise<T> {
  const res = await fetch(`${serverUrl}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  });

  const data = await res.json();
  return data;
}

// Login mutation
async function loginMutation(credentials: { email: string; password: string }) {
  return graphqlRequest<{
    data: {
      login: {
        message: string;
        s_id: string | null;
        o_id: string | null;
        requires2FA: boolean;
        accessToken: string;
        refreshToken: string;
        user: {
          id: string;
          email: string;
          phone: string;
          role: UserRole;
          firstName: string;
          lastName: string;
          fullName: string;
          username: string;
          profilePicture: { url: string; pub_id: string };
          coverPicture: { url: string; pub_id: string };
        };
      };
    };
    errors?: { message: string }[];
  }>(
    `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          message
          s_id
          o_id
          requires2FA
          accessToken
          refreshToken
          user {
            id
            email
            phone
            role
            firstName
            lastName
            fullName
            username
            profilePicture {
              url
              pub_id
            }
            coverPicture {
              url
              pub_id
            }
          }
        }
      }
    `,
    credentials,
  );
}

// Verify 2FA mutation
async function verify2FAMutation(credentials: {
  token: string;
  s_id: string;
  o_id: string;
}) {
  return graphqlRequest<{
    data: { verify2FA: { token: string; user: { id: string; email: string } } };
    errors?: { message: string }[];
  }>(
    `
      mutation Verify2FA($s_id: String!, $o_id: String!, $token: String!) {
        verify2FA(s_id: $s_id, o_id: $o_id, token: $token) {
          token
          user {
            id
            email
          }
        }
      }
    `,
    credentials,
  );
}

// ------------------
// NextAuth Config
// ------------------
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password" },
        token: { label: "2FA Token" },
        s_id: { label: "Session ID" },
        o_id: { label: "Object ID" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          // Case 1: 2FA verification
          if (credentials.token && credentials.s_id && credentials.o_id) {
            const { data, errors } = await verify2FAMutation({
              token: credentials.token as string,
              s_id: credentials.s_id as string,
              o_id: credentials.o_id as string,
            });

            if (errors?.length) throw new Error(errors[0].message);

            return {
              id: data.verify2FA.user.id,
              email: data.verify2FA.user.email,
              accessToken: data.verify2FA.token,
            };
          }

          // Case 2: Normal login
          const { data, errors } = await loginMutation({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (errors?.length) throw new Error(errors[0].message);

          const loginData = data.login;

          // If 2FA required → stop auth and redirect
          if (loginData.requires2FA) {
            throw new Error("TWO_FACTOR_REQUIRED");
          }

          // (await cookies()).set("accessToken", loginData.accessToken, {
          //   secure: true,
          //   sameSite: "none",
          //   httpOnly: true,
          // });
          // (await cookies()).set("refreshToken", loginData.refreshToken, {
          //   secure: true,
          //   sameSite: "none",
          //   httpOnly: true,
          // });

          return {
            id: loginData.user.id,
            email: loginData.user.email,
            phone: loginData.user.phone,
            role: loginData.user.role,
            firstName: loginData.user.firstName,
            lastName: loginData.user.lastName,
            fullName: loginData.user.fullName,
            username: loginData.user.username,
            profilePicture: loginData.user.profilePicture,
            coverPicture: loginData.user?.coverPicture,
            accessToken: loginData.accessToken,
            refreshToken: loginData.refreshToken,
          };
        } catch (err: any) {
          throw new Error(err.message || "Authentication failed");
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // will get ?error=...
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.phone = (user as any).phone;
        token.role = (user as any).role;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.fullName = (user as any).fullName;
        token.username = (user as any).username;
        token.profilePicture = (user as any).profilePicture;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.accessToken) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;

        session.user = {
          emailVerified: session.user?.emailVerified || new Date(),
          id: token.id as string,
          email: token.email as string,
          phone: token.phone as string,
          role: token.role as UserRole,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          fullName: token.fullName as string,
          username: token.username as string,
          profilePicture: token.profilePicture as {
            url: string;
            pub_id: string;
          },
        };
      }
      return session;
    },
  },

  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});
