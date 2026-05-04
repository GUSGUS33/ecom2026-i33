# ProcesoBlock - Documentación

## Descripción
Componente para mostrar un proceso paso a paso con diseño alternado (zigzag) entre imagen y contenido.

## Características
- ✅ Diseño alternado: imagen izquierda/derecha en pasos alternos
- ✅ Numeración automática de pasos (1, 2, 3...)
- ✅ Imágenes placeholder con icono Package cuando no hay imagen
- ✅ Responsive: vertical en móvil, horizontal en desktop
- ✅ Línea de progreso visual al final
- ✅ Círculos numerados en imagen y junto al título

## Estructura de datos ACF

### Campos del bloque:
```
blockType: "proceso"
procesoTitulo: string (opcional)
procesoPasos: Array<{
  titulo: string
  descripcion: string
  icono?: {
    node: {
      sourceUrl: string
      altText: string
    }
  }
}>
```

## Ejemplo de configuración en WordPress

```json
{
  "blockType": "proceso",
  "procesoTitulo": "Cómo funciona nuestro servicio de personalización",
  "procesoPasos": [
    {
      "titulo": "Elige tu producto",
      "descripcion": "Selecciona entre más de 1000 productos personalizables: camisetas, tazas, bolsas y mucho más. Todos con garantía de calidad premium.",
      "icono": {
        "node": {
          "sourceUrl": "https://example.com/paso1.jpg",
          "altText": "Elegir producto"
        }
      }
    },
    {
      "titulo": "Sube tu diseño",
      "descripcion": "Carga tu logo, imagen o texto. Nuestro equipo revisará el archivo y te enviará una prueba digital gratuita en menos de 2 horas.",
      "icono": null
    },
    {
      "titulo": "Aprobación y producción",
      "descripcion": "Una vez apruebes la prueba, comenzamos la producción. Utilizamos las mejores técnicas: serigrafía, bordado o DTF según el producto.",
      "icono": null
    },
    {
      "titulo": "Recibe tu pedido",
      "descripcion": "Envío express en 24-48h a toda España. Embalaje profesional y seguimiento en tiempo real. Garantía de satisfacción 100%.",
      "icono": null
    }
  ]
}
```

## Diseño visual

### Desktop:
```
[Imagen 1] ← → [Contenido 1]
[Contenido 2] ← → [Imagen 2]
[Imagen 3] ← → [Contenido 3]
[Contenido 4] ← → [Imagen 4]
```

### Mobile:
```
[Imagen 1]
[Contenido 1]

[Imagen 2]
[Contenido 2]
...
```

## Elementos visuales

1. **Número en imagen**: Círculo azul (bg-blue-600) con número blanco en esquina superior izquierda
2. **Número en contenido**: Círculo azul claro (bg-blue-100) con número azul junto al título
3. **Placeholder**: Icono Package gris en fondo degradado cuando no hay imagen
4. **Línea de progreso**: Barras azules horizontales al final indicando cantidad de pasos

## Integración

El bloque ya está integrado en:
- ✅ `BlockRenderer.tsx` (línea 22 import, línea 54 mapping)
- ✅ `seoPageComplete.ts` (campos GraphQL definidos)
- ✅ Sistema de fondos alternados (blanco → gris → azul)

## Testing

Para probar el bloque:
1. Ir a WordPress → Editar página con plantilla "Plantilla SEO (Headless Minimal)"
2. Añadir bloque de tipo "proceso"
3. Rellenar campos según estructura arriba
4. Guardar y visitar la página en desarrollo

## Próximas mejoras

- [ ] Animaciones de entrada (fade-in al hacer scroll)
- [ ] Iconos personalizados en lugar de imágenes
- [ ] Variante de diseño vertical sin alternancia
- [ ] Conectores visuales entre pasos (líneas/flechas)
