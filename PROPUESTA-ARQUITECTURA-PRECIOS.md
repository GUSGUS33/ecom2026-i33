# 🏗️ Propuesta de Arquitectura: Sistema de Precios Multi-Capas

**Fecha:** 4 de Enero de 2026  
**Objetivo:** Integrar 236 categorías de catálogo (WooCommerce) con 20 categorías SEO transaccionales

---

## 📊 CONTEXTO: DOS CAPAS DE CATEGORÍAS

### Capa 1: Catálogo (236 categorías WooCommerce)
**Archivo:** `all_categories_full.json`  
**Estructura:** `{ name, slug }`  
**Ejemplos de slugs:**
- `t_shirts` (Camisetas)
- `cam` (Camisetas manga corta)
- `polos` (Polos)
- `bags` (Bolsas)
- `bottles` (Botellas)
- `tech_accessories` (Accesorios tecnológicos)

**Características:**
- ✅ Muy granular (236 categorías)
- ✅ Algunos slugs duplicados con diferentes nombres
- ✅ Algunos slugs muy específicos (ej: `industrytshirts`, `highvistshirts`)

---

### Capa 2: SEO Transaccional (20 categorías madre)
**Archivo:** `seo-sitemap.json`  
**Estructura:** `{ url, slug, tipo, children[] }`  
**Ejemplos de slugs:**
```
camisetas-personalizadas
polos-personalizados
sudaderas-personalizadas
chaquetas-personalizadas
pantalones-personalizados
monos-personalizados
vestuario-laboral
mochilas-personalizadas
bolsas-personalizadas
accesorios-viaje
papeleria-personalizada
escritura-personalizada
tecnologia-personalizada
hogar-personalizado
merchandising-eventos
verano-personalizado
mascotas-personalizadas
deporte-personalizado
invierno-personalizado
paraguas-personalizados
```

**Características:**
- ✅ Menos granular (20 categorías)
- ✅ Orientadas a SEO y conversión
- ✅ Tienen subcategorías (hijas)

---

## 🎯 PROBLEMA A RESOLVER

**Situación actual:**
```
ProductPage.tsx
  ↓
ProductPricingFlow.tsx
  ↓
pricingCategory: 'camisetas' ← HARDCODEADO
  ↓
loadPricingData('camisetas')
  ↓
client/src/data/pricing/camisetas.json
```

**Limitación:**
- ❌ Todos los productos usan precios de camisetas
- ❌ No hay diferenciación por tipo de producto
- ❌ No hay forma de tener precios para bolsas, tazas, etc.

**Objetivo:**
- ✅ Mapear 236 categorías WooCommerce a "familias de precios"
- ✅ Cada familia tiene su propia configuración JSON
- ✅ Productos de diferentes categorías usan diferentes precios
- ✅ Sistema flexible y escalable

---

## 💡 MI PROPUESTA DE ARQUITECTURA

### NIVEL 1: Definir "Familias de Precios"

En lugar de tener 236 archivos JSON (uno por categoría), agrupar en **familias lógicas**:

```typescript
// client/src/data/pricing/pricing-families.ts

export const PRICING_FAMILIES = {
  // Familia ROPA
  'ropa': {
    name: 'Ropa Personalizada',
    description: 'Camisetas, polos, sudaderas, chaquetas, etc.',
    cantidad_minima: 25,
    factores_escalado: { /* ... */ },
    coste_personalizacion: { /* ... */ },
    zonas_permitidas: ['frontal', 'espalda', 'mangas']
  },
  
  // Familia ACCESORIOS
  'accesorios': {
    name: 'Accesorios Personalizados',
    description: 'Bolsas, mochilas, gorras, etc.',
    cantidad_minima: 50,
    factores_escalado: { /* ... */ },
    coste_personalizacion: { /* ... */ },
    zonas_permitidas: ['frontal', 'espalda']
  },
  
  // Familia HOGAR
  'hogar': {
    name: 'Artículos para el Hogar',
    description: 'Tazas, botellas, decoración, etc.',
    cantidad_minima: 20,
    factores_escalado: { /* ... */ },
    coste_personalizacion: { /* ... */ },
    zonas_permitidas: ['frontal']
  },
  
  // Familia PAPELERÍA
  'papeleria': {
    name: 'Papelería Personalizada',
    description: 'Bolígrafos, libretas, etc.',
    cantidad_minima: 100,
    factores_escalado: { /* ... */ },
    coste_personalizacion: { /* ... */ },
    zonas_permitidas: ['frente']
  }
};
```

---

### NIVEL 2: Mapeo de Categorías WooCommerce → Familias

```typescript
// client/src/data/pricing/category-to-family-mapping.ts

export const CATEGORY_TO_FAMILY_MAPPING: Record<string, string> = {
  // ROPA
  't_shirts': 'ropa',
  'cam': 'ropa',
  'cam_w': 'ropa',
  'polos': 'ropa',
  'sudaderas': 'ropa',
  'chaquetas': 'ropa',
  'pantalones': 'ropa',
  'monos': 'ropa',
  'cha': 'ropa',
  'chnd': 'ropa',
  'coats': 'ropa',
  'raincoats': 'ropa',
  
  // ACCESORIOS
  'bags': 'accesorios',
  'sub_bags': 'accesorios',
  'mochilas': 'accesorios',
  'gor': 'accesorios',
  'hats': 'accesorios',
  'gloves': 'accesorios',
  'scarves': 'accesorios',
  
  // HOGAR
  'bottles': 'hogar',
  'bottles_thermos_flas': 'hogar',
  'tazas': 'hogar',
  'decorations': 'hogar',
  'home_gifts': 'hogar',
  
  // PAPELERÍA
  'ball_pens': 'papeleria',
  'notebooks': 'papeleria',
  'diaries_calendars': 'papeleria',
  'writing': 'papeleria',
  
  // FALLBACK
  'default': 'ropa' // Si no encuentra mapeo
};
```

---

### NIVEL 3: Mapeo de Categorías SEO → Familias

```typescript
// client/src/data/pricing/seo-to-family-mapping.ts

export const SEO_TO_FAMILY_MAPPING: Record<string, string> = {
  'camisetas-personalizadas': 'ropa',
  'polos-personalizados': 'ropa',
  'sudaderas-personalizadas': 'ropa',
  'chaquetas-personalizadas': 'ropa',
  'pantalones-personalizados': 'ropa',
  'monos-personalizados': 'ropa',
  'vestuario-laboral': 'ropa',
  
  'mochilas-personalizadas': 'accesorios',
  'bolsas-personalizadas': 'accesorios',
  'accesorios-viaje': 'accesorios',
  'paraguas-personalizados': 'accesorios',
  
  'hogar-personalizado': 'hogar',
  'mascotas-personalizadas': 'hogar',
  'verano-personalizado': 'hogar',
  'invierno-personalizado': 'hogar',
  
  'papeleria-personalizada': 'papeleria',
  'escritura-personalizada': 'papeleria',
  
  'tecnologia-personalizada': 'accesorios',
  'merchandising-eventos': 'ropa',
  'deporte-personalizado': 'ropa'
};
```

---

### NIVEL 4: Servicio de Precios Mejorado

```typescript
// client/src/services/pricingService.ts (MEJORADO)

import { PRICING_FAMILIES } from '../data/pricing/pricing-families';
import { CATEGORY_TO_FAMILY_MAPPING } from '../data/pricing/category-to-family-mapping';
import { SEO_TO_FAMILY_MAPPING } from '../data/pricing/seo-to-family-mapping';

/**
 * Obtener familia de precios desde categoría WooCommerce
 */
export const getPricingFamilyFromWooCategory = (wooCategorySlug: string): string => {
  return CATEGORY_TO_FAMILY_MAPPING[wooCategorySlug] || 'ropa';
};

/**
 * Obtener familia de precios desde URL SEO
 */
export const getPricingFamilyFromSeoSlug = (seoSlug: string): string => {
  return SEO_TO_FAMILY_MAPPING[seoSlug] || 'ropa';
};

/**
 * Cargar datos de pricing de una familia
 */
export const loadPricingFamily = async (familyId: string): Promise<PricingData> => {
  const family = PRICING_FAMILIES[familyId];
  if (!family) {
    console.warn(`Pricing family "${familyId}" not found, using default`);
    return PRICING_FAMILIES['ropa'];
  }
  return family;
};

/**
 * Calcular precio (igual que antes, pero con familia dinámica)
 */
export const calculateScaledPrice = (
  regularPrice: number,
  cantidad: number,
  zonasSeleccionadas: string[],
  familyId: string
): PriceCalculation => {
  const pricingData = loadPricingFamily(familyId);
  // ... resto del cálculo igual
};
```

---

### NIVEL 5: Integración en ProductPricingFlow

```typescript
// client/src/components/pricing/ProductPricingFlow.tsx (MEJORADO)

const ProductPricingFlow: React.FC<ProductPricingFlowProps> = ({ product }) => {
  // OPCIÓN A: Desde categoría WooCommerce del producto
  const pricingFamilyId = getPricingFamilyFromWooCategory(
    product.categories?.nodes?.[0]?.slug || 'default'
  );
  
  // OPCIÓN B: Desde URL SEO actual (si estamos en página de categoría)
  // const [, params] = useRoute('/categoria/:seoSlug');
  // const pricingFamilyId = getPricingFamilyFromSeoSlug(params?.seoSlug || 'default');

  const {
    availableColors,
    sizeOptions,
    pricingData,
    selectedColor,
    quantities,
    selectedZones,
    priceCalculation,
    selectColor,
    updateQuantity,
    toggleZone
  } = useProductPricing({ 
    product,
    basePrice: parseFloat(product.price.replace(/[^0-9.,]/g, '').replace(',', '.')),
    pricingFamilyId // ← DINÁMICO
  });

  return (
    <div className="space-y-8">
      {/* Componentes igual que antes */}
    </div>
  );
};
```

---

## 📁 ESTRUCTURA DE ARCHIVOS PROPUESTA

```
client/src/data/pricing/
├── pricing-families.ts              ← Definición de familias
├── category-to-family-mapping.ts    ← Mapeo WooCommerce → Familia
├── seo-to-family-mapping.ts         ← Mapeo SEO → Familia
├── _default.json                    ← Fallback (si algo falla)
└── (opcional) families/
    ├── ropa.json                    ← Precios familia ropa
    ├── accesorios.json              ← Precios familia accesorios
    ├── hogar.json                   ← Precios familia hogar
    └── papeleria.json               ← Precios familia papelería
```

---

## 🔄 FLUJO DE DECISIÓN

```
┌─────────────────────────────────┐
│ Usuario abre página de producto │
└────────────────┬────────────────┘
                 │
         ┌───────▼────────┐
         │ Obtener datos  │
         │ del producto   │
         └───────┬────────┘
                 │
         ┌───────▼──────────────────┐
         │ ¿Tiene categoría WooCommerce? │
         └───┬──────────────────┬───┘
             │ SÍ               │ NO
             │                  │
      ┌──────▼────────┐    ┌────▼──────────┐
      │ Buscar en     │    │ Usar URL SEO  │
      │ CATEGORY_TO_  │    │ actual        │
      │ FAMILY_MAPPING│    │               │
      └──────┬────────┘    └────┬──────────┘
             │                  │
             └──────────┬───────┘
                        │
             ┌──────────▼──────────┐
             │ Obtener familia ID  │
             │ (ej: 'ropa')        │
             └──────────┬──────────┘
                        │
             ┌──────────▼──────────┐
             │ Cargar PRICING_     │
             │ FAMILIES[familyId]  │
             └──────────┬──────────┘
                        │
             ┌──────────▼──────────┐
             │ Calcular precios    │
             │ con familia         │
             └──────────┬──────────┘
                        │
             ┌──────────▼──────────┐
             │ Mostrar en UI       │
             └─────────────────────┘
```

---

## ✅ VENTAJAS DE ESTA ARQUITECTURA

| Aspecto | Ventaja |
|--------|---------|
| **Escalabilidad** | Agregar nuevas familias es trivial |
| **Mantenibilidad** | Cambiar precios es solo editar TypeScript/JSON |
| **Flexibilidad** | Mapeos dinámicos, sin hardcoding |
| **Claridad** | Código autodocumentado |
| **Robustez** | Fallbacks en cada nivel |
| **Performance** | Sin imports dinámicos, todo en memoria |
| **Testing** | Fácil de testear cada familia |

---

## ⚠️ CONSIDERACIONES TÉCNICAS

### 1. ¿TypeScript o JSON para familias?

**Opción A: TypeScript (Recomendado)**
```typescript
// Ventajas:
✅ Type-safe
✅ Sin imports dinámicos
✅ Fácil de debuggear
✅ Mejor performance

// Desventajas:
❌ Requiere recompilación para cambios
❌ Menos "no-code friendly"
```

**Opción B: JSON**
```json
// Ventajas:
✅ Cambios sin recompilación
✅ Más "no-code friendly"

// Desventajas:
❌ Requiere imports dinámicos
❌ Menos type-safe
```

**Mi recomendación:** TypeScript para familias + JSON solo si necesitas cambios en tiempo real

---

### 2. ¿Dónde obtener la categoría del producto?

**Opción A: Desde GraphQL (Recomendado)**
```typescript
// El producto ya trae: product.categories?.nodes?.[0]?.slug
const familyId = getPricingFamilyFromWooCategory(
  product.categories.nodes[0].slug
);
```

**Opción B: Desde URL SEO**
```typescript
// Si estamos en /camisetas-personalizadas/
const [, params] = useRoute('/categoria/:seoSlug');
const familyId = getPricingFamilyFromSeoSlug(params.seoSlug);
```

**Opción C: Combinada (Fallback)**
```typescript
// Intenta primero WooCommerce, luego SEO
const familyId = 
  getPricingFamilyFromWooCategory(product.categories?.nodes?.[0]?.slug) ||
  getPricingFamilyFromSeoSlug(currentSeoSlug) ||
  'ropa'; // Fallback final
```

---

### 3. Limitaciones actuales de GraphQL

**Problema:** ¿Trae GraphQL la categoría del producto?

**Solución:** Verificar en la query GraphQL actual:
```graphql
query GetProduct($slug: String!) {
  product(id: $slug) {
    id
    name
    categories {
      nodes {
        slug  ← ¿Viene esto?
        name
      }
    }
  }
}
```

Si no viene, hay dos opciones:
1. Agregar a la query GraphQL
2. Hacer lookup en `all_categories_full.json` por nombre

---

## 🎯 CASOS DE USO

### Caso 1: Producto de Camiseta
```
Producto: "Camiseta Básica Roja"
Categoría WooCommerce: "t_shirts"
  ↓
CATEGORY_TO_FAMILY_MAPPING["t_shirts"] = "ropa"
  ↓
PRICING_FAMILIES["ropa"] = {
  cantidad_minima: 25,
  factores_escalado: { "25": 5.16, "50": 3.69, ... },
  coste_personalizacion: { "frontal": 0.45, ... }
}
  ↓
Presupuesto: 50 unidades, 2 zonas = 2.002€
```

---

### Caso 2: Producto de Bolsa
```
Producto: "Bolsa Tela Personalizada"
Categoría WooCommerce: "bags"
  ↓
CATEGORY_TO_FAMILY_MAPPING["bags"] = "accesorios"
  ↓
PRICING_FAMILIES["accesorios"] = {
  cantidad_minima: 50,
  factores_escalado: { "50": 4.50, "100": 3.00, ... },
  coste_personalizacion: { "frontal": 0.60, ... }
}
  ↓
Presupuesto: 50 unidades, 1 zona = 1.500€
```

---

### Caso 3: Producto de Taza
```
Producto: "Taza Cerámica 300ml"
Categoría WooCommerce: "bottles" (o similar)
  ↓
CATEGORY_TO_FAMILY_MAPPING["bottles"] = "hogar"
  ↓
PRICING_FAMILIES["hogar"] = {
  cantidad_minima: 20,
  factores_escalado: { "20": 6.00, "50": 4.00, ... },
  coste_personalizacion: { "frontal": 0.30 }
}
  ↓
Presupuesto: 20 unidades, 1 zona = 800€
```

---

## 📋 PRÓXIMOS PASOS

1. **Definir familias finales** (¿Cuántas? ¿Cuáles?)
2. **Mapear 236 categorías WooCommerce** a familias
3. **Validar mapeos SEO** contra familias
4. **Crear archivos TypeScript** con estructuras
5. **Modificar ProductPricingFlow** para usar familias
6. **Actualizar hooks** (useProductPricing, usePriceCalculation)
7. **Tests unitarios** para cada familia
8. **Documentación** de cómo agregar nuevas familias

---

## 🤔 PREGUNTAS PARA TI

1. **¿Cuántas familias de precios quieres?** (Propongo 4-6)
2. **¿Qué nombres les das?** (Propongo: ropa, accesorios, hogar, papelería, etc.)
3. **¿Prefieres TypeScript o JSON para familias?**
4. **¿Trae GraphQL la categoría del producto?** (Necesito verificar)
5. **¿Hay categorías WooCommerce que no encajen en ninguna familia?**

---

**Espero tu feedback para refinar esta propuesta. 🚀**
