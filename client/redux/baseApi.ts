import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
const serverUrl = process.env.NEXT_PUBLIC_API_URL;
export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${serverUrl}`,
    credentials: "include",
    prepareHeaders: async (headers, { extra }) => {
      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const cookieHeader = cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");
        headers.set("cookie", cookieHeader);
        headers.set(
          "authorization",
          `${cookieStore.get("accessToken")?.value}`,
        );
      }

      return headers;
    },
    next: {
      revalidate: 0,
    },
  }),
  endpoints: (builder) => ({}),
  tagTypes: [
    "STORIES",
    "GET_MESSAGES",
    "GET_CONVERSATIONS",
    "REACTIONS",
    "POSTS",
  ],
});
