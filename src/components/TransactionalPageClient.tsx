"use client";

/**
 * Client Component wrapper para TransactionalPage.
 * Recibe los datos pre-fetched del Server Component y renderiza
 * los bloques interactivos (BlockRenderer, HeroWithSubcategories, etc.)
 *
 * TODO: En una fase posterior, migrar bloques individuales que no necesiten
 * interactividad a Server Components para reducir el bundle JS del cliente.
 */

import { useCallback } from "react";
import { Link } from "wouter";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BreadcrumbsWithSchema } from "@/components/BreadcrumbsWithSchema";
import { useChildPages } from "@/hooks/useChildPages";
import { usePrefetch } from "@/hooks/usePrefetch";
import type { PageBlock } from "@/queries/seoPageComplete";

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface PageData {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  uri: string;
  parent?: {
    node: {
      id: string;
      uri: string;
    };
  } | null;
  heroPageSeo: {
    tituloPrincipal: string | null;
    intro: string | null;
  } | null;
  seoMeta: {
    metaDescription: string | null;
    canonicalUrl: string | null;
    schemaType: string | null;
    openGraph: {
      title: string | null;
      description: string | null;
      image: {
        node: {
          sourceUrl: string;
          altText: string;
          mediaDetails: { width: number; height: number };
        };
      } | null;
    } | null;
    breadcrumbsConfig: {
      show: boolean | null;
      customPath: Array<{
        label: string | null;
        url: string | null;
      }> | null;
    } | null;
    indexConfig: {
      index: boolean | null;
      follow: boolean | null;
    } | null;
  } | null;
  pageBlocks: {
    pageBlocks: PageBlock[];
  } | null;
}

interface TransactionalPageClientProps {
  page: PageData;
  blocks: PageBlock[];
}

// ─── Componente principal ───────────────────────────────────────────────────

export default function TransactionalPageClient({
  page,
  blocks,
}: TransactionalPageClientProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section fusionado con subcategorías */}
      {page.heroPageSeo && (
        <HeroWithSubcategories
          title={page.heroPageSeo.tituloPrincipal}
          description={page.heroPageSeo.intro}
          pageUri={page.uri}
          parentUri={page.parent?.node?.uri || null}
        />
      )}

      {/* Breadcrumbs (si está configurado) */}
      {page.seoMeta?.breadcrumbsConfig?.show && (
        <BreadcrumbsWithSchema
          customPath={
            page.seoMeta.breadcrumbsConfig.customPath?.map((item) => ({
              label: item.label ?? "",
              url: item.url ?? undefined,
            })) ?? undefined
          }
          currentPageTitle={page.title}
        />
      )}

      {/* Bloques Dinámicos */}
      {blocks.map((block, index) => (
        <BlockRenderer
          key={index}
          block={block}
          index={index}
          pageUri={page.uri}
          pageTitle={page.title}
          parentUri={page.parent?.node?.uri || null}
        />
      ))}
    </div>
  );
}

// ─── HeroWithSubcategories ─────────────────────────────────────────────────

interface HeroWithSubcategoriesProps {
  title: string | null;
  description: string | null;
  pageUri: string;
  parentUri?: string | null;
}

function HeroWithSubcategories({
  title,
  description,
  pageUri,
  parentUri,
}: HeroWithSubcategoriesProps) {
  const uriToFetch = parentUri || pageUri;
  const { childPages, loading } = useChildPages(uriToFetch);
  const prefetchPage = usePrefetch();

  // Filtrar la página actual de las hermanas
  const pagesToShow = parentUri
    ? childPages.filter((p) => p.uri !== pageUri)
    : childPages;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Si no hay subcategorías/hermanas, mostrar hero simple centrado
  if (!pagesToShow || pagesToShow.length === 0 || loading) {
    return (
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {title && (
              <h1 className="text-3xl md:text-5xl font-bold mb-6">{title}</h1>
            )}
            {description && (
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 text-white py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          {/* Lado izquierdo: Título y descripción */}
          <div className="lg:w-1/2 flex flex-col justify-center">
            {title && (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Lado derecho: Slider de subcategorías/hermanas */}
          <div className="lg:w-1/2 w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                {parentUri ? "Categorías relacionadas" : "Subcategorías"}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={scrollPrev}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={scrollNext}
                  className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {pagesToShow.map((childPage) => {
                  const normalizedUri =
                    childPage.uri.endsWith("/") && childPage.uri.length > 1
                      ? childPage.uri.slice(0, -1)
                      : childPage.uri;
                  return (
                    <div
                      key={childPage.id}
                      className="flex-[0_0_160px] md:flex-[0_0_180px]"
                    >
                      <Link
                        href={normalizedUri}
                        onMouseEnter={() => prefetchPage(childPage.uri)}
                      >
                        <div className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-colors cursor-pointer text-center group">
                          {childPage.featuredImage?.node?.sourceUrl ? (
                            <img
                              src={childPage.featuredImage.node.sourceUrl}
                              alt={
                                childPage.featuredImage.node.altText ||
                                childPage.title
                              }
                              className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-slate-700 flex items-center justify-center">
                              <Package className="w-8 h-8 text-slate-500" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2">
                            {childPage.title}
                          </span>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
