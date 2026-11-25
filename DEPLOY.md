# Deploying tilichocare.com (free)

The site is plain files, so any static host works. Upload **`tilicho-site-deploy.zip`**, which is the website files
without `CLAUDE.md`, `tools/` and `images/src/`. Those are working files and don't need to be public.

Before you upload, edit the `TILICHO` block at the top of `main.js` with your WhatsApp number, address and social links.

## Option A: Netlify (easiest, no account setup beyond sign-up)
1. Go to https://app.netlify.com/drop and sign up (free).
2. Unzip `tilicho-site-deploy.zip` and drag the **folder** onto the page. Your site is live in seconds at a
   `something.netlify.app` address. Open it on your phone and test the WhatsApp buttons.
3. **Site configuration → Change site name** (optional), e.g. `tilichocare`.
4. **Domain management → Add a domain** → type `tilichocare.com` → Verify → Add domain.
5. Netlify shows the DNS records to add. Log in where you bought the domain and set:
   - `A` record for `@` → `75.2.60.5`
   - `CNAME` record for `www` → `your-site-name.netlify.app`
   (Or switch the domain's nameservers to Netlify DNS, which Netlify offers on the same screen.)
6. Wait (minutes to a few hours). Netlify adds free HTTPS automatically. Under **Domain management → HTTPS** click
   "Verify DNS configuration" if it isn't active after an hour.
7. To update the site later: **Deploys → drag and drop** the new folder.

## Option B: Cloudflare Pages (very fast in Nepal/Asia, free)
1. Sign up at https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Upload assets**.
2. Name the project `tilichocare`, upload the unzipped folder → Deploy. You get `tilichocare.pages.dev`.
3. **Custom domains → Set up a custom domain** → `tilichocare.com`, then repeat for `www.tilichocare.com`.
4. Cloudflare will ask you to move the domain's **nameservers** to Cloudflare (it shows two names, e.g.
   `xxx.ns.cloudflare.com`). Change them at your domain registrar. This is required for the root domain on Cloudflare.
5. HTTPS is automatic once the domain is active.

## Option C: Vercel
1. Sign up at https://vercel.com. Easiest with a GitHub account: put the folder in a GitHub repository, then
   **Add New → Project → Import** that repository (Framework preset: *Other*, no build command).
2. **Settings → Domains → Add** `tilichocare.com`. Add the records Vercel shows: `A @ 76.76.21.21` and
   `CNAME www cname.vercel-dns.com`.

> The `_headers` file (cache rules) works on Netlify and Cloudflare Pages. Vercel ignores it, which is harmless.

## After going live
1. Open https://tilichocare.com on a phone, tap every WhatsApp/Viber/phone button and send a test form.
2. Check the sharing preview: paste the link into https://developers.facebook.com/tools/debug/ → "Scrape again".
3. Add the site to **Google Search Console** (https://search.google.com/search-console) → Domain property →
   verify with the DNS TXT record → submit `https://tilichocare.com/sitemap.xml`.
4. Analytics: paste the Meta Pixel and Google Analytics snippets into the `ANALYTICS SLOT` comments in `index.html`,
   run `python3 tools/build_pages.py` to copy them to the policy pages, and redeploy.
