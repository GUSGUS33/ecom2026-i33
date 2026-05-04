# Feed XML para Google Merchant Center

## 📍 Descripción

Sistema completo de generación de feed XML para Google Merchant Center que obtiene productos automáticamente desde WooCommerce vía GraphQL y los convierte al formato RSS 2.0 requerido por Google.

## 🌐 Endpoints Disponibles

### 1. Feed XML Principal
```
GET /feeds/google.xml
```
**Descripción:** Retorna el feed XML completo con todos los productos del catálogo.

**Content-Type:** `application/xml; charset=utf-8`

**Caché:** 15 minutos (automático)

**Ejemplo de uso:**
```bash
curl https://impacto33.com/feeds/google.xml
```

### 2. Estadísticas del Feed
```
GET /feeds/google.xml/stats
```
**Descripción:** Retorna estadísticas del feed en formato JSON.

**Respuesta:**
```json
{
  "totalProducts": 1702,
  "simpleProducts": 850,
  "variableProducts": 852,
  "totalFeedItems": 1702,
  "cacheStatus": "valid",
  "cacheAge": 120,
  "cacheExpiry": 780
}
```

### 3. Limpiar Caché
```
POST /feeds/google.xml/clear-cache
```
**Descripción:** Limpia el caché manualmente para forzar regeneración del feed.

**Respuesta:**
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

## 📋 Campos del Feed

### Campos Obligatorios (Google Merchant)
- ✅ `g:id` - ID único del producto (databaseId de WooCommerce)
- ✅ `g:title` - Nombre del producto
- ✅ `g:description` - Descripción del producto (sin HTML, máx 5000 caracteres)
- ✅ `g:link` - URL del producto en impacto33.com
- ✅ `g:image_link` - URL de la imagen principal
- ✅ `g:price` - Precio en formato "123.45 EUR"
- ✅ `g:availability` - Estado de stock (in stock / out of stock / preorder)
- ✅ `g:condition` - Condición del producto (new)

### Campos Opcionales Implementados
- ✅ `g:brand` - Marca (fijo: "IMPACTO33")
- ✅ `g:mpn` - Código de fabricante (SKU del producto)

### Campos Opcionales NO Implementados
- ❌ `g:gtin` - EAN/UPC (no disponible en WooCommerce actual)
- ❌ `g:item_group_id` - Agrupación de variaciones (implementación futura)

## 🔧 Arquitectura Técnica

### Archivos Creados

1. **`server/graphql/merchantFeedQuery.ts`**
   - Query GraphQL optimizada con inline fragments
   - Interfaces TypeScript para productos
   - Soporte para SimpleProduct, VariableProduct, ExternalProduct, GroupProduct

2. **`server/services/merchantFeedService.ts`**
   - Generación de XML RSS 2.0
   - Escape de caracteres especiales XML
   - Formateo de precios
   - Limpieza de HTML en descripciones
   - Mapeo de estados de stock

3. **`server/routes/merchantFeed.ts`**
   - Endpoint Express `/feeds/google.xml`
   - Sistema de caché en memoria (15 minutos)
   - Paginación automática (100 productos por batch)
   - Endpoints auxiliares (stats, clear-cache)

4. **`server/merchantFeedRouter.ts`**
   - Router tRPC alternativo (para uso interno)
   - Misma funcionalidad que routes/merchantFeed.ts

### Flujo de Datos

```
WooCommerce GraphQL (creativu.es/graphql)
          ↓
  fetchAllProducts() con paginación
          ↓
  Procesar productos (1702 items)
          ↓
  generateMerchantFeedXML()
          ↓
  Caché en memoria (15 min)
          ↓
  Endpoint /feeds/google.xml
          ↓
  Google Merchant Center
```

## ⚙️ Configuración

### Variables de Entorno

```bash
# URL del endpoint GraphQL de WooCommerce
VITE_WP_GRAPHQL_URL=https://creativu.es/graphql
```

### Caché

- **Duración:** 15 minutos
- **Tipo:** En memoria (se pierde al reiniciar servidor)
- **Regeneración:** Automática al expirar o manual vía `/clear-cache`

### Paginación

- **Tamaño de batch:** 100 productos por request
- **Total esperado:** ~1702 productos
- **Tiempo de generación:** 30-60 segundos (primera vez)

## 📊 Formato XML Generado

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>IMPACTO33 - Regalos Publicitarios y Ropa Personalizada</title>
    <link>https://impacto33.com</link>
    <description>Catálogo completo de productos personalizados: ropa, merchandising, regalos publicitarios y artículos promocionales</description>
    
    <item>
      <g:id>78629</g:id>
      <g:title>TRALEM</g:title>
      <g:description>Lápiz de madera redondo. Cuenta con una goma en su extremo...</g:description>
      <g:link>https://impacto33.com/producto/tralem</g:link>
      <g:image_link>https://creativu.es/wp-content/uploads/2024/...</g:image_link>
      <g:price>0.50 EUR</g:price>
      <g:availability>in stock</g:availability>
      <g:condition>new</g:condition>
      <g:brand>IMPACTO33</g:brand>
      <g:mpn>TRALEM-001</g:mpn>
    </item>
    
    <!-- ... más items ... -->
    
  </channel>
</rss>
```

## 🚀 Configuración en Google Merchant Center

### Paso 1: Añadir el Feed

1. Ir a **Merchant Center** → **Productos** → **Feeds**
2. Click en **Agregar feed**
3. Seleccionar país: **España**
4. Seleccionar idioma: **Español**
5. Nombre del feed: **IMPACTO33 - Catálogo Principal**

### Paso 2: Configurar Origen

1. Tipo de feed: **Feed programado**
2. Método de obtención: **Obtener desde URL**
3. URL del feed: `https://impacto33.com/feeds/google.xml`
4. Frecuencia: **Diaria** (recomendado)
5. Hora: **03:00 AM** (horario de menor tráfico)

### Paso 3: Validar

1. Click en **Obtener ahora** para validar
2. Verificar que no hay errores críticos
3. Revisar advertencias y corregir si es necesario

## 🐛 Debugging

### Ver Estadísticas en Tiempo Real

```bash
curl https://impacto33.com/feeds/google.xml/stats
```

### Forzar Regeneración del Feed

```bash
curl -X POST https://impacto33.com/feeds/google.xml/clear-cache
```

### Ver Logs del Servidor

Los logs incluyen información detallada:
- `[Merchant Feed] Starting to fetch products from: ...`
- `[Merchant Feed] Fetching batch: first=100, after=...`
- `[Merchant Feed] Total products fetched: 1702`
- `[Merchant Feed] Generated feed with X items`

## ⚠️ Limitaciones Conocidas

1. **Variaciones de productos:** Actualmente se genera 1 item por producto variable (con precio base). No se generan items individuales por cada variación (color, talla, etc.).

2. **GTIN/EAN:** No se incluye porque WooCommerce no tiene estos campos por defecto. Se usa `g:mpn` (SKU) como alternativa.

3. **Imágenes de variaciones:** Se usa la imagen principal del producto, no las imágenes específicas de cada variación.

4. **Caché en memoria:** Se pierde al reiniciar el servidor. Para producción se recomienda usar Redis o similar.

## 🔮 Mejoras Futuras

1. **Variaciones completas:** Implementar query adicional para obtener todas las variaciones y generar items individuales con `g:item_group_id`.

2. **Caché persistente:** Migrar a Redis para mantener caché entre reinicios.

3. **GTIN/EAN:** Añadir campos personalizados en WooCommerce y actualizar query.

4. **Categorías Google:** Mapear categorías de WooCommerce a taxonomía de Google (`g:google_product_category`).

5. **Atributos adicionales:** Añadir `g:color`, `g:size`, `g:material`, etc.

6. **Feed incremental:** Implementar feed de cambios (solo productos modificados).

## 📚 Referencias

- [Especificación de feeds de Google Merchant](https://support.google.com/merchants/answer/7052112)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)
- [WooCommerce GraphQL Schema](https://docs.wpgraphql.com/extensions/wpgraphql-woocommerce)

## ✅ Checklist de Deployment

- [x] Código implementado y testeado
- [x] Endpoint `/feeds/google.xml` accesible
- [x] Query GraphQL optimizada con inline fragments
- [x] Caché de 15 minutos configurado
- [x] Paginación funcionando correctamente
- [x] Formato XML validado contra especificaciones
- [ ] Deploy a producción (GitHub)
- [ ] Configurar en Google Merchant Center
- [ ] Validar feed en Merchant Center
- [ ] Monitorear errores durante 7 días
- [ ] Optimizar basado en feedback de Google
