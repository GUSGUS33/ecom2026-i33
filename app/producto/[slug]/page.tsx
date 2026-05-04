import type { Metadata } from "next";
import { ProductPageClient } from "./ProductPageClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  // Fetch product data from WordPress GraphQL for SEO meta tags
  try {
    const graphqlUrl = process.env.VITE_WP_GRAPHQL_URL || process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://creativu.es/graphql';
    const res = await fetch(graphqlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query GetProductMeta($slug: ID!) {
            product(id: $slug, idType: SLUG) {
              name
              shortDescription
              image {
                sourceUrl
                altText
              }
            }
          }
        `,
        variables: { slug },
      }),
      next: { revalidate: 3600 },
    });

    const json = await res.json();
    const product = json?.data?.product;

    if (product) {
      const cleanDescription = product.shortDescription
        ? product.shortDescription.replace(/<[^>]*>/g, '').substring(0, 160)
        : `${product.name} personalizado. Precios mayoristas, calidad premium. Presupuesto gratis en 2 horas.`;

      return {
        title: product.name,
        description: cleanDescription,
        openGraph: {
          title: product.name,
          description: cleanDescription,
          images: product.image?.sourceUrl ? [{ url: product.image.sourceUrl }] : [],
          type: 'website',
        },
        robots: { index: true, follow: true },
      };
    }
  } catch (e) {
    // Fallback metadata if fetch fails
  }

  return {
    title: `Producto - ${slug.replace(/-/g, ' ')}`,
    description: `Producto personalizado ${slug.replace(/-/g, ' ')}. Precios mayoristas. Presupuesto gratis.`,
  };
}

export default async function ProductoPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductPageClient slug={slug} />;
}
