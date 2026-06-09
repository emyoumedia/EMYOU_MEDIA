"""
EmYou Media — Bulk Responsive Patcher
Run this script inside your project folder:
    python3 patch_all_pages.py

It will:
1. Add <link rel="stylesheet" href="responsive.css"> to every HTML file
2. Add semantic classes to all inline grid style= attributes
3. Skip files that are already patched
"""

import os
import re

HTML_FILES = [
    "index.html",
    "about.html",
    "services.html",
    "digital-marketing.html",
    "media-production.html",
    "contact.html",
    "portfolio.html",
    "blog.html",
    "careers.html",
]

# Map of inline grid patterns → class name to inject
GRID_PATCHES = [
    # 2-col grids
    (r'style="display:grid;grid-template-columns:1fr 1fr;([^"]*)"',
     'grid-2col'),
    (r'style="display:grid;grid-template-columns:1fr 1\.2fr;([^"]*)"',
     'grid-2col'),
    (r'style="display:grid;grid-template-columns:1\.2fr 1fr;([^"]*)"',
     'grid-2col'),
    # 3-col repeat grids
    (r'style="display:grid;grid-template-columns:repeat\(3,1fr\);([^"]*)"',
     'grid-3col'),
    # 4-col repeat grids
    (r'style="display:grid;grid-template-columns:repeat\(4,1fr\);([^"]*)"',
     'grid-4col'),
    # 2-col repeat grids
    (r'style="display:grid;grid-template-columns:repeat\(2,1fr\);([^"]*)"',
     'grid-2col'),
    # Why section grids (1fr 1fr with gap:1px)
    (r'style="display:grid;grid-template-columns:1fr 1fr;gap:1px;([^"]*)"',
     'grid-2col grid-divided'),
]

def patch_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    patched_count = 0

    # 1. Add responsive.css link if not already present
    if 'responsive.css' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="styles.css">',
            '<link rel="stylesheet" href="styles.css">\n  <link rel="stylesheet" href="responsive.css">'
        )
        print(f"  + Added responsive.css link")

    # 2. Inject semantic classes into inline grid divs
    def inject_class(match, classname):
        full = match.group(0)
        # Check if class already exists on this element
        # Look backwards in content for the opening tag
        return full  # handled below

    # Better approach: find <div ... style="display:grid..."> and add class
    def add_class_to_grid(content, pattern, classname):
        count = 0
        # Find all divs with this grid style
        full_pattern = r'(<div)([^>]*?)(style="display:grid;grid-template-columns:' + pattern + r'[^>]*?>)'
        # Simpler: just find the style attribute and prepend class
        style_pattern = r'(<div)(\s+)(style="display:grid;grid-template-columns:' + pattern + r'")'
        
        def replacer(m):
            nonlocal count
            before = m.group(0)
            if 'class="' in before:
                # Already has a class, append to it
                result = re.sub(r'class="([^"]*)"', f'class="\\1 {classname}"', before, count=1)
            else:
                # No class, add one after <div
                result = before.replace('<div ', f'<div class="{classname}" ', 1)
            count += 1
            return result
        
        new_content = re.sub(style_pattern, replacer, content)
        return new_content, count

    # Apply grid class patches
    grid_patterns = [
        (r'1fr 1fr', 'grid-2col'),
        (r'1fr 1\.2fr', 'grid-2col'),
        (r'1\.2fr 1fr', 'grid-2col'),
        (r'repeat\(2,1fr\)', 'grid-2col'),
        (r'repeat\(3,1fr\)', 'grid-3col'),
        (r'repeat\(4,1fr\)', 'grid-4col'),
    ]

    for pattern, classname in grid_patterns:
        content, n = add_class_to_grid(content, pattern, classname)
        if n:
            patched_count += n
            print(f"  + Added class '{classname}' to {n} grid(s) matching: {pattern}")

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Saved {filepath}")
    else:
        print(f"  — No changes needed for {filepath}")

    return content != original


# Run
print("=" * 50)
print("EmYou Media — Responsive Patcher")
print("=" * 50)
print("Place this script in your project folder and run it.")
print("It will patch all HTML files in the same directory.")
print()

# Self-test with current directory
cwd = os.getcwd()
print(f"Working directory: {cwd}")
print()

found = []
for f in HTML_FILES:
    path = os.path.join(cwd, f)
    if os.path.exists(path):
        found.append(path)
        
if not found:
    print("No HTML files found in current directory.")
    print("Copy this script into your EmYou Media project folder and run again.")
else:
    for path in found:
        print(f"\nPatching: {os.path.basename(path)}")
        patch_file(path)

print("\n✓ Done! All pages patched.")
print("Make sure responsive.css is in the same folder as your HTML files.")