# Sistema de Páginas Transaccionales

## 📋 Descripción General

Sistema completo para renderizar páginas transaccionales SEO desde WordPress usando la plantilla ACF "Plantilla SEO (Headless Minimal)" con bloques dinámicos vía GraphQL.

---

## 🎯 Arquitectura

### **Flujo de Renderizado**

```
Usuario accede a /camisetas-personalizadas/
        ↓
TransactionalPage.tsx carga
        ↓
useTransactionalPages busca página en cache
        ↓
¿Existe y usa plantilla correcta?
        ↓
    SÍ → useTransactionalPage obtiene contenido completo
        ↓
    Filtra bloques con contenido (no null)
        ↓
    BlockRenderer renderiza cada bloque
        ↓
    Fondos alternados: blanco → gris → azul → blanco...
        ↓
    Página renderizada ✅
        
    NO → 404
```

---

## 📁 Estructura de Archivos

```
client/src/
├── queries/
│   ├── transactionalPages.ts       # Query para listar páginas
│   └── seoPageComplete.ts          # Query para detalle completo
├── hooks/
│   ├── useTransactionalPages.ts    # Hook para listado
│   ├── useTransactionalPage.ts     # Hook para detalle
│   └── useTransactionalPages.test.ts # Tests (4 tests)
├── pages/
│   └── TransactionalPage.tsx       # Página dinámica principal
└── components/blocks/
    ├── BlockRenderer.tsx           # Renderizador principal
    ├── HtmlBlock.tsx               # ✅ Contenido HTML/Texto
    ├── FaqBlock.tsx                # ✅ Preguntas frecuentes
    ├── IconosBlock.tsx             # ✅ 4 columnas con iconos
    ├── VideoBlock.tsx              # ✅ Video promocional
    ├── GaleriaBlock.tsx            # ✅ Galería de imágenes
    ├── CtaSecundarioBlock.tsx      # ✅ CTA destacado
    ├── ProductosVendidosBlock.tsx  # 🔄 Stub (próximamente)
    ├── ProductosDestacadosBlock.tsx # 🔄 Stub
    ├── ProductosDinamicosBlock.tsx # 🔄 Stub
    ├── SubcategoriasBlock.tsx      # 🔄 Stub
    ├── CasosUsoBlock.tsx           # 🔄 Stub
    ├── UsosComunesBlock.tsx        # 🔄 Stub
    ├── InterlinkingBlock.tsx       # 🔄 Stub
    ├── BlogSliderBlock.tsx         # 🔄 Stub
    ├── TestimoniosBlock.tsx        # 🔄 Stub
    ├── TrustBadgesBlock.tsx        # 🔄 Stub
    ├── StatsBlock.tsx              # 🔄 Stub
    ├── ComparativaBlock.tsx        # 🔄 Stub
    ├── ProcesoBlock.tsx            # 🔄 Stub
    ├── UrgenciaBlock.tsx           # 🔄 Stub
    ├── BeneficiosBlock.tsx         # 🔄 Stub
    ├── VentajasBlock.tsx           # 🔄 Stub
    ├── GarantiaBlock.tsx           # 🔄 Stub
    └── SocialProofBlock.tsx        # 🔄 Stub
```

---

## 🔍 Identificación de Páginas Transaccionales

Una página es transaccional si cumple:

```typescript
page.template.__typename === 'Template_PlantillaSEOHeadlessMinimal'
```

**Ejemplo de página transaccional:**

```json
{
  "id": "cGFnZToxMjM=",
  "databaseId": 123,
  "title": "Camisetas Personalizadas",
  "slug": "camisetas-personalizadas",
  "uri": "/camisetas-personalizadas/",
  "template": {
    "templateName": "Plantilla SEO (Headless Minimal)",
    "__typename": "Template_PlantillaSEOHeadlessMinimal"
  }
}
```

---

## 📊 Queries GraphQL

### **1. GetAllTransactionalPages**

**Propósito**: Listar todas las páginas transaccionales

**Variables**: Ninguna

**Retorna**:
- `id`, `databaseId`, `title`, `slug`, `uri`
- `template.__typename` (para filtrar)
- `heroPageSeo` (título e intro)
- `seoMeta.metaDescription`

**Uso**:
```typescript
const { pages, findPageByUri } = useTransactionalPages();
const page = findPageByUri('/camisetas-personalizadas/');
```

### **2. GetSeoPageComplete**

**Propósito**: Obtener contenido completo de una página

**Variables**:
```typescript
{ id: number } // databaseId
```

**Retorna**:
- Hero section
- SEO meta (title, description, canonical, OG, breadcrumbs, robots)
- **Todos los bloques** (`pageBlocks.pageBlocks`)

**Uso**:
```typescript
const { page, blocks } = useTransactionalPage(123);
```

---

## 🎨 Sistema de Bloques

### **Tipos de Bloques Disponibles**

| blockType | Componente | Estado | Descripción |
|-----------|-----------|--------|-------------|
| `html` | HtmlBlock | ✅ | Contenido HTML/Texto |
| `faq` | FaqBlock | ✅ | Preguntas frecuentes (accordion) |
| `iconos` | IconosBlock | ✅ | 4 columnas con iconos |
| `video` | VideoBlock | ✅ | Video promocional (YouTube/Vimeo/directo) |
| `galeria` | GaleriaBlock | ✅ | Galería de imágenes (grid) |
| `ctasecundario` | CtaSecundarioBlock | ✅ | CTA destacado |
| `productos_vendidos` | ProductosVendidosBlock | 🔄 | Productos más vendidos |
| `productos_destacados` | ProductosDestacadosBlock | 🔄 | Productos destacados |
| `productos_dinamicos` | ProductosDinamicosBlock | 🔄 | Productos por categoría |
| `subcategorias` | SubcategoriasBlock | 🔄 | Grid de subcategorías |
| `casosuso` | CasosUsoBlock | 🔄 | Casos de uso |
| `usoscomunes` | UsosComunesBlock | 🔄 | Usos comunes |
| `interlinking` | InterlinkingBlock | 🔄 | Enlaces internos |
| `blogslider` | BlogSliderBlock | 🔄 | Slider de posts |
| `testimonios` | TestimoniosBlock | 🔄 | Testimonios/reseñas |
| `trustbadges` | TrustBadgesBlock | 🔄 | Trust badges |
| `stats` | StatsBlock | 🔄 | Números impactantes |
| `comparativa` | ComparativaBlock | 🔄 | Tabla comparativa |
| `proceso` | ProcesoBlock | 🔄 | Proceso paso a paso |
| `urgencia` | UrgenciaBlock | 🔄 | Urgencia/escasez |
| `beneficios` | BeneficiosBlock | 🔄 | Beneficios vs características |
| `ventajas` | VentajasBlock | 🔄 | Por qué elegirnos |
| `garantia` | GarantiaBlock | 🔄 | Garantía destacada |
| `socialproof` | SocialProofBlock | 🔄 | Prueba social |

**Leyenda**:
- ✅ = Implementado con diseño funcional
- 🔄 = Stub básico (refinamiento pendiente)

---

## 🎨 Sistema de Fondos Alternados

Los bloques se renderizan con fondos alternados para crear separación visual:

```typescript
const BACKGROUND_COLORS = [
  'bg-white',      // Bloque 0, 3, 6, 9...
  'bg-slate-50',   // Bloque 1, 4, 7, 10...
  'bg-blue-50',    // Bloque 2, 5, 8, 11...
];
```

**Espaciado**:
- Desktop: `py-16 md:py-24` (100px arriba/abajo aprox.)
- Móvil: `py-16` (adaptado automáticamente)

---

## 🔒 Filtrado de Bloques

**Solo se renderizan bloques con contenido**:

```typescript
// Un bloque tiene contenido si al menos uno de sus campos no es null
function hasBlockContent(block: PageBlock): boolean {
  const { blockType, ...fields } = block;
  
  for (const value of Object.values(fields)) {
    if (value !== null && value !== undefined) {
      // Arrays: verificar que tengan elementos
      // Objetos: verificar que tengan propiedades
      // Strings: verificar que no estén vacíos
      return true;
    }
  }
  
  return false;
}
```

---

## 🧪 Testing

**Archivo**: `client/src/hooks/useTransactionalPages.test.ts`

**Tests**:
1. ✅ Retorna array vacío cuando está cargando
2. ✅ Filtra solo páginas transaccionales
3. ✅ Encuentra página por URI (normaliza `/` inicial/final)
4. ✅ Retorna undefined para página inexistente

**Ejecutar tests**:
```bash
pnpm test useTransactionalPages.test.ts
```

---

## 🚀 Uso

### **1. Crear Página en WordPress**

1. Ir a **Páginas → Añadir nueva**
2. Título: "Camisetas Personalizadas"
3. Slug: `camisetas-personalizadas`
4. **Plantilla**: Seleccionar "Plantilla SEO (Headless Minimal)"
5. Rellenar campos ACF:
   - Hero Section (título, intro)
   - SEO Meta (description, canonical, etc.)
   - Page Blocks (añadir bloques según necesidad)
6. Publicar

### **2. Acceder desde Frontend**

```
https://impacto33.com/camisetas-personalizadas/
```

La página se renderizará automáticamente con:
- Hero section
- Breadcrumbs (si configurado)
- Bloques dinámicos (solo los que tengan contenido)
- SEO meta tags completos

---

## 🔄 Migración de Páginas Existentes

**Páginas a migrar desde configuración interna**:

1. Categorías madre (ej: `/camisetas-personalizadas/`)
2. Categorías hijas (ej: `/camisetas-personalizadas/manga-larga/`)
3. Páginas de servicio (ej: `/servicios/serigrafia/`)

**Proceso**:
1. Crear página en WordPress con plantilla ACF
2. Copiar contenido existente a campos ACF
3. Configurar bloques según estructura actual
4. Verificar renderizado en frontend
5. Eliminar configuración interna (si aplica)

---

## 🎯 Próximos Pasos

### **Fase 1: Refinamiento de Bloques (Iterativo)**

Refinar diseño de bloques según prioridad:
1. `productos_dinamicos` (más usado)
2. `subcategorias` (navegación)
3. `testimonios` (social proof)
4. `stats` (impacto visual)
5. Resto según necesidad

### **Fase 2: Migración de Contenido**

1. Identificar páginas transaccionales actuales
2. Crear páginas en WordPress
3. Migrar contenido bloque por bloque
4. Testing de SEO y rendimiento

### **Fase 3: Optimización**

1. Lazy loading de bloques
2. Caché de queries GraphQL
3. Optimización de imágenes
4. Performance monitoring

---

## 📚 Referencias

- **Query completa**: `client/src/queries/seoPageComplete.ts`
- **Hooks**: `client/src/hooks/useTransactional*.ts`
- **Componentes**: `client/src/components/blocks/`
- **Tests**: `client/src/hooks/useTransactionalPages.test.ts`

---

## ⚠️ Notas Importantes

1. **Bloques desconocidos**: Se ignoran silenciosamente (no rompen la página)
2. **Bloques vacíos**: Se filtran automáticamente (no se renderizan)
3. **SEO**: Todos los meta tags se generan automáticamente desde `seoMeta`
4. **Caché**: Las queries usan `cache-first` para mejor rendimiento
5. **404**: Si la página no existe o no usa plantilla transaccional → 404

---

## 🐛 Troubleshooting

### **Página no se renderiza**

1. Verificar que la página usa la plantilla correcta en WordPress
2. Verificar que la página está publicada (no borrador)
3. Verificar que el slug coincide con la URL
4. Revisar consola del navegador para errores de GraphQL

### **Bloque no aparece**

1. Verificar que el bloque tiene contenido (no todos los campos null)
2. Verificar que el `blockType` coincide con el mapeo en `BlockRenderer`
3. Verificar que el componente del bloque existe

### **Fondos no alternan**

1. Verificar que `BlockRenderer` está usando el `index` correctamente
2. Verificar que los bloques filtrados mantienen el orden correcto

---

**Última actualización**: 2026-02-03
