# Filtro de Color - Temporalmente Deshabilitado

## Estado Actual

El **filtro de color** en el sidebar de productos está **temporalmente deshabilitado** hasta que se implementen thumbnails optimizados en WordPress.

## Motivo

Las imágenes de variaciones de productos son **1000x1000px** (aprox. 100-300KB cada una). Cargar 20-30 círculos de color en una página significaría:

- **2-9 MB** de imágenes adicionales solo para los filtros
- **Tiempo de carga lento** en conexiones lentas
- **Consumo innecesario de ancho de banda**

## Solución Pendiente

### 1. Plugin de Thumbnails en WordPress Headless

Crear o instalar un plugin que genere thumbnails optimizados automáticamente:

- **Tamaño recomendado**: 100x100px o 150x150px
- **Formato**: WebP (mejor compresión) o JPEG (mayor compatibilidad)
- **Peso objetivo**: <10KB por thumbnail
- **Generación**: Automática al subir/actualizar imagen de variación

### 2. Modificar Query GraphQL

Actualizar la query `GET_PRODUCTS_WITH_VARIATIONS` para obtener thumbnails:

```graphql
variations {
  nodes {
    id
    name
    price
    attributes {
      nodes {
        name
        value
      }
    }
    image {
      sourceUrl          # Imagen completa (1000x1000px)
      thumbnail {         # NUEVO: Thumbnail optimizado
        sourceUrl         # URL del thumbnail (100x100px)
        width
        height
      }
      altText
    }
  }
}
```

### 3. Actualizar Código Frontend

En `useFilteredProducts.ts`, usar thumbnail en lugar de imagen completa:

```typescript
// ANTES
colorsMap.set(colorAttr.value, variation.image?.sourceUrl || null);

// DESPUÉS
colorsMap.set(colorAttr.value, variation.image?.thumbnail?.sourceUrl || variation.image?.sourceUrl || null);
```

## Cómo Reactivar el Filtro

### Paso 1: Verificar Thumbnails en WordPress

1. Acceder a WordPress admin
2. Ir a un producto variable con imágenes de variaciones
3. Verificar que las imágenes tengan thumbnails generados
4. Comprobar peso de thumbnails (<10KB ideal, <50KB aceptable)

### Paso 2: Actualizar Query GraphQL

Modificar `/home/ubuntu/impacto33-mvp/client/src/queries/products.ts`:

- Añadir campo `thumbnail` dentro de `image`
- Verificar que la query retorna URLs de thumbnails

### Paso 3: Actualizar Hook de Productos

Modificar `/home/ubuntu/impacto33-mvp/client/src/hooks/useFilteredProducts.ts`:

- Cambiar `variation.image?.sourceUrl` por `variation.image?.thumbnail?.sourceUrl`
- Mantener fallback a imagen completa si no hay thumbnail

### Paso 4: Reactivar Filtro en ProductFilters

Editar `/home/ubuntu/impacto33-mvp/client/src/components/ProductFilters.tsx`:

**Línea 125** - Cambiar:
```tsx
{false && availableColors.length > 0 && (
```

Por:
```tsx
{availableColors.length > 0 && (
```

### Paso 5: Testing

1. Navegar a página transaccional (ej: `/camisetas-personalizadas/`)
2. Abrir DevTools → Network → Img
3. Verificar que se cargan thumbnails pequeños (<50KB)
4. Comprobar que círculos de color se ven correctamente
5. Probar filtrado por color (click en círculos)

## Código Actual

El código del filtro está **completo y funcional**, solo deshabilitado con `false &&`:

- ✅ Círculos con zoom 200% para mostrar solo el color
- ✅ Centrado perfecto con `transform: translate(-50%, -50%)`
- ✅ Tooltips con nombres de colores
- ✅ Checkmark en colores seleccionados
- ✅ Etiquetas de colores activos
- ✅ Botón "Limpiar filtros"

## Archivos Relacionados

- **ProductFilters.tsx**: Componente de filtros (línea 125 para reactivar)
- **useFilteredProducts.ts**: Hook que extrae colores de variaciones
- **products.ts**: Queries GraphQL de productos
- **ProductosDinamicosBlock.tsx**: Bloque que usa los filtros

## Notas Técnicas

### Alternativa: Lazy Loading de Imágenes

Si no es posible implementar thumbnails en WordPress, considerar:

1. **Intersection Observer**: Cargar imágenes solo cuando el usuario hace scroll hasta los filtros
2. **Blur Placeholder**: Mostrar versión borrosa mientras carga la imagen completa
3. **Limitar colores**: Mostrar solo los 10 colores más comunes

### Alternativa: Filtro de Color sin Imágenes

Otra opción es usar **círculos de color sólido** basados en el nombre del color:

```typescript
const colorMap: Record<string, string> = {
  "Amarillo": "#FFD700",
  "Azul": "#0066CC",
  "Rojo": "#CC0000",
  // ... más colores
};
```

**Ventajas**:
- ✅ Carga instantánea (sin imágenes)
- ✅ Peso mínimo (solo CSS)

**Desventajas**:
- ❌ No muestra el color exacto del producto
- ❌ Requiere mapeo manual de nombres a colores
- ❌ No funciona con colores personalizados/complejos

## Conclusión

El filtro de color está **listo para producción**, solo falta:

1. ✅ Implementar thumbnails en WordPress
2. ✅ Actualizar query GraphQL
3. ✅ Cambiar `false &&` por `` en ProductFilters.tsx línea 125

**Tiempo estimado de reactivación**: 30 minutos (una vez que los thumbnails estén disponibles)
