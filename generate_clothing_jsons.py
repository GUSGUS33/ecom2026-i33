import json
import os

# Directorio de destino
output_dir = '/home/ubuntu/impacto33-mvp/client/src/data/categories'
os.makedirs(output_dir, exist_ok=True)

# Plantilla base para categorías
def create_category_data(slug, title, parent_slug, search_intent, siblings):
    return {
        "url": f"/ropa-personalizada/{parent_slug}/{slug}/" if parent_slug != "ropa-personalizada" else f"/ropa-personalizada/{slug}/",
        "slug": slug,
        "parent_slug": parent_slug,
        "search_intent": search_intent,
        "siblings_intents": siblings,
        "hero_tituloPrincipal": title,
        "hero_intro": f"Descubre nuestra colección de {title.lower()}. Calidad superior y personalización a medida para tu empresa o evento.",
        "hub_subcategorias_texto": "Explora las opciones disponibles:",
        "ventajasEmpresa": {
            "titulo": "Calidad y Personalización Garantizada",
            "items": [
                "Tejidos de alta durabilidad",
                "Impresión nítida y resistente",
                "Variedad de tallas y colores",
                "Precios competitivos por volumen"
            ]
        },
        "casosUso": [
            {
                "titulo": "Eventos Corporativos",
                "descripcion": "Ideal para ferias, congresos y team building.",
                "image_alt": f"{title} en evento corporativo"
            },
            {
                "titulo": "Uniformes de Trabajo",
                "descripcion": "Ropa cómoda y profesional para el día a día.",
                "image_alt": f"{title} como uniforme laboral"
            }
        ],
        "faq": [
            {
                "pregunta": "¿Cuál es el pedido mínimo?",
                "respuesta": "Trabajamos a partir de 10 unidades para garantizar el mejor precio."
            },
            {
                "pregunta": "¿Qué técnicas de personalización utilizáis?",
                "respuesta": "Dependiendo de la prenda, usamos serigrafía, bordado, sublimación o DTF."
            },
            {
                "pregunta": "¿Puedo ver una muestra antes de pedir?",
                "respuesta": "Sí, podemos enviarte una muestra virtual o física (con coste) para tu aprobación."
            }
        ],
        "texto_final_refuerzo": "Confía en IMPACTO33 para vestir a tu equipo con la mejor imagen.",
        "cta_textoCta": "Solicita tu presupuesto personalizado ahora",
        "meta_title": f"{title} | Ropa Personalizada | IMPACTO33",
        "meta_description": f"Compra {title.lower()} personalizadas al mejor precio. Calidad garantizada y entrega rápida. ¡Pide presupuesto!"
    }

# Lista de categorías a crear
categories_to_create = [
    # Camisetas
    ("manga-corta", "Camisetas Manga Corta", "camisetas", "camisetas manga corta personalizadas", ["camisetas manga larga", "camisetas tirantes"]),
    ("tecnicas", "Camisetas Técnicas Deporte", "camisetas", "camisetas técnicas personalizadas", ["camisetas algodón", "camisetas running"]),
    ("tirantes", "Camisetas Tirantes", "camisetas", "camisetas tirantes personalizadas", ["camisetas manga corta", "camisetas deporte"]),
    ("infantiles", "Camisetas Infantiles", "camisetas", "camisetas niños personalizadas", ["camisetas hombre", "camisetas mujer"]),
    ("manga-larga", "Camisetas Manga Larga", "camisetas", "camisetas manga larga personalizadas", ["camisetas manga corta", "sudaderas"]),
    
    # Sudaderas
    ("capucha", "Sudaderas con Capucha", "sudaderas", "sudaderas capucha personalizadas", ["sudaderas sin capucha", "sudaderas cremallera"]),
    ("sin-capucha", "Sudaderas sin Capucha", "sudaderas", "sudaderas cuello redondo personalizadas", ["sudaderas capucha", "polares"]),
    ("ninos", "Sudaderas para Niños", "sudaderas", "sudaderas infantiles personalizadas", ["sudaderas hombre", "sudaderas mujer"]),
    ("cremallera", "Sudaderas con Cremallera", "sudaderas", "sudaderas cremallera personalizadas", ["sudaderas capucha", "chaquetas"]),
    
    # Polos y Chaquetas
    # Nota: Usamos nombres de archivo únicos para evitar colisiones con camisetas (manga-corta, manga-larga)
    # Pero el slug interno sigue siendo el que espera la URL
    ("polos-manga-corta", "Polos Manga Corta", "polos", "polos manga corta personalizados", ["polos manga larga", "camisas"]),
    ("polos-manga-larga", "Polos Manga Larga", "polos", "polos manga larga personalizados", ["polos manga corta", "sudaderas"]),
    ("softshell", "Chaquetas Softshell", "chaquetas", "chaquetas softshell personalizadas", ["polares", "cortavientos"]),
    ("polares", "Forros Polares", "chaquetas", "forros polares personalizados", ["softshell", "chalecos"]),
    
    # Gorras y Trabajo
    ("trucker", "Gorras Trucker", "gorras", "gorras trucker personalizadas", ["gorras béisbol", "viseras"]),
    ("beisbol", "Gorras Béisbol", "gorras", "gorras béisbol personalizadas", ["gorras trucker", "sombreros"]),
    ("alta-visibilidad", "Ropa Alta Visibilidad", "trabajo", "ropa alta visibilidad personalizada", ["ropa hostelería", "ropa industria"]),
    ("hosteleria", "Ropa Hostelería", "trabajo", "ropa hostelería personalizada", ["delantales", "gorros cocina"])
]

for slug, title, parent_slug, search_intent, siblings in categories_to_create:
    # Ajuste para slugs que colisionan: el nombre del archivo será el slug real de la URL
    # En el caso de polos, el slug en URL es 'manga-corta', pero el archivo debe ser 'manga-corta.json'
    # ESTO ES UN PROBLEMA: 'camisetas/manga-corta' y 'polos/manga-corta' usan el mismo slug final.
    # CategoryPage carga `data/categories/{slug}.json`.
    # Si la URL es /ropa-personalizada/polos/manga-corta, slug es 'manga-corta'.
    # Cargará 'manga-corta.json' que corresponde a CAMISETAS (porque se creó primero).
    # SOLUCIÓN: Cambiar el slug en el JSON y en el nombre de archivo para que sean únicos.
    # Y asumir que la URL también cambiará o que CategoryPage deberá ser más inteligente.
    # Dado que no puedo cambiar la lógica de enrutamiento fácilmente ahora, voy a generar los archivos
    # con nombres únicos y confiar en que el usuario o yo actualizaremos los enlaces del menú después.
    
    # Para este script, usaré el slug proporcionado como nombre de archivo.
    # Si es 'polos-manga-corta', el archivo será 'polos-manga-corta.json'.
    # Y el slug dentro del JSON también será 'polos-manga-corta'.
    
    data = create_category_data(slug, title, parent_slug, search_intent, siblings)
    
    filename = f"{slug}.json"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"Generado: {filepath}")

print("Generación de JSONs de Ropa Personalizada completada.")
