import { calculateScaledPrice, getEscaladoMultiplier } from './pricingService';
import type { PricingData } from '../types/pricing';

// Mock data
const mockPricingData: PricingData = {
  categoria: "Test",
  cantidad_minima: 10,
  factores_escalado: {
    "10": 5.0,
    "100": 2.0,
    "1000": 1.0
  },
  coste_personalizacion: {
    "frontal": 0.5,
    "espalda": 0.5
  },
  zonas_permitidas: ["frontal", "espalda"],
  notas: "Test"
};

// Test runner simple
const runTests = () => {
  console.log("Running Pricing Service Tests...");
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  };

  // Test 1: Multiplicador de escalado
  const m1 = getEscaladoMultiplier(10, mockPricingData.factores_escalado);
  assert(m1 === 5.0, `Multiplicador para 10 debe ser 5.0 (Obtenido: ${m1})`);

  const m2 = getEscaladoMultiplier(50, mockPricingData.factores_escalado);
  assert(m2 === 5.0, `Multiplicador para 50 debe ser 5.0 (Obtenido: ${m2})`);

  const m3 = getEscaladoMultiplier(100, mockPricingData.factores_escalado);
  assert(m3 === 2.0, `Multiplicador para 100 debe ser 2.0 (Obtenido: ${m3})`);

  // Test 2: Cálculo de precio
  // Regular Price: 10 -> Base: 5
  // Personalización: Frontal (0.5) -> Total Base: 5.5
  // Cantidad: 100 -> Escalado: 2.0
  // Final Unitario: 5.5 * 2.0 = 11.0
  const calc = calculateScaledPrice(10, 100, ["frontal"], mockPricingData);
  
  assert(calc.precioUnitarioBase === 5, `Precio base debe ser 5 (Obtenido: ${calc.precioUnitarioBase})`);
  assert(calc.precioPersonalizacion === 0.5, `Precio personalización debe ser 0.5 (Obtenido: ${calc.precioPersonalizacion})`);
  assert(calc.escalado === 2.0, `Escalado aplicado debe ser 2.0 (Obtenido: ${calc.escalado})`);
  assert(calc.precioUnitarioFinal === 11.0, `Precio final unitario debe ser 11.0 (Obtenido: ${calc.precioUnitarioFinal})`);
  assert(calc.precioTotalSinIVA === 1100, `Total sin IVA debe ser 1100 (Obtenido: ${calc.precioTotalSinIVA})`);

  console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
};

// Ejecutar si se llama directamente (en un entorno de node real requeriría configuración, 
// pero esto sirve como documentación ejecutable o para vitest)
if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  
  test('getEscaladoMultiplier returns correct factor', () => {
    expect(getEscaladoMultiplier(10, mockPricingData.factores_escalado)).toBe(5.0);
    expect(getEscaladoMultiplier(50, mockPricingData.factores_escalado)).toBe(5.0);
    expect(getEscaladoMultiplier(100, mockPricingData.factores_escalado)).toBe(2.0);
  });

  test('calculateScaledPrice computes correctly', () => {
    const result = calculateScaledPrice(10, 100, ["frontal"], mockPricingData);
    expect(result.precioUnitarioFinal).toBe(11.0);
    expect(result.precioTotalSinIVA).toBe(1100);
  });
}

export { runTests };
