import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@apollo/client';
import { Helmet } from 'react-helmet-async';
import { GET_FULL_VARIABLE_PRODUCT } from '../lib/queries';
import { Product, ProductVariation } from '../../../shared/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Home, FileText, Mail, Check } from 'lucide-react';
import { formatPrice, getAttributeLabel } from '@/lib/utils';

export default function ProductPage() {
  const [, params] = useRoute('/producto/:slug');
  const slug = params?.slug;

  const { data, loading, error } = useQuery(GET_FULL_VARIABLE_PRODUCT, {
    variables: { slug },
    skip: !slug,
  });

  const product = data?.product as Product;
  
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [mainImage, setMainImage] = useState<string>('');

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedAttributes({});
      setSelectedVariation(null);
      setMainImage(product.featuredImage?.node?.sourceUrl || product.galleryImages?.nodes[0]?.sourceUrl || '/placeholder-image.jpg');
    }
  }, [product]);

  // Handle attribute selection
  const handleAttributeSelect = (attributeName: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeName]: value };
    setSelectedAttributes(newAttributes);

    // Si el atributo seleccionado es color, intentar actualizar la imagen inmediatamente
    // buscando cualquier variación que tenga este color, aunque no coincida con otros atributos
    if (attributeName === 'pa_color' && product?.variations?.nodes) {
      const variationWithColor = product.variations.nodes.find(v => 
        v.attributes.nodes.some(a => a.name === 'pa_color' && a.value === value) &&
        v.image?.sourceUrl
      );
      
      if (variationWithColor?.image?.sourceUrl) {
        setMainImage(variationWithColor.image.sourceUrl);
      }
    }

    // Find matching variation (exact match for all selected attributes)
    if (product?.variations?.nodes) {
      const variation = product.variations.nodes.find(v => {
        // Check if variation matches ALL currently selected attributes
        return Object.entries(newAttributes).every(([name, val]) => {
          const variationAttr = v.attributes.nodes.find(a => a.name === name);
          // If variation doesn't have this attribute, it might be 'any' or global, 
          // but for strict matching we usually expect it to be present or we ignore it if it's not defining.
          // In WooCommerce GraphQL, variations usually return specific attributes.
          return !variationAttr || variationAttr.value === val;
        }) && v.attributes.nodes.every(attr => {
          // Also check reverse: variation attributes must match selection if selected
          return !newAttributes[attr.name] || newAttributes[attr.name] === attr.value;
        });
      });

      if (variation) {
        setSelectedVariation(variation);
        // Solo actualizar imagen desde variación exacta si NO acabamos de actualizarla por color
        // o si la variación exacta tiene una imagen específica diferente (aunque usualmente es la misma del color)
        if (variation.image?.sourceUrl && attributeName !== 'pa_color') {
          setMainImage(variation.image.sourceUrl);
        }
      } else {
        // If we have all attributes selected but no match, it might be an invalid combination
        const allSelected = product.attributes.nodes.every(attr => newAttributes[attr.name]);
        if (allSelected) {
          setSelectedVariation(null);
        }
      }
    }
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

  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const isOutOfStock = selectedVariation 
    ? selectedVariation.stockStatus === 'OUT_OF_STOCK' 
    : product.stockStatus === 'OUT_OF_STOCK';

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

        <div className="container mx-auto px-4">
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
                    {formatPrice(currentPrice)}
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

              {/* Attributes Selection */}
              {product.attributes?.nodes.length > 0 && (
                <div className="space-y-6 border-t border-b border-slate-100 py-6 bg-slate-50/50 rounded-xl px-6">
                  {product.attributes.nodes.map(attr => (
                    <div key={attr.id}>
                      <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">{getAttributeLabel(attr.name)}</h3>
                      <div className="flex flex-wrap gap-2">
                        {attr.name === 'pa_color' ? (
                          // Selector visual para colores
                          attr.options.map(option => {
                            // Intentar encontrar una variación que tenga este color para usar su imagen
                            const variationWithColor = product.variations?.nodes.find(v => 
                              v.attributes?.nodes?.some(a => a.name === 'pa_color' && a.value === option) &&
                              v.image?.sourceUrl
                            );
                            const imageUrl = variationWithColor?.image?.sourceUrl;

                            return (
                              <button
                                key={option}
                                onClick={() => handleAttributeSelect(attr.name, option)}
                                className={`relative w-12 h-12 rounded-full border-2 transition-all overflow-hidden ${
                                  selectedAttributes[attr.name] === option
                                    ? 'border-blue-600 ring-2 ring-blue-200 scale-110'
                                    : 'border-slate-200 hover:border-blue-400'
                                }`}
                                title={option}
                              >
                                {imageUrl ? (
                                  <img 
                                    src={imageUrl} 
                                    alt={option} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="flex items-center justify-center w-full h-full bg-slate-100 text-[10px] font-bold text-slate-500">
                                    {option.substring(0, 3)}
                                  </span>
                                )}
                                {selectedAttributes[attr.name] === option && (
                                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                    <Check size={16} className="text-white drop-shadow-md" />
                                  </div>
                                )}
                              </button>
                            );
                          })
                        ) : (
                          // Selector estándar para otros atributos (talla, etc.)
                          attr.options.map(option => (
                            <button
                              key={option}
                              onClick={() => handleAttributeSelect(attr.name, option)}
                              className={`px-4 py-2 text-sm rounded-lg border transition-all font-medium ${
                                selectedAttributes[attr.name] === option
                                  ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                                  : 'border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 bg-white'
                              }`}
                            >
                              {option}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                <h3 className="font-bold text-slate-900 mb-4 text-lg">Solicitar Presupuesto</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Te enviaremos una propuesta personalizada en menos de 24 horas. Sin compromiso.
                </p>
                
              <div className="flex flex-col gap-3">
                <Link href="/presupuesto-rapido">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-bold rounded-lg shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                    disabled={isOutOfStock || (product.attributes?.nodes.length > 0 && !selectedVariation)}
                  >
                    <FileText size={20} />
                    {isOutOfStock ? 'Agotado' : 'PEDIR PRESUPUESTO ONLINE'}
                  </Button>
                </Link>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button asChild variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50 h-12 font-bold rounded-lg flex items-center justify-center gap-2">
                    <a href="https://wa.me/34690906027" target="_blank" rel="noopener noreferrer">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                      WHATSAPP
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-slate-300 text-slate-600 hover:bg-slate-50 h-12 font-bold rounded-lg flex items-center justify-center gap-2">
                    <a href="mailto:info@impacto33.com">
                      <Mail size={20} />
                      EMAIL
                    </a>
                  </Button>
                </div>
              </div>
              </div>

              {/* Full Description */}
              <div className="pt-6 border-t border-slate-200">
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
