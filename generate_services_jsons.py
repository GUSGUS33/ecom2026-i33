import json
import os

# Directorio de destino
output_dir = '/home/ubuntu/impacto33-mvp/client/src/data/categories'
os.makedirs(output_dir, exist_ok=True)

# Plantilla base para servicios (adaptada de categorías)
def create_service_data(slug, title, parent_slug, search_intent, siblings):
    return {
        "url": f"/servicios/{slug}/",
        "slug": slug,
        "parent_slug": parent_slug,
        "search_intent": search_intent,
        "siblings_intents": siblings,
        "hero_tituloPrincipal": title,
        "hero_intro": f"Expertos en {title.lower()}. La mejor calidad de impresión para tus prendas y artículos promocionales.",
        "hub_subcategorias_texto": "Otras técnicas disponibles:",
        "ventajasEmpresa": {
            "titulo": "¿Por qué elegirnos?",
            "items": [
                "Maquinaria de última generación",
                "Acabados profesionales y duraderos",
                "Asesoramiento técnico especializado",
                "Plazos de entrega ajustados"
            ]
        },
        "casosUso": [
            {
                "titulo": "Grandes Tiradas",
                "descripcion": "Ideal para eventos masivos y promociones.",
                "image_alt": f"{title} grandes cantidades"
            },
            {
                "titulo": "Alta Definición",
                "descripcion": "Resultados fotográficos y detalles precisos.",
                "image_alt": f"{title} alta calidad"
            }
        ],
        "faq": [
            {
                "pregunta": "¿Qué materiales se pueden personalizar?",
                "respuesta": "Depende de la técnica. Consúltanos para saber qué método es mejor para tu producto."
            },
            {
                "pregunta": "¿Cuál es la cantidad mínima?",
                "respuesta": "Para la mayoría de técnicas partimos de 10 unidades, aunque en impresión digital podemos hacer desde 1 unidad."
            },
            {
                "pregunta": "¿Necesito un archivo vectorial?",
                "respuesta": "Es lo ideal para garantizar la máxima calidad, pero nuestro equipo de diseño puede ayudarte si no lo tienes."
            }
        ],
        "texto_final_refuerzo": "Garantizamos el mejor resultado para tu marca con nuestra tecnología de vanguardia.",
        "cta_textoCta": "Pide presupuesto de personalización",
        "meta_title": f"{title} | Servicios de Impresión | IMPACTO33",
        "meta_description": f"Servicio profesional de {title.lower()}. Calidad, rapidez y precios competitivos. ¡Infórmate aquí!"
    }

# Lista de servicios a crear
services_to_create = [
    ("serigrafia", "Serigrafía Textil", "servicios", "serigrafía camisetas", ["sublimación", "bordado"]),
    ("sublimacion", "Sublimación", "servicios", "sublimación textil", ["serigrafía", "impresión digital"]),
    ("bordado", "Bordado Industrial", "servicios", "bordado ropa laboral", ["serigrafía", "parches"]),
    ("impresion-digital", "Impresión Digital (DTG/DTF)", "servicios", "impresión digital camisetas", ["sublimación", "vinilo"])
]

for slug, title, parent_slug, search_intent, siblings in services_to_create:
    data = create_service_data(slug, title, parent_slug, search_intent, siblings)
    
    filename = f"{slug}.json"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Generado: {filepath}")

print("Generación de JSONs de Servicios completada.")
