import { useRoute, Link } from "wouter";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/siteConfig";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ChevronRight, Mail, Phone, ShieldCheck, Truck } from "lucide-react";
import NotFound from "@/pages/NotFound";
import { useState } from "react";

// Query específica para producto individual (reutilizando la lógica de GET_FULL_VARIABLE_PRODUCT mencionada en briefing)
const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      shortDescription
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockStatus
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

export default function ProductPage() {
  const [match, params] = useRoute("/producto/:slug");
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { slug: params?.slug },
    skip: !match || !params?.slug
  });

  if (!match) return <NotFound />;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-sm" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.product) {
    // Si falla la carga o no existe, mostramos un estado de error amigable o 404
    return <NotFound />;
  }

  const product = data.product;
  const mainImage = product.image?.sourceUrl;
  const gallery = product.galleryImages?.nodes || [];
  const currentImage = activeImage || mainImage;
  
  // Precio display
  const displayPrice = product.salePrice || product.price || product.regularPrice;

  // Categoría principal para breadcrumbs
  const mainCategory = product.productCategories?.nodes[0];

  return (
    <>
      <Helmet>
        <title>{`${product.name} | ${siteConfig.brandName}`}</title>
        <meta name="description" content={`Compra ${product.name} personalizado. ${product.shortDescription?.replace(/<[^>]*>?/gm, '').slice(0, 150)}...`} />
      </Helmet>

      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-100 py-3">
        <div className="container mx-auto px-4 text-xs text-slate-500 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-700">Inicio</Link>
          <ChevronRight size={12} />
          {mainCategory && (
            <>
              <Link href={`/${mainCategory.slug}/`} className="hover:text-blue-700 capitalize">
                {mainCategory.name}
              </Link>
              <ChevronRight size={12} />
            </>
          )}
          <span className="font-bold text-slate-900 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Columna Izquierda: Galería */}
          <div className="space-y-4">
            <div className="aspect-square bg-white border border-slate-100 rounded-sm overflow-hidden relative group">
              {currentImage ? (
                <img 
                  src={currentImage} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 font-bold">
                  SIN IMAGEN
                </div>
              )}
            </div>
            
            {/* Miniaturas */}
            {gallery.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {/* Imagen principal como primera miniatura */}
                {mainImage && (
                  <button 
                    onClick={() => setActiveImage(mainImage)}
                    className={`w-20 h-20 border rounded-sm overflow-hidden flex-shrink-0 ${activeImage === mainImage || (!activeImage && currentImage === mainImage) ? 'border-blue-700 ring-1 ring-blue-700' : 'border-slate-200 hover:border-slate-400'}`}
                  >
                    <img src={mainImage} alt="Principal" className="w-full h-full object-cover" />
                  </button>
                )}
                {/* Resto de galería */}
                {gallery.map((img: any, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img.sourceUrl)}
                    className={`w-20 h-20 border rounded-sm overflow-hidden flex-shrink-0 ${activeImage === img.sourceUrl ? 'border-blue-700 ring-1 ring-blue-700' : 'border-slate-200 hover:border-slate-400'}`}
                  >
                    <img src={img.sourceUrl} alt={img.altText || `Galería ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Info Producto */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-2xl font-bold text-blue-700">
                {displayPrice ? `Desde ${displayPrice}` : "Consultar Precio"}
              </div>
              {product.stockStatus === 'IN_STOCK' && (
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <Check size={12} /> DISPONIBLE
                </span>
              )}
            </div>

            <div className="prose prose-slate prose-sm mb-8 text-slate-600" dangerouslySetInnerHTML={{ __html: product.shortDescription || '' }} />

            {/* Bloque de Acción (Lead Magnet) */}
            <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 mb-8">
              <h3 className="font-bold text-slate-900 mb-4">Solicitar Presupuesto Personalizado</h3>
              <p className="text-sm text-slate-600 mb-6">
                Te enviamos presupuesto en menos de 2 horas. Incluye boceto digital gratuito con tu logo.
              </p>
              
              <div className="space-y-3">
                <Link href="/presupuesto-rapido">
                  <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-6 text-lg shadow-md">
                    PEDIR PRESUPUESTO AHORA
                  </Button>
                </Link>
                
                <div className="grid grid-cols-2 gap-3">
                  <a href={`https://wa.me/${siteConfig.whatsappNumber.replace("+", "")}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full border-slate-300 hover:bg-green-50 hover:text-green-700 hover:border-green-600">
                      <Phone size={16} className="mr-2" /> WhatsApp
                    </Button>
                  </a>
                  <a href={`mailto:${siteConfig.contactEmail}`}>
                    <Button variant="outline" className="w-full border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600">
                      <Mail size={16} className="mr-2" /> Email
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Ventajas Rápidas */}
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Truck size={18} className="text-blue-700 mt-0.5" />
                <span>Envío rápido a toda la península</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck size={18} className="text-blue-700 mt-0.5" />
                <span>Garantía de calidad 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción Larga / Tabs */}
        <div className="mt-16 border-t border-slate-100 pt-12">
          <h2 className="text-2xl font-bold mb-6">Descripción Detallada</h2>
          <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '<p>Sin descripción detallada disponible.</p>' }} />
        </div>
      </div>
    </>
  );
}
