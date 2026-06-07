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
astro.config.mjs               output: 'static', site/base configured for GitHub Pages
public/
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
2. **About** (`#about`) — short intro paragraph about Dona Archie / Donchie
3. **Services** (`#services`) — `services` array in the frontmatter renders `.service-card`s
   (icon/emoji + title + one-line description) in a 3-up grid that stacks on mobile
4. **Testimonials** (`#testimonials`) — `testimonials` array renders `.testimonial-card`s
   (quote + name + relation) in the same 3-up/stacking grid pattern as Services. Currently
   **placeholder content** — swap in real client quotes when available
5. **Service Area Map** (`#service-area`) — static `<img id="map">` pointing at
   `public/service_area_map.jpg` (an interactive Leaflet map was tried first and replaced
   with this static image)
6. **Contact / CTA** (`#contact`) — large tappable `tel:` phone link and a licensing note
7. **Footer** — copyright line

To add/edit services or testimonials, edit the `services` / `testimonials` arrays at the top
of [index.astro](src/pages/index.astro) — the markup maps over them, so the grid updates
automatically.

## Design System (in `global.css`)

CSS custom properties defined in `:root`:
- `--color-navy-deep` (#102747), `--color-navy` (#1a3a6b), `--color-navy-light` (#2a5089),
  `--color-silver` (#c9d4e3), `--color-white`
- `--font-heading`: "Playfair Display" (serif, headings) — loaded via Google Fonts in `Layout.astro`
- `--font-body`: "Lato" (sans-serif, body text)
- `--gradient-navy`: the deep-navy → royal-blue gradient used on alternating section backgrounds

**Water droplet decorations** (`.droplet`, sizes `--sm`/`--md`/`--lg`): pure-CSS glass-like
drops built from layered `radial-gradient`s + `border-radius: 50% 50% 50% 0` + rotation —
no images. Sprinkled across sections via inline `style` positioning.

Reusable component classes: `.container`, `.section-title`, `.btn-call`, `.service-card`,
`.testimonial-card`. Card components share the same visual recipe (navy gradient background,
silver border, inset border accent via `::before`, droplet decoration, rounded corners).

Responsive breakpoint: `@media (max-width: 800px)` — collapses the services and testimonials
grids to a single column and reduces section padding / map height.

## GitHub Pages Deployment

`astro.config.mjs` is configured for the `halliday2026/donchie_website` GitHub repo:
`site: 'https://halliday2026.github.io'`, `base: '/donchie_website'`. If the repo is ever
renamed or transferred, update both to match.

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
