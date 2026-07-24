# EUZOIA — static website

Production-ready static hero website for `euzoia.com`, built with semantic HTML and CSS.

## Local preview

No build step or dependencies are required:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Structure

- `index.html` — homepage and metadata
- `404.html` — custom error page
- `css/styles.css` — responsive design system and layout
- `assets/images/` — optimized production images
- `assets/video/` — preserved optimized video assets for possible future use
- `assets/originals/` — preserved copies of all supplied source assets
- `_headers`, `_redirects` — Cloudflare Pages rules
- `robots.txt`, `sitemap.xml`, `site.webmanifest` — discovery and app metadata

## Content notes

The current copy is suitable for an initial presentation site but should be approved by the owner before publication. No analytics, pixels, cookies, remote fonts or third-party scripts are included.

Deployment instructions are in `DEPLOYMENT.md`.
