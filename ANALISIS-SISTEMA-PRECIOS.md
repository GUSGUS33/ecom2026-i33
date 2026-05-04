# 📊 Análisis Completo del Sistema de Precios - IMPACTO33 MVP

**Fecha:** 4 de Enero de 2026  
**Versión:** 1.0 (Análisis de Fase 1)  
**Autor:** Manus AI  
**Objetivo:** Documentar la configuración y lógica de precios sin cambios de comportamiento

---

## 1️⃣ LOCALIZACIÓN DE ARCHIVOS CLAVE

### 📁 Estructura de Directorios

```
impacto33-mvp/
├── client/src/
│   ├── components/pricing/              ← Componentes UI
│   │   ├── PriceCalculator.tsx          ← Mostrador de precios
│   │   ├── ProductPricingFlow.tsx       ← Flujo completo de precios
│   │   ├── SizeQuantityTable.tsx        ← Tabla de tallas/cantidades
│   │   ├── ZoneSelector.tsx             ← Selector de zonas de personalización
│   │   ├── ColorSelector.tsx            ← Selector de colores
│   │   └── QuoteRequestModal.tsx        ← Modal de solicitud de presupuesto
│   │
│   ├── services/
│   │   ├── pricingService.ts            ← LÓGICA PRINCIPAL DE CÁLCULO
│   │   └── pricingService.test.ts       ← Tests unitarios
│   │
│   ├── hooks/
│   │   ├── useProductPricing.ts         ← Hook maestro de precios
│   │   ├── usePriceCalculation.ts       ← Hook de cálculo
│   │   └── usePricing.ts                ← Hook de carga de datos
│   │
│   ├── data/pricing/                    ← CONFIGURACIÓN JSON
│   │   ├── _default.json                ← Precios por defecto (fallback)
│   │   └── camisetas.json               ← Precios específicos para camisetas
│   │
│   ├── types/
│   │   └── pricing.ts                   ← Interfaces TypeScript
│   │
│   └── pages/
│       └── ProductPage.tsx              ← Integración en página de producto
```

---

## 2️⃣ ESTRUCTURA DE DATOS DE PRECIOS

### 📋 Interfaz TypeScript (client/src/types/pricing.ts)

```typescript
export interface PricingData {
  categoria: string;                           // Nombre de la categoría
  cantidad_minima: number;                     // Cantidad mínima para personalización
  factores_escalado: Record<string, number>;   // Factores por cantidad
  coste_personalizacion: Record<string, number>; // Coste por zona
  zonas_permitidas: string[];                  // Zonas disponibles
  notas?: string;                              // Notas adicionales
}

export interface PriceCalculation {
  precioUnitarioBase: number;      // Precio base (regularPrice / 2)
  precioPersonalizacion: number;   // Suma de costes de zonas
  precioUnitarioFinal: number;     // Base + Personalización + Escalado
  precioTotalSinIVA: number;       // Unitario × Cantidad
  precioTotalConIVA: number;       // Total × 1.21 (IVA 21%)
  cantidadTotal: number;           // Total de unidades
  cantidadMinima: number;          // Mínimo requerido
  cumpleCantidadMinima: boolean;   // Validación
  escalado: number;                // Factor aplicado (ej: 2.47)
  zonasSeleccionadas: string[];    // Zonas elegidas
}
```

---

## 3️⃣ ARCHIVOS DE CONFIGURACIÓN JSON

### 📄 _default.json (Fallback para todas las categorías)

**Ubicación:** `client/src/data/pricing/_default.json`

```json
{
  "categoria": "General",
  "cantidad_minima": 10,
  "factores_escalado": {
    "10": 5.16,
    "25": 3.69,
    "50": 2.97,
    "100": 2.13,
    "250": 1.67,
    "500": 1.32,
    "1000": 1.0,
    "2000": 0.89
  },
  "coste_personalizacion": {
    "frontal": 0.50,
    "espalda": 0.45,
    "mangas": 0.40
  },
  "zonas_permitidas": ["frontal", "espalda", "mangas"],
  "notas": "Precios IVA incluido"
}
```

**Significado de campos:**

| Campo | Significado | Ejemplo |
|-------|-------------|---------|
| `cantidad_minima` | Mínimo de unidades para aplicar precios | 10 unidades |
| `factores_escalado` | Multiplicadores por tramo de cantidad | A 50 unidades: ×2.97 |
| `coste_personalizacion` | Euros adicionales por zona | Frontal: +0.50€ |
| `zonas_permitidas` | Qué zonas se pueden personalizar | frontal, espalda, mangas |

---

### 📄 camisetas.json (Configuración específica)

**Ubicación:** `client/src/data/pricing/camisetas.json`

```json
{
  "categoria": "Camisetas",
  "cantidad_minima": 25,
  "factores_escalado": {
    "25": 5.16,
    "50": 3.69,
    "100": 2.47,
    "250": 1.85,
    "500": 1.32,
    "1000": 1.0,
    "2000": 0.89
  },
  "coste_personalizacion": {
    "frontal": 0.45,
    "espalda": 0.40,
    "mangas": 0.35
  },
  "zonas_permitidas": ["frontal", "espalda", "mangas"],
  "notas": "Precios IVA incluido, personalización full color"
}
```

**Diferencias vs. _default.json:**

| Aspecto | Default | Camisetas |
|--------|---------|-----------|
| Cantidad mínima | 10 | 25 |
| Factor a 100 unidades | 2.13 | 2.47 |
| Coste frontal | 0.50€ | 0.45€ |
| Coste espalda | 0.45€ | 0.40€ |
| Coste mangas | 0.40€ | 0.35€ |

---

## 4️⃣ LÓGICA DE CÁLCULO DE PRECIOS

### 🔧 Función Principal: calculateScaledPrice()

**Ubicación:** `client/src/services/pricingService.ts` (líneas 77-116)

```typescript
export const calculateScaledPrice = (
  regularPrice: number,           // Precio de WooCommerce
  cantidad: number,               // Total de unidades
  zonasSeleccionadas: string[],   // Ej: ["frontal", "espalda"]
  pricingData: PricingData        // Datos JSON cargados
): PriceCalculation => {
  
  // PASO 1: Calcular precio base
  const precioUnitarioBase = regularPrice / 2;
  
  // PASO 2: Calcular coste de personalización
  const precioPersonalizacion = zonasSeleccionadas.reduce((total, zona) => {
    return total + (pricingData.coste_personalizacion[zona] || 0);
  }, 0);
  
  // PASO 3: Coste base total (antes de escalado)
  const costeBaseTotal = precioUnitarioBase + precioPersonalizacion;
  
  // PASO 4: Obtener multiplicador de escalado
  const escalado = getEscaladoMultiplier(cantidad, pricingData.factores_escalado);
  
  // PASO 5: Aplicar escalado
  const precioUnitarioFinal = costeBaseTotal * escalado;
  
  // PASO 6: Calcular totales
  const precioTotalSinIVA = precioUnitarioFinal * cantidad;
  const precioTotalConIVA = precioTotalSinIVA * 1.21; // IVA 21%
  
  return { /* ... */ };
};
```

### 📊 Función de Escalado: getEscaladoMultiplier()

**Ubicación:** `client/src/services/pricingService.ts` (líneas 54-72)

```typescript
export const getEscaladoMultiplier = (
  cantidad: number,
  escalados: Record<string, number>
): number => {
  const tramos = Object.keys(escalados)
    .map(Number)
    .sort((a, b) => a - b); // Ordenar: [25, 50, 100, 250, 500, 1000, 2000]

  // Encontrar el tramo más alto ≤ cantidad
  let tramoAplicable = tramos[0];
  
  for (const tramo of tramos) {
    if (cantidad >= tramo) {
      tramoAplicable = tramo;
    } else {
      break;
    }
  }

  return escalados[tramoAplicable.toString()] || 1.0;
};
```

**Ejemplo de búsqueda de tramo:**
- Cantidad: 75 unidades
- Tramos disponibles: [25, 50, 100, 250, 500, 1000, 2000]
- Tramo aplicable: 50 (el más alto ≤ 75)
- Factor: 3.69

---

## 5️⃣ EJEMPLOS CONCRETOS CON NÚMEROS REALES

### 📌 CASO 1: Camiseta - Pedido Pequeño (10 unidades, 1 zona)

**Datos de entrada:**
- Precio WooCommerce: 20€
- Cantidad: 10 unidades
- Zonas: ["frontal"]
- Categoría: camisetas

**Cálculo paso a paso:**

```
PASO 1: Precio base
  precioUnitarioBase = 20 / 2 = 10€

PASO 2: Personalización
  precioPersonalizacion = 0.45€ (frontal)

PASO 3: Coste base total
  costeBaseTotal = 10 + 0.45 = 10.45€

PASO 4: Escalado
  cantidad = 10
  tramos disponibles = [25, 50, 100, 250, 500, 1000, 2000]
  tramo aplicable = 25 (el más bajo, porque 10 < 25)
  ⚠️ PROBLEMA: 10 < cantidad_minima (25)
  → Se muestra alerta: "Cantidad mínima no alcanzada"
  → No se calcula precio
```

**Resultado:** ❌ No se puede calcular (cantidad insuficiente)

---

### 📌 CASO 2: Camiseta - Pedido Mediano (50 unidades, 2 zonas)

**Datos de entrada:**
- Precio WooCommerce: 20€
- Cantidad: 50 unidades
- Zonas: ["frontal", "espalda"]
- Categoría: camisetas

**Cálculo paso a paso:**

```
PASO 1: Precio base
  precioUnitarioBase = 20 / 2 = 10€

PASO 2: Personalización
  precioPersonalizacion = 0.45€ (frontal) + 0.40€ (espalda) = 0.85€

PASO 3: Coste base total
  costeBaseTotal = 10 + 0.85 = 10.85€

PASO 4: Escalado
  cantidad = 50
  tramos disponibles = [25, 50, 100, 250, 500, 1000, 2000]
  tramo aplicable = 50 (porque 50 >= 50)
  escalado = 3.69

PASO 5: Precio unitario final
  precioUnitarioFinal = 10.85 × 3.69 = 40.04€

PASO 6: Totales
  precioTotalSinIVA = 40.04 × 50 = 2.002€
  precioTotalConIVA = 2.002 × 1.21 = 2.422,42€
```

**Resultado:**
- ✅ Precio unitario: **40,04€**
- ✅ Total sin IVA: **2.002,00€**
- ✅ Total con IVA: **2.422,42€**
- ✅ Descuento por volumen: **269% (escalado 3.69x)**

---

### 📌 CASO 3: Camiseta - Pedido Grande (1.000 unidades, 3 zonas)

**Datos de entrada:**
- Precio WooCommerce: 20€
- Cantidad: 1.000 unidades
- Zonas: ["frontal", "espalda", "mangas"]
- Categoría: camisetas

**Cálculo paso a paso:**

```
PASO 1: Precio base
  precioUnitarioBase = 20 / 2 = 10€

PASO 2: Personalización
  precioPersonalizacion = 0.45€ + 0.40€ + 0.35€ = 1.20€

PASO 3: Coste base total
  costeBaseTotal = 10 + 1.20 = 11.20€

PASO 4: Escalado
  cantidad = 1.000
  tramos disponibles = [25, 50, 100, 250, 500, 1000, 2000]
  tramo aplicable = 1000 (porque 1000 >= 1000)
  escalado = 1.0 (sin descuento, precio base)

PASO 5: Precio unitario final
  precioUnitarioFinal = 11.20 × 1.0 = 11.20€

PASO 6: Totales
  precioTotalSinIVA = 11.20 × 1.000 = 11.200€
  precioTotalConIVA = 11.200 × 1.21 = 13.552€
```

**Resultado:**
- ✅ Precio unitario: **11,20€**
- ✅ Total sin IVA: **11.200,00€**
- ✅ Total con IVA: **13.552,00€**
- ✅ Descuento por volumen: **0% (escalado 1.0x)**

---

### 📌 CASO 4: Producto Default (50 unidades, 1 zona)

**Datos de entrada:**
- Precio WooCommerce: 15€
- Cantidad: 50 unidades
- Zonas: ["frontal"]
- Categoría: general (usa _default.json)

**Cálculo paso a paso:**

```
PASO 1: Precio base
  precioUnitarioBase = 15 / 2 = 7.50€

PASO 2: Personalización
  precioPersonalizacion = 0.50€ (frontal)

PASO 3: Coste base total
  costeBaseTotal = 7.50 + 0.50 = 8.00€

PASO 4: Escalado
  cantidad = 50
  tramos disponibles = [10, 25, 50, 100, 250, 500, 1000, 2000]
  tramo aplicable = 50 (porque 50 >= 50)
  escalado = 2.97

PASO 5: Precio unitario final
  precioUnitarioFinal = 8.00 × 2.97 = 23.76€

PASO 6: Totales
  precioTotalSinIVA = 23.76 × 50 = 1.188€
  precioTotalConIVA = 1.188 × 1.21 = 1.437,48€
```

**Resultado:**
- ✅ Precio unitario: **23,76€**
- ✅ Total sin IVA: **1.188,00€**
- ✅ Total con IVA: **1.437,48€**
- ✅ Descuento por volumen: **197% (escalado 2.97x)**

---

## 6️⃣ FLUJO DE CARGA Y CACHE

### 🔄 Proceso de Carga de Datos de Precios

**Ubicación:** `client/src/services/pricingService.ts` (líneas 20-49)

```typescript
export const loadPricingData = async (categoryId: string): Promise<PricingData> => {
  // NIVEL 1: Cache en memoria
  if (pricingCache.has(categoryId)) {
    return pricingCache.get(categoryId)!;
  }

  try {
    // NIVEL 2: Importación dinámica de JSON
    // Busca: client/src/data/pricing/{categoryId}.json
    const module = await import(`../data/pricing/${normalizedId}.json`);
    const data = module.default as PricingData;
    
    pricingCache.set(categoryId, data);
    return data;
  } catch (error) {
    // NIVEL 3: Fallback a _default.json
    console.warn(`Pricing data not found for category "${categoryId}", using default fallback.`);
    const fallbackData = defaultPricing as unknown as PricingData;
    pricingCache.set(categoryId, fallbackData);
    return fallbackData;
  }
};
```

**Flujo de decisión:**

```
┌─────────────────────────────────┐
│ Solicitar precios para categoría │
└────────────────┬────────────────┘
                 │
         ┌───────▼────────┐
         │ ¿Está en cache? │
         └───┬─────────┬──┘
             │ SÍ      │ NO
             │         │
          DEVOLVER   BUSCAR JSON
             │         │
             │    ┌────▼──────────────┐
             │    │ ¿Existe archivo?  │
             │    └────┬──────────┬───┘
             │         │ SÍ       │ NO
             │         │          │
             │      CARGAR    USAR DEFAULT
             │         │          │
             └─────────┴──────────┘
                       │
                  GUARDAR EN CACHE
                       │
                    DEVOLVER
```

---

## 7️⃣ INTEGRACIÓN EN COMPONENTES

### 🎯 ProductPricingFlow (Componente Maestro)

**Ubicación:** `client/src/components/pricing/ProductPricingFlow.tsx`

```typescript
const ProductPricingFlow: React.FC<ProductPricingFlowProps> = ({ product, onRequestQuote }) => {
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
    
    // Acciones
    selectColor,
    updateQuantity,
    toggleZone
  } = useProductPricing({ 
    product,
    basePrice: parseFloat(product.price.replace(/[^0-9.,]/g, '').replace(',', '.')),
    pricingCategory: 'camisetas' // ⚠️ HARDCODED - debería ser dinámico
  });

  return (
    <div className="space-y-8">
      {/* 1. Selector de Color */}
      <ColorSelector {...} />
      
      {/* 2. Tabla de Cantidades por Talla */}
      <SizeQuantityTable {...} />
      
      {/* 3. Selector de Zonas de Personalización */}
      <ZoneSelector {...} />
      
      {/* 4. Calculadora de Precios */}
      <PriceCalculator {...} />
    </div>
  );
};
```

**⚠️ PROBLEMA DETECTADO:**
- `pricingCategory` está **hardcodeado a 'camisetas'** (línea 48)
- Debería extraerse dinámicamente del producto
- Actualmente, TODAS las categorías usan la configuración de camisetas

---

## 8️⃣ RESUMEN EJECUTIVO (Para No Técnicos)

### 📋 "¿Cómo estamos calculando precios en IMPACTO33?"

**Fórmula simplificada:**

```
Precio Final = (Precio WooCommerce ÷ 2 + Personalización) × Escalado × Cantidad
```

**Ejemplo real:**
- Camiseta de 20€, 50 unidades, 2 zonas personalizadas
- Precio base: 20€ ÷ 2 = 10€
- Personalización: 0.45€ + 0.40€ = 0.85€
- Escalado (50 unidades): ×3.69
- **Total: 2.002€ (sin IVA)**

### 🎯 "¿Qué cosas son fáciles de cambiar tocando solo el JSON?"

**Muy fácil (solo editar JSON):**

1. **Cambiar cantidad mínima**
   - Editar: `cantidad_minima: 25`
   - Efecto: Inmediato, sin recargar código

2. **Ajustar precios de personalización**
   - Editar: `coste_personalizacion: { "frontal": 0.45 }`
   - Efecto: Inmediato, afecta todos los cálculos

3. **Modificar tramos de escalado**
   - Editar: `factores_escalado: { "100": 2.47 }`
   - Efecto: Inmediato, aplica a nuevos presupuestos

4. **Cambiar zonas permitidas**
   - Editar: `zonas_permitidas: ["frontal", "espalda", "mangas"]`
   - Efecto: Inmediato, limita opciones en UI

5. **Crear nueva categoría**
   - Crear: `client/src/data/pricing/bolsas.json`
   - Efecto: Automático, se carga dinámicamente

### ⚙️ "¿Qué cosas requerirían tocar código?"

**Requiere cambios en código:**

1. **Cambiar la fórmula base (regularPrice ÷ 2)**
   - Archivo: `pricingService.ts` línea 84
   - Razón: Está hardcodeada en la lógica

2. **Cambiar IVA (actualmente 21%)**
   - Archivo: `pricingService.ts` línea 102
   - Razón: Está hardcodeado en la fórmula

3. **Agregar nuevos tipos de escalado** (ej: por urgencia, por color)
   - Archivo: `pricingService.ts` y tipos
   - Razón: Requiere nueva lógica de cálculo

4. **Cambiar cómo se asigna categoría a producto**
   - Archivo: `ProductPricingFlow.tsx` línea 48
   - Razón: Actualmente está hardcodeado a 'camisetas'

5. **Agregar descuentos por volumen adicionales**
   - Archivo: `pricingService.ts`
   - Razón: Requiere nueva lógica condicional

---

## 9️⃣ INCONSISTENCIAS Y "TRUCOS" DETECTADOS

### 🚨 PROBLEMA 1: pricingCategory Hardcodeado

**Ubicación:** `client/src/components/pricing/ProductPricingFlow.tsx:48`

```typescript
pricingCategory: 'camisetas' // Esto debería venir dinámicamente del producto
```

**Impacto:** 
- ❌ Todas las categorías de productos usan precios de camisetas
- ❌ No hay forma de tener precios diferentes para bolsas, tazas, etc.
- ✅ Funciona solo porque camisetas es la única categoría con JSON

**Solución propuesta:**
```typescript
// Extraer del producto o categoría
pricingCategory: product.categories?.nodes?.[0]?.slug || 'general'
```

---

### 🚨 PROBLEMA 2: Fórmula de Precio Base (÷ 2)

**Ubicación:** `client/src/services/pricingService.ts:84`

```typescript
const precioUnitarioBase = regularPrice / 2;
```

**Impacto:**
- ❌ No hay documentación de por qué se divide entre 2
- ❌ Parece ser un "truco" para ajustar márgenes
- ❌ Si WooCommerce tiene precios reales, esta fórmula puede ser incorrecta

**Preguntas:**
- ¿WooCommerce tiene precios de mayorista o minorista?
- ¿La división ÷ 2 es intencional o temporal?
- ¿Debería haber diferentes factores por categoría?

---

### 🚨 PROBLEMA 3: Escalado Invertido (Números Altos = Descuentos)

**Ubicación:** `client/src/services/pricingService.ts:95-98`

```typescript
const escalado = getEscaladoMultiplier(cantidad, pricingData.factores_escalado);
const precioUnitarioFinal = costeBaseTotal * escalado;
```

**Impacto:**
- ⚠️ Números altos (5.16, 3.69, 2.47) significan DESCUENTOS
- ⚠️ Números bajos (1.0, 0.89) significan PRECIO NORMAL o DESCUENTO MAYOR
- ⚠️ Es contraintuitivo: más cantidad = multiplicador más bajo = precio más bajo

**Ejemplo confuso:**
```
10 unidades: ×5.16 = 51.6€ por unidad
1000 unidades: ×1.0 = 10€ por unidad
```

Esto es correcto (más cantidad = precio más bajo), pero el nombre "escalado" es confuso.

---

### 🚨 PROBLEMA 4: Cantidad Mínima No Configurable por Zona

**Ubicación:** `client/src/data/pricing/camisetas.json`

```json
{
  "cantidad_minima": 25,
  "coste_personalizacion": {
    "frontal": 0.45,
    "espalda": 0.40,
    "mangas": 0.35
  }
}
```

**Impacto:**
- ❌ No hay cantidad mínima diferente por número de zonas
- ❌ No hay cantidad mínima diferente por zona específica
- ❌ No hay cantidad mínima diferente por color

**Caso real:**
- 25 unidades con 1 zona: ✅ Permitido
- 25 unidades con 3 zonas: ✅ Permitido (pero puede ser muy caro)
- 10 unidades con 1 zona: ❌ Rechazado (pero podría ser viable)

---

### 🚨 PROBLEMA 5: Sin Descuentos Explícitos por Volumen

**Ubicación:** `client/src/data/pricing/camisetas.json`

```json
{
  "factores_escalado": {
    "25": 5.16,
    "50": 3.69,
    "100": 2.47,
    ...
  }
}
```

**Impacto:**
- ⚠️ Los "descuentos" están implícitos en los factores
- ⚠️ No hay forma de mostrar "Ahorro: 30%" al cliente
- ⚠️ No hay descuentos por cantidad + zonas combinadas

**Ejemplo:**
- 50 unidades, 1 zona: Factor 3.69
- 50 unidades, 3 zonas: Factor 3.69 (mismo)
- ¿Debería haber descuento por 3 zonas?

---

## 🔟 PROPUESTAS DE MEJORA (Sin Implementar)

### ✨ MEJORA 1: Estructura JSON Mejorada

**Problema actual:** Campos sueltos sin relación clara

**Propuesta:**

```json
{
  "categoria": "Camisetas",
  "cantidad_minima": 25,
  
  "precios_base": {
    "factor_margen": 0.5,
    "descripcion": "Precio WooCommerce × 0.5"
  },
  
  "escalados": [
    {
      "cantidad_desde": 25,
      "cantidad_hasta": 49,
      "factor": 5.16,
      "descuento_porcentaje": 0
    },
    {
      "cantidad_desde": 50,
      "cantidad_hasta": 99,
      "factor": 3.69,
      "descuento_porcentaje": 28
    },
    {
      "cantidad_desde": 100,
      "cantidad_hasta": 249,
      "factor": 2.47,
      "descuento_porcentaje": 52
    }
  ],
  
  "personalizacion": {
    "zonas": [
      {
        "id": "frontal",
        "nombre": "Pecho frontal",
        "coste_base": 0.45,
        "coste_por_zona_adicional": 0.05,
        "max_colores": 4
      },
      {
        "id": "espalda",
        "nombre": "Espalda completa",
        "coste_base": 0.40,
        "coste_por_zona_adicional": 0.05,
        "max_colores": 4
      }
    ],
    "cantidad_minima_por_zona": 25
  },
  
  "urgencia": {
    "habilitada": true,
    "opciones": [
      {
        "dias": 14,
        "multiplicador": 1.0,
        "etiqueta": "Estándar"
      },
      {
        "dias": 10,
        "multiplicador": 1.1,
        "etiqueta": "+10% recargo"
      },
      {
        "dias": 7,
        "multiplicador": 1.2,
        "etiqueta": "+20% recargo"
      }
    ]
  },
  
  "iva": {
    "porcentaje": 21,
    "incluido_en_precios": false
  }
}
```

**Ventajas:**
- ✅ Estructura clara y autodocumentada
- ✅ Fácil agregar descuentos por urgencia
- ✅ Fácil agregar descuentos por zona adicional
- ✅ Fácil calcular porcentaje de descuento para mostrar al cliente
- ✅ Escalable para nuevos tipos de recargos

---

### ✨ MEJORA 2: Archivo Maestro de Configuración

**Problema actual:** Categorías dispersas, sin centralización

**Propuesta:** `client/src/data/pricing/pricing-config.ts`

```typescript
export const PRICING_CONFIG = {
  // Configuración global
  global: {
    iva_porcentaje: 21,
    precio_base_factor: 0.5,
    moneda: 'EUR',
    cantidad_minima_global: 10
  },
  
  // Categorías
  categorias: {
    'camisetas': {
      cantidad_minima: 25,
      escalados: { /* ... */ },
      personalizacion: { /* ... */ }
    },
    'bolsas': {
      cantidad_minima: 50,
      escalados: { /* ... */ },
      personalizacion: { /* ... */ }
    },
    'tazas': {
      cantidad_minima: 20,
      escalados: { /* ... */ },
      personalizacion: { /* ... */ }
    }
  },
  
  // Mapeo de categorías WooCommerce a precios
  mapeo_categorias: {
    'ropa-personalizada': 'camisetas',
    'bolsas-mochilas': 'bolsas',
    'hogar-personalizado': 'tazas'
  },
  
  // Descuentos especiales
  descuentos: {
    por_volumen: true,
    por_urgencia: true,
    por_cliente_vip: false
  }
};
```

**Ventajas:**
- ✅ Centralización total
- ✅ Fácil mapeo WooCommerce → Precios
- ✅ Fácil agregar nuevas categorías
- ✅ Fácil cambiar configuración global

---

### ✨ MEJORA 3: Descuentos por Urgencia

**Problema actual:** No hay recargos por plazo de entrega

**Propuesta:** Agregar a JSON

```json
{
  "urgencia": {
    "habilitada": true,
    "opciones": [
      {
        "dias": 14,
        "multiplicador": 1.0,
        "etiqueta": "Estándar (14 días)"
      },
      {
        "dias": 10,
        "multiplicador": 1.1,
        "etiqueta": "Rápido (10 días, +10%)"
      },
      {
        "dias": 7,
        "multiplicador": 1.2,
        "etiqueta": "Urgente (7 días, +20%)"
      }
    ]
  }
}
```

**Cálculo:**
```
Precio Final = (Base + Personalización) × Escalado × Urgencia × Cantidad
```

---

### ✨ MEJORA 4: Descuentos por Zona Adicional

**Problema actual:** Todas las zonas cuestan lo mismo

**Propuesta:**

```json
{
  "personalizacion": {
    "coste_primera_zona": 0.45,
    "coste_zona_adicional": 0.20,
    "zonas_permitidas": ["frontal", "espalda", "mangas"]
  }
}
```

**Cálculo:**
```
Personalización = 0.45 + (0.20 × (número_zonas - 1))

Ejemplo: 3 zonas = 0.45 + (0.20 × 2) = 0.85€
```

---

### ✨ MEJORA 5: Descuentos por Cliente VIP

**Problema actual:** No hay descuentos por cliente

**Propuesta:**

```json
{
  "descuentos_cliente": {
    "habilitada": true,
    "tipos": [
      {
        "id": "vip",
        "nombre": "Cliente VIP",
        "descuento_porcentaje": 10,
        "cantidad_minima": 0
      },
      {
        "id": "mayorista",
        "nombre": "Mayorista",
        "descuento_porcentaje": 15,
        "cantidad_minima": 500
      }
    ]
  }
}
```

---

## 1️⃣1️⃣ RESUMEN DE ARCHIVOS CLAVE

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `pricingService.ts` | 151 | Lógica principal de cálculo |
| `pricingService.test.ts` | 82 | Tests unitarios |
| `pricing.ts` (types) | 44 | Interfaces TypeScript |
| `_default.json` | 21 | Precios por defecto |
| `camisetas.json` | 20 | Precios específicos |
| `useProductPricing.ts` | 206 | Hook maestro |
| `usePriceCalculation.ts` | 92 | Hook de cálculo |
| `usePricing.ts` | 68 | Hook de carga |
| `PriceCalculator.tsx` | 173 | Componente mostrador |
| `ProductPricingFlow.tsx` | 150+ | Componente flujo completo |

---

## 1️⃣2️⃣ CHECKLIST DE CAMBIOS FUTUROS

- [ ] Hacer `pricingCategory` dinámico desde el producto
- [ ] Documentar por qué se divide entre 2 en `regularPrice / 2`
- [ ] Crear archivo maestro de configuración centralizado
- [ ] Agregar descuentos por urgencia/plazo
- [ ] Agregar descuentos por zona adicional
- [ ] Agregar descuentos por cliente VIP
- [ ] Crear JSON para todas las categorías (bolsas, tazas, etc.)
- [ ] Mejorar estructura JSON con campos descriptivos
- [ ] Agregar tests para nuevas categorías
- [ ] Documentar fórmula de precios en README

---

**Fin del Análisis - Fase 1**

*Este documento es de referencia. No se han realizado cambios en el código.*
