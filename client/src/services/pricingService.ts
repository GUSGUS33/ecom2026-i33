import type { PricingData, PriceCalculation } from '../types/pricing';
import defaultPricing from '../data/pricing/_default.json';

// Cache en memoria para evitar recargas innecesarias
const pricingCache = new Map<string, PricingData>();

// Valores hardcoded de emergencia por si falla todo lo demás
const EMERGENCY_PRICING: PricingData = {
  categoria: "Emergency",
  cantidad_minima: 10,
  factores_escalado: { "1": 1.0 },
  coste_personalizacion: { "frontal": 0.5 },
  zonas_permitidas: ["frontal"],
  notas: "Emergency Fallback"
};

/**
 * Cargar datos de pricing con sistema de cache y fallback
 */
export const loadPricingData = async (categoryId: string): Promise<PricingData> => {
  // Nivel 1: Cache en memoria
  if (pricingCache.has(categoryId)) {
    return pricingCache.get(categoryId)!;
  }

  try {
    // Normalizar ID de categoría para buscar el archivo
    const normalizedId = categoryId.toLowerCase().replace(/\s+/g, '-');
    
    // Nivel 2: Intentar cargar JSON específico
    // Nota: En Vite/Webpack, las importaciones dinámicas de JSON deben manejarse con cuidado.
    // Usamos import() dinámico que Vite resolverá.
    const module = await import(`../data/pricing/${normalizedId}.json`);
    const data = module.default as PricingData;
    
    pricingCache.set(categoryId, data);
    return data;
  } catch (error) {
    console.warn(`Pricing data not found for category "${categoryId}", using default fallback.`);
    
    // Nivel 3: Fallback a _default.json
    // Ya importado estáticamente arriba para asegurar disponibilidad
    const fallbackData = defaultPricing as unknown as PricingData;
    
    // Guardamos en cache el fallback para esta categoría también
    pricingCache.set(categoryId, fallbackData);
    return fallbackData;
  }
};

/**
 * Calcular multiplicador de escalado según cantidad
 */
export const getEscaladoMultiplier = (cantidad: number, escalados: Record<string, number>): number => {
  const tramos = Object.keys(escalados)
    .map(Number)
    .sort((a, b) => a - b); // Ordenar ascendente: 25, 50, 100...

  // Encontrar el tramo más alto que sea menor o igual a la cantidad
  // Ej: cantidad 75 -> tramo 50
  let tramoAplicable = tramos[0];
  
  for (const tramo of tramos) {
    if (cantidad >= tramo) {
      tramoAplicable = tramo;
    } else {
      break; // Ya nos pasamos, nos quedamos con el anterior
    }
  }

  return escalados[tramoAplicable.toString()] || 1.0;
};

/**
 * Calcular precio final con escalado y personalización
 */
export const calculateScaledPrice = (
  regularPrice: number,
  cantidad: number,
  zonasSeleccionadas: string[],
  pricingData: PricingData
): PriceCalculation => {
  // 1. Precio base real: regularPrice / 2 (Según fórmula del proyecto)
  const precioUnitarioBase = regularPrice / 2;

  // 2. Costo de personalización: sumar zonas seleccionadas
  const precioPersonalizacion = zonasSeleccionadas.reduce((total, zona) => {
    return total + (pricingData.coste_personalizacion[zona] || 0);
  }, 0);

  // 3. Coste base total
  const costeBaseTotal = precioUnitarioBase + precioPersonalizacion;

  // 4. Obtener multiplicador de escalado
  const escalado = getEscaladoMultiplier(cantidad, pricingData.factores_escalado);

  // 5. Aplicar escalado al TOTAL
  const precioUnitarioFinal = costeBaseTotal * escalado;

  // 6. Precios totales
  const precioTotalSinIVA = precioUnitarioFinal * cantidad;
  const precioTotalConIVA = precioTotalSinIVA * 1.21; // IVA 21%

  return {
    precioUnitarioBase,
    precioPersonalizacion,
    precioUnitarioFinal,
    precioTotalSinIVA,
    precioTotalConIVA,
    cantidadTotal: cantidad,
    cantidadMinima: pricingData.cantidad_minima,
    cumpleCantidadMinima: cantidad >= pricingData.cantidad_minima,
    escalado,
    zonasSeleccionadas
  };
};

/**
 * Calcular precio "desde" para mostrar en listas (basado en cantidad óptima/máxima)
 */
export const calculateFromPrice = async (regularPrice: number, categoryId: string = 'general'): Promise<string> => {
  const data = await loadPricingData(categoryId);
  
  // Asumimos una cantidad alta para mostrar el precio más bajo posible ("Desde...")
  // Usamos el tramo más alto disponible
  const tramos = Object.keys(data.factores_escalado).map(Number);
  const maxCantidad = Math.max(...tramos);
  
  const calculo = calculateScaledPrice(regularPrice, maxCantidad, [], data);
  return formatEuroPrice(calculo.precioUnitarioFinal);
};

/**
 * Formatear precio en euros
 */
export const formatEuroPrice = (price: number): string => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Limpiar cache (útil para desarrollo)
 */
export const clearPricingCache = (): void => {
  pricingCache.clear();
};
