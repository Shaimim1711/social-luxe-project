# Social Luxe

Design-first website for Social Luxe and **Luxe Concierge by SL**.

## Design

- Warm ivory, ink black and raspberry accent.
- Anton display headings; Inter Tight body/wordmark; Allura calligraphy.
- Responsive desktop/mobile layouts, accessible mobile navigation, native FAQ disclosures, reduced-motion support, scroll reveals and photo hover effects.
- Dedicated /marketing/ and /concierge/ pages plus /the-house/, /enquire/ and /privacy/.

## Edit and preview

The site is static and has no npm dependencies or backend. Edit build.py, styles.css and app.js; run:

    python3 build.py
    python3 -m http.server 4173 --directory public

The public/ directory is committed so Vercel can deploy directly without a build toolchain.

## Enquiries

The form prepares an email addressed to the publicly listed hello@socialluxe.com.au. It never submits or stores visitor data. The visitor reviews the draft, opens their email application and sends it themselves. A copy fallback is included. No reservation is confirmed by submitting the form.

## Content status

This is an aesthetic development version.

- The three photographs are AI-generated illustrative art direction, not actual Social Luxe clients, venues or campaigns.
- Archive links point to public primary-source posts with contextual descriptions. No invented results or fake testimonials.
- Service descriptions, budgets, brand typography, imagery and final business policies need client review before a branded launch.
- Search indexing is disabled in robots.txt, page metadata and Vercel headers while the site is in development.
- No custom domain, subdomain, DNS record, analytics, email automation or payment integration is configured.

See docs/research.md for brand research and asset provenance.
