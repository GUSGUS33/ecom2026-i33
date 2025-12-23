import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useProduct } from '../hooks/useProduct';
import { Helmet } from 'react-helmet-async';

import { Product, ProductVariation } from '../../../shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Home, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Pricing Components
import ProductPricingFlow from '@/components/pricing/ProductPricingFlow';

export default function ProductPage() {
  const [, params] = useRoute('/producto/:slug');
  const slug = params?.slug;

  const { product, loading, error } = useProduct(slug || '');
  
  const [mainImage, setMainImage] = useState<string>('');

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setMainImage(product.featuredImage?.node?.sourceUrl || product.galleryImages?.nodes[0]?.sourceUrl || '/placeholder-image.jpg');
    }
  }, [product]);

  // Manejar solicitud de presupuesto
  const handleRequestQuote = (quoteData: any) => {
    console.log("Solicitud de presupuesto:", quoteData);
    // Aquí redirigiríamos a la página de checkout/presupuesto con los datos
    // El modal se abre internamente en ProductPricingFlow
    // window.location.href = '/presupuesto-rapido';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <p className="mb-8">Lo sentimos, no hemos podido cargar el producto que buscas.</p>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stockStatus === 'OUT_OF_STOCK';

  return (
    <>
      <Helmet>
        <title>{`${product.name} | IMPACTO33`}</title>
        <meta name="description" content={product.shortDescription?.replace(/<[^>]*>/g, '').slice(0, 160) || `Compra ${product.name} personalizado en IMPACTO33.`} />
        <link rel="canonical" href={`https://impacto33.com/producto/${product.slug}`} />
        <meta property="og:title" content={`${product.name} | IMPACTO33`} />
        <meta property="og:description" content={product.shortDescription?.replace(/<[^>]*>/g, '').slice(0, 160) || `Compra ${product.name} personalizado en IMPACTO33.`} />
        <meta property="og:image" content={mainImage} />
        <meta property="og:url" content={`https://impacto33.com/producto/${product.slug}`} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="bg-white min-h-screen pb-20">
        {/* Breadcrumbs */}
        <div className="bg-slate-50 border-b border-slate-200 mb-8">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-slate-500">
              <Link href="/">
                <span className="flex items-center hover:text-blue-600 transition-colors cursor-pointer">
                  <Home size={16} className="mr-1" />
                  Inicio
                </span>
              </Link>
              <ChevronRight size={16} className="mx-2 text-slate-300" />
              <span className="font-semibold text-slate-900 truncate max-w-[200px]">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative">
                {product.onSale && (
                  <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 z-10">Oferta</Badge>
                )}
                <img 
                  src={mainImage || '/placeholder-image.jpg'} 
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              {product.galleryImages?.nodes.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {product.galleryImages.nodes.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setMainImage(img.sourceUrl)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${mainImage === img.sourceUrl ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <img src={img.sourceUrl} alt={img.altText || product.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-8">
              <div>
                <h1 className="text-[32px] font-bold text-[#48475c] mb-4 font-['Montserrat'] leading-tight first-letter:uppercase lowercase">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPrice(product.price)}
                  </div>
                  
                  {isOutOfStock ? (
                    <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 px-3 py-1">Agotado</Badge>
                  ) : (
                    <span className="text-green-600 flex items-center text-sm font-medium bg-green-50 px-3 py-1 rounded-full border border-green-100">
                      <Check size={16} className="mr-1" /> Stock disponible
                    </span>
                  )}
                </div>

                <div 
                  className="prose prose-slate text-slate-600 mb-8"
                  dangerouslySetInnerHTML={{ __html: product.shortDescription }} 
                />
              </div>

              {/* --- NEW PRICING FLOW INTEGRATION --- */}
              <ProductPricingFlow 
                product={product}
                onRequestQuote={handleRequestQuote}
              />
              {/* ------------------------------------ */}

              {/* Full Description */}
              <div className="pt-6 border-t border-slate-200 mt-8">
                <h3 className="text-lg font-bold mb-4 text-slate-900">Descripción detallada</h3>
                <div 
                  className="prose prose-slate max-w-none text-slate-600"
                  dangerouslySetInnerHTML={{ __html: product.description }} 
                />
              </div>
            </div>
          </div>

          {/* Related Products */}
          {product.related?.nodes.length > 0 && (
            <div className="mt-20 border-t border-slate-200 pt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">También te podría interesar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {product.related.nodes.map((relatedProduct) => (
                  <Link key={relatedProduct.id} href={`/producto/${relatedProduct.slug}`}>
                    <div className="group block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                      <div className="aspect-square bg-slate-50 p-4 relative overflow-hidden">
                        <img 
                          src={relatedProduct.featuredImage?.node?.sourceUrl || '/placeholder-image.jpg'} 
                          alt={relatedProduct.featuredImage?.node?.altText || relatedProduct.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">Ver detalles</span>
                          <ChevronRight size={16} className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
