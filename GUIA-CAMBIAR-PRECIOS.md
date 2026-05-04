# 💰 Guía Práctica: Cómo Cambiar Precios en IMPACTO33

**Objetivo:** Modificar precios sin tocar código, solo editando archivos JSON

---

## 📋 ÍNDICE RÁPIDO

1. [Cambios muy simples (5 minutos)](#cambios-muy-simples)
2. [Cambios moderados (15 minutos)](#cambios-moderados)
3. [Cambios avanzados (30 minutos)](#cambios-avanzados)
4. [Cómo probar los cambios](#cómo-probar)
5. [Troubleshooting](#troubleshooting)

---

## 🟢 CAMBIOS MUY SIMPLES

### 1️⃣ Subir un 10% todos los precios de camisetas

**Archivo:** `client/src/data/pricing/camisetas.json`

**Qué cambiar:** Los valores en `factores_escalado`

**Antes:**
```json
"factores_escalado": {
  "25": 5.16,
  "50": 3.69,
  "100": 2.47,
  "250": 1.85,
  "500": 1.32,
  "1000": 1.0,
  "2000": 0.89
}
```

**Después (×1.10):**
```json
"factores_escalado": {
  "25": 5.68,    // 5.16 × 1.10
  "50": 4.06,    // 3.69 × 1.10
  "100": 2.72,   // 2.47 × 1.10
  "250": 2.04,   // 1.85 × 1.10
  "500": 1.45,   // 1.32 × 1.10
  "1000": 1.10,  // 1.0 × 1.10
  "2000": 0.98   // 0.89 × 1.10
}
```

**Efecto:**
- ✅ Todos los precios de camisetas suben 10%
- ✅ Cambio inmediato (sin recargar servidor)
- ✅ Se aplica a todos los presupuestos nuevos

**Ejemplo de impacto:**
```
Antes: 50 unidades × 2 zonas = 2.002€
Después: 50 unidades × 2 zonas = 2.202€ (+10%)
```

---

### 2️⃣ Cambiar el coste de personalización frontal

**Archivo:** `client/src/data/pricing/camisetas.json`

**Qué cambiar:** `coste_personalizacion.frontal`

**Antes:**
```json
"coste_personalizacion": {
  "frontal": 0.45,
  "espalda": 0.40,
  "mangas": 0.35
}
```

**Después (subir frontal a 0.60€):**
```json
"coste_personalizacion": {
  "frontal": 0.60,  // Cambio: 0.45 → 0.60
  "espalda": 0.40,
  "mangas": 0.35
}
```

**Efecto:**
- ✅ Solo afecta a presupuestos con zona frontal
- ✅ Cambio inmediato
- ✅ No afecta espalda ni mangas

**Ejemplo de impacto:**
```
Antes: 50 unidades, frontal = 40.04€/unidad
Después: 50 unidades, frontal = 40.19€/unidad (+0.15€)
```

---

### 3️⃣ Cambiar cantidad mínima

**Archivo:** `client/src/data/pricing/camisetas.json`

**Qué cambiar:** `cantidad_minima`

**Antes:**
```json
"cantidad_minima": 25
```

**Después (bajar a 20):**
```json
"cantidad_minima": 20
```

**Efecto:**
- ✅ Ahora se pueden hacer presupuestos desde 20 unidades
- ✅ Cambio inmediato
- ✅ Se muestra alerta si no se cumple

**Ejemplo:**
```
Antes: 20 unidades → ❌ "Cantidad mínima no alcanzada"
Después: 20 unidades → ✅ Presupuesto calculado
```

---

## 🟡 CAMBIOS MODERADOS

### 4️⃣ Crear una nueva categoría (bolsas)

**Paso 1:** Crear archivo `client/src/data/pricing/bolsas.json`

```json
{
  "categoria": "Bolsas",
  "cantidad_minima": 50,
  "factores_escalado": {
    "50": 4.50,
    "100": 3.00,
    "250": 2.00,
    "500": 1.50,
    "1000": 1.00,
    "2000": 0.90
  },
  "coste_personalizacion": {
    "frontal": 0.60,
    "espalda": 0.50
  },
  "zonas_permitidas": ["frontal", "espalda"],
  "notas": "Bolsas de tela personalizadas"
}
```

**Paso 2:** Cambiar `pricingCategory` en ProductPricingFlow

**Archivo:** `client/src/components/pricing/ProductPricingFlow.tsx`

**Antes:**
```typescript
pricingCategory: 'camisetas' // Hardcodeado
```

**Después:**
```typescript
pricingCategory: product.categories?.nodes?.[0]?.slug || 'general'
```

**Efecto:**
- ✅ Nuevos presupuestos para bolsas usan su propia configuración
- ✅ Cantidad mínima: 50 (vs 25 para camisetas)
- ✅ Escalados diferentes
- ✅ Personalización diferente

---

### 5️⃣ Cambiar tramos de escalado

**Archivo:** `client/src/data/pricing/camisetas.json`

**Escenario:** Quieres que a partir de 75 unidades se aplique el factor de 100

**Antes:**
```json
"factores_escalado": {
  "25": 5.16,
  "50": 3.69,
  "100": 2.47,   // Se aplica a partir de 100
  "250": 1.85
}
```

**Después (agregar tramo 75):**
```json
"factores_escalado": {
  "25": 5.16,
  "50": 3.69,
  "75": 2.47,    // Nuevo: aplica a partir de 75
  "100": 2.47,
  "250": 1.85
}
```

**Efecto:**
```
Antes: 75 unidades → factor 3.69
Después: 75 unidades → factor 2.47 (más barato)
```

**Cálculo de impacto:**
```
Camiseta 20€, 2 zonas, 75 unidades

Antes:
  Base: 10 + 0.85 = 10.85€
  Factor: 3.69
  Unitario: 10.85 × 3.69 = 40.04€
  Total: 40.04 × 75 = 3.003€

Después:
  Base: 10 + 0.85 = 10.85€
  Factor: 2.47
  Unitario: 10.85 × 2.47 = 26.80€
  Total: 26.80 × 75 = 2.010€

Ahorro: 993€ (33% menos)
```

---

### 6️⃣ Cambiar zonas permitidas

**Archivo:** `client/src/data/pricing/camisetas.json`

**Escenario:** Solo permitir frontal y espalda, no mangas

**Antes:**
```json
"zonas_permitidas": ["frontal", "espalda", "mangas"]
```

**Después:**
```json
"zonas_permitidas": ["frontal", "espalda"]
```

**Efecto:**
- ✅ El selector de zonas solo muestra frontal y espalda
- ✅ Mangas no se puede seleccionar
- ✅ Cambio inmediato en UI

---

## 🔴 CAMBIOS AVANZADOS

### 7️⃣ Crear estructura de descuentos por tramo

**Archivo:** `client/src/data/pricing/camisetas.json`

**Escenario:** Mostrar descuentos explícitos al cliente

**Estructura mejorada:**
```json
{
  "categoria": "Camisetas",
  "cantidad_minima": 25,
  "tramos": [
    {
      "cantidad_desde": 25,
      "cantidad_hasta": 49,
      "factor": 5.16,
      "descuento_porcentaje": 0,
      "etiqueta": "Precio base"
    },
    {
      "cantidad_desde": 50,
      "cantidad_hasta": 99,
      "factor": 3.69,
      "descuento_porcentaje": 28,
      "etiqueta": "Descuento 28%"
    },
    {
      "cantidad_desde": 100,
      "cantidad_hasta": 249,
      "factor": 2.47,
      "descuento_porcentaje": 52,
      "etiqueta": "Descuento 52%"
    },
    {
      "cantidad_desde": 250,
      "cantidad_hasta": 499,
      "factor": 1.85,
      "descuento_porcentaje": 64,
      "etiqueta": "Descuento 64%"
    },
    {
      "cantidad_desde": 500,
      "cantidad_hasta": 999,
      "factor": 1.32,
      "descuento_porcentaje": 74,
      "etiqueta": "Descuento 74%"
    },
    {
      "cantidad_desde": 1000,
      "cantidad_hasta": 1999,
      "factor": 1.0,
      "descuento_porcentaje": 80,
      "etiqueta": "Descuento 80%"
    },
    {
      "cantidad_desde": 2000,
      "cantidad_hasta": 999999,
      "factor": 0.89,
      "descuento_porcentaje": 82,
      "etiqueta": "Descuento 82%"
    }
  ],
  "coste_personalizacion": {
    "frontal": 0.45,
    "espalda": 0.40,
    "mangas": 0.35
  },
  "zonas_permitidas": ["frontal", "espalda", "mangas"]
}
```

**Ventajas:**
- ✅ Información clara para el cliente
- ✅ Fácil calcular porcentaje de ahorro
- ✅ Fácil mostrar en tabla comparativa

---

### 8️⃣ Agregar descuentos por urgencia

**Archivo:** `client/src/data/pricing/camisetas.json`

**Estructura:**
```json
{
  "categoria": "Camisetas",
  "cantidad_minima": 25,
  "factores_escalado": { /* ... */ },
  "coste_personalizacion": { /* ... */ },
  "urgencia": {
    "habilitada": true,
    "opciones": [
      {
        "dias": 14,
        "multiplicador": 1.0,
        "etiqueta": "Estándar (14 días)"
      },
      {
        "dias": 10,
        "multiplicador": 1.1,
        "etiqueta": "Rápido (10 días, +10%)"
      },
      {
        "dias": 7,
        "multiplicador": 1.2,
        "etiqueta": "Urgente (7 días, +20%)"
      }
    ]
  }
}
```

**Cálculo:**
```
Precio Final = (Base + Personalización) × Escalado × Urgencia × Cantidad

Ejemplo: 50 unidades, 2 zonas, urgente (7 días)
  Base: 10.85€
  Escalado: 3.69
  Urgencia: 1.2
  Unitario: 10.85 × 3.69 × 1.2 = 48.05€
  Total: 48.05 × 50 = 2.402€
```

---

## ✅ CÓMO PROBAR LOS CAMBIOS

### Opción 1: Prueba en Navegador (Recomendado)

1. Edita el archivo JSON
2. Guarda los cambios
3. Abre el navegador en `https://3000-i1am9yf4riqzx6ro3x91c-77bcb4b6.manusvm.computer`
4. Navega a un producto
5. Selecciona cantidad y zonas
6. Verifica que el precio cambió

**Nota:** El cache se limpia automáticamente al cambiar el archivo

---

### Opción 2: Prueba con Tests

**Archivo:** `client/src/services/pricingService.test.ts`

```typescript
import { calculateScaledPrice } from './pricingService';

const testPricing = {
  categoria: "Test",
  cantidad_minima: 25,
  factores_escalado: {
    "25": 5.68,  // Nuevo valor
    "50": 4.06
  },
  coste_personalizacion: {
    "frontal": 0.60  // Nuevo valor
  },
  zonas_permitidas: ["frontal", "espalda"]
};

// Prueba
const result = calculateScaledPrice(20, 50, ["frontal"], testPricing);
console.log("Precio unitario:", result.precioUnitarioFinal);
// Esperado: 10.85 × 4.06 = 44.05€
```

---

### Opción 3: Prueba Automática

```bash
cd /home/ubuntu/impacto33-mvp
pnpm test
```

---

## 🐛 TROUBLESHOOTING

### ❌ "El precio no cambió después de editar JSON"

**Solución 1:** Limpiar cache del navegador
- Abre DevTools (F12)
- Pestaña "Application"
- Borra "Local Storage"
- Recarga la página

**Solución 2:** Reiniciar servidor
```bash
# En la carpeta del proyecto
pnpm dev
```

---

### ❌ "Aparece un error de JSON inválido"

**Solución:** Valida el JSON
```bash
# Instalar validador
npm install -g jsonlint

# Validar archivo
jsonlint client/src/data/pricing/camisetas.json
```

**Errores comunes:**
- Comas faltantes: `"25": 5.16` ← Falta coma
- Comillas mal cerradas: `"factor": 5.1"6` ← Comilla extra
- Llaves sin cerrar: `{ "key": "value"` ← Falta }

---

### ❌ "El archivo no se carga, usa _default.json"

**Causa:** El archivo JSON no existe o tiene nombre incorrecto

**Solución:**
1. Verifica que el archivo existe: `client/src/data/pricing/camisetas.json`
2. Verifica que el nombre es exacto (minúsculas, sin espacios)
3. Verifica que `pricingCategory` en ProductPricingFlow.tsx coincide

---

### ❌ "Los precios son muy altos/bajos"

**Causa:** Probablemente la fórmula `regularPrice / 2` no es correcta

**Solución:** Revisa el documento `ANALISIS-SISTEMA-PRECIOS.md` sección "Problema 2"

---

## 📊 TABLA DE REFERENCIA RÁPIDA

| Cambio | Archivo | Campo | Efecto |
|--------|---------|-------|--------|
| Subir precios 10% | camisetas.json | factores_escalado | Todos los precios ×1.10 |
| Cambiar coste frontal | camisetas.json | coste_personalizacion.frontal | Solo presupuestos con frontal |
| Cantidad mínima | camisetas.json | cantidad_minima | Validación de cantidad |
| Nueva categoría | Crear bolsas.json | Todos | Nueva configuración |
| Nuevo tramo | camisetas.json | factores_escalado | Nuevo escalado |
| Zonas permitidas | camisetas.json | zonas_permitidas | Opciones en selector |

---

## 🎯 CHECKLIST ANTES DE CAMBIAR PRECIOS

- [ ] ¿Tengo backup del archivo original?
- [ ] ¿He validado el JSON?
- [ ] ¿He probado en navegador?
- [ ] ¿He verificado el impacto en ejemplos reales?
- [ ] ¿He informado al equipo de ventas?
- [ ] ¿He documentado el cambio?

---

## 📞 SOPORTE

Si algo no funciona:

1. Revisa el documento `ANALISIS-SISTEMA-PRECIOS.md`
2. Valida el JSON con `jsonlint`
3. Limpia cache del navegador
4. Reinicia el servidor
5. Revisa la consola del navegador (F12) para errores

---

**Fin de la Guía**

*Última actualización: 4 de Enero de 2026*
