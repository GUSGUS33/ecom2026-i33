# Feed XML Estático para Google Merchant Center

## ✅ Estado: COMPLETADO

Se ha generado exitosamente un feed XML estático con **todos los 1,702 productos** de WooCommerce.

---

## 📊 Detalles del Feed Generado

- **Archivo:** `/client/public/feeds/google.xml`
- **Productos:** 1,702 (100% del catálogo)
- **Tamaño:** 3.0 MB (3,001,981 bytes)
- **Formato:** RSS 2.0 con namespace Google Merchant Center
- **Fecha de generación:** 2 de enero de 2026

---

## 🔧 Problema Resuelto: Rate Limiting

### Problema Original
El endpoint dinámico `/feeds/google.xml` se detenía en 200 productos debido a:
- **Error 429: Too Many Requests** del servidor de WooCommerce
- WordFence firewall limitando peticiones consecutivas
- Paginación detenida prematuramente

### Solución Implementada
Script Python con **delay de 3 segundos** entre peticiones:
```python
# Delay para evitar rate limiting
if has_next_page:
    print(f"    Waiting 3 seconds to avoid rate limiting...")
    time.sleep(3)
```

**Resultado:** 18 páginas procesadas exitosamente (100 productos por página + 2 en la última)

---

## 📁 Ubicación del Archivo

### En el proyecto local:
```
/home/ubuntu/impacto33-mvp/client/public/feeds/google.xml
```

### En el servidor IONOS (después de subir):
```
https://impacto33.com/feeds/google.xml
```

---

## 🚀 Próximos Pasos

### 1. Subir a IONOS
El usuario debe subir manualmente el archivo a IONOS:
- Ruta en IONOS: `/public/feeds/google.xml`
- Método: FTP, cPanel File Manager o GitHub deploy

### 2. Configurar Google Merchant Center
Una vez subido, configurar en Google Merchant Center:
- **URL del feed:** `https://impacto33.com/feeds/google.xml`
- **Tipo:** RSS 2.0
- **Frecuencia de actualización:** Diaria (recomendado)

### 3. Regenerar el Feed (cuando haya cambios)
Ejecutar el script Python cuando se actualicen productos:
```bash
python3 /tmp/generate-merchant-feed.py
```
Luego subir el nuevo archivo a IONOS.

---

## 🔄 Migración Futura a Feed Dinámico

Una vez que IONOS configure Node.js en el servidor:

1. **Activar el endpoint dinámico:**
   - URL: `https://impacto33.com/api/feeds/google.xml`
   - El código ya está implementado en `/server/routes/feeds.ts`

2. **Añadir delay en el código del servidor:**
   ```typescript
   // En /server/services/googleMerchantFeed.ts
   if (hasNextPage) {
     await new Promise(resolve => setTimeout(resolve, 3000));
   }
   ```

3. **Actualizar URL en Google Merchant Center:**
   - Cambiar de `/feeds/google.xml` (estático) a `/api/feeds/google.xml` (dinámico)

---

## 📋 Estructura del Feed XML

Cada producto incluye:

### Campos Obligatorios
- `g:id` - ID del producto
- `g:title` - Título del producto
- `g:description` - Descripción completa (HTML limpio)
- `g:link` - URL del producto en impacto33.com
- `g:image_link` - URL de la imagen principal
- `g:price` - Precio en EUR
- `g:availability` - Estado de stock (in stock / out of stock)
- `g:condition` - Condición (new)

### Campos Opcionales
- `g:brand` - Marca (IMPACTO33)
- `g:mpn` - Número de referencia (SKU)

---

## 🛠️ Script de Generación

**Ubicación:** `/tmp/generate-merchant-feed.py`

**Características:**
- Paginación automática (100 productos por página)
- Delay de 3 segundos entre peticiones
- Limpieza de HTML en descripciones
- Validación de URLs de imágenes
- Manejo de productos simples y variables
- Generación de XML conforme a especificaciones de Google

**Tiempo de ejecución:** ~1-2 minutos para 1,702 productos

---

## ✅ Validación

El feed ha sido validado:
- ✅ 1,702 elementos `<item>` generados
- ✅ Estructura XML válida
- ✅ Todos los campos obligatorios presentes
- ✅ URLs de productos e imágenes correctas
- ✅ Precios en formato EUR
- ✅ Descripciones limpias (sin HTML)

---

## 📞 Soporte

Para regenerar el feed o resolver problemas:
1. Ejecutar el script Python en el sandbox
2. Copiar el archivo generado a `/client/public/feeds/`
3. Subir a IONOS vía FTP o GitHub

**Nota:** El feed estático es una solución temporal hasta que IONOS configure Node.js. Una vez configurado, se recomienda migrar al endpoint dinámico para actualizaciones automáticas.
