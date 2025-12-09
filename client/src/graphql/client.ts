import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const WP_GRAPHQL_URL = import.meta.env.VITE_WP_GRAPHQL_URL || "https://creativu.es/graphql";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: WP_GRAPHQL_URL,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
      errorPolicy: "ignore",
    },
    query: {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    },
  },
});
