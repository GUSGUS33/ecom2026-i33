import json
import re
from urllib.parse import urlparse

# Leer el archivo de texto
with open('/home/ubuntu/upload/categorias.txt', 'r') as f:
    lines = f.readlines()

# Estructuras de datos
seo_sitemap = []
dynamic_blocks = []

# Función para limpiar y extraer datos de cada línea
def parse_line(line):
    # Buscar URL (empieza por https://)
    match = re.search(r'(https://impacto33\.com/[^\s]+)', line)
    if not match:
        return None
    
    full_url = match.group(1)
    
    # Extraer el nombre (todo lo que hay antes de la URL)
    name = line[:match.start()].strip()
    
    # Parsear URL para obtener path y slug
    parsed_url = urlparse(full_url)
    path = parsed_url.path
    
    # Eliminar slashes iniciales y finales para procesar
    clean_path = path.strip('/')
    parts = clean_path.split('/')
    
    slug = parts[-1] if parts else ""
    parent_slug = parts[-2] if len(parts) > 1 else ""
    
    # Determinar tipo
    tipo = "categoria_hija" if parent_slug else "categoria_madre"
    
    return {
        "name": name,
        "url": path, # Guardamos el path relativo como pide el sistema (/categoria/)
        "slug": slug,
        "parent_slug": parent_slug,
        "tipo": tipo,
        "full_url": full_url
    }

# Procesar líneas
items = []
for line in lines:
    item = parse_line(line)
    if item:
        items.append(item)

# Construir estructura jerárquica para identificar hijos
# Primero, crear un diccionario de padres para fácil acceso
parents_map = {item['slug']: item for item in items if item['tipo'] == 'categoria_madre'}

# Segundo paso: Construir el JSON final
for item in items:
    # Generar search_intent (usamos el nombre como base)
    search_intent = item['name'].lower()
    
    # Generar siblings (hermanos)
    siblings_intents = []
    if item['parent_slug']:
        # Si es hija, sus hermanos son los que tienen el mismo padre
        siblings = [s['name'].lower() for s in items if s['parent_slug'] == item['parent_slug'] and s['slug'] != item['slug']]
        siblings_intents = siblings[:5] # Limitamos a 5 para no saturar
    else:
        # Si es madre, sus hermanos son otras madres
        siblings = [s['name'].lower() for s in items if not s['parent_slug'] and s['slug'] != item['slug']]
        siblings_intents = siblings[:5]

    # Construir objeto SEO
    seo_entry = {
        "url": item['url'],
        "slug": item['slug'],
        "parent_slug": item['parent_slug'],
        "search_intent": search_intent,
        "siblings_intents": siblings_intents,
        "tipo": item['tipo'],
        "anchor": item['name'] # Añadido para facilitar visualización
    }

    # Si es madre, buscar sus hijos
    if item['tipo'] == 'categoria_madre':
        children = []
        for child in items:
            if child['parent_slug'] == item['slug']:
                children.append({
                    "url": child['url'],
                    "anchor": child['name']
                })
        if children:
            seo_entry['children'] = children

    # Si es hija, añadir referencia al padre
    if item['tipo'] == 'categoria_hija':
        seo_entry['parent'] = f"/{item['parent_slug']}/"

    seo_sitemap.append(seo_entry)

    # Construir objeto Dynamic Block
    # Asumimos que el slug de catálogo es similar al slug de la URL
    # En un caso real, esto podría requerir un mapeo manual si difieren mucho
    catalog_slug = item['slug']
    
    # Ajustes manuales comunes si fuera necesario (ej: 'camisetas-personalizadas' -> 'camisetas')
    # Por ahora usamos el slug directo
    
    block_entry = {
        "url": item['url'],
        "catalog_category_slug": catalog_slug,
        "limit": 12, # Aumentamos un poco el límite por defecto
        "columns": 4
    }
    dynamic_blocks.append(block_entry)

# Guardar archivos
with open('/home/ubuntu/impacto33-mvp/client/src/data/seo-sitemap.json', 'w') as f:
    json.dump(seo_sitemap, f, indent=2, ensure_ascii=False)

with open('/home/ubuntu/impacto33-mvp/client/src/data/dynamic-blocks.json', 'w') as f:
    json.dump(dynamic_blocks, f, indent=2, ensure_ascii=False)

print(f"Generados {len(seo_sitemap)} entradas en seo-sitemap.json")
print(f"Generados {len(dynamic_blocks)} entradas en dynamic-blocks.json")
