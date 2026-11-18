# Social Luxe

Design-first website for Social Luxe and **Luxe Concierge by SL**.

## Design

- Warm ivory, ink black and raspberry accent.
- Inter Tight headings, body and wordmark; Allura calligraphy.
- Responsive desktop/mobile layouts, accessible mobile navigation, native FAQ disclosures, reduced-motion support, scroll reveals and photo hover effects.
- Dedicated /work/, /marketing/ and /concierge/ pages plus /the-house/, /enquire/ and /privacy/.
- Five verified projects with Instagram photography and official logos, filters, keyboard-accessible carousels and native project dialogs.
- Native WebGL chrome sculpture, pointer response, pause control and reduced-motion support; no third-party runtime.

## Edit and preview

The site is static and has no npm dependencies or backend. Edit build.py, projects.json, templates/, styles.css, app.js and material-scene.js; run:

    python3 build.py
    python3 -m http.server 4173 --directory public

The public/ directory is committed so Vercel can deploy directly without a build toolchain.

## Enquiries

The form prepares an email addressed to the publicly listed hello@socialluxe.com.au. It never submits or stores visitor data. The visitor reviews the draft, opens their email application and sends it themselves. A copy fallback is included. No reservation is confirmed by submitting the form.

## Content status

This is an aesthetic development version.

- The live website uses nine photographs from five verified Instagram collaborations and five logos downloaded from official brand/venue websites. Source posts and provenance are recorded in docs/instagram-research-v2.md.
- Projects are an editorial selection, not a performance ranking: public Instagram metrics are incomplete and not comparable.
- The chrome sculpture is a decorative 3D design element; old generated photographs are no longer used.
- Archive links point to public primary-source posts with contextual descriptions. No invented results or fake testimonials.
- Service descriptions, budgets, brand typography, imagery and final business policies need client review before a branded launch.
- Search indexing is disabled in robots.txt, page metadata and Vercel headers while the site is in development.
- No custom domain, subdomain, DNS record, analytics, email automation or payment integration is configured.

See docs/research.md for brand research and asset provenance.
