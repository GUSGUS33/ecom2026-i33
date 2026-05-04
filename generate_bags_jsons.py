import json
import os

# Directorio de destino
output_dir = '/home/ubuntu/impacto33-mvp/client/src/data/categories'
os.makedirs(output_dir, exist_ok=True)

# Plantilla base para categorías
def create_category_data(slug, title, parent_slug, search_intent, siblings):
    return {
        "url": f"/bolsas-mochilas/{parent_slug}/{slug}/" if parent_slug != "bolsas-mochilas" else f"/bolsas-mochilas/{slug}/",
        "slug": slug,
        "parent_slug": parent_slug,
        "search_intent": search_intent,
        "siblings_intents": siblings,
        "hero_tituloPrincipal": title,
        "hero_intro": f"Encuentra las mejores {title.lower()}. Resistentes, prácticas y personalizables con tu logo.",
        "hub_subcategorias_texto": "Modelos disponibles:",
        "ventajasEmpresa": {
            "titulo": "Visibilidad para tu Marca",
            "items": [
                "Gran área de impresión",
                "Materiales ecológicos disponibles",
                "Diseños modernos y funcionales",
                "Ideales como regalo promocional"
            ]
        },
        "casosUso": [
            {
                "titulo": "Ferias y Congresos",
                "descripcion": "El soporte perfecto para entregar documentación.",
                "image_alt": f"{title} para ferias"
            },
            {
                "titulo": "Regalo de Empresa",
                "descripcion": "Un detalle útil que tus clientes usarán a diario.",
                "image_alt": f"{title} regalo corporativo"
            }
        ],
        "faq": [
            {
                "pregunta": "¿Qué peso soportan?",
                "respuesta": "Depende del modelo y gramaje, pero nuestras bolsas estándar soportan entre 5 y 8 kg."
            },
            {
                "pregunta": "¿Se pueden imprimir a todo color?",
                "respuesta": "Sí, mediante transferencia digital o DTF podemos imprimir diseños a todo color."
            },
            {
                "pregunta": "¿Tenéis opciones ecológicas?",
                "respuesta": "Sí, disponemos de algodón orgánico, RPET y materiales reciclados."
            }
        ],
        "texto_final_refuerzo": "Lleva tu marca a todas partes con nuestras bolsas y mochilas personalizadas.",
        "cta_textoCta": "Pide tu presupuesto sin compromiso",
        "meta_title": f"{title} | Bolsas y Mochilas | IMPACTO33",
        "meta_description": f"Catálogo de {title.lower()} para personalizar. Precios de fábrica y envío rápido. ¡Consulta ahora!"
    }

# Lista de categorías a crear
categories_to_create = [
    # Bolsas
    ("algodon", "Bolsas de Algodón", "bolsas", "bolsas algodón personalizadas", ["bolsas non woven", "bolsas yute"]),
    ("non-woven", "Bolsas Non Woven", "bolsas", "bolsas non woven personalizadas", ["bolsas algodón", "bolsas papel"]),
    ("yute", "Bolsas de Yute", "bolsas", "bolsas yute personalizadas", ["bolsas algodón", "bolsas playa"]),
    ("botellas", "Bolsas para Botellas", "bolsas", "bolsas vino personalizadas", ["bolsas papel", "cajas vino"]), # Ojo: slug 'botellas' colisiona con Tazas y Botellas > Botellas.
    # Solución: Renombrar slug a 'bolsas-para-botellas'
    ("papel", "Bolsas de Papel", "bolsas", "bolsas papel personalizadas", ["bolsas kraft", "bolsas lujo"]),
    ("plegables", "Bolsas Plegables", "bolsas", "bolsas plegables personalizadas", ["bolsas compra", "bolsas poliéster"]),
    
    # Mochilas
    ("cuerda", "Mochilas de Cuerda", "mochilas", "mochilas saco personalizadas", ["mochilas escolares", "mochilas deporte"]),
    ("escolares", "Mochilas Escolares", "mochilas", "mochilas colegio personalizadas", ["mochilas cuerda", "mochilas portátil"]),
    ("portatil", "Mochilas para Portátil", "mochilas", "mochilas ordenador personalizadas", ["maletines", "mochilas ejecutivo"])
]

for slug, title, parent_slug, search_intent, siblings in categories_to_create:
    # Ajuste de slugs conflictivos
    final_slug = slug
    if slug == "botellas":
        final_slug = "bolsas-para-botellas"
    
    data = create_category_data(final_slug, title, parent_slug, search_intent, siblings)
    
    filename = f"{final_slug}.json"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Generado: {filepath}")

print("Generación de JSONs de Bolsas y Mochilas completada.")
