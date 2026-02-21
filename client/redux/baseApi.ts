// client/src/redux/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
const serverUrl = process.env.NEXT_PUBLIC_API_URL;
export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${serverUrl}/graphql`,
    credentials: "include",
    prepareHeaders: async (headers, { extra }) => {
      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const { auth } = await import("@/auth");
        const cookieStore = await cookies();
        const cookieHeader = cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
        const session = await auth();
        headers.set("cookie", cookieHeader);
        headers.set("authorization", `${session?.accessToken}`);
      } else {
        const session = await getSession();

        if (session?.accessToken) {
          headers.set("authorization", `${session.accessToken}`);
        }
      }

      return headers;
    },
    next: {
      revalidate: 0,
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: ["STORIES", "GET_MESSAGES", "GET_CONVERSATIONS"],
});
