"""Builds optimised web images from images/src. Run: python3 tools/build_images.py [pdf_pages_dir]"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter, ImageOps
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC, OUT = os.path.join(ROOT, 'images/src'), os.path.join(ROOT, 'images')
PDF = sys.argv[1] if len(sys.argv) > 1 else None

def save(im, name, widths, q=80):
    for w in widths:
        r = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(os.path.join(OUT, f'{name}-{w}.webp'), 'WEBP', quality=q, method=6)

def transparent_bg(im, seed_tol=38):
    im = im.convert('RGBA')
    mask = im.convert('RGB').copy()
    for xy in [(0, 0), (im.width - 1, 0), (0, im.height - 1), (im.width - 1, im.height - 1)]:
        ImageDraw.floodfill(mask, xy, (255, 0, 255), thresh=seed_tol)
    m = Image.new('L', im.size, 255)
    px, mp = mask.load(), m.load()
    for y in range(im.height):
        for x in range(im.width):
            if px[x, y] == (255, 0, 255):
                mp[x, y] = 0
    m = m.filter(ImageFilter.GaussianBlur(0.8))
    im.putalpha(m)
    return im.crop(im.getbbox())

# Logo
logo = Image.open(os.path.join(SRC, '3.jpg')).convert('RGB')
badge = transparent_bg(logo.crop((60, 60, 1480, 860)))
save(badge, 'logo', [180, 320, 640], q=88)
full = transparent_bg(logo)
save(full, 'logo-tagline', [480, 800], q=88)
# favicons
sq = max(badge.size); canvas = Image.new('RGBA', (sq, sq), (0, 0, 0, 0))
canvas.paste(badge, ((sq - badge.width) // 2, (sq - badge.height) // 2), badge)
for s in (16, 32, 48, 192, 512):
    canvas.resize((s, s), Image.LANCZOS).save(os.path.join(ROOT, f'favicon-{s}.png'))
canvas.resize((48, 48), Image.LANCZOS).save(os.path.join(ROOT, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
apple = Image.new('RGBA', (180, 180), (255, 255, 255, 255))
b = badge.resize((164, round(badge.height * 164 / badge.width)), Image.LANCZOS)
apple.paste(b, (8, (180 - b.height) // 2), b); apple.convert('RGB').save(os.path.join(ROOT, 'apple-touch-icon.png'))

# Wand (white background, crop to content)
wand = Image.open(os.path.join(SRC, '2.webp')).convert('RGBA')  # source already has a transparent background
bbox = wand.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
pad = 20; wand = wand.crop((bbox[0] - pad, bbox[1] - pad, bbox[2] + pad, bbox[3] + pad))
save(wand, 'wand', [240, 400])

# Box (4.webp: 3D box render on a transparent background, cropped to the box)
box = Image.open(os.path.join(SRC, '4.webp')).convert('RGBA')
bb = box.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
box = box.crop((bb[0] - 14, bb[1] - 14, bb[2] + 14, bb[3] + 14))
save(box, 'wand-box', [360, 560], q=82)

if PDF:
    for n, name in [(1, 'lemon'), (3, 'lavender'), (5, 'pine'), (7, 'ocean')]:
        save(Image.open(os.path.join(PDF, f'hi-{n}.png')).convert('RGB'), f'pouch-{name}', [360, 600])
    sink = Image.open(os.path.join(PDF, 'hi-2.png')).convert('RGB').crop((60, 165, 510, 650))
    save(sink, 'drain-sink', [400])

# Open Graph share image 1200x630
og = Image.new('RGB', (1200, 630), (0, 56, 136))
d = ImageDraw.Draw(og)
for i in range(630):  # soft vertical gradient
    t = i / 630; d.line([(0, i), (1200, i)], fill=(0, int(56 + 30 * t), int(136 + 40 * t)))
d.ellipse((640, 40, 1190, 590), fill=(255, 255, 255))
w = wand.resize((round(wand.width * 520 / wand.height), 520), Image.LANCZOS)
og.paste(w, (915 - w.width // 2, 55), w)
lb = full.resize((520, round(full.height * 520 / full.width)), Image.LANCZOS)
plate = Image.new('RGBA', (580, lb.height + 50), (255, 255, 255, 255))
pm = Image.new('L', plate.size, 0); ImageDraw.Draw(pm).rounded_rectangle((0, 0, *plate.size), 28, fill=255)
og.paste(plate, (40, (630 - plate.height) // 2), pm)
og.paste(lb, (70, (630 - lb.height) // 2), lb)
og.save(os.path.join(ROOT, 'og-image.jpg'), quality=85)
print('done')
