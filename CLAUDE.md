# Tilicho Cleaning: website (tilichocare.com)

Static, single-page marketing site. Plain HTML/CSS/JS, no build step, no framework.
Orders happen on WhatsApp (pre-filled messages), so there is no cart or checkout.

## Brand
- **Name:** Tilicho Cleaning (legal: Tilicho Cleaning Pvt. Ltd.). Domain: tilichocare.com
- **Tagline:** "Smarter cleaning. Easier living."
- **Story:** New Nepali cleaning-products brand; goal is to become Nepal's own trusted cleaning brand for every home.
  Name inspired by Tilicho Lake (Manang, Annapurna region, ~4,900 m). Logo = snow mountain over a lake in a
  red-bordered blue badge with white lettering.
- **Vision:** build Nepal's complete cleaning-products range.

## Colours (sampled from logo `images/src/3.jpg`; use ONLY these brand colours)
| Token | Hex | Use |
|---|---|---|
| `--blue` | `#003888` | Dominant: header text/links, buttons, footer, headings, large areas |
| `--blue-700` | `#002a6a` | Hover/pressed blue |
| `--blue-50` | `#eef4fc` | Pale tint for alternating section backgrounds |
| `--blue-100` | `#dce8f8` | Light tint (illustrations, soft chips) |
| `--red` | `#e8050f` | ONLY offers, prices, badges, Buy/Order buttons |
| `--red-700` | `#c0040c` | Hover for red buttons |
| `--ink` | `#0d1b3e` | Body text (dark navy). Never red paragraphs |
| `--ink-soft` | `#44506a` | Secondary text |

Fragrance colours, used **only** on the drain-stick product card (sampled from the pouch designs):
Lemon `#fed21c` · Lavender `#6c4fa3` · Pine `#1d7a4b` · Ocean `#0779ad`.

Font: **Plus Jakarta Sans** 400–800 (one family for headings and body), via Google Fonts.

### Design direction (v3, current): clean, premium storefront
The owner rejected v1 (generic) and v2 (too busy/editorial). v3 takes cues from big cleaning brands' sites
(Clorox, Scotch-Brite, Suvaam): lots of white, soft pale-blue panels, rounded product tiles, calm motion.
Keep it calm: no marquees, contour lines, rotating stamps, giant watermark text or extra sections.
Page order: announcement bar (offer) → sticky white header → hero panel (product on white plate, red "Free" badge)
→ 4-item perks strip → "Shop our range" product cards (swipe row on phones) → "See how it works" video player
→ toilet wand spotlight → drain sticks spotlight (fragrance switcher) → about → FAQ accordion
→ distributor banner (form opens on "Apply now") → contact cards + form → footer.
Motion: soft fade-up reveals, gentle hero float, card lift + image zoom on hover, smooth accordion, pulse on offer badge.

## Products & prices
| Product | Pack | Price |
|---|---|---|
| Disposable Toilet Wand (hero product) | 1 box = handle + storage caddy + **16 heads** | **NPR 1,500** |
| Drain Cleaning Sticks | **12 sticks** per pack (each 9.8 × 0.5 cm) | **NPR 370** |
| Bleach | coming soon | – |
| Glass cleaner | coming soon | – |

- Only ONE toilet wand size (16 heads). There are no 24/32-head packs.
- A 16-head box usually lasts about 6–7 weeks.
- Wand usage: click a fresh head onto the handle → scrub → press button to drop used head in the bin.
  **Box says "DO NOT FLUSH"**: heads go in the bin, never the toilet.
- Drain sticks: fragrances Lemon (fresh citrus), Lavender (calming), Pine (Himalayan pine), Ocean (cool ocean breeze).
  Use areas: kitchen sink, bathroom pipes, vanity basin, utility area. Drop one stick in the drain, run water / leave
  to work, replace every 3 days. Pack claims: "Cleans • Deodorises • Keeps drains flowing".
  Warning: keep away from children, avoid contact with eyes, do not mix with other cleaners.
- **Launch offer:** free drain stick with every toilet wand, for the **first 500 customers**.

## Business details
- Delivery: **all over Nepal**. Times and charges are confirmed per order (no fixed numbers published yet).
- Returns: replacement if the product **arrives damaged** (site says: report within 48 hours with photos; ⚠ the 48-hour window still needs owner confirmation).
- Payment methods: **not yet confirmed** (owner mentioned Cash on delivery, eSewa, Khalti, still to confirm). The FAQ currently says options are confirmed on WhatsApp.
- "Pre-loaded with cleaner" for wand heads: **NOT confirmed**. The benefit is commented out in `index.html`; enable only when confirmed.
- Email: info@tilichocare.com

### Still placeholders (fill in `main.js` → `TILICHO` config at the top)
`phoneIntl` (digits, e.g. 9779812345678), `phoneDisplay`, `address`, `facebook`, `instagram`, `tiktok`.
Also replace the fallback text `+977 98XXXXXXXX` / `[Your address], Nepal` in the HTML if you want it correct without JS
(search the files for `98XXXXXXXX` and `[Your address]`).

## Content rules
- Do NOT invent customer reviews, awards, certifications, or product claims (e.g. "kills 99% germs").
- The reviews section exists in `index.html` with the `hidden` attribute; only enable with real reviews.
- Red is never used for paragraphs.

## Files
- `index.html`: the whole one-page site (sections: hero, perks, #shop, #how (video player), #toilet-wand, #drain-sticks, #reels, #reviews (hidden), #about, #faq, #distributor, #contact).
- **Videos:** `TILICHO.videos` in `main.js`: per product (`wand`, `drain`) set `mp4` (+ optional `poster`) for a file in
  `videos/`, or `youtube` (video ID). When empty, the player shows a labelled **animated SVG demo** (CSS keyframes:
  wand 7.5 s, drain 8 s) with the step list highlighting in sync. No real videos have been supplied yet.
- **Reels** (`#reels`, "Tilicho in real homes"): customer feedback + product description reels, listed in
  `TILICHO.reels` in `main.js` (type 'review' | 'product', title, optional name, and one of mp4 / youtube (Shorts ID) /
  link (Instagram/TikTok/Facebook, needs poster)). Files go in `videos/reels/`. Rendered by JS as a swipeable 9:16 row
  with filters; tapping opens a full-screen `<dialog>` player (swipe/arrows/Esc). While the list is empty, the section
  shows "coming soon" slots + a "send us your video" WhatsApp card. Never add fake or unpermitted customer videos.
- `tilicho-website.html`: single-file preview (everything inlined), generated by `python3 tools/build_single.py`. Not for hosting.
- `styles.css`: all styles; design tokens at the top. Animations respect `prefers-reduced-motion`.
- `main.js`: contact config, WhatsApp order links, fragrance switcher, forms → WhatsApp/email, header shrink, mobile menu, scroll reveal.
- `privacy.html`, `terms.html`, `returns.html`, `shipping.html`, `404.html`: **generated** by `python3 tools/build_pages.py`
  (re-uses header/footer/icons from index.html). Edit text in that script, then re-run it.
- `images/src/`: original images. `tools/build_images.py`: rebuilds the WebP sizes, favicons and `og-image.jpg`
  (pass the folder with rendered PDF pages `hi-1.png … hi-8.png` to rebuild the pouch/sink images).
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `_headers` (cache rules for Netlify/Cloudflare Pages).
- Analytics: paste Meta Pixel / Google Analytics into the marked `ANALYTICS SLOT` comments in the `<head>` of every page
  (for policy pages, add to index.html and re-run `tools/build_pages.py`, which copies the slot content).

## Testing
Serve locally with `python3 -m http.server 8000` and check widths 360, 768 and 1366 px.
