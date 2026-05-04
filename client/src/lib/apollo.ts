import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// Usamos /graphql (ruta relativa) que pasa por el proxy del servidor Express
// En desarrollo: Vite proxy redirige a creativu.es/graphql
// En producción: Express proxy redirige a creativu.es/graphql
// Esto evita problemas de CORS y mejora la fiabilidad
const GRAPHQL_URL = '/graphql';

const httpLink = new HttpLink({
  uri: GRAPHQL_URL,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
