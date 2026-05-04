import json
import os

# Directorio de destino
output_dir = '/home/ubuntu/impacto33-mvp/client/src/data/categories'
os.makedirs(output_dir, exist_ok=True)

# Plantilla base para categorías
def create_category_data(slug, title, parent_slug, search_intent, siblings):
    return {
        "url": f"/merchandising/{parent_slug}/{slug}/" if parent_slug != "merchandising" else f"/merchandising/{slug}/",
        "slug": slug,
        "parent_slug": parent_slug,
        "search_intent": search_intent,
        "siblings_intents": siblings,
        "hero_tituloPrincipal": title,
        "hero_intro": f"Los mejores artículos de {title.lower()}. Innovación y utilidad para potenciar tu marca.",
        "hub_subcategorias_texto": "Categorías destacadas:",
        "ventajasEmpresa": {
            "titulo": "Impacto Garantizado",
            "items": [
                "Artículos de tendencia",
                "Personalización de alta precisión",
                "Stock permanente",
                "Asesoramiento personalizado"
            ]
        },
        "casosUso": [
            {
                "titulo": "Campañas de Marketing",
                "descripcion": "Aumenta el ROI de tus campañas con regalos útiles.",
                "image_alt": f"{title} campaña marketing"
            },
            {
                "titulo": "Fidelización de Clientes",
                "descripcion": "Detalles que marcan la diferencia y crean recuerdo de marca.",
                "image_alt": f"{title} fidelización"
            }
        ],
        "faq": [
            {
                "pregunta": "¿Cuál es el plazo de entrega?",
                "respuesta": "Para artículos en stock con personalización estándar, el plazo es de 7 a 10 días laborables."
            },
            {
                "pregunta": "¿Hacéis envíos urgentes?",
                "respuesta": "Sí, disponemos de servicio express para pedidos urgentes. Consúltanos."
            },
            {
                "pregunta": "¿Tenéis catálogo físico?",
                "respuesta": "Priorizamos el catálogo digital por sostenibilidad, pero podemos enviarte muestras físicas."
            }
        ],
        "texto_final_refuerzo": "Diferénciate de la competencia con el merchandising más original de IMPACTO33.",
        "cta_textoCta": "Solicita cotización hoy mismo",
        "meta_title": f"{title} | Merchandising | IMPACTO33",
        "meta_description": f"Amplio catálogo de {title.lower()} para empresas. Personalización premium y precios competitivos. ¡Entra ahora!"
    }

# Lista de categorías a crear
categories_to_create = [
    # Oficina
    ("boligrafos", "Bolígrafos Personalizados", "oficina", "bolígrafos publicidad", ["libretas", "carpetas"]),
    ("libretas", "Libretas Personalizadas", "oficina", "libretas corporativas", ["bolígrafos", "agendas"]),
    ("carpetas", "Carpetas Personalizadas", "oficina", "carpetas congresos", ["portadocumentos", "libretas"]),
    ("usb", "Memorias USB", "oficina", "pendrives personalizados", ["power banks", "tecnología"]),
    
    # Tecnología
    ("power-banks", "Power Banks", "tecnologia", "baterías externas personalizadas", ["usb", "altavoces"]),
    ("altavoces", "Altavoces Bluetooth", "tecnologia", "altavoces personalizados", ["auriculares", "power banks"]),
    ("auriculares", "Auriculares", "tecnologia", "auriculares personalizados", ["altavoces", "accesorios móvil"]),
    
    # Hogar
    ("mantas", "Mantas Personalizadas", "hogar", "mantas bordadas", ["toallas", "cojines"]),
    ("velas", "Velas Aromáticas", "hogar", "velas personalizadas", ["ambientadores", "decoración"]),
    ("cocina", "Utensilios de Cocina", "hogar", "accesorios cocina personalizados", ["delantales", "tablas cortar"]),
    
    # Eventos
    ("lanyards", "Lanyards Identificativos", "eventos", "lanyards personalizados", ["chapas", "pulseras"]),
    ("pulseras", "Pulseras de Tela", "eventos", "pulseras festivales", ["lanyards", "entradas"]),
    ("chapas", "Chapas Personalizadas", "eventos", "chapas publicitarias", ["imanes", "pegatinas"])
]

for slug, title, parent_slug, search_intent, siblings in categories_to_create:
    data = create_category_data(slug, title, parent_slug, search_intent, siblings)
    
    filename = f"{slug}.json"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Generado: {filepath}")

print("Generación de JSONs de Merchandising completada.")
