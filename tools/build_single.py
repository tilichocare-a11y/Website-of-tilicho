"""Builds tilicho-website.html: the whole site in ONE file (CSS, JS and images inlined) for previewing.
Run: python3 tools/build_single.py"""
import re, base64, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
html = open('index.html', encoding='utf-8').read()
css = open('styles.css', encoding='utf-8').read()
js = open('main.js', encoding='utf-8').read()


def uri(path, mime='image/webp'):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()


pick = {'logo': 'images/logo-320.webp', 'wand-box': 'images/wand-box-560.webp', 'wand': 'images/wand-400.webp',
        'logo-tagline': 'images/logo-tagline-480.webp', 'pouch-lemon': 'images/pouch-lemon-360.webp', 'pouch-lavender': 'images/pouch-lavender-360.webp', 'pouch-pine': 'images/pouch-pine-360.webp', 'pouch-ocean': 'images/pouch-ocean-360.webp',
        'drain-sink': 'images/drain-sink-400.webp'}
cache = {}
html = re.sub(r'\s(srcset|sizes)="[^"]*"', '', html)
html = re.sub(r'\s*<link rel="preload" as="image"[^>]*>', '', html)
html = re.sub(r'\s*<link rel="(icon|apple-touch-icon|manifest)"[^>]*>', '', html)


def repl(m):
    name = re.match(r'images/(.+?)-\d+\.webp', m.group(1)).group(1)
    if name not in cache:
        cache[name] = uri(pick[name])
    return 'src="' + cache[name] + '"'


html = re.sub(r'src="(images/[^"]+\.webp)"', repl, html)
html = html.replace('<link rel="stylesheet" href="styles.css">',
                    f'<link rel="icon" type="image/png" href="{uri("favicon-32.png", "image/png")}">\n  <style>\n{css}\n  </style>')
imgs = {f'pouch-{k}': uri(f'images/pouch-{k}-360.webp') for k in ('lemon', 'lavender', 'pine', 'ocean')}
js = js.replace("img.srcset = 'images/pouch-' + key + '-360.webp 360w, images/pouch-' + key + '-600.webp 600w';", "img.removeAttribute('srcset');")
js = js.replace("'images/pouch-' + key + '-360.webp'", "__IMG['pouch-' + key]")
js = js.replace("'images/pouch-' + k + '-360.webp'", "__IMG['pouch-' + k]")
assert "'images/" not in js
imgjs = 'var __IMG = {' + ','.join(f'"{k}":"{v}"' for k, v in imgs.items()) + '};'
html = html.replace('<script src="main.js" defer></script>', f'<script>\n{imgjs}\n{js}\n</script>')
for p in ('privacy', 'terms', 'returns', 'shipping'):
    html = html.replace(f'href="{p}.html"', f'href="https://tilichocare.com/{p}.html"')
left = re.findall(r'["\' ]images/[\w-]+\.webp', html)
assert not left, left
open('tilicho-website.html', 'w', encoding='utf-8').write(html)
print('tilicho-website.html', round(os.path.getsize('tilicho-website.html') / 1024), 'KB')
