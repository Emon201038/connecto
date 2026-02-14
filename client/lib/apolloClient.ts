// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const serverUrl = process.env.NEXT_PUBLIC_API_URL;
const client = new ApolloClient({
  link: new HttpLink({
    uri: `${serverUrl}/graphql`, // Replace with your backend
    fetchOptions: {
      cache: "no-store", // For fetch API (used in SSR mode)
    },
    credentials: "include",
  }),
  cache: new InMemoryCache(), // Required even if you're disabling caching at fetch level
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
    query: {
      fetchPolicy: "no-cache",
    },
    mutate: {
      fetchPolicy: "no-cache",
    },
  },
});

export default client;
