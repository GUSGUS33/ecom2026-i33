import json
import os

# Paths
source_file = '/home/ubuntu/impacto33-mvp/client/src/data/seo-data.json'
output_dir = '/home/ubuntu/impacto33-mvp/client/src/data/categories'

# Ensure output directory exists
os.makedirs(output_dir, exist_ok=True)

# Read source file
try:
    with open(source_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Found {len(data)} categories in seo-data.json")

    # Write individual files
    for slug, content in data.items():
        output_path = os.path.join(output_dir, f"{slug}.json")
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(content, f, indent=2, ensure_ascii=False)
        print(f"Created {output_path}")

    print("Splitting complete.")

except Exception as e:
    print(f"Error: {e}")
