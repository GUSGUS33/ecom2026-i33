import React, { Suspense, lazy, useState } from 'react';
import { useProductPricing } from '../../hooks/useProductPricing';
import { Product } from '../../../../shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { QuoteRequestModal } from './QuoteRequestModal';

// Lazy load components for better initial render performance
const ColorSelector = lazy(() => import('./ColorSelector'));
const SizeQuantityTable = lazy(() => import('./SizeQuantityTable'));
const ZoneSelector = lazy(() => import('./ZoneSelector'));
const PriceCalculator = lazy(() => import('./PriceCalculator'));

interface ProductPricingFlowProps {
  product: Product;
  onRequestQuote?: (data: any) => void;
}

const ProductPricingFlow: React.FC<ProductPricingFlowProps> = React.memo(({ product, onRequestQuote }) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const {
    // Datos
    availableColors,
    sizeOptions,
    pricingData,
    
    // Estado
    selectedColor,
    quantities,
    selectedZones,
    priceCalculation,
    
    // Derivados
    hasSelectedColor,
    canEnterQuantities,
    isReadyForPricing,
    isValid,
    totalQuantity,
    colorVariations, // Necesario para el modal
    
    // Acciones
    selectColor,
    updateQuantity,
    toggleZone
  } = useProductPricing({ 
    product,
    basePrice: product.price ? parseFloat(product.price.replace(/[^0-9.,]/g, '').replace(',', '.')) : 0,
    pricingCategory: 'camisetas' // Esto debería venir dinámicamente del producto
  });

  return (
    <div className="space-y-8">
      {/* 1. Selector de Color */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
          <ColorSelector
            availableColors={availableColors}
            selectedColor={selectedColor}
            onColorSelect={selectColor}
          />
        </Suspense>
        
        {!hasSelectedColor && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-blue-800 font-medium text-sm">
                Selecciona un color para comenzar
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Verás las tallas disponibles y el stock en tiempo real para el color elegido.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Tabla de Cantidades por Talla */}
      {canEnterQuantities && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <Suspense fallback={<Skeleton className="h-60 w-full rounded-xl" />}>
            <SizeQuantityTable
              sizeOptions={sizeOptions}
              quantities={quantities}
              onQuantityChange={updateQuantity}
              disabled={!hasSelectedColor}
              title="Selecciona Tallas y Cantidades"
            />
          </Suspense>
          
          {totalQuantity > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-green-800 text-sm font-medium">
                  Has seleccionado <span className="font-bold">{totalQuantity}</span> unidades en total
                </p>
              </div>
              {pricingData?.cantidad_minima && totalQuantity < pricingData.cantidad_minima && (
                <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded border border-amber-100">
                  Mínimo recomendado: {pricingData.cantidad_minima} uds.
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. Selector de Zonas de Personalización */}
      {hasSelectedColor && totalQuantity > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
          <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
            <ZoneSelector
              availableZones={[
                { id: 'frontal', name: 'frontal', label: 'Frontal', cost: pricingData?.coste_personalizacion?.frontal || 0.80 },
                { id: 'espalda', name: 'espalda', label: 'Espalda', cost: pricingData?.coste_personalizacion?.espalda || 0.80 },
                { id: 'manga_izquierda', name: 'manga_izquierda', label: 'Manga Izq.', cost: pricingData?.coste_personalizacion?.manga_izquierda || 0.50 },
                { id: 'manga_derecha', name: 'manga_derecha', label: 'Manga Der.', cost: pricingData?.coste_personalizacion?.manga_derecha || 0.50 }
              ]}
              selectedZones={selectedZones}
              onZoneChange={toggleZone}
              disabled={!hasSelectedColor}
            />
          </Suspense>
        </div>
      )}

      {/* 4. Calculadora de Precios */}
      {isReadyForPricing && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner animate-in fade-in slide-in-from-top-4 duration-500 delay-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            💰 Presupuesto Estimado
          </h3>
          <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
            <PriceCalculator
              priceCalculation={priceCalculation}
              selectedColor={selectedColor}
              isValid={isValid}
              onRequestQuote={() => {
                setIsQuoteModalOpen(true);
                if (onRequestQuote) {
                  onRequestQuote({
                    productId: product.id,
                    selectedColor,
                    quantities,
                    selectedZones,
                    priceCalculation,
                    totalQuantity
                  });
                }
              }}
            />
          </Suspense>
        </div>
      )}

      {/* Modal de Solicitud de Presupuesto */}
      {priceCalculation && (
        <QuoteRequestModal
          isOpen={isQuoteModalOpen}
          onClose={() => setIsQuoteModalOpen(false)}
          product={product}
          selectedColor={selectedColor}
          selectedColorVariations={colorVariations}
          quantities={quantities}
          priceCalculation={priceCalculation}
          selectedZones={selectedZones}
        />
      )}
    </div>
  );
});

export default ProductPricingFlow;
