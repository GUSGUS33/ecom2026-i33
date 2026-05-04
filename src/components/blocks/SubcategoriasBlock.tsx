import { Link } from "wouter";
import { useChildPages } from "@/hooks/useChildPages";
import { Loader2, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { PageBlock } from "@/queries/seoPageComplete";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

interface SubcategoriasBlockProps {
  data: PageBlock;
}

/**
 * Bloque de subcategorías fusionado con hero
 * 
 * Diseño compacto: título/descripción a la izquierda + slider de subcategorías a la derecha
 * Fondo oscuro, slider con flechas, círculos con imágenes
 * 
 * Prioridad: ALTA (navegación interna + SEO + hero)
 */
export function SubcategoriasBlock({ data }: SubcategoriasBlockProps) {
  const {
    subcategoriasTitulo = "Explora por categoría",
    subcategoriasParent,
  } = data;

  const { childPages, loading, error } = useChildPages(subcategoriasParent ?? undefined);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Si no hay título, no renderizar nada
  if (!subcategoriasTitulo) return null;

  // Estado de carga
  if (loading) {
    return (
      <div className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    console.error("[SubcategoriasBlock] Error loading subcategories:", error);
    return null;
  }

  // Sin páginas hijas
  if (!childPages || childPages.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 text-white py-8 md:py-12">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Izquierda: Título y subtítulo */}
          <div className="w-full lg:w-1/3 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 uppercase tracking-tight">
              {subcategoriasTitulo}
            </h1>
            <p className="text-base md:text-lg text-slate-300 uppercase tracking-wide">
              Selecciona una categoría
            </p>
          </div>

          {/* Derecha: Slider de subcategorías */}
          <div className="w-full lg:w-2/3 relative">
            {/* Botones de navegación */}
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 -ml-5"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 -mr-5"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Slider */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6 md:gap-8">
                {childPages.map((childPage) => (
                  <Link
                    key={childPage.id}
                    href={childPage.uri}
                  >
                    <div className="flex flex-col items-center group cursor-pointer min-w-[120px] md:min-w-[140px]">
                      {/* Imagen circular */}
                      <div className="w-24 h-24 md:w-32 md:h-32 mb-3 overflow-hidden rounded-full border-4 border-white group-hover:border-blue-400 transition-all duration-300 bg-slate-800 flex items-center justify-center shadow-lg">
                        {childPage.featuredImage?.node?.sourceUrl ? (
                          <img
                            src={childPage.featuredImage.node.sourceUrl}
                            alt={childPage.featuredImage.node.altText || childPage.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <Package className="w-10 h-10 md:w-12 md:h-12 text-slate-500" />
                        )}
                      </div>

                      {/* Título */}
                      <h3 className="font-bold text-white text-xs md:text-sm text-center group-hover:text-blue-400 transition-colors px-2 leading-tight">
                        {childPage.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
