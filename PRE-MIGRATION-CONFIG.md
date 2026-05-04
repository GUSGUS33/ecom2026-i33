# Configuración Crítica del Proyecto - Pre-Migración
## IMPACTO33 MVP — Manus 1.6 → 1.6 Max
**Fecha:** 2026-03-13
**Estado:** ✅ LISTO PARA MIGRAR

---

## 1. Secrets / Variables de Entorno

| Variable | Descripción | Estado |
|----------|-------------|--------|
| `VITE_SUPABASE_URL` | `https://opwryjxwhfhjkficumsv.supabase.co` | ✅ Configurado |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima pública de Supabase | ✅ Configurado |
| `VITE_WP_GRAPHQL_URL` | `https://creativu.es/graphql` | ✅ Configurado |
| `DATABASE_URL` | MySQL/TiDB interno de Manus | ✅ Auto-inyectado |
| `JWT_SECRET` | Secreto para sesiones | ✅ Auto-inyectado |
| `VITE_APP_ID` | ID de la app Manus OAuth | ✅ Auto-inyectado |

**⚠️ ACCIÓN POST-MIGRACIÓN:** Verificar que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` siguen configurados en el nuevo plan.

---

## 2. Bases de Datos

### Base de Datos Interna (MySQL/TiDB de Manus)
- **Tablas:** users, wishlist, viewed_products, + tablas del sistema
- **Estado:** ✅ Activa y funcionando
- **Migración:** Automática (gestionada por Manus)

### Supabase (impacto33-ecommerce)
- **Proyecto ID:** `opwryjxwhfhjkficumsv`
- **URL:** `https://opwryjxwhfhjkficumsv.supabase.co`
- **Tablas:** wishlist, wishlist_impacto33, user_personalization, viewed_products, cart_items, carts, orders, order_items, payment_events, search_history
- **Estado:** ✅ Activa (restaurada el 2026-03-13)
- **Migración:** No requiere migración (es externa a Manus)

---

## 3. Integraciones Externas

| Integración | URL/Config | Estado |
|-------------|-----------|--------|
| WordPress GraphQL | `https://creativu.es/graphql` | ✅ Activo |
| CORS en WordPress | MU-plugin `graphql-cors-manus.php` | ✅ Configurado |
| Supabase Auth | Proyecto `opwryjxwhfhjkficumsv` | ✅ Activo |
| Elfsight Reviews | Widget ID: `002cb98a-9032-4065-ae41-780f662588ea` | ✅ Activo |

---

## 4. Estado del Código

| Verificación | Resultado |
|-------------|-----------|
| Errores TypeScript | ✅ 0 errores |
| Tests | ✅ 124/124 pasando |
| Dependencias | ✅ Instaladas |
| Git status | ✅ Limpio |
| Servidor dev | ✅ Funcionando |

---

## 5. Checklist Post-Migración

Después de migrar a Manus 1.6 Max, verificar:

- [ ] Servidor dev arranca sin errores
- [ ] `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` siguen configurados
- [ ] `VITE_WP_GRAPHQL_URL` sigue configurado
- [ ] Página `/camisetas-personalizadas/` carga productos
- [ ] Login/registro con Supabase funciona
- [ ] Tests pasan: `pnpm test`
- [ ] TypeScript sin errores: `pnpm tsc --noEmit`
