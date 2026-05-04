# Feed XML Google Merchant Center - Estado de Variaciones

## 📊 Resumen de Implementación

### ✅ Completado

1. **Feed básico funcionando** (sin variaciones)
   - Endpoint: `/feeds/google.xml`
   - Productos: 1,702 items
   - Formato: RSS 2.0 con namespace Google
   - Caché: 15 minutos
   - Campos: id, title, description, link, image_link, price, availability, condition, brand, mpn

2. **Código de variaciones implementado**
   - Query GraphQL para obtener variaciones individuales
   - Lógica de generación de items por variación
   - Soporte para `g:item_group_id`, `g:color`, `g:size`
   - Procesamiento en batches para evitar sobrecarga

### ⚠️ Problema Detectado

**Timeout al generar feed completo con variaciones**

El catálogo tiene aproximadamente:
- 1,702 productos base
- ~70% son productos variables (1,191 productos)
- Promedio de 8 variaciones por producto
- **Total estimado: ~10,000 items en el feed**

Obtener variaciones para cada producto requiere:
- 1 query GraphQL por producto variable
- 1,191 queries × 2 segundos promedio = **40 minutos**
- Timeout HTTP: 5 minutos máximo

## 🎯 Opciones Disponibles

### Opción 1: Feed Básico (Recomendado para MVP)

**Usar el feed actual sin variaciones**

✅ **Ventajas:**
- Funciona inmediatamente
- 1,702 productos indexados en Google
- Actualización rápida (30 segundos)
- Suficiente para empezar a vender

❌ **Limitaciones:**
- No muestra colores/tallas específicas
- Precio genérico por producto
- Stock global (no por variación)

**Implementación:** Ya está funcionando en `/feeds/google.xml`

---

### Opción 2: Generación Asíncrona con Cron Job

**Generar el feed completo en background cada noche**

✅ **Ventajas:**
- Feed completo con todas las variaciones
- ~10,000 items indexados
- No afecta el rendimiento del sitio
- Actualización automática diaria

⚠️ **Consideraciones:**
- Requiere configurar un cron job
- Primera generación toma 40-60 minutos
- Feed se actualiza una vez al día

**Implementación necesaria:**
```bash
# Cron job diario a las 3:00 AM
0 3 * * * curl -X POST https://impacto33.com/api/generate-merchant-feed-async
```

---

### Opción 3: Feed Híbrido (Mejor de ambos mundos)

**Feed básico + variaciones solo para productos destacados**

✅ **Ventajas:**
- Rápido de generar (2-3 minutos)
- Productos principales con variaciones completas
- Resto de productos con info básica

📊 **Ejemplo:**
- Top 100 productos: Con variaciones (800 items)
- Resto 1,602 productos: Sin variaciones (1,602 items)
- **Total: ~2,400 items**

**Implementación necesaria:**
- Filtrar productos por ventas/popularidad
- Obtener variaciones solo para top products

---

### Opción 4: Feed Simplificado con Atributos

**Usar campos de Google para indicar variaciones sin items separados**

✅ **Ventajas:**
- Generación rápida
- Google entiende que hay variaciones
- No requiere queries adicionales

❌ **Limitaciones:**
- Menos preciso que items individuales
- No permite precios diferentes por variación

**Implementación:**
```xml
<item>
  <g:id>12345</g:id>
  <g:title>Camiseta TRALEM</g:title>
  <g:color>Rojo, Azul, Verde, Amarillo</g:color>
  <g:size>S, M, L, XL</g:size>
  ...
</item>
```

---

## 💡 Recomendación

Para el **MVP y lanzamiento inicial**, recomiendo:

**Opción 1 (Feed Básico)** para empezar inmediatamente, y luego migrar a **Opción 2 (Generación Asíncrona)** cuando el sitio esté en producción.

**Razones:**
1. **Velocidad:** Puedes empezar a indexar productos hoy mismo
2. **Simplicidad:** No requiere configuración adicional
3. **Escalabilidad:** Fácil migrar a feed completo después
4. **ROI:** 1,702 productos indexados es suficiente para generar ventas

---

## 🚀 Próximos Pasos

### Para usar Feed Básico (Opción 1):
```bash
# El feed ya está funcionando
https://impacto33.com/feeds/google.xml

# Configurar en Google Merchant Center:
# - URL del feed: https://impacto33.com/feeds/google.xml
# - Frecuencia: Diaria
# - Hora: 3:00 AM
```

### Para implementar Generación Asíncrona (Opción 2):
1. Crear endpoint `/api/generate-merchant-feed-async`
2. Implementar sistema de jobs en background
3. Guardar feed generado en archivo estático
4. Configurar cron job en el servidor
5. Servir archivo estático desde `/feeds/google.xml`

---

## 📈 Métricas Actuales

| Métrica | Valor |
|---------|-------|
| Productos totales | 1,702 |
| Productos simples | ~30% (510) |
| Productos variables | ~70% (1,192) |
| Variaciones estimadas | ~10,000 |
| Tiempo generación básica | 30 segundos |
| Tiempo generación completa | 40-60 minutos |
| Tamaño feed básico | ~750 KB |
| Tamaño feed completo estimado | ~4.5 MB |

---

## 🔧 Archivos Modificados

1. `server/graphql/merchantFeedQuery.ts` - Queries GraphQL
2. `server/services/merchantFeedService.ts` - Generación XML con variaciones
3. `server/routes/merchantFeed.ts` - Endpoint y lógica de batches
4. `server/_core/index.ts` - Registro de rutas

---

## 📝 Notas Técnicas

- WooCommerce GraphQL tiene límite de timeout en queries complejas
- Queries con variaciones anidadas causan "Internal Server Error"
- Solución: Queries separadas por producto (más lento pero funcional)
- Caché de 15 minutos para evitar regeneraciones frecuentes
- Feed cumple con especificaciones de Google Merchant Center

---

**Última actualización:** 2025-12-31  
**Estado:** Feed básico funcionando ✅ | Variaciones en desarrollo ⚙️
