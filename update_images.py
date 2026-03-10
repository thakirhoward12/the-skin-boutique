import re
import time
from duckduckgo_search import DDGS

def main():
    try:
        with open('src/data/products.ts', 'r', encoding='utf-8') as f:
            content = f.read()

        ddgs = DDGS()

        # Regex to find: brand: "Brand", \n name: "Name", ... \n image: "https://images.unsplash.com/..."
        # It handles arbitrary spaces and lines between brand, name, and image
        pattern = r'(brand:\s*"([^"]+)",[\s\S]*?name:\s*"([^"]+)",[\s\S]*?image:\s*")(https:\/\/images\.unsplash\.com\/[^"]+)(")'
        matches = list(re.finditer(pattern, content))

        print(f"Found {len(matches)} images to replace")

        for match in matches:
            full_match = match.group(0)
            prefix = match.group(1)
            brand = match.group(2)
            name = match.group(3)
            old_url = match.group(4)
            suffix = match.group(5)
            
            query = f"{brand} {name} skincare"
            print(f"Searching for: {query}")
            
            try:
                results = list(ddgs.images(query, max_results=1))
                if results and len(results) > 0:
                    new_url = results[0]['image']
                    print(f"Found: {new_url}")
                    
                    # Create the replacement block
                    new_block = prefix + new_url + suffix
                    content = content.replace(full_match, new_block)
                    
                    time.sleep(1) # sleep slightly to avoid rate limiting
                else:
                    print(f"No results found for {query}.")
            except Exception as e:
                print(f"Error searching for {query}: {e}")

        with open('src/data/products.ts', 'w', encoding='utf-8') as f:
            f.write(content)

        print("Done updating products.ts")
    except Exception as e:
        print(f"Script failed: {e}")

if __name__ == "__main__":
    main()
