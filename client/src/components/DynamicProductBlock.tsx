import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS_BY_CATEGORY } from "@/graphql/queries";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { formatPrice } from "@/lib/utils";

interface DynamicProductBlockProps {
  categorySlug: string;
  limit?: number;
  columns?: number;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    attributes?: Record<string, string[]>;
  };
}

export function DynamicProductBlock({ categorySlug, limit = 12, columns = 4, filters }: DynamicProductBlockProps) {
  // Transformar filtros de atributos al formato de WPGraphQL
  // TODO: Investigar estructura correcta para filtros de taxonomía en este endpoint GraphQL
  // Por ahora desactivamos el filtrado por atributos para evitar errores 500/400
  /*
  const taxonomyFilter = filters?.attributes 
    ? Object.entries(filters.attributes).flatMap(([taxonomy, terms]) => 
        terms.length > 0 ? [{ taxonomy: taxonomy.toUpperCase() as any, terms: terms, operator: "IN" as any }] : []
      )
    : undefined;
  */

  const { data, loading, error, fetchMore } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: { 
      categorySlug, 
      first: limit,
      after: null,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
    },
    notifyOnNetworkStatusChange: true,
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo || { hasNextPage: false, endCursor: null };
  const isLoadingMore = loading && products.length > 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pageInfo.hasNextPage && !loading) {
          fetchMore({
            variables: {
              after: pageInfo.endCursor,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                products: {
                  ...fetchMoreResult.products,
                  nodes: [
                    ...prev.products.nodes,
                    ...fetchMoreResult.products.nodes,
                  ],
                },
              };
            },
          });
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [pageInfo.hasNextPage, pageInfo.endCursor, loading, fetchMore]);

  if (loading && products.length === 0) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-6`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-64 w-full rounded-sm" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-800 p-8 rounded-sm text-center">
        <AlertCircle className="mx-auto mb-2 h-8 w-8 text-red-500" />
        <p className="font-medium">Error cargando productos</p>
        <p className="text-sm opacity-80 mt-1">Por favor, intenta recargar la página.</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-100 text-slate-600 p-12 rounded-sm text-center">
        <p className="font-medium">No se encontraron productos en esta categoría.</p>
        <Link href="/contacto">
          <Button variant="link" className="mt-2 text-blue-700">Contáctanos para consultar disponibilidad</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-6`}>
        {products.map((product: any) => {
          const displayPrice = product.salePrice || product.price || product.regularPrice;
          
          return (
            <Link key={product.id} href={`/producto/${product.slug}`}>
              <div className="group cursor-pointer border border-transparent hover:border-slate-200 hover:shadow-lg transition-all duration-200 p-4 rounded-sm bg-white h-full flex flex-col">
                <div className="relative aspect-square overflow-hidden mb-4 bg-slate-50 rounded-sm">
                  {product.image?.sourceUrl ? (
                    <img 
                      src={product.image.sourceUrl} 
                      alt={product.image.altText || product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
                      <span className="text-xs uppercase font-bold">Sin imagen</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col">
                  <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Desde <span className="text-slate-900 font-bold text-base">{formatPrice(displayPrice)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3 border-slate-200 text-slate-700 hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-colors text-xs uppercase font-bold tracking-wide"
                  >
                    Ver Producto
                  </Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Intersection Observer Target */}
      <div ref={observerTarget} className="h-10 flex items-center justify-center w-full">
        {isLoadingMore && (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Cargando más productos...</span>
          </div>
        )}
      </div>
    </div>
  );
}
