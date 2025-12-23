import { useState, useEffect, useMemo } from 'react';
import { usePriceCalculation } from './usePriceCalculation';
import { usePricingData } from './usePricing';
import { Product } from '../../../shared/types';

interface UseProductPricingProps {
  product: Product;
  basePrice?: number;
  pricingCategory?: string;
}

export const useProductPricing = ({ 
  product, 
  basePrice = 0, 
  pricingCategory = 'camisetas' 
}: UseProductPricingProps) => {
  // --- ESTADOS DEL FLUJO ---
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  
  // --- DATOS DE PRICING ---
  const { pricingData, loading: loadingData, error: pricingError } = usePricingData(pricingCategory);

  // --- DERIVADOS DEL PRODUCTO ---
  
  // 1. Agrupar variaciones por color
  const variationsByColor = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    if (product?.variations?.nodes) {
      product.variations.nodes.forEach(variation => {
        // Buscar atributo color
        const colorAttr = variation.attributes?.nodes.find(
          (a: any) => a.name === 'pa_color'
        );
        
        if (colorAttr) {
          const colorName = colorAttr.value;
          if (!grouped[colorName]) grouped[colorName] = [];
          grouped[colorName].push(variation);
        }
      });
    }
    
    return grouped;
  }, [product]);

  // 2. Obtener lista de colores disponibles para el selector
  const availableColors = useMemo(() => {
    // Si hay variaciones agrupadas, usarlas
    const colorsFromVariations = Object.keys(variationsByColor);
    
    if (colorsFromVariations.length > 0) {
      return colorsFromVariations.map(colorName => {
        const variations = variationsByColor[colorName];
        // Usar imagen de la primera variación de este color
        const image = variations[0]?.image?.sourceUrl;
        
        // Calcular stock total de este color
        // Si stockQuantity es null pero status es IN_STOCK, asumimos stock infinito (9999)
        const totalStock = variations.reduce((sum, v) => {
          if (v.stockStatus === 'IN_STOCK' && v.stockQuantity === null) return sum + 9999;
          return sum + (v.stockQuantity || 0);
        }, 0);
        
        const isOutOfStock = variations.every(v => v.stockStatus === 'OUT_OF_STOCK' || (v.stockQuantity !== null && v.stockQuantity <= 0));
        
        return {
          id: colorName, // Usar nombre como ID por simplicidad
          name: colorName,
          value: colorName,
          image,
          stockStatus: (isOutOfStock ? 'OUT_OF_STOCK' : 'IN_STOCK') as "OUT_OF_STOCK" | "IN_STOCK" | "ON_BACKORDER",
          stockQuantity: totalStock
        };
      });
    }
    
    // Fallback a atributos globales si no hay variaciones cargadas (caso raro en variable products)
    const colorAttribute = product?.attributes?.nodes.find(a => a.name === 'pa_color');
    if (colorAttribute) {
      return colorAttribute.options.map(opt => ({
        id: opt,
        name: opt,
        value: opt,
        stockStatus: 'IN_STOCK' as "OUT_OF_STOCK" | "IN_STOCK" | "ON_BACKORDER",
        stockQuantity: 999
      }));
    }
    
    return [];
  }, [variationsByColor, product]);

  // 3. Obtener variaciones (tallas) del color seleccionado
  const colorVariations = useMemo(() => {
    if (!selectedColor || !variationsByColor[selectedColor]) return [];
    return variationsByColor[selectedColor];
  }, [selectedColor, variationsByColor]);

  // 4. Preparar opciones de talla para la tabla
  const sizeOptions = useMemo(() => {
    return colorVariations.map(v => {
      const sizeAttr = v.attributes?.nodes.find(
        (a: any) => a.name === 'pa_size' || a.name === 'pa_talla'
      );
      
      // Si stock es null pero está IN_STOCK, poner un número alto
      const effectiveStock = (v.stockStatus === 'IN_STOCK' && v.stockQuantity === null) 
        ? 9999 
        : (v.stockQuantity || 0);

      return {
        size: sizeAttr?.value || 'Única',
        stockStatus: v.stockStatus,
        stockQuantity: effectiveStock,
        price: v.price ? parseFloat(v.price.replace(/[^0-9.,]/g, '').replace(',', '.')) : basePrice,
        variationId: v.id
      };
    });
  }, [colorVariations, basePrice]);

  // --- LÓGICA DE CÁLCULO ---
  
  // Calcular cantidad total
  const totalQuantity = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  // Hook de cálculo de precios
  const { priceCalculation, isValid } = usePriceCalculation({
    regularPrice: basePrice, // Precio base (se podría refinar con precio promedio de variaciones)
    categoryId: pricingCategory,
    selectedColor,
    sizeOptions,
    quantities: quantities,
    selectedZones: selectedZones
  });

  // --- ACCIONES ---

  const selectColor = (color: string) => {
    if (color !== selectedColor) {
      setSelectedColor(color);
      setQuantities({}); // Resetear cantidades al cambiar color
      // Opcional: Resetear zonas o mantenerlas
    }
  };

  const updateQuantity = (size: string, quantity: number) => {
    // Validar contra stock disponible
    const sizeOption = sizeOptions.find(s => s.size === size);
    if (sizeOption) {
      // Si stockQuantity es null (o muy alto por nuestra lógica anterior), permitimos la cantidad
      const maxStock = sizeOption.stockQuantity; 
      const validQuantity = Math.max(0, Math.min(quantity, maxStock));
      
      setQuantities(prev => ({
        ...prev,
        [size]: validQuantity
      }));
    }
  };

  const toggleZone = (zoneId: string) => {
    setSelectedZones(prev => {
      if (prev.includes(zoneId)) {
        return prev.filter(z => z !== zoneId);
      } else {
        return [...prev, zoneId];
      }
    });
  };

  // --- ESTADO DEL FLUJO ---
  const hasSelectedColor = !!selectedColor;
  const canEnterQuantities = hasSelectedColor && sizeOptions.length > 0;
  const isReadyForPricing = hasSelectedColor && totalQuantity > 0;

  return {
    // Datos
    pricingData,
    availableColors,
    colorVariations,
    sizeOptions,
    
    // Estado
    selectedColor,
    quantities,
    selectedZones,
    priceCalculation,
    
    // Derivados
    totalQuantity,
    hasSelectedColor,
    canEnterQuantities,
    isReadyForPricing,
    isValid,
    loadingData,
    pricingError,
    
    // Acciones
    selectColor,
    updateQuantity,
    toggleZone
  };
};
