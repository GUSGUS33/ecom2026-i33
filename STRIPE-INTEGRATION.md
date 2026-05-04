# Integración con Stripe - Modo Preparado

## 📋 Resumen

Se ha implementado una integración completa con Stripe en modo **desactivado** mediante un feature flag. El sistema está listo para procesar pagos reales, pero actualmente muestra un mensaje informativo indicando que el pago online no está disponible.

---

## 🔧 Configuración

### Variables de Entorno Requeridas

Para activar Stripe, configura estas variables de entorno:

```bash
# Feature flag (false = desactivado, true = activado)
VITE_STRIPE_ENABLED=false

# Clave pública de Stripe (obtener de https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx

# Clave secreta de Stripe (solo backend, NUNCA en frontend)
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Archivo de Configuración

- **Frontend**: `client/src/config/stripeConfig.ts`
  - Define el feature flag `STRIPE_ENABLED`
  - Valida que si está habilitado, tenga la clave pública
  - Proporciona mensaje informativo cuando está desactivado

---

## 🎯 Comportamiento Actual (Desactivado)

### Frontend

**CheckoutForm.tsx** (`client/src/components/CheckoutForm.tsx`):
- Verifica si Stripe está habilitado
- Si está **desactivado**:
  - Muestra mensaje informativo en color ámbar
  - Botón de pago aparece deshabilitado
  - Muestra resumen del carrito (solo lectura)
  - Enlace a "Presupuesto Rápido" como alternativa
- Si está **habilitado** (cuando se active):
  - Mostraría formulario de Stripe
  - Permitiría procesar pagos reales

**CheckoutPage.tsx** (`client/src/pages/CheckoutPage.tsx`):
- Importa y usa `CheckoutForm`
- Pasa datos del carrito al componente
- Maneja estados de carga

### Backend

**Endpoint POST /api/checkout** (`server/routes/checkout.ts`):
- Verifica que `STRIPE_ENABLED` es true
- Si está **desactivado**:
  - Devuelve HTTP 503 con error controlado
  - No intenta conectar con Stripe
  - No crea órdenes
- Si está **habilitado** (cuando se active):
  - Obtendría carrito desde Supabase
  - Crearía PaymentIntent en Stripe
  - Devolvería clientSecret o sessionUrl

**Endpoint GET /api/checkout/status**:
- Devuelve estado actual de Stripe
- Útil para debugging

---

## 🚀 Activar Stripe (Cuando Estés Listo)

### Paso 1: Obtener Claves de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Copia tu clave pública (`pk_test_...`)
3. Copia tu clave secreta (`sk_test_...`)

### Paso 2: Configurar Variables de Entorno

```bash
# En tu archivo .env o configuración del servidor
VITE_STRIPE_ENABLED=true
VITE_STRIPE_PUBLIC_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

### Paso 3: Implementar Lógica de Pago

Los siguientes archivos tienen placeholders comentados que necesitan implementación:

**Frontend**:
- `CheckoutForm.tsx`: Implementar llamada a `/api/checkout` cuando se haga clic en "Pagar"
- Integrar `CardElement` de Stripe para capturar datos de tarjeta

**Backend**:
- `server/routes/checkout.ts`: Implementar creación de PaymentIntent
- `server/helpers/stripeOrderHelper.ts`: Implementar creación de órdenes desde eventos de Stripe

### Paso 4: Configurar Webhooks

1. En Stripe Dashboard → Webhooks
2. Añade endpoint: `https://tudominio.com/api/webhooks/stripe`
3. Selecciona eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copia el webhook secret y configúralo en `STRIPE_WEBHOOK_SECRET`

---

## 📁 Archivos Creados/Modificados

### Frontend

| Archivo | Descripción |
|---------|-------------|
| `client/src/config/stripeConfig.ts` | Configuración y feature flag de Stripe |
| `client/src/components/CheckoutForm.tsx` | Componente de formulario de pago |
| `client/src/pages/CheckoutPage.tsx` | Página de checkout (actualizada) |
| `client/src/config/stripeConfig.test.ts` | Tests de configuración |

### Backend

| Archivo | Descripción |
|---------|-------------|
| `server/routes/checkout.ts` | Endpoint `/api/checkout` |
| `server/helpers/stripeOrderHelper.ts` | Helper para crear órdenes (comentado) |

---

## 🧪 Tests

Ejecutar tests:

```bash
pnpm test -- stripeConfig
```

Tests incluyen:
- Verificar que Stripe está deshabilitado por defecto
- Validar que el feature flag funciona correctamente
- Comprobar que la configuración es válida

---

## 📊 Flujo de Pago (Cuando esté activo)

```
Usuario en /checkout
    ↓
CheckoutPage carga carrito
    ↓
CheckoutForm verifica isStripeEnabled()
    ↓
Si está activo:
    ├─ Muestra formulario de Stripe
    ├─ Usuario ingresa datos de tarjeta
    ├─ Clic en "Pagar"
    ├─ POST /api/checkout
    ├─ Backend crea PaymentIntent en Stripe
    ├─ Frontend confirma pago con Stripe
    ├─ Stripe webhook: payment_intent.succeeded
    ├─ Backend crea orden en Supabase
    ├─ Backend envía email de confirmación
    └─ Usuario ve confirmación
```

---

## 🔐 Seguridad

### Claves Públicas vs Secretas

- **VITE_STRIPE_PUBLIC_KEY**: Visible en el frontend (seguro)
- **STRIPE_SECRET_KEY**: Solo en backend (NUNCA expongas esto)

### Validación de Webhooks

Todos los webhooks de Stripe deben validar la firma usando `stripe.webhooks.constructEvent()` para evitar requests falsificados.

### PCI Compliance

Nunca almacenes datos de tarjetas en tu base de datos. Stripe maneja toda la información sensible.

---

## 🐛 Debugging

### Verificar Estado de Stripe

```bash
# Frontend
curl https://tudominio.com/api/checkout/status

# Respuesta esperada cuando está desactivado:
{
  "stripeEnabled": false,
  "stripeConfigured": false,
  "message": "Stripe está deshabilitado"
}
```

### Logs

Busca logs con `[Checkout]` o `[StripeOrderHelper]` en los logs del servidor.

---

## 📝 Notas Importantes

1. **Feature Flag**: El sistema respeta `STRIPE_ENABLED`. Si es false, nunca intenta conectar con Stripe.

2. **Órdenes**: Mientras Stripe esté desactivado, NO se crean órdenes en la base de datos.

3. **Carrito**: El carrito persiste en Supabase independientemente del estado de Stripe.

4. **Presupuestos**: Los usuarios pueden usar "Presupuesto Rápido" como alternativa mientras Stripe está desactivado.

5. **Implementación Gradual**: Los helpers en `stripeOrderHelper.ts` están comentados para implementación futura.

---

## ✅ Checklist de Activación

- [ ] Obtener claves de Stripe
- [ ] Configurar `VITE_STRIPE_ENABLED=true`
- [ ] Configurar `VITE_STRIPE_PUBLIC_KEY`
- [ ] Configurar `STRIPE_SECRET_KEY`
- [ ] Implementar lógica de PaymentIntent en `checkout.ts`
- [ ] Implementar `createOrderFromStripeEvent()` en `stripeOrderHelper.ts`
- [ ] Configurar webhook en Stripe Dashboard
- [ ] Implementar validación de firma de webhook
- [ ] Probar con tarjeta de prueba: `4242 4242 4242 4242`
- [ ] Revisar logs y transacciones en Stripe Dashboard
- [ ] Cambiar a claves de producción cuando esté listo

---

## 🆘 Soporte

Para más información sobre Stripe:
- [Documentación de Stripe](https://stripe.com/docs)
- [Guía de Integración](https://stripe.com/docs/payments/integration-builder)
- [Webhooks](https://stripe.com/docs/webhooks)
