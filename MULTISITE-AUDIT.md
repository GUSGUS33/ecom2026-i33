# Auditoría Multi-Site: Archivos que interactúan con Supabase

## Servicios cliente (queries de negocio que necesitan site_id)

| Archivo | Tablas usadas | Necesita site_id |
|---|---|---|
| `services/cartService.ts` | carts, cart_items | SÍ |
| `services/checkoutService.ts` | orders, order_items, carts | SÍ |
| `services/ordersService.ts` | orders, order_items, carts, cart_items | SÍ |
| `services/wishlistService.ts` | wishlist_impacto33 | SÍ (migrar a wishlist con site_id) |
| `services/searchHistoryService.ts` | search_history | EVALUAR |
| `services/trackingService.ts` | viewed_products | EVALUAR |
| `services/addressService.ts` | user_addresses | EVALUAR |
| `services/profileService.ts` | user_personalization | EVALUAR |
| `services/profileOnboardingService.ts` | user_personalization | EVALUAR |
| `services/userProfileService.ts` | user_personalization | EVALUAR |

## Auth (NO tocar)

| Archivo | Notas |
|---|---|
| `services/authService.ts` | Solo auth.* — NO necesita site_id |
| `lib/supabaseClient.ts` | Inicialización — NO necesita site_id |

## Servidor

| Archivo | Tablas usadas | Necesita site_id |
|---|---|---|
| `server/routes/checkout.ts` | orders, payment_events | SÍ |
| `server/quoteRouter.ts` | EVALUAR | EVALUAR |

## Tests (actualizar después de cambios)

- cartService.test.ts
- ordersService.test.ts
- wishlistService.test.ts
- searchHistoryService.test.ts
- trackingService.test.ts
- profileService.test.ts
- profileOnboardingService.test.ts
