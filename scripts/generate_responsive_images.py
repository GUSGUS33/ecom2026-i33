import os
from PIL import Image

# Configuración
INPUT_DIR = '/home/ubuntu/impacto33-mvp/client/public/images'
OUTPUT_DIR = '/home/ubuntu/impacto33-mvp/client/public/images'
SIZES = {
    'mobile': 480,
    'tablet': 768,
    'desktop': 1200
}

# Imágenes clave a procesar (rutas relativas a INPUT_DIR)
KEY_IMAGES = [
    'articulos-promocionales-personalizados-empresa.jpg',
    'regalos-personalizados-originales-para-empresas.jpg',
    '404-illustration.jpg',
    'services/serigrafia.jpg',
    'services/sublimacion.jpg',
    'services/bordado.jpg',
    'services/impresion-digital.jpg',
    'services/vinilo-textil.jpg',
    'services/transfer-dtf.jpg'
]

def process_image(image_path):
    try:
        full_path = os.path.join(INPUT_DIR, image_path)
        if not os.path.exists(full_path):
            print(f"Skipping {image_path}: File not found")
            return

        with Image.open(full_path) as img:
            # Convertir a RGB si es necesario
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')

            base_name, ext = os.path.splitext(image_path)
            
            for size_name, width in SIZES.items():
                # Calcular altura proporcional
                aspect_ratio = img.height / img.width
                height = int(width * aspect_ratio)
                
                # Redimensionar
                resized_img = img.resize((width, height), Image.Resampling.LANCZOS)
                
                # Guardar versión optimizada
                output_filename = f"{base_name}-{size_name}{ext}"
                output_path = os.path.join(OUTPUT_DIR, output_filename)
                
                # Asegurar que el directorio de salida existe
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                
                resized_img.save(output_path, quality=85, optimize=True)
                print(f"Generated {output_filename}")

                # También generar versión WebP
                webp_filename = f"{base_name}-{size_name}.webp"
                webp_path = os.path.join(OUTPUT_DIR, webp_filename)
                resized_img.save(webp_path, format='WEBP', quality=85)
                print(f"Generated {webp_filename}")

    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")

def main():
    print("Starting image optimization...")
    for image_path in KEY_IMAGES:
        process_image(image_path)
    print("Done!")

if __name__ == "__main__":
    main()
