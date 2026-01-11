# Variables de Entorno Requeridas para Producción

## Resumen Ejecutivo

Para que **impacto33.com** funcione correctamente en producción, se requieren las siguientes variables de entorno. Sin ellas, la página cargará pero las funciones de autenticación, carrito y pedidos no funcionarán.

---

## Variables CRÍTICAS ⚠️ (Requeridas para Auth)

Estas variables **DEBEN** estar configuradas en el servidor de producción para que funcionen login, registro, carrito y pedidos.

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://opwryjxwhfhjkficumsv.supabase.co` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Clave anónima de Supabase (obtener de Supabase dashboard) |

**Impacto si faltan**: 
- ❌ Login/Registro no funcionan
- ❌ Carrito no funciona
- ❌ Pedidos no funcionan
- ❌ Favoritos no funcionan
- ❌ Perfil de usuario no funciona
- ✅ Páginas públicas (home, categorías, productos) SÍ funcionan

---

## Variables OPCIONALES (Mejoras, no críticas)

| Variable | Valor | Descripción | Impacto si falta |
|----------|-------|-------------|------------------|
| `VITE_ANALYTICS_WEBSITE_ID` | ID de Umami | ID del sitio en Umami Analytics | No se registran visitas en Umami |
| `VITE_ANALYTICS_ENDPOINT` | URL de Umami | Endpoint del servidor de Umami | No se registran visitas en Umami |
| `VITE_WP_GRAPHQL_URL` | `https://creativu.es/graphql` | URL de WooCommerce GraphQL | Usa fallback a creativu.es |
| `VITE_OAUTH_PORTAL_URL` | URL del portal OAuth | Portal de login OAuth | Usa fallback interno |
| `VITE_APP_ID` | ID de app | ID de aplicación para OAuth | Usa fallback interno |
| `VITE_STRIPE_ENABLED` | `false` | Feature flag de Stripe | Stripe desactivado (correcto por ahora) |
| `VITE_STRIPE_PUBLIC_KEY` | Clave pública | Clave pública de Stripe | No requerida (Stripe desactivado) |
| `VITE_FRONTEND_FORGE_API_KEY` | API key | Clave de API del frontend | Usa fallback |
| `VITE_FRONTEND_FORGE_API_URL` | URL de API | URL de API del frontend | Usa fallback |

---

## Cómo Obtener las Variables Críticas

### VITE_SUPABASE_URL

1. Ir a [Supabase Dashboard](https://app.supabase.com)
2. Seleccionar proyecto `impacto33-ecommerce`
3. En Settings → API, copiar **Project URL**
4. Valor: `https://opwryjxwhfhjkficumsv.supabase.co`

### VITE_SUPABASE_ANON_KEY

1. En el mismo lugar (Settings → API)
2. Copiar **anon public** key
3. Comienza con `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## Configuración en IONOS (o tu servidor)

### Opción 1: Variables de Entorno del Sistema

Si tu servidor soporta variables de entorno (recomendado):

```bash
# Añadir a tu archivo de configuración de entorno
VITE_SUPABASE_URL=https://opwryjxwhfhjkficumsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Opción 2: Archivo .env.production

Si tu servidor permite archivos `.env`:

```bash
# .env.production
VITE_SUPABASE_URL=https://opwryjxwhfhjkficumsv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Verificación en Producción

Una vez configuradas, puedes verificar que funcionan:

1. Abre https://impacto33.com en el navegador
2. Abre DevTools (F12)
3. Ve a la pestaña **Console**
4. Busca los siguientes mensajes:

**✅ Si está bien configurado:**
```
📊 Analytics: Umami script loaded successfully.
```

**⚠️ Si falta Supabase (pero la página carga):**
```
❌ CRITICAL: Supabase credentials are missing!

Required environment variables:
  - VITE_SUPABASE_URL: ❌ MISSING
  - VITE_SUPABASE_ANON_KEY: ❌ MISSING

Auth features (login, registration, profile, cart, orders, wishlist) will NOT work...
```

**✅ Si está bien configurado:**
```
⚠️ Supabase not configured. Auth features disabled. Public pages will work normally.
```
(Este mensaje es normal si Supabase no está configurado)

---

## Cambios Realizados en el Código

### 1. **Umami Analytics (import.meta fuera de módulo)**

**Problema**: El script de Umami usaba `import.meta.env` directamente en HTML, causando error "Cannot use 'import.meta' outside a module"

**Solución**:
- ✅ Movido a módulo TS: `client/src/lib/analytics.ts`
- ✅ Removido script de `client/index.html`
- ✅ Inicializado en `client/src/main.tsx`
- ✅ Solo carga si `VITE_ANALYTICS_WEBSITE_ID` está definido

### 2. **Supabase Client (supabaseUrl is required)**

**Problema**: Sin credenciales de Supabase, la app crasheaba con "supabaseUrl is required"

**Solución**:
- ✅ `client/src/lib/supabaseClient.ts`: Ahora crea cliente con fallback
- ✅ Exporta flag `isSupabaseConfigured` para verificar estado
- ✅ Mensaje de error claro en consola indicando qué falta
- ✅ `client/src/context/AuthContext.tsx`: Salta auth si Supabase no está configurado
- ✅ Páginas públicas funcionan normalmente sin Supabase

---

## Flujo de Funcionamiento

### Con Supabase Configurado ✅
```
Usuario accede a impacto33.com
  ↓
App carga
  ↓
AuthContext verifica Supabase
  ↓
isSupabaseConfigured = true
  ↓
Auth se inicializa normalmente
  ↓
Login/Registro/Carrito/Pedidos funcionan
```

### Sin Supabase Configurado ⚠️
```
Usuario accede a impacto33.com
  ↓
App carga
  ↓
AuthContext verifica Supabase
  ↓
isSupabaseConfigured = false
  ↓
Auth se salta, pero app no crashea
  ↓
Páginas públicas funcionan
  ↓
Login/Registro/Carrito/Pedidos no disponibles
  ↓
Mensaje claro en consola explicando qué falta
```

---

## Próximos Pasos

1. **Inmediato**: Proporcionar al técnico de infraestructura:
   - `VITE_SUPABASE_URL=https://opwryjxwhfhjkficumsv.supabase.co`
   - `VITE_SUPABASE_ANON_KEY=<obtener de Supabase dashboard>`

2. **Verificar**: Después de configurar, revisar consola en https://impacto33.com

3. **Opcional**: Configurar Umami Analytics:
   - `VITE_ANALYTICS_WEBSITE_ID=<ID de Umami>`
   - `VITE_ANALYTICS_ENDPOINT=<URL de Umami>`

---

## Contacto

- **Proyecto Supabase**: impacto33-ecommerce
- **Dashboard**: https://app.supabase.com
- **Documentación**: https://supabase.com/docs
