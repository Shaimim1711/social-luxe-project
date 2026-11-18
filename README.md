# Social Luxe

Design-first website for Social Luxe and **Luxe Concierge by SL**.

## Design

- Warm ivory, ink black and raspberry accent.
- Inter Tight headings, body and wordmark; Allura calligraphy.
- Responsive desktop/mobile layouts, accessible mobile navigation, native FAQ disclosures, reduced-motion support, scroll reveals and photo hover effects.
- Dedicated /marketing/ and /concierge/ pages plus /the-house/, /enquire/ and /privacy/. The former /work/ page redirects to /marketing/.
- Five floating original Instagram posts form the homepage hero, supported by pointer-responsive hover effects and reduced-motion support.
- Nine documented projects with Instagram photography and official logos, filters, keyboard-accessible carousels and native project dialogs.
- The Marketing page combines the project catalogue with a venue partner collection featuring Desa Kitsuné, Giselle and Bella.

## Edit and preview

The site is static and has no npm dependencies or backend. Edit build.py, projects.json, templates/, styles.css, app.js and hover-effects.js; run:

    python3 build.py
    python3 -m http.server 4173 --directory public

The public/ directory is committed so Vercel can deploy directly without a build toolchain.

## Enquiries

The form prepares an email addressed to the publicly listed hello@socialluxe.com.au. It never submits or stores visitor data. The visitor reviews the draft, opens their email application and sends it themselves. A copy fallback is included. No reservation is confirmed by submitting the form.

## Content status

This is an aesthetic development version.

- The website uses original photography from documented Instagram collaborations, official venue images and logos downloaded from the brands' and venues' own websites.
- The nine projects feature Ella Cervetto × The Lawn, Tyniesha Hales × Skool, Ziara Rae × PATRÓN, Jason Derulo at Pony, Wiz Khalifa's private dinner, Tori Levett × Zumana, Sevara & Josh × Savaya/PATRÓN, El × Pony and Michelle × Sana Uluwatu. Descriptions follow the role stated in each public source.
- Desa Kitsuné, Giselle and Bella are partners explicitly confirmed by the client. Their official venue photography illustrates the locations; it is not presented as a Social Luxe campaign or production.
- Projects are an editorial selection, not a performance ranking: public Instagram metrics are incomplete and not comparable.
- The homepage now features original Instagram imagery in place of the previous chrome sculpture. Generated photographs are not used.
- Archive links point to public primary-source posts with contextual descriptions. No invented results or fake testimonials.
- Service descriptions, budgets, brand typography, imagery and final business policies need client review before a branded launch.
- Search indexing is disabled in robots.txt, page metadata and Vercel headers while the site is in development.
- No custom domain, subdomain, DNS record, analytics, email automation or payment integration is configured.

See docs/research.md for brand research, docs/instagram-research-v2.md for the original project sources and docs/venue-expansion-research.md for the additional projects, venue identities and asset provenance.
