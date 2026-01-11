import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useProductPricing } from '../../hooks/useProductPricing';
import { Product } from '../../../../shared/types';
import { Skeleton } from '@/components/ui/skeleton';
import { QuoteRequestModal } from './QuoteRequestModal';
import { getAllPrintingMethods } from '../../data/pricing/printing-methods';
import { getAvailablePrintingMethods } from '../../services/pricingService';
import type { PrintingMethodId } from '../../types/printing';
import { CollapsibleSection } from '../CollapsibleSection';

// Lazy load components for better initial render performance
const ColorSelector = lazy(() => import('./ColorSelector'));
const SizeQuantityTable = lazy(() => import('./SizeQuantityTable'));
const PrintingMethodSelector = lazy(() => import('./PrintingMethodSelector'));
const ZoneSelector = lazy(() => import('./ZoneSelector'));
const PriceCalculator = lazy(() => import('./PriceCalculator'));

interface ProductPricingFlowProps {
  product: Product;
  onRequestQuote?: (data: any) => void;
  onColorChange?: (colorName: string, colorImage?: string) => void;
}

const ProductPricingFlow: React.FC<ProductPricingFlowProps> = React.memo(({ product, onRequestQuote, onColorChange }) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedPrintingMethod, setSelectedPrintingMethod] = useState<PrintingMethodId>('DTF');
  const [firstZoneInitialized, setFirstZoneInitialized] = useState(false);

  // Obtener categoría del producto
  const categorySlug = (product as any).categories?.nodes?.[0]?.slug || 'default';
  
  // Obtener métodos de impresión disponibles para esta categoría
  const availablePrintingMethods = getAvailablePrintingMethods(categorySlug);
  
  // Obtener todos los métodos (activos e inactivos) para mostrar opciones futuras
  const allPrintingMethods = getAllPrintingMethods().map(m => m.id) as PrintingMethodId[];

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
    pricingCategory: categorySlug // Dinámico desde categoría del producto
  });

  // Inicializar primera zona cuando hay cantidad y método no es "Sin Impresión"
  useEffect(() => {
    if (hasSelectedColor && totalQuantity > 0 && pricingData && !firstZoneInitialized) {
      // Si el método es "Sin Impresión", no activar zonas
      if (selectedPrintingMethod === 'SIN_IMPRESION') {
        if (selectedZones.length > 0) {
          // Limpiar zonas si el método es Sin Impresión
          selectedZones.forEach(zone => toggleZone(zone));
        }
      } else {
        // Para DTF y Serigrafía, activar primera zona si no hay ninguna seleccionada
        const availableZones = pricingData.zonas_permitidas || ['frontal', 'espalda', 'mangas'];
        if (availableZones.length > 0 && selectedZones.length === 0) {
          toggleZone(availableZones[0]);
        }
      }
      setFirstZoneInitialized(true);
    }
  }, [hasSelectedColor, totalQuantity, pricingData, firstZoneInitialized, selectedPrintingMethod]);

  // Resetear zonas cuando cambia el método a "Sin Impresión"
  useEffect(() => {
    if (selectedPrintingMethod === 'SIN_IMPRESION' && selectedZones.length > 0) {
      selectedZones.forEach(zone => toggleZone(zone));
    } else if (selectedPrintingMethod !== 'SIN_IMPRESION' && selectedZones.length === 0 && hasSelectedColor && totalQuantity > 0 && pricingData) {
      // Si vuelves a DTF/Serigrafía desde Sin Impresión, reactiva primera zona
      const availableZones = pricingData.zonas_permitidas || ['frontal', 'espalda', 'mangas'];
      if (availableZones.length > 0) {
        toggleZone(availableZones[0]);
      }
    }
  }, [selectedPrintingMethod]);

  return (
    <div className="space-y-8">
      {/* 1. Selector de Color */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
          <ColorSelector
            availableColors={availableColors}
            selectedColor={selectedColor}
            onColorSelect={(colorName) => {
              selectColor(colorName);
              // Encontrar la imagen del color seleccionado
              const selectedColorObj = availableColors.find(c => c.name === colorName);
              if (onColorChange && selectedColorObj) {
                onColorChange(colorName, selectedColorObj.image);
              }
            }}
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

      {/* 3. Selector de Método de Impresión (Colapsable) */}
      {hasSelectedColor && totalQuantity > 0 && availablePrintingMethods.length > 0 && (
        <CollapsibleSection title="Ajustes de impresión" defaultOpen={true}>
          <Suspense fallback={<Skeleton className="h-20 w-full rounded-xl" />}>
            <PrintingMethodSelector
              activeMethods={availablePrintingMethods}
              selectedMethod={selectedPrintingMethod}
              onMethodChange={setSelectedPrintingMethod}
              showInactiveMethods={true}
              availableMethods={allPrintingMethods}
            />
          </Suspense>
        </CollapsibleSection>
      )}

      {/* 4. Selector de Zonas de Personalización */}
      {hasSelectedColor && totalQuantity > 0 && pricingData && (
        <CollapsibleSection title="Ajustes de impresión" defaultOpen={true}>
          <Suspense fallback={<Skeleton className="h-40 w-full rounded-xl" />}>
            <ZoneSelector
              availableZones={(
                pricingData.zonas_permitidas || ['frontal', 'espalda']
              ).map(zoneId => {
                const zoneLabels: Record<string, string> = {
                  'frontal': 'Frontal',
                  'espalda': 'Espalda',
                  'manga_izquierda': 'Manga Izq.',
                  'manga_derecha': 'Manga Der.'
                };
                return {
                  id: zoneId,
                  name: zoneId,
                  label: zoneLabels[zoneId] || zoneId,
                  cost: pricingData.coste_personalizacion[zoneId] || 0
                };
              })}
              selectedZones={selectedZones}
              onZoneChange={toggleZone}
              disabled={!hasSelectedColor}
            />
          </Suspense>
        </CollapsibleSection>
      )}

      {/* 5. Calculadora de Precios */}
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
              quantities={quantities}
              selectedZones={selectedZones}
              selectedPrintingMethod={selectedPrintingMethod}
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
