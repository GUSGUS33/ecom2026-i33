import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Usar la URL de WooCommerce GraphQL desde variable de entorno
const GRAPHQL_URL = import.meta.env.VITE_WP_GRAPHQL_URL || 'https://creativu.es/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
