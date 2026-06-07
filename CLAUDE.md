# Donchie — Brochure Website

A one-page brochure site for **Donchie**, the home health aide business of Dona Archie
(Licensed Home Health Aide), based in Upland, CA. Built as a static Astro site deployed to
GitHub Pages.

## Tech Stack

- **Astro** (`output: 'static'`) — no UI frameworks, plain `.astro` components
- Vanilla CSS (single global stylesheet, CSS custom properties for the palette)
- No JS beyond what Astro emits — the site is fully static HTML/CSS
- Deployed to **GitHub Pages** via GitHub Actions (`withastro/action` + `actions/deploy-pages`)

## Project Structure

```
.github/workflows/deploy.yml   GitHub Actions: build + deploy to GitHub Pages on push to main
astro.config.mjs               output: 'static', site set for the donchie.com custom domain
public/
  CNAME                        Custom domain file ("donchie.com") — copied verbatim to dist root
  favicon.svg                  Inline water-drop SVG icon (navy)
  service_area_map.jpg         Static map image used in the "Areas We Serve" section
src/
  layouts/Layout.astro         Base HTML shell: meta tags, Google Fonts, favicon, global.css import
  pages/index.astro            The entire one-page site (all sections, in order, below)
  styles/global.css            All styles — palette, typography, sections, components, responsive
```

There is only one page (`index.astro`); all content lives there as a sequence of `<section>`s.

## Page Sections (in order)

1. **Hero** (`.hero`) — full-viewport background image with navy gradient overlay, headline,
   subheadline, and a `tel:` CTA button (`.btn-call`)
2. **About** (`#about`) — short intro paragraph about Dona Archie / Donchie, plus a
   `.credential-badge` showing her CDPH Home Health Aide certification (see "Credential
   badge" below — **do not** add her legal name, signature, or a photo of the certificate)
3. **Services** (`#services`) — `services` array in the frontmatter renders `.service-card`s
   (icon/emoji + title + one-line description) in a 3-up grid that stacks on mobile
4. **Testimonials** (`#testimonials`) — `testimonials` array renders `.testimonial-card`s
   (quote + name + relation) in the same 3-up/stacking grid pattern as Services. Currently
   **placeholder content** — swap in real client quotes when available
5. **Service Area Map** (`#service-area`) — static `<img id="map">` pointing at
   `public/service_area_map.jpg` (an interactive Leaflet map was tried first and replaced
   with this static image)
6. **Contact / CTA** (`#contact`) — large tappable `tel:` phone link and a licensing note
7. **Footer** — copyright line with a dynamically computed year (`new Date().getFullYear()`
   in `index.astro`'s frontmatter, rendered as `currentYear` — never hardcode the year here)

To add/edit services or testimonials, edit the `services` / `testimonials` arrays at the top
of [index.astro](src/pages/index.astro) — the markup maps over them, so the grid updates
automatically.

## Credential Badge

The `.credential-badge` in the About section (`index.astro`) represents Dona Archie's real
California Department of Public Health Home Health Aide certification, built as styled markup
(inline SVG seal + text) rather than an embedded photo of the certificate card. This was a
deliberate privacy/trust tradeoff made with the owner:

- **Shows**: issuing agency ("California Department of Public Health"), credential title
  ("Certified Home Health Aide"), and the certificate number/validity
  ("Certificate #00266808 · Active through October 2026") — the cert number is shown
  *intentionally* as public proof, per the owner's explicit choice
- **Deliberately omits**: the certificate holder's legal name (it differs from the public
  business persona "Dona Archie" and publishing both could cause confusion/privacy issues)
  and the handwritten signature visible on the physical card
- If the certification is renewed/changes, update the `Certificate #...` line and the seal
  markup stays the same — don't replace this with a scanned/photographed image of the card

## Design System (in `global.css`)

CSS custom properties defined in `:root`:
- `--color-navy-deep` (#102747), `--color-navy` (#1a3a6b), `--color-navy-light` (#2a5089),
  `--color-silver` (#c9d4e3), `--color-white`
- `--font-heading`: "Playfair Display" (serif, headings) — loaded via Google Fonts in `Layout.astro`
- `--font-body`: "Lato" (sans-serif, body text)
- `--gradient-navy`: the deep-navy → royal-blue gradient used on alternating section backgrounds

Reusable component classes: `.container`, `.section-title`, `.btn-call`, `.service-card`,
`.testimonial-card`. Card components share the same visual recipe (navy gradient background,
silver border, inset border accent via `::before`, rounded corners).

Note: an earlier iteration included pure-CSS "water droplet" decorations (`.droplet`); these
were removed at the owner's request — don't reintroduce them.

Responsive breakpoint: `@media (max-width: 800px)` — collapses the services and testimonials
grids to a single column and reduces section padding / map height.

## GitHub Pages Deployment

The site is served from a **custom domain**, `donchie.com`, via `public/CNAME` (Astro copies
everything in `public/` verbatim to the dist root, so the file ends up exactly where GitHub
Pages expects it). Because of this:
- `astro.config.mjs` has `site: 'https://donchie.com'` and **no `base`** (defaults to `/`,
  i.e. the site lives at the domain root, not under `/donchie_website/`)
- Asset references use `import.meta.env.BASE_URL.replace(/\/$/, '')` before appending a
  filename (see `Layout.astro`'s favicon link and `index.astro`'s map image `src`) so the
  paths resolve correctly whether `BASE_URL` is `/` (custom domain) or a subpath — don't
  revert these to plain string concatenation, it breaks one case or the other.
- The custom domain (`donchie.com` → `www.donchie.com` is **not** used; no `www.` prefix)
  must also be configured in the repo's Pages settings and DNS must point at GitHub Pages.

GitHub Pages must also be enabled in the repo settings (Settings → Pages → Build and
deployment → Source → **GitHub Actions**) — without this the deploy job fails with a 404
"Failed to create deployment... Ensure GitHub Pages has been enabled" error.

The deploy workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) builds and
uploads the Pages artifact in one step via `withastro/action@v3` (it wraps
`actions/upload-pages-artifact` internally — do **not** add a separate upload-artifact step,
it will collide with the one the action already creates and fail with a 409 "artifact already
exists" error), then publishes via `actions/deploy-pages` on every push to `main`.

## Commands

- `npm run dev` — local dev server
- `npm run build` — static build to `dist/`
- `npm run preview` — preview the production build locally

## Notes

- All copy (hero headline, about paragraph, service descriptions, contact text, footer) was
  supplied directly by the business owner and is final; **testimonials are placeholders** and
  need real client quotes.
- The hero background image is hot-linked from Unsplash; the gradient overlay
  (`linear-gradient` layered with the `background-image`) keeps text readable and also acts as
  a visual fallback if the remote image fails to load.
