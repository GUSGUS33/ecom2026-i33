# 🎨 Fase 1.2: Sistema de Métodos de Impresión

**Estado:** ✅ Completado  
**Fecha:** 10 de Enero de 2026  
**Objetivo:** Implementar arquitectura multi-método de impresión con DTF activo y Serigrafía/Sin impresión en config

---

## 📋 Resumen de Cambios

### ✅ Implementado

1. **Tipos TypeScript para Printing Methods**
   - Archivo: `client/src/types/printing.ts`
   - Tipos: `PrintingMethodId`, `PrintingMethodConfig`, `PricingStrategyType`

2. **Configuración de Métodos de Impresión**
   - Archivo: `client/src/data/pricing/printing-methods.ts`
   - 3 métodos definidos:
     - ✅ **DTF** (activo)
     - ⏳ **SERIGRAFIA_1_COLOR** (inactivo, estructura preparada)
     - ⏳ **SIN_IMPRESION** (inactivo, estructura preparada)

3. **Mapeo de Categorías WooCommerce → Familias**
   - Archivo: `client/src/data/pricing/category-to-family.ts`
   - 4 familias de precios:
     - `ropa` (camisetas, polos, sudaderas, chaquetas, etc.)
     - `accesorios` (bolsas, mochilas, gorras, etc.)
     - `hogar` (tazas, botellas, decoración, etc.)
     - `papeleria` (bolígrafos, libretas, etc.)
     - `otros` (fallback)

4. **Mapeo de Categorías → Métodos Permitidos**
   - Archivo: `client/src/data/pricing/category-allowed-methods.ts`
   - Define qué métodos se pueden usar por categoría
   - Estructura preparada para activar nuevos métodos

5. **Configuración de Familias de Precios**
   - Archivo: `client/src/data/pricing/pricing-families.ts`
   - Cada familia tiene:
     - Cantidad mínima
     - Factores de escalado
     - Costes de personalización
     - Zonas permitidas

6. **Actualización de pricingService**
   - Nuevas funciones:
     - `loadPricingDataFromFamily()` - Cargar precios desde familia
     - `calculateScaledPriceFromCategory()` - Calcular desde categoría WooCommerce
     - `getAvailablePrintingMethods()` - Obtener métodos activos
   - Mantiene compatibilidad con API anterior

7. **Integración en ProductPricingFlow**
   - Selector de método de impresión visual
   - Obtiene categoría dinámicamente desde producto
   - Solo muestra DTF (métodos activos)
   - Preparado para activar nuevos métodos

8. **Tests Completos**
   - Archivo: `client/src/services/pricingService.test.ts`
   - 31 tests, todos pasando ✅
   - Cubre:
     - Mapeos de categorías
     - Métodos permitidos
     - Cálculos de precios
     - Casos edge
     - Compatibilidad con sistema anterior

---

## 🏗️ Arquitectura

### Flujo de Datos

```
Producto WooCommerce
    ↓
    ├─ Categoría: product.categories.nodes[0].slug
    ↓
CATEGORY_TO_FAMILY_MAPPING
    ↓
    └─ Familia: 'ropa', 'accesorios', 'hogar', 'papeleria', 'otros'
    ↓
PRICING_FAMILIES[familyId]
    ↓
    └─ Datos de precios (cantidad_minima, escalados, costes, zonas)
    ↓
CATEGORY_ALLOWED_METHODS[slug]
    ↓
    └─ Métodos permitidos: ['DTF', 'SERIGRAFIA_1_COLOR', 'SIN_IMPRESION']
    ↓
getAvailablePrintingMethods() → Filtrar solo activos
    ↓
    └─ En Fase 1.2: ['DTF']
    ↓
calculateScaledPrice(regularPrice, cantidad, zonas, pricingData, 'DTF')
    ↓
    └─ Resultado: PriceCalculation
```

---

## 📁 Estructura de Archivos

```
client/src/
├── types/
│   └── printing.ts                    ← Tipos base
│
├── data/pricing/
│   ├── printing-methods.ts            ← Catálogo de métodos
│   ├── category-to-family.ts          ← Mapeo Woo → Familia
│   ├── category-allowed-methods.ts    ← Mapeo Woo → Métodos
│   ├── pricing-families.ts            ← Config de familias
│   └── _default.json                  ← Fallback
│
├── services/
│   ├── pricingService.ts              ← Lógica de cálculo (actualizado)
│   └── pricingService.test.ts         ← Tests (31 tests ✅)
│
└── components/pricing/
    └── ProductPricingFlow.tsx         ← UI con selector (actualizado)
```

---

## 🎯 Cómo Funciona Ahora (Fase 1.2)

### 1. Usuario abre página de producto

```typescript
// ProductPricingFlow.tsx
const categorySlug = product.categories?.nodes?.[0]?.slug; // 't_shirts'
const availablePrintingMethods = getAvailablePrintingMethods(categorySlug); // ['DTF']
```

### 2. Se muestra selector de método (solo DTF visible)

```typescript
// En Fase 1.2, solo DTF está activo (isActive: true)
// Serigrafía 1 color y Sin impresión tienen isActive: false
```

### 3. Usuario selecciona DTF (única opción)

```typescript
const [selectedPrintingMethod, setSelectedPrintingMethod] = useState<PrintingMethodId>('DTF');
```

### 4. Se calcula precio con DTF

```typescript
const pricingData = loadPricingDataFromFamily('t_shirts'); // Familia 'ropa'
const result = calculateScaledPrice(
  regularPrice,
  cantidad,
  zonasSeleccionadas,
  pricingData,
  'DTF' // Método
);
```

### 5. Resultado es idéntico al sistema anterior

✅ **Garantizado:** DTF produce exactamente los mismos precios que antes

---

## 🔄 Cómo Activar Nuevos Métodos (Fase 2+)

### Paso 1: Definir fórmula de precios

En `printing-methods.ts`:

```typescript
SERIGRAFIA_1_COLOR: {
  id: 'SERIGRAFIA_1_COLOR',
  label: 'Serigrafía 1 color',
  description: '...',
  pricingType: 'COLOR_COUNT',
  isActive: true, // ← Cambiar a true
  notes: 'Fórmula: coste_base + (colores - 1) * coste_por_color'
}
```

### Paso 2: Implementar lógica de cálculo

En `pricingService.ts`, agregar en `calculateScaledPrice()`:

```typescript
if (printingMethod === 'SERIGRAFIA_1_COLOR') {
  // Implementar lógica específica de serigrafía
  // Por ejemplo: coste por color adicional, tramos de cantidad, etc.
}
```

### Paso 3: Agregar tests

En `pricingService.test.ts`:

```typescript
it('debería calcular precio correcto para serigrafía 1 color', () => {
  // Tests específicos para serigrafía
});
```

---

## 📊 Ejemplo de Cálculo (DTF)

### Escenario: 50 unidades, 2 zonas, familia ropa

```
Entrada:
- regularPrice (WooCommerce): 20€
- cantidad: 50
- zonas: ['frontal', 'espalda']
- pricingData: familia 'ropa'
- método: 'DTF'

Cálculo:
1. Precio base: 20 / 2 = 10€
2. Personalización: 0.45 (frontal) + 0.40 (espalda) = 0.85€
3. Total base: 10 + 0.85 = 10.85€
4. Escalado (50 unidades): 3.69
5. Precio unitario: 10.85 * 3.69 = 40.0365€
6. Total sin IVA: 40.0365 * 50 = 2001.825€
7. Total con IVA (21%): 2001.825 * 1.21 = 2422.21€

Salida:
{
  precioUnitarioBase: 10,
  precioPersonalizacion: 0.85,
  precioUnitarioFinal: 40.0365,
  precioTotalSinIVA: 2001.825,
  precioTotalConIVA: 2422.21,
  cantidadTotal: 50,
  cantidadMinima: 25,
  cumpleCantidadMinima: true,
  escalado: 3.69,
  zonasSeleccionadas: ['frontal', 'espalda']
}
```

---

## ✅ Tests Pasando

```
✓ Category to Family Mapping (6 tests)
✓ Category Allowed Methods (3 tests)
✓ Available Printing Methods (3 tests)
✓ Pricing Data from Family (5 tests)
✓ Escalado Multiplier (4 tests)
✓ Calculate Scaled Price - DTF (3 tests)
✓ Calculate Scaled Price from Category (2 tests)
✓ Printing Method Validation (2 tests)
✓ Edge Cases (3 tests)

Total: 31 tests ✅ All Passing
```

---

## 🔍 Validaciones

### ✅ DTF Idéntico al Sistema Anterior

Verificado en tests:
- Misma fórmula: `(regularPrice / 2 + personalizacion) * escalado * cantidad`
- Mismos factores de escalado
- Mismos costes de personalización
- Mismo IVA (21%)

### ✅ Categorías Mapeadas

Verificado:
- 236 categorías WooCommerce
- Mapeadas a 5 familias
- Fallback a 'otros' para desconocidas

### ✅ Métodos Permitidos

Verificado:
- Camisetas: DTF, Serigrafía, Sin impresión
- Bolsas: DTF, Sin impresión
- Tazas: DTF, Sin impresión
- Papelería: DTF, Sin impresión

### ✅ Solo DTF Visible

Verificado:
- `getAvailablePrintingMethods()` filtra por `isActive: true`
- En Fase 1.2: solo DTF tiene `isActive: true`
- Serigrafía y Sin impresión tienen `isActive: false`

---

## 🚀 Próximos Pasos (Fase 2+)

1. **Serigrafía 1 Color**
   - Definir fórmula de precios
   - Implementar cálculo por color
   - Agregar tests
   - Activar en PRINTING_METHODS

2. **Sin Impresión**
   - Definir si es `regularPrice * cantidad` o algo diferente
   - Implementar lógica
   - Agregar tests
   - Activar en PRINTING_METHODS

3. **Nuevos Métodos**
   - Bordado
   - Sublimación
   - Vinilo
   - DTF Transfer
   - etc.

4. **Recargos por Urgencia**
   - Integrar con plazos de entrega
   - Agregar multiplicadores por plazo

5. **Descuentos por Volumen**
   - Descuentos adicionales por cantidad
   - Descuentos por cliente VIP

---

## 📞 Soporte

### ¿Cómo agregar una nueva categoría?

1. Agregar slug en `CATEGORY_TO_FAMILY_MAPPING`
2. Asignar familia (ropa, accesorios, hogar, papeleria, otros)
3. Agregar métodos en `CATEGORY_ALLOWED_METHODS`

### ¿Cómo cambiar precios de una familia?

1. Editar `PRICING_FAMILIES[familyId]`
2. Cambiar `cantidad_minima`, `factores_escalado`, `coste_personalizacion`
3. Tests validarán automáticamente

### ¿Cómo activar un nuevo método?

1. Cambiar `isActive: false` a `isActive: true` en `PRINTING_METHODS`
2. Implementar lógica en `calculateScaledPrice()`
3. Agregar tests
4. Listo: aparecerá automáticamente en la UI

---

## 🎓 Lecciones Aprendidas

✅ **Arquitectura escalable:** Agregar nuevos métodos es trivial  
✅ **Type-safe:** TypeScript previene errores  
✅ **Testeable:** 31 tests cubren todos los casos  
✅ **Compatible:** DTF produce exactamente los mismos precios  
✅ **Flexible:** Métodos inactivos listos para activar  

---

**Fase 1.2 completada exitosamente. ✅**
