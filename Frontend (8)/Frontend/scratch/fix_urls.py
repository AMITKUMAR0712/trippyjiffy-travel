import os

search_path = r'e:\AMIT NEW\Desktop\tj\Frontend (8)\Frontend\src'
# The broken string we observed in Login.jsx
# It was: import.meta.env.VITE_API_BASE_URL || " https://trippyjiffy.com\;
broken_variant1 = 'import.meta.env.VITE_API_BASE_URL || " https://trippyjiffy.com\\;'
broken_variant2 = 'import.meta.env.VITE_API_BASE_URL || " https://trippyjiffy.com\\"'
broken_variant3 = 'import.meta.env.VITE_API_BASE_URL || " https://trippyjiffy.com'

correct = 'import.meta.env.VITE_API_BASE_URL || "https://trippyjiffy.com";'

for root, dirs, files in os.walk(search_path):
    for f in files:
        if f.endswith(('.jsx', '.js')):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8') as file:
                content = file.read()
            
            # Simple way to find the broken part and fix it
            if 'import.meta.env.VITE_API_BASE_URL || "' in content and 'trippyjiffy.com' in content:
                # Use regex to find and replace the messy line
                import re
                new_content = re.sub(r'import\.meta\.env\.VITE_API_BASE_URL\s*\|\|\s*\"\s*https://trippyjiffy\.com.*?;', correct, content)
                # Also handle missing semicolon
                new_content = re.sub(r'import\.meta\.env\.VITE_API_BASE_URL\s*\|\|\s*\"\s*https://trippyjiffy\.com.*?(?=\n)', correct, new_content)
                
                if new_content != content:
                    with open(p, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f'Fixed: {p}')
