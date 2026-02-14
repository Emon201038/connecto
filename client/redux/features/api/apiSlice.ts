import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "graphqlApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    prepareHeaders: (headers) => headers,
    credentials: "include",
  }),
  endpoints: () => ({}),
});
