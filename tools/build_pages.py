"""Regenerates privacy/terms/returns/shipping/404 pages from the text below,
re-using the header, footer and icons from index.html.  Run: python3 tools/build_pages.py"""
import os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
index = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
sprite = re.search(r'(<svg width="0" height="0".*?</defs>\s*</svg>)', index, re.S).group(1)
footer = re.search(r'(<footer class="site-footer">.*?</footer>)', index, re.S).group(1)
footer = re.sub(r'href="#(?!contact")', 'href="index.html#', footer).replace('href="#contact"', 'href="index.html#contact"')
analytics = re.search(r'(  <!-- ===== ANALYTICS SLOT 1.*?)\s*</head>', index, re.S).group(1)  # everything pasted into the slots
UPDATED = 'Last updated: 24 November 2026'

def page(slug, title, desc, body, noindex=False):
    robots = "\n  <meta name=\"robots\" content=\"noindex\">\n  <base href=\"/\">" if noindex else ""
    canonical = '' if noindex else f'\n  <link rel="canonical" href="https://tilichocare.com/{slug}.html">'
    return f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title} | Tilicho Cleaning</title>
  <meta name="description" content="{desc}">{canonical}{robots}
  <meta name="theme-color" content="#003888">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Tilicho Cleaning">
  <meta property="og:title" content="{title} | Tilicho Cleaning">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="https://tilichocare.com/og-image.jpg">
  <link rel="icon" href="/favicon.ico" sizes="48x48">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap">
  <link rel="stylesheet" href="styles.css">

{analytics}

</head>
<body class="legal-page">
  <a class="skip-link" href="#main">Skip to content</a>
  {sprite}
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="index.html" aria-label="Tilicho Cleaning home">
        <img src="images/logo-180.webp" srcset="images/logo-180.webp 180w, images/logo-320.webp 320w" sizes="120px" width="180" height="100" alt="Tilicho logo: a snow mountain over a lake inside a red and blue badge">
      </a>
      <div class="header-actions">
        <a class="btn btn-quiet btn-sm" href="index.html">Home</a>
        <a class="btn btn-buy btn-sm" href="index.html#products">Buy now</a>
      </div>
    </div>
  </header>
  <main id="main" class="legal">
    <div class="container container-narrow">
      <a class="back-link" href="index.html"><svg class="ico" style="transform:scaleX(-1)" aria-hidden="true"><use href="#i-arrow"/></svg>Back to home</a>
{body}
    </div>
  </main>
  {footer}
  <a class="wa-float" data-link="whatsapp" href="index.html#contact" aria-label="Chat with Tilicho on WhatsApp">
    <svg aria-hidden="true"><use href="#i-whatsapp"/></svg>
  </a>
  <script src="main.js" defer></script>
</body>
</html>
'''

CONTACT = '<p>Questions? Contact us on WhatsApp at <a data-link="whatsapp" href="index.html#contact"><span data-fill="phoneDisplay">+977 98XXXXXXXX</span></a> or email <a data-link="email" href="mailto:info@tilichocare.com" data-fill="email">info@tilichocare.com</a>.</p>'

PAGES = {
'privacy': ('Privacy Policy', 'How Tilicho Cleaning collects, uses and protects your personal information.', f'''
      <h1>Privacy Policy</h1>
      <p class="updated">{UPDATED}</p>
      <p>Tilicho Cleaning Pvt. Ltd. ("Tilicho", "we", "us") respects your privacy. This policy explains what information we collect when you visit tilichocare.com or order from us, and how we use it.</p>
      <h2>Information we collect</h2>
      <ul>
        <li><strong>Details you give us:</strong> your name, phone number, delivery address and any message you send through our website forms, WhatsApp, Viber, email or social media.</li>
        <li><strong>Order details:</strong> the products you order, the quantity and delivery information.</li>
        <li><strong>Website usage:</strong> if we use analytics tools (such as Google Analytics or the Meta Pixel), they may collect information like your device type, pages visited and how you reached our site, using cookies or similar technology.</li>
      </ul>
      <h2>How we use your information</h2>
      <ul>
        <li>To confirm, prepare and deliver your orders.</li>
        <li>To reply to your questions, distributor enquiries and feedback.</li>
        <li>To arrange replacements for products that arrive damaged.</li>
        <li>To improve our website, products and service.</li>
        <li>To tell you about new products or offers, only if you have agreed to hear from us.</li>
      </ul>
      <h2>Sharing your information</h2>
      <p>We do not sell your personal information. We only share it with people who help us serve you, such as delivery partners who need your name, phone number and address to deliver your order, or where the law requires it.</p>
      <h2>WhatsApp and other messaging apps</h2>
      <p>When you contact us through WhatsApp, Viber or social media, those messages are also handled by those companies under their own privacy policies.</p>
      <h2>How long we keep information</h2>
      <p>We keep your information only as long as we need it for the purposes above, or as required by the laws of Nepal.</p>
      <h2>Your choices</h2>
      <p>You can ask us to show, correct or delete the personal information we hold about you, or to stop sending you updates, by contacting us.</p>
      <h2>Contact us</h2>
      {CONTACT}'''),
'terms': ('Terms & Conditions', 'Terms and conditions for using tilichocare.com and buying Tilicho Cleaning products.', f'''
      <h1>Terms &amp; Conditions</h1>
      <p class="updated">{UPDATED}</p>
      <p>These terms apply when you use tilichocare.com or buy products from Tilicho Cleaning Pvt. Ltd. By placing an order you agree to them.</p>
      <h2>Products and prices</h2>
      <ul>
        <li>All prices are in Nepali Rupees (NPR). Delivery charges, where they apply, are confirmed with you before dispatch.</li>
        <li>Prices and product availability may change. The price confirmed to you when we accept your order is the price you pay.</li>
        <li>Product photos are for illustration. Packaging may vary slightly.</li>
      </ul>
      <h2>Orders</h2>
      <p>Orders are placed by contacting us on WhatsApp or our other channels. An order is accepted once we confirm it with you. We may decline or cancel an order, for example if a product is out of stock or the delivery details cannot be confirmed.</p>
      <h2>Launch offer</h2>
      <p>A free drain stick is given with each Disposable Toilet Wand ordered by our first 500 customers. The offer ends once 500 customers have ordered, and it cannot be exchanged for cash.</p>
      <h2>Using our products safely</h2>
      <ul>
        <li>Always follow the instructions on the pack.</li>
        <li>Do not flush toilet wand heads. Throw used heads in the bin.</li>
        <li>Keep drain sticks away from children, avoid contact with eyes, and do not mix them with other cleaners.</li>
      </ul>
      <h2>Returns</h2>
      <p>Please see our <a href="returns.html">Return &amp; Refund Policy</a>.</p>
      <h2>Liability</h2>
      <p>To the extent allowed by law, Tilicho is not responsible for loss or damage caused by using a product in a way that does not follow its instructions.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of Nepal.</p>
      <h2>Contact us</h2>
      {CONTACT}'''),
'returns': ('Return & Refund Policy', 'Tilicho Cleaning return and replacement policy for products that arrive damaged.', f'''
      <h1>Return &amp; Refund Policy</h1>
      <p class="updated">{UPDATED}</p>
      <p>We want every Tilicho order to reach you in perfect condition. If something arrives damaged, we'll make it right.</p>
      <h2>Damaged on arrival</h2>
      <p>If your product arrives damaged, we will replace it.</p>
      <ul>
        <li>Contact us on WhatsApp <strong>within 48 hours of delivery</strong>.</li>
        <li>Send clear photos (or a short video) of the damaged product and its packaging, plus your name and order details.</li>
        <li>Keep the product and packaging until we have resolved your request.</li>
      </ul>
      <p>Once we confirm the damage, we will send you a replacement. If a replacement is not available, we will discuss a refund with you.</p>
      <h2>What we cannot accept</h2>
      <ul>
        <li>Products that were delivered in good condition but are no longer wanted. Because these are hygiene products, we cannot take back opened or used items.</li>
        <li>Damage caused after delivery, or by not following the product instructions.</li>
        <li>Requests made more than 48 hours after delivery.</li>
      </ul>
      <h2>Contact us</h2>
      {CONTACT}'''),
'shipping': ('Shipping Policy', 'Tilicho Cleaning delivers all over Nepal. Delivery times and charges explained.', f'''
      <h1>Shipping Policy</h1>
      <p class="updated">{UPDATED}</p>
      <h2>Where we deliver</h2>
      <p>We deliver all over Nepal.</p>
      <h2>Delivery time</h2>
      <p>Delivery time depends on your location. When you order, we'll tell you the estimated delivery date for your address.</p>
      <h2>Delivery charges</h2>
      <p>Delivery charges depend on your location. We always confirm the charge with you before we dispatch your order.</p>
      <h2>Your delivery details</h2>
      <ul>
        <li>Please give a complete address and a phone number that is reachable on the delivery day.</li>
        <li>If we cannot reach you after several tries, we may need to cancel or reschedule the delivery.</li>
      </ul>
      <h2>When your order arrives</h2>
      <p>Please check your package when it arrives. If anything is damaged, contact us within 48 hours. See our <a href="returns.html">Return &amp; Refund Policy</a>.</p>
      <h2>Contact us</h2>
      {CONTACT}'''),
'404': ('Page not found', 'This page could not be found.', '''
      <h1>Sorry, we couldn't find that page</h1>
      <p>The link may be old or mistyped.</p>
      <p><a class="btn btn-primary" href="index.html">Go to the homepage</a></p>'''),
}

for slug, (title, desc, body) in PAGES.items():
    open(os.path.join(ROOT, f'{slug}.html'), 'w', encoding='utf-8').write(page(slug, title, desc, body, noindex=(slug == '404')))
print('pages written')
