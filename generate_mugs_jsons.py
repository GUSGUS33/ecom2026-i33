import json
import os

# Directorio de destino
output_dir = '/home/ubuntu/impacto33-mvp/client/src/data/categories'
os.makedirs(output_dir, exist_ok=True)

# Plantilla base para categorías
def create_category_data(slug, title, parent_slug, search_intent, siblings):
    return {
        "url": f"/tazas-botellas/{parent_slug}/{slug}/" if parent_slug != "tazas-botellas" else f"/tazas-botellas/{slug}/",
        "slug": slug,
        "parent_slug": parent_slug,
        "search_intent": search_intent,
        "siblings_intents": siblings,
        "hero_tituloPrincipal": title,
        "hero_intro": f"Descubre nuestra selección de {title.lower()}. El regalo promocional perfecto para clientes y empleados.",
        "hub_subcategorias_texto": "Elige tu estilo:",
        "ventajasEmpresa": {
            "titulo": "Durabilidad y Diseño",
            "items": [
                "Materiales de alta calidad",
                "Aptas para lavavajillas (según modelo)",
                "Impresión 360º disponible",
                "Opciones térmicas y ecológicas"
            ]
        },
        "casosUso": [
            {
                "titulo": "Welcome Packs",
                "descripcion": "Imprescindibles en el kit de bienvenida de nuevos empleados.",
                "image_alt": f"{title} en welcome pack"
            },
            {
                "titulo": "Merchandising de Oficina",
                "descripcion": "Refuerza tu imagen de marca en cada escritorio.",
                "image_alt": f"{title} en oficina"
            }
        ],
        "faq": [
            {
                "pregunta": "¿Son aptas para microondas?",
                "respuesta": "La mayoría de nuestras tazas de cerámica sí, pero las metálicas no. Consulta la ficha de cada producto."
            },
            {
                "pregunta": "¿El marcaje se borra con los lavados?",
                "respuesta": "Utilizamos tintas vitrificables y sublimación de alta calidad para garantizar la máxima durabilidad."
            },
            {
                "pregunta": "¿Hacéis tazas con nombres individuales?",
                "respuesta": "Sí, mediante sublimación podemos personalizar cada taza con un nombre diferente."
            }
        ],
        "texto_final_refuerzo": "Haz que tu marca esté presente en cada sorbo con IMPACTO33.",
        "cta_textoCta": "Consigue tu presupuesto ahora",
        "meta_title": f"{title} | Tazas y Botellas | IMPACTO33",
        "meta_description": f"Personaliza {title.lower()} con tu logo. Precios directos de fábrica y calidad garantizada. ¡Pide precio!"
    }

# Lista de categorías a crear
categories_to_create = [
    # Tazas
    ("ceramica", "Tazas de Cerámica", "tazas", "tazas cerámica personalizadas", ["tazas metálicas", "tazas sublimación"]),
    ("metalicas", "Tazas Metálicas", "tazas", "tazas metálicas personalizadas", ["tazas cerámica", "termos"]),
    ("sublimacion", "Tazas Sublimación", "tazas", "tazas sublimación personalizadas", ["tazas mágicas", "tazas color"]),
    
    # Botellas
    ("aluminio", "Botellas de Aluminio", "botellas", "botellas aluminio personalizadas", ["botellas térmicas", "botellas cristal"]),
    ("termicas", "Botellas Térmicas", "botellas", "botellas térmicas personalizadas", ["termos", "botellas deporte"]),
    ("cristal", "Botellas de Cristal", "botellas", "botellas cristal personalizadas", ["botellas agua", "botellas bambú"])
]

for slug, title, parent_slug, search_intent, siblings in categories_to_create:
    data = create_category_data(slug, title, parent_slug, search_intent, siblings)
    
    filename = f"{slug}.json"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Generado: {filepath}")

print("Generación de JSONs de Tazas y Botellas completada.")
