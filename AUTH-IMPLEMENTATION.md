# 🔐 Implementación de Autenticación - IMPACTO33 MVP

## 📋 Resumen

Se ha implementado un sistema completo de autenticación con Supabase Auth, recuperación de contraseña, validación mejorada y preparación para Google OAuth. El flujo es:

- **Usuarios no logueados**: ven la home pública (catálogo, SEO, etc.)
- **Usuarios logueados**: son redirigidos automáticamente a `/inicio` (home personalizada)
- **Usuarios con contraseña olvidada**: pueden recuperarla vía email

---

## 🏗️ Arquitectura Implementada

### 1. **Capa de Autenticación (Supabase)**

#### Cliente Supabase
- **Archivo**: `client/src/lib/supabaseClient.ts`
- **Configuración**: Usa variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
- **Características**: Persistencia de sesión en localStorage, auto-refresh de tokens

#### Servicios
- **`authService.ts`**: Funciones completas de autenticación
  - `signUpWithEmail(email, password)` - Registro
  - `signInWithEmail(email, password)` - Login
  - `signOut()` - Logout
  - `getCurrentSession()` - Obtener sesión actual
  - `resendConfirmationEmail(email)` - Reenviar email de confirmación
  - `resetPasswordForEmail(email)` - Enviar email de recuperación
  - `updatePassword(newPassword)` - Actualizar contraseña
  - `signInWithGoogle()` - Login con Google OAuth (preparado)
  - `onAuthStateChange(callback)` - Suscribirse a cambios

- **`userProfileService.ts`**: Gestión de perfiles en `user_personalization`
  - `getOrCreateUserProfile(supabaseUserId, email)` - Crea automáticamente el perfil si no existe
  - `updateUserProfile(supabaseUserId, updates)` - Actualiza datos del perfil

### 2. **Contexto Global (AuthContext)**

- **Archivo**: `client/src/context/AuthContext.tsx`
- **Estado**: `user`, `profile`, `loading`, `error`
- **Hook**: `useAuth()` para acceder desde cualquier componente
- **Inicialización**: Carga la sesión al montar la app y se suscribe a cambios de auth

**Uso en componentes:**
```tsx
const { user, profile, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!user) return <NotLoggedIn />;

return <UserDashboard email={user.email} />;
```

### 3. **Rutas Protegidas**

#### Componente `RequireAuth`
- **Archivo**: `client/src/components/RequireAuth.tsx`
- **Función**: HOC que protege rutas requiriendo autenticación
- **Comportamiento**:
  - Si no hay usuario → redirige a `/auth/login`
  - Si hay usuario → renderiza el contenido
  - Muestra loading mientras se verifica

**Uso en rutas:**
```tsx
<Route path="/inicio">
  {() => (
    <RequireAuth>
      <PrivateHome />
    </RequireAuth>
  )}
</Route>
```

---

## 📄 Páginas Implementadas

### 1. **Login** (`/auth/login`)
- Formulario email + contraseña
- Detección automática de email no confirmado
- Botón "Reenviar email de confirmación" si es necesario
- Link a "Olvidé mi contraseña"
- Link a registro
- Redirección post-login a `/inicio`

### 2. **Registro** (`/auth/register`)
- Formulario email + contraseña + confirmación
- **Validación mejorada:**
  - Email válido (formato correcto)
  - Mínimo 8 caracteres
  - Mayúscula, minúscula y número obligatorios
  - Mensaje claro de requisitos
- Pantalla de éxito con instrucciones de confirmación de email
- Redirección automática a login en 3 segundos

### 3. **Recuperación de Contraseña** (`/auth/forgot-password`)
- Formulario para solicitar email de recuperación
- Pantalla de éxito mostrando email de destino
- Instrucciones claras sobre pasos siguientes
- Enlace de recuperación válido por 24 horas

### 4. **Reset de Contraseña** (`/auth/reset-password`)
- Formulario para nueva contraseña
- **Indicador visual de fuerza de contraseña:**
  - Débil (rojo)
  - Media (amarillo)
  - Fuerte (verde)
- Validación de requisitos en tiempo real
- Confirmación de contraseña
- Redirección automática a login tras éxito

### 5. **Mi Cuenta** (`/mi-cuenta`) - PROTEGIDA
- Información personal del usuario
- Email, fecha de registro
- Estado de newsletter
- Botón para cerrar sesión
- Enlaces rápidos a otras páginas

### 6. **Home Personalizada** (`/inicio`) - PROTEGIDA
Tres bloques principales:

#### Bloque 1: "Retoma donde lo dejaste"
- Muestra últimos productos vistos
- Grid responsivo (1-4 columnas según pantalla)
- Cada producto es un link al detalle

#### Bloque 2: "Tus Favoritos"
- Muestra productos guardados en wishlist
- Estado vacío con CTA al catálogo

#### Bloque 3: "Búsquedas Recientes"
- Muestra últimas keywords buscadas
- Cada búsqueda es un link para repetirla

#### CTA Final
- "¿Listo para tu próximo pedido?"
- Botones a catálogo y presupuesto rápido

---

## 🔄 Flujos de Redirección

### Flujo de Registro
```
1. Usuario accede a /auth/register
2. Completa el formulario (email, contraseña con validación)
3. Se envía email de confirmación
4. Usuario ve pantalla de éxito con instrucciones
5. Usuario confirma email (desde su bandeja)
6. Usuario puede hacer login
```

### Flujo de Login
```
1. Usuario accede a /auth/login
2. Ingresa email y contraseña
3. Si email no está confirmado → muestra botón de reenvío
4. Si credenciales correctas → redirige a /inicio
5. AuthContext se actualiza automáticamente
```

### Flujo de Recuperación de Contraseña
```
1. Usuario en login hace click en "¿Olvidaste tu contraseña?"
2. Va a /auth/forgot-password
3. Ingresa su email
4. Recibe email con enlace de recuperación
5. Hace click en el enlace (válido 24 horas)
6. Va a /auth/reset-password
7. Ingresa nueva contraseña (con indicador de fuerza)
8. Contraseña se actualiza
9. Redirige a login para acceder con nueva contraseña
```

### Flujo de Acceso a Home Pública
```
1. Usuario logueado accede a /
2. Componente Home detecta user en AuthContext
3. useEffect redirige automáticamente a /inicio
4. SEO de / no se ve afectado (redirección client-side)
```

### Flujo de Logout
```
1. Usuario hace click en "Cerrar Sesión"
2. Se llama a signOut()
3. AuthContext se actualiza (user = null)
4. Se redirige a home pública (/)
5. Todas las rutas protegidas vuelven a requerir login
```

---

## 🎨 Integración en Header

### Desktop (xl screens)
- **Si NO está logueado**: Botón "Acceder" que lleva a `/auth/login`
- **Si está logueado**: Dropdown con:
  - Email del usuario
  - "Mi Panel" → `/inicio`
  - "Mi Cuenta" → `/mi-cuenta`
  - "Mis Pedidos" → `/mis-pedidos`
  - "Cerrar Sesión" (en rojo)

### Mobile (< xl screens)
- Botones de auth en el menú móvil
- Mismo contenido que desktop pero en formato lista

### Logo
- **Si NO está logueado**: Lleva a `/` (home pública)
- **Si está logueado**: Lleva a `/inicio` (home personalizada)

---

## 📊 Tablas de Supabase (Preparadas)

### `user_personalization`
```sql
- id: bigint (PK)
- created_at: timestamptz (DEFAULT now())
- supabase_user_id: uuid (NOT NULL)
- woo_customer_id: bigint (NULL)
- email: text (NOT NULL)
- is_newsletter_subscribed: boolean (DEFAULT false)
- newsletter_consent_at: timestamptz (NULL)
- newsletter_source: text (NULL)
```

**RLS Policies**: El usuario solo puede ver/modificar sus propias filas

### `viewed_products` (Próxima integración)
```sql
- id: bigint (PK)
- supabase_user_id: uuid
- product_id: bigint
- viewed_at: timestamptz (DEFAULT now())
```

### `wishlist` (Próxima integración)
```sql
- id: bigint (PK)
- supabase_user_id: uuid
- product_id: bigint
- added_at: timestamptz (DEFAULT now())
```

### `search_history` (Próxima integración)
```sql
- id: bigint (PK)
- supabase_user_id: uuid
- search_query: text
- searched_at: timestamptz (DEFAULT now())
```

### `orders` y `order_items` (Ya implementado)
```sql
orders:
- id: bigint (PK)
- supabase_user_id: uuid
- status: text
- total: numeric
- created_at: timestamptz

order_items:
- id: bigint (PK)
- order_id: bigint
- product_id: bigint
- quantity: integer
- price: numeric
```

---

## 🔐 Seguridad

### Implementado
- ✅ Uso de ANON_KEY (no service_role) en frontend
- ✅ RLS policies en todas las tablas
- ✅ Sesión persistida en localStorage (manejada por Supabase)
- ✅ Auto-refresh de tokens
- ✅ Rutas protegidas con RequireAuth
- ✅ Validación de email requerida (confirmation links)
- ✅ Recuperación de contraseña vía email
- ✅ Validación fuerte de contraseña (8+ caracteres, mayúscula, minúscula, número)

### Próximas mejoras
- [ ] Implementar refresh token rotation
- [ ] Agregar 2FA (two-factor authentication)
- [ ] Rate limiting en login/registro
- [ ] Google OAuth (OAuth provider configurado)
- [ ] GitHub OAuth
- [ ] Magic link authentication

---

## 📝 Archivos Creados/Modificados

### Nuevos Archivos
```
client/src/
├── lib/
│   └── supabaseClient.ts
├── services/
│   ├── authService.ts
│   ├── authService.test.ts
│   └── userProfileService.ts
├── context/
│   └── AuthContext.tsx
├── components/
│   └── RequireAuth.tsx
└── pages/
    ├── auth/
    │   ├── Login.tsx
    │   ├── Register.tsx
    │   ├── ForgotPassword.tsx
    │   └── ResetPassword.tsx
    ├── MiCuenta.tsx
    ├── PrivateHome.tsx
    └── OrdersPage.tsx
```

### Archivos Modificados
```
client/src/
├── main.tsx (+ AuthProvider)
├── App.tsx (+ rutas de auth y protegidas)
├── pages/Home.tsx (+ redirección a /inicio si logueado)
└── layouts/MainLayout.tsx (+ botones de login/logout, menú de usuario)
```

---

## 🚀 Próximos Pasos

### Fase 2: Integración de Datos Dinámicos
1. **Conectar `viewed_products`**: Mostrar productos reales visitados
2. **Conectar `wishlist`**: Mostrar favoritos guardados
3. **Conectar `search_history`**: Mostrar búsquedas reales

### Fase 3: Autenticación Social
1. Configurar Google OAuth en Supabase
2. Implementar botón "Continuar con Google" en login/registro
3. Configurar GitHub OAuth (opcional)

### Fase 4: Mejoras de UX
1. Agregar notificaciones (toast) para acciones
2. Implementar perfil editable
3. Agregar cambio de contraseña en Mi Cuenta
4. Implementar preferencias de newsletter

### Fase 5: Carrito y Pedidos
1. Implementar tabla `carts` y `cart_items` (ya existe)
2. Crear página de carrito (ya existe)
3. Integrar con Stripe para pagos
4. Implementar historial de pedidos (ya existe)

---

## 🧪 Testing Manual

### Test 1: Registro con validación
1. Ir a `/auth/register`
2. Intentar con email inválido → debe mostrar error
3. Intentar con contraseña < 8 caracteres → debe mostrar error
4. Intentar sin mayúscula/minúscula/número → debe mostrar error
5. Completar correctamente → debe enviar email de confirmación
6. Verificar pantalla de éxito con instrucciones

### Test 2: Login con email no confirmado
1. Ir a `/auth/login`
2. Usar email no confirmado → debe mostrar botón de reenvío
3. Hacer click en "Reenviar email de confirmación"
4. Verificar mensaje de éxito
5. Confirmar email desde bandeja
6. Intentar login nuevamente → debe funcionar

### Test 3: Recuperación de contraseña
1. Ir a `/auth/login`
2. Hacer click en "¿Olvidaste tu contraseña?"
3. Ir a `/auth/forgot-password`
4. Ingresar email válido
5. Verificar pantalla de éxito
6. Revisar email de recuperación
7. Hacer click en enlace de recuperación
8. Ir a `/auth/reset-password`
9. Ingresar nueva contraseña (verificar indicador de fuerza)
10. Confirmar contraseña
11. Verificar redirección a login
12. Hacer login con nueva contraseña

### Test 4: Redirección automática
1. Estando logueado, acceder a `/`
2. Verificar que se redirige automáticamente a `/inicio`
3. Verificar que el SEO de `/` no se ve afectado

### Test 5: Logout
1. Estando en `/inicio`, hacer click en "Cerrar Sesión"
2. Verificar redirección a `/`
3. Verificar que el botón de "Acceder" aparece en el header
4. Intentar acceder a `/inicio` → debe redirigir a login

---

## 📚 Configuración de Supabase

### Pasos para activar Email Confirmation
1. Ir a Supabase Dashboard
2. Authentication → Providers → Email
3. Habilitar "Confirm email"
4. Configurar email template (opcional)
5. Guardar cambios

### Pasos para activar Password Recovery
1. Ir a Supabase Dashboard
2. Authentication → Email Templates
3. Verificar que "Reset Password" template está habilitado
4. Personalizar template si es necesario
5. Guardar cambios

### Pasos para configurar Google OAuth
1. Ir a Google Cloud Console
2. Crear proyecto nuevo
3. Habilitar Google+ API
4. Crear credenciales (OAuth 2.0 Client ID)
5. Ir a Supabase Dashboard → Authentication → Providers → Google
6. Pegar Client ID y Client Secret
7. Copiar Redirect URL de Supabase
8. Pegar en Google Cloud Console
9. Guardar cambios

---

## 🔍 Troubleshooting

### Error: "Email not confirmed"
**Causa**: El usuario se registró pero no confirmó el email
**Solución**: 
1. En login, hacer click en "Reenviar email de confirmación"
2. Revisar bandeja de entrada (incluyendo spam)
3. Hacer click en enlace de confirmación
4. Intentar login nuevamente

### Error: "Invalid login credentials"
**Causa**: Email o contraseña incorrectos
**Solución**: 
1. Verificar que el email es correcto
2. Si olvidó la contraseña, usar "¿Olvidaste tu contraseña?"
3. Si no tiene cuenta, ir a registro

### Error: "Service temporarily unavailable"
**Causa**: Problema con Supabase
**Solución**: 
1. Esperar unos minutos
2. Intentar nuevamente
3. Si persiste, contactar a soporte de Supabase

---

## 📞 Soporte

Para problemas o preguntas sobre autenticación, contactar a:
- **Email**: info@impacto33.com
- **WhatsApp**: +34690906027
- **Horario**: Lunes-Viernes 9-14 hs y 15-18 hs
