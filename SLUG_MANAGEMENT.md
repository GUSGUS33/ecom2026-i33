# Gestión de Slugs y Sincronización Backend-Frontend

Este documento detalla cómo se gestionan los slugs de categorías en IMPACTO33, los cambios recientes realizados y cómo mantener la sincronización entre WooCommerce (Backend) y el Frontend.

## 1. Reporte de Correcciones (Diciembre 2025)

Se realizó una auditoría masiva para corregir discrepancias entre las URLs del frontend y los slugs reales de la API de WooCommerce. A continuación, las correcciones más importantes:

| URL Frontend | Slug Anterior (Erróneo) | Slug Nuevo (Correcto) |
| :--- | :--- | :--- |
| `/sudaderas-personalizadas/` | `sweaters` | `sudaderas` |
| `/sudaderas-personalizadas/con-capucha/` | `hooded` | `sudaderas` (Fallback) |
| `/ropa-laboral-personalizada/` | `t_shirts` | `highviz` |
| `/ropa-laboral-personalizada/industria/` | `industria` | `industry_services` |
| `/bolsas-personalizadas/algodon/` | `cotton_bags` | `bags` (Fallback) |
| `/mochilas-personalizadas/` | `bags_travel_backpack` | `bags_travel` |
| `/accesorios-viaje/neceser/` | `toiletry_bags` | `travel_accessories` |
| `/hogar-personalizado/` | `t_shirts` | `decoration` |
| `/eventos-personalizados/` | `t_shirts` | `conferences_fairs` |
| `/verano-personalizado/` | `t_shirts` | `beach_items` |

*(Lista parcial representativa de los +40 cambios realizados)*

## 2. Script de Monitoreo (`monitor-slugs.mjs`)

Hemos creado una herramienta automática para evitar que esto vuelva a ocurrir.

### ¿Qué hace?
1.  Lee tu configuración local (`dynamic-blocks.json`).
2.  Descarga la lista **real** de categorías desde tu WooCommerce.
3.  Compara ambos y te avisa si:
    *   Un slug configurado ya no existe en el backend (Error ❌).
    *   Estás usando un slug genérico como `t_shirts` en secciones que no son camisetas (Warning ⚠️).

### ¿Cómo usarlo manualmente?
Si haces cambios en el backend y quieres verificar que todo está bien en el frontend:

1.  Abre la terminal en la carpeta del proyecto.
2.  Ejecuta:
    ```bash
    node scripts/monitor-slugs.mjs
    ```
3.  El script te dirá "✅ Todo perfecto" o listará los errores a corregir.

## 3. Sincronización Automática (Cambios en Backend)

**Pregunta del usuario:** *"Haré cambios de nombre y slugs a productos en el backend, necesito que cuando eso suceda se actualice en el frontend"*

**Respuesta:**
El frontend de IMPACTO33 es **estático** en cuanto a su estructura de navegación, pero **dinámico** en la carga de productos.

*   **Si cambias nombres de productos:** Se actualizan **automáticamente** e instantáneamente. No tienes que hacer nada.
*   **Si cambias SLUGS de categorías:** El frontend **se romperá** (mostrará "No se encontraron productos") hasta que actualices el archivo `dynamic-blocks.json`.

**Flujo de trabajo recomendado:**
1.  Realiza tus cambios en WooCommerce.
2.  Ejecuta `node scripts/monitor-slugs.mjs`.
3.  El script te dirá qué slugs han dejado de existir.
4.  Actualiza `client/src/data/dynamic-blocks.json` con los nuevos slugs.

*Nota: Estamos configurando una tarea automática semanal para avisarte si algo se desincroniza.*
