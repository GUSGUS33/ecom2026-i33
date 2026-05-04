import { describe, it, expect } from 'vitest';
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

describe('WooCommerce GraphQL Connection', () => {
  it('should connect to WooCommerce GraphQL endpoint and fetch products', async () => {
    const GRAPHQL_URL = import.meta.env.VITE_WP_GRAPHQL_URL || 'https://creativu.es/graphql';
    
    const client = new ApolloClient({
      link: new HttpLink({ uri: GRAPHQL_URL }),
      cache: new InMemoryCache(),
    });

    const query = gql`
      query TestConnection {
        products(first: 3) {
          nodes {
            id
            name
            slug
          }
        }
      }
    `;

    const result = await client.query({ query });

    expect(result.data).toBeDefined();
    expect(result.data.products).toBeDefined();
    expect(result.data.products.nodes).toBeInstanceOf(Array);
    expect(result.data.products.nodes.length).toBeGreaterThan(0);
    expect(result.data.products.nodes[0]).toHaveProperty('id');
    expect(result.data.products.nodes[0]).toHaveProperty('name');
    expect(result.data.products.nodes[0]).toHaveProperty('slug');
  }, 10000); // 10 segundos de timeout para la petición HTTP
});
