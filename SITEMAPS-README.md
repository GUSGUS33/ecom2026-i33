# 📍 Generación de Sitemaps - IMPACTO33

Este proyecto incluye un sistema completo de generación de sitemaps XML para mejorar el SEO y la indexación en Google.

## 📂 Archivos Generados

### 1. **sitemap-index.xml** (Índice principal)
Archivo maestro que enlaza todos los sitemaps individuales. Google recomienda usar un índice cuando tienes múltiples sitemaps.

**Ubicación:** `/client/public/sitemap-index.xml`  
**URL pública:** `https://impacto33.com/sitemap-index.xml`

### 2. **sitemap.xml** (Páginas estáticas y categorías)
Contiene todas las páginas estáticas del sitio y las categorías transaccionales definidas en `seo-sitemap.json`.

**Ubicación:** `/client/public/sitemap.xml`  
**URL pública:** `https://impacto33.com/sitemap.xml`  
**Contenido:**
- Páginas estáticas (Home, Contacto, Quiénes somos, etc.)
- Categorías madre e hijas (definidas en SEO)
- Páginas de servicios y legales

### 3. **sitemap-products.xml** (Catálogo de productos)
Sitemap dinámico que contiene **todos los productos** del catálogo de WooCommerce obtenidos mediante GraphQL.

**Ubicación:** `/client/public/sitemap-products.xml`  
**URL pública:** `https://impacto33.com/sitemap-products.xml`  
**Contenido:**
- 1,702 URLs de productos individuales
- Imágenes de productos (schema `image:image`)
- Fechas de última modificación
- Prioridad máxima (1.0) para productos

## 🚀 Comandos de Generación

### Generar todos los sitemaps
```bash
pnpm build:sitemap
```
Este comando ejecuta ambos scripts en secuencia:
1. `generate-sitemap.mjs` → Genera `sitemap.xml`
2. `generate-sitemap-products.mjs` → Genera `sitemap-products.xml` y `sitemap-index.xml`

### Generar solo el sitemap de productos
```bash
pnpm build:sitemap:products
```
Útil cuando solo necesitas actualizar el catálogo de productos sin regenerar las páginas estáticas.

## 🔄 ¿Cuándo Regenerar los Sitemaps?

### Sitemap de productos (`sitemap-products.xml`)
**Regenerar cuando:**
- Se añadan nuevos productos al catálogo de WooCommerce
- Se modifiquen slugs o URLs de productos existentes
- Se actualicen imágenes de productos
- Cambien las categorías de productos

**Frecuencia recomendada:** Diaria o semanal (dependiendo de la frecuencia de actualización del catálogo)

### Sitemap de páginas estáticas (`sitemap.xml`)
**Regenerar cuando:**
- Se añadan nuevas páginas estáticas al sitio
- Se modifiquen las categorías transaccionales en `seo-sitemap.json`
- Se cambien las rutas de navegación

**Frecuencia recomendada:** Mensual o cuando haya cambios estructurales

## 📋 Configuración de robots.txt

El archivo `robots.txt` ya está configurado para referenciar todos los sitemaps:

```txt
# Sitemaps
Sitemap: https://impacto33.com/sitemap-index.xml
Sitemap: https://impacto33.com/sitemap.xml
Sitemap: https://impacto33.com/sitemap-products.xml
```

## 🔧 Configuración Técnica

### Script de Productos (`generate-sitemap-products.mjs`)

**Características:**
- Paginación automática (100 productos por página)
- Soporte para productos simples y variables
- Inclusión de imágenes con schema `image:image`
- Fechas de última modificación (`lastmod`)
- Manejo de errores y reintentos
- Delay entre peticiones para evitar rate limiting

**Configuración:**
```javascript
const BASE_URL = 'https://impacto33.com';
const GRAPHQL_URL = 'https://creativu.es/graphql';
const PRODUCTS_PER_PAGE = 100;
```

### Estructura XML

Los sitemaps siguen el estándar oficial de [sitemaps.org](https://www.sitemaps.org/):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://impacto33.com/producto/ejemplo</loc>
    <lastmod>2025-12-19</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://example.com/image.jpg</image:loc>
      <image:title>Nombre del Producto</image:title>
    </image:image>
  </url>
</urlset>
```

## 📊 Estadísticas Actuales

- **Páginas estáticas:** ~30 URLs
- **Categorías transaccionales:** ~15 URLs
- **Productos:** 1,702 URLs
- **Total:** ~1,747 URLs indexables

## 🎯 Envío a Google Search Console

Una vez desplegado el sitio:

1. Accede a [Google Search Console](https://search.google.com/search-console)
2. Ve a **Sitemaps** en el menú lateral
3. Añade la URL del índice principal:
   ```
   https://impacto33.com/sitemap-index.xml
   ```
4. Google detectará automáticamente los sitemaps individuales

## ⚠️ Notas Importantes

- Los sitemaps se generan de forma **estática** durante el build
- No se regeneran automáticamente en producción
- Debes ejecutar los comandos manualmente cuando haya cambios
- Los archivos se guardan en `client/public/` para ser servidos directamente
- El límite de Google es 50,000 URLs por sitemap (estamos muy por debajo)

## 🔮 Mejoras Futuras

- [ ] Automatizar la regeneración con GitHub Actions o cron jobs
- [ ] Añadir sitemap para imágenes independiente
- [ ] Incluir sitemap de noticias/blog si se añade contenido editorial
- [ ] Implementar compresión gzip para sitemaps grandes
- [ ] Añadir validación XML automática antes de deployment
