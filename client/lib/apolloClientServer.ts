// lib/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { cookies } from "next/headers";
import { setContext } from "@apollo/client/link/context";

const serverUrl = process.env.NEXT_PUBLIC_API_URL;

const apolloServerClient = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const httpLink = new HttpLink({
    uri: `${serverUrl}/graphql`, // Replace with your backend
    fetchOptions: {
      cache: "no-store", // For fetch API (used in SSR mode)
    },
    credentials: "include",
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      Cookie: cookieHeader,
    },
  }));

  return new ApolloClient({
    link: authLink.concat(httpLink),
    ssrMode: true,
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
};

export default apolloServerClient;
