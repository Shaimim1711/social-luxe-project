"""Build a dependency-free static site. Run: python3 build.py."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent
PUBLIC = ROOT / "public"
PUBLIC.mkdir(exist_ok=True)
shutil.copytree(ROOT / "assets", PUBLIC / "assets", dirs_exist_ok=True)
for name in ("styles.css", "app.js"):
    shutil.copyfile(ROOT / name, PUBLIC / name)

def button(text, href, cls=""):
    return f'<a class="button {cls}" href="{href}">{text}<span class="arrow" aria-hidden="true">↗</span></a>'

def header(active=""):
    items = [("Marketing", "/marketing/", "marketing"), ("Private Concierge", "/concierge/", "concierge"), ("The House", "/the-house/", "house")]
    links = "".join(f'<a class="nav-link" href="{href}"' + (' aria-current="page"' if active == key else '') + f'>{label}</a>' for label, href, key in items)
    mobile = "".join(f'<a class="mobile-link" href="{href}">{label}</a>' for label, href, key in items)
    return f'''<a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header"><div class="shell header-inner">
      <a class="brand" href="/" aria-label="Social Luxe home">Social Luxe<span class="brand-period">.</span></a>
      <nav class="desktop-nav" aria-label="Main navigation">{links}</nav>
      {button("Enquire", "/enquire/", "header-action")}
      <button class="menu-toggle" aria-label="Open menu" aria-controls="mobile-menu" aria-expanded="false"><span></span><span></span></button>
    </div></header>
    <div class="mobile-menu" id="mobile-menu" hidden><nav aria-label="Mobile navigation">{mobile}{button("Get in touch", "/enquire/")}</nav><p><a href="mailto:hello@socialluxe.com.au">hello@socialluxe.com.au</a></p></div>'''

def footer():
    return '''<footer class="site-footer"><div class="shell">
      <div class="footer-top"><div><a class="brand" href="/">Social Luxe<span class="brand-period">.</span></a><p class="footer-description">Marketing &amp; private concierge.<br>Australia. Working worldwide.</p></div>
      <div class="footer-nav">
        <div class="footer-column"><span class="eyebrow">Explore</span><a href="/marketing/">Marketing</a><a href="/concierge/">Luxe Concierge by SL</a><a href="/the-house/">The House</a></div>
        <div class="footer-column"><span class="eyebrow">Get in touch</span><a href="/enquire/">Make an enquiry ↗</a><a href="mailto:hello@socialluxe.com.au">hello@socialluxe.com.au</a></div>
        <div class="footer-column"><span class="eyebrow">Follow along</span><a href="https://www.instagram.com/social_luxe/" target="_blank" rel="noopener noreferrer">Social Luxe ↗</a><a href="https://www.instagram.com/luxeconciergebysl/" target="_blank" rel="noopener noreferrer">Luxe Concierge ↗</a></div>
      </div></div><div class="footer-bottom"><span>© 2026 Social Luxe.</span><a href="/privacy/">Privacy &amp; enquiries</a><span>Marketing · Partnerships · Private bookings</span></div>
    </div></footer>'''

def contact_band():
    return f'''<section class="contact-band"><div class="shell contact-band-inner">
      <div class="reveal"><p class="eyebrow">Let’s talk</p><h2>Get in <span class="script">touch.</span></h2></div>
      <div class="contact-options reveal"><div class="contact-option"><p class="eyebrow">For brands &amp; venues</p>{button("Discuss a campaign", "/enquire/?service=marketing")}</div><div class="contact-option"><p class="eyebrow">For private clients</p>{button("Plan a booking", "/enquire/?service=concierge")}</div></div>
    </div></section>'''

def faq(items):
    return '<div class="faq-list">' + "".join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in items) + '</div>'

def process():
    return '''<div class="process-grid">
      <div class="process-item reveal"><span class="number">01 /</span><h3>Tell us what you need.</h3><p>A campaign brief, a booking or an idea. Share the details and the dates you have in mind.</p></div>
      <div class="process-item reveal delay-1"><span class="number">02 /</span><h3>Talk it through.</h3><p>We discuss the right approach, the people involved and the options for your budget.</p></div>
      <div class="process-item reveal delay-2"><span class="number">03 /</span><h3>Confirm the details.</h3><p>Agree the scope and arrangements before anything is confirmed.</p></div>
    </div>'''

def archive():
    return '''<div class="archive">
      <a class="archive-item" href="https://www.linkedin.com/posts/social-luxe_sandiego-california-locationbookings-activity-7056707686544912384-Ndfm" target="_blank" rel="noopener noreferrer"><span class="eyebrow">San Diego / 2023</span><h3>Villa Pantera</h3><span class="caption">Venue bookings &amp; brand activations</span><span class="arrow" aria-hidden="true">↗</span></a>
      <a class="archive-item" href="https://www.instagram.com/social_luxe/p/DdlFEnvEw7c/" target="_blank" rel="noopener noreferrer"><span class="eyebrow">Bali / 2026</span><h3>Jason Derulo in Bali</h3><span class="caption">Private hosting with Luxe Concierge</span><span class="arrow" aria-hidden="true">↗</span></a>
    </div><p class="archive-note">Selected moments from our public archive. Open a story to see the original post.</p>'''

HOME = f'''
<section class="home-hero shell">
  <p class="eyebrow with-dot hero-enter">Marketing &amp; private concierge</p>
  <h1 class="display hero-enter"><span>Influencer marketing.</span><span><span class="script hero-script">Private</span> concierge.</span></h1>
  <p class="hero-copy hero-enter">Campaigns for brands and venues.<br>Bookings for private clients.</p>
  <div class="hero-actions hero-enter">{button("For brands & venues", "/marketing/")}{button("For private clients", "/concierge/")}</div>
  <div class="hero-bottom"><p class="eyebrow">Australia · Worldwide</p><a class="scroll-link" href="#our-world">Explore Social Luxe <span aria-hidden="true">↓</span></a></div>
</section>
<section class="shell service-grid" id="our-world" aria-label="Our two services">
  <article class="service-panel reveal"><a href="/marketing/" class="photo" style="display:block" aria-label="Explore marketing and partnerships">
    <img src="/assets/marketing.jpg" alt="Editorial fashion shoot with a photographer at a coastal venue" width="1536" height="1024" fetchpriority="high">
    <span class="photo-label">For brands &amp; venues</span>
    <div class="photo-caption"><h2>Marketing &amp;<br>partnerships.</h2><span class="circle-arrow" aria-hidden="true">↗</span></div>
  </a><div class="panel-info"><p>Influencer campaigns, brand collaborations<br>and venue partnerships.</p><span class="eyebrow">Social Luxe / 01</span></div></article>
  <article class="service-panel reveal delay-1"><a href="/concierge/" class="photo" style="display:block" aria-label="Explore Luxe Concierge by SL">
    <img src="/assets/concierge.jpg" alt="A private dining table overlooking the sea at sunset" width="1536" height="1024" fetchpriority="high">
    <span class="photo-label">For private clients</span>
    <div class="photo-caption"><h2 class="concierge-wordmark"><span class="script">Luxe</span><span class="wordmark-bottom">CONCIERGE <span class="by-sl">BY SL</span></span></h2><span class="circle-arrow" aria-hidden="true">↗</span></div>
  </a><div class="panel-info"><p>Private reservations, personal requests<br>and the arrangements around them.</p><span class="eyebrow">Social Luxe / 02</span></div></article>
</section>
<section class="section shell intro-grid">
  <div class="intro-copy reveal"><p class="eyebrow with-dot">The house</p><h2 class="section-title">Meet<br>Social Luxe.</h2><p>Social Luxe is a marketing house and private concierge founded by Grace Kelly. We work with brands, venues, talent and private clients — with a different approach for every brief.</p><a class="text-link" href="/the-house/">Meet Social Luxe <span aria-hidden="true">↗</span></a></div>
  <div class="detail-composition reveal delay-1"><div class="photo"><img src="/assets/detail.jpg" alt="A raspberry flower being placed on an ivory table setting" width="1254" height="1254" loading="lazy"></div><div class="detail-note" aria-label="Luxe Concierge by SL"><span class="script">Luxe Concierge</span><span class="eyebrow">by Social Luxe</span></div></div>
</section>
<section class="section shell" style="padding-top:0"><div class="section-head reveal"><div><p class="eyebrow with-dot">From the archive</p><h2 class="section-title">Selected moments.</h2></div><p>Venue bookings, collaborations<br>and private hosting.</p></div><div class="reveal">{archive()}</div></section>
<section class="section shell" style="border-top:1px solid var(--line)"><div class="section-head reveal"><div><p class="eyebrow with-dot">How it works</p><h2 class="section-title">Start with a conversation.</h2></div></div>{process()}</section>
{contact_band()}
'''

MARKETING = f'''
<section class="shell page-intro page-intro-grid"><div class="reveal"><p class="eyebrow with-dot">Social Luxe / Marketing</p><h1 class="display">Marketing &amp;<br><span class="script">partnerships.</span></h1></div><div class="reveal delay-1"><p class="body-large">Influencer campaigns and collaborations for brands and venues.</p>{button("Discuss a campaign", "/enquire/?service=marketing")}</div></section>
<div class="shell full-photo photo reveal"><img src="/assets/marketing.jpg" width="1536" height="1024" alt="A campaign shoot in a coastal architectural setting" fetchpriority="high"></div>
<section class="section shell"><div class="section-head reveal"><div><p class="eyebrow with-dot">What we do</p><h2 class="section-title">People. Content.<br>Collaborations.</h2></div><p>Start with your brand, your audience<br>and what you want to achieve.</p></div>
  <div class="offerings reveal">
    <div class="offering"><span class="number">01 /</span><h3>Creator &amp; talent partnerships</h3><p>Bring your brief to us. We help identify relevant creators and talent, discuss the collaboration and coordinate the agreed arrangements.</p></div>
    <div class="offering"><span class="number">02 /</span><h3>Campaign coordination</h3><p>From the first introduction to the agreed content and timings, keep your collaboration moving with a clear point of contact.</p></div>
    <div class="offering"><span class="number">03 /</span><h3>Venue collaborations</h3><p>Connect your hotel, restaurant or venue with creators, shoots and brand experiences that suit the space.</p></div>
  </div>
</section>
<section class="section shell" style="padding-top:0"><div class="section-head reveal"><div><p class="eyebrow with-dot">See more</p><h2 class="section-title">On our socials.</h2></div><p>Explore collaborations and recent updates<br>on Social Luxe’s Instagram.</p></div><a class="text-link" href="https://www.instagram.com/social_luxe/" target="_blank" rel="noopener noreferrer">Visit @social_luxe <span aria-hidden="true">↗</span></a></section>
<section class="section shell page-faq" style="border-top:1px solid var(--line)"><div class="reveal"><p class="eyebrow with-dot">A few details</p><h2 class="section-title">Before we<br>get started.</h2></div><div class="reveal delay-1">{faq([
("Who do you work with?", "Brands and establishments looking to collaborate with talent or creators. Tell us about your business and the audience you want to reach."),
("What should I include in my brief?", "Your brand or venue, the objective, your ideal timing, the audience and a working budget. An early idea is enough to start the conversation."),
("Can I enquire about a specific talent?", "Yes. Include the person you have in mind in your brief. Availability, suitability and terms need to be discussed before a collaboration can be confirmed.")
])}</div></section>{contact_band()}
'''

CONCIERGE = f'''
<section class="concierge-hero"><img src="/assets/concierge.jpg" width="1536" height="1024" alt="A seaside terrace set for a private dinner at sunset" fetchpriority="high">
  <div class="concierge-hero-inner hero-enter"><p class="eyebrow">Private bookings &amp; personal requests</p><h1><span class="script">Luxe</span><span class="concierge-title">CONCIERGE</span><span class="by-line">BY SL</span></h1><p>Tell us where you’re going<br>and what you have in mind.</p>{button("Plan a booking", "/enquire/?service=concierge")}</div>
</section>
<section class="section shell concierge-intro">
  <div class="reveal"><p class="eyebrow with-dot">For private clients</p><h2 class="section-title">Private bookings.<br><span class="script pink">Personal requests.</span></h2></div>
  <div class="reveal delay-1"><p class="body-large">Luxe Concierge by SL arranges bookings and personal requests for private clients, including talent and people travelling in a private capacity.</p><div class="concierge-services">
    <div><h3>Stays</h3><p>Share your destination, dates and the kind of place you’re looking for.</p></div>
    <div><h3>Dining</h3><p>A table for two, a group reservation or a dinner for a particular occasion.</p></div>
    <div><h3>Private occasions</h3><p>Venue enquiries, guest arrangements and plans for your occasion.</p></div>
    <div><h3>Getting around</h3><p>Let us know your transport and arrival requirements alongside your booking.</p></div>
  </div><a class="text-link" href="/enquire/?service=concierge">Tell us about your plans <span aria-hidden="true">↗</span></a></div>
</section>
<div class="shell image-pair"><div class="photo reveal"><img src="/assets/concierge.jpg" alt="A dining terrace with flowers and views of the coast" width="1536" height="1024" loading="lazy"></div><div class="photo reveal delay-1"><img src="/assets/detail.jpg" alt="Flower and linen details at a table setting" width="1254" height="1254" loading="lazy"></div></div>
<section class="section shell"><div class="section-head reveal"><div><p class="eyebrow with-dot">From request to arrangements</p><h2 class="section-title">A personal point of contact.</h2></div></div>{process()}</section>
<section class="section shell page-faq" style="padding-top:0"><div class="reveal"><p class="eyebrow with-dot">Good to know</p><h2 class="section-title">Your questions.</h2></div><div class="reveal delay-1">{faq([
("Is the concierge only for talent and public figures?", "No. Luxe Concierge by SL also works with private clients. You do not need to be a creator, celebrity or public figure to make an enquiry."),
("What information do you need?", "Your destination or venue, preferred dates, number of guests, budget and any requests you would like us to consider."),
("Is my request a confirmed reservation?", "No. An enquiry starts a conversation. Availability, pricing and booking terms must be agreed before a reservation is confirmed."),
("Can I make a request that isn’t listed here?", "Of course. Describe what you need and we’ll discuss whether we can help, including any fees and arrangements involved.")
])}</div></section>{contact_band()}
'''

HOUSE = f'''
<section class="shell page-intro house-intro"><p class="eyebrow with-dot hero-enter">The House</p><h1 class="display hero-enter">Social Luxe.<br>Founded by <span class="script">Grace Kelly.</span></h1><p class="body-large hero-enter">A marketing house and private concierge, bringing together brands, venues, talent and private clients.</p></section>
<section class="section shell founder-layout" style="padding-top:25px"><div class="founder-card reveal"><span class="script">Grace Kelly</span><span class="eyebrow">Founder · Social Luxe</span></div><div class="founder-story reveal delay-1"><h2 class="section-title">One house.<br>Two ways to work with us.</h2><p>For brands and establishments, Social Luxe coordinates influencer collaborations and partnerships.</p><p>For private clients, Luxe Concierge by SL arranges reservations and personal requests. Each starts with a conversation about the people, places and details involved.</p><a class="text-link" href="/enquire/">Meet us over a conversation <span aria-hidden="true">↗</span></a></div></section>
<section class="section shell" style="padding-top:0"><div class="section-head reveal"><div><p class="eyebrow with-dot">In practice</p><h2 class="section-title">From the archive.</h2></div><p>A look at venue bookings<br>and private hosting.</p></div><div class="reveal">{archive()}</div></section>{contact_band()}
'''

ENQUIRE = '''
<section class="shell enquiry-layout">
  <div class="enquiry-intro"><p class="eyebrow with-dot">A campaign or a personal request</p><h1 class="display">Let’s <span class="script">talk.</span></h1><p>Tell us a little about what you need. Choose the right team and prepare your enquiry below.</p><a class="contact-email" href="mailto:hello@socialluxe.com.au">hello@socialluxe.com.au ↗</a></div>
  <div><p class="form-intro">Choose your enquiry. Fields marked * are required.</p><form id="enquiry-form">
    <fieldset><legend class="sr-only">Enquiry type</legend><div class="service-choice">
      <label><input type="radio" name="service" value="marketing" checked><span>Marketing &amp; partnerships</span></label>
      <label><input type="radio" name="service" value="concierge"><span>Luxe Concierge by SL</span></label>
    </div></fieldset>
    <div class="field-grid">
      <label class="field">Your name *<input name="name" autocomplete="name" placeholder="Full name" maxlength="100" required></label>
      <label class="field">Email address *<input type="email" name="email" autocomplete="email" placeholder="you@example.com" maxlength="150" required></label>
      <label class="field full"><span id="context-label">Brand or venue</span><input id="context" name="context" placeholder="Your business name" maxlength="180"></label>
      <label class="field">When?<input name="timing" placeholder="Dates or a rough timeframe" maxlength="120"></label>
      <label class="field">Budget<select name="budget"><option value="">Select a range (AUD)</option><option>Under $5,000 AUD</option><option>$5,000–$15,000 AUD</option><option>$15,000–$50,000 AUD</option><option>$50,000+ AUD</option><option>To discuss</option></select></label>
      <label class="field full">What do you have in mind? *<textarea id="message" name="message" rows="4" minlength="10" maxlength="2500" placeholder="Your project, audience and what you would like to achieve…" required></textarea></label>
    </div>
    <div class="form-actions"><button class="button" type="submit">Prepare email enquiry <span class="arrow" aria-hidden="true">↗</span></button><p>You’ll review and send this from your own email app. Nothing is sent automatically.</p></div>
    <p id="concierge-note" class="form-intro" style="margin-top:18px" hidden>An enquiry does not confirm availability or a reservation.</p>
    <noscript><p>Please email <a class="inline-link" href="mailto:hello@socialluxe.com.au">hello@socialluxe.com.au</a> directly with your enquiry.</p></noscript>
  </form>
  <p id="form-status" class="form-status" role="status" aria-live="polite"></p>
  <section class="draft-panel" id="draft-panel" aria-label="Your enquiry draft" hidden><h2>Your enquiry is ready.</h2><p>Review it in your email app and send it to hello@socialluxe.com.au. You can also copy the text.</p><textarea id="draft-text" readonly aria-label="Enquiry text"></textarea><div class="draft-buttons"><a id="draft-open" class="button" href="mailto:hello@socialluxe.com.au">Open email draft <span class="arrow" aria-hidden="true">↗</span></a><button class="button button-outline" id="draft-copy" type="button">Copy enquiry</button></div></section>
  </div>
</section>
'''

PRIVACY = '''<section class="shell privacy-copy"><p class="eyebrow">Social Luxe</p><h1 class="display">Privacy &amp; enquiries.</h1><h2>Information you enter</h2><p>The enquiry form prepares a message in your browser. Your form details are not uploaded to a site database. Nothing is sent until you choose to send the message from your own email app.</p><h2>Email correspondence</h2><p>If you email Social Luxe, the information you provide will be included in that correspondence. Share only what is needed for the initial enquiry. For privacy questions or requests about your correspondence, contact <a class="inline-link" href="mailto:hello@socialluxe.com.au">hello@socialluxe.com.au</a>.</p><h2>Site hosting</h2><p>The site is hosted by Vercel, which may process connection information to serve and secure the site. This version does not use advertising trackers or analytics cookies.</p><h2>External links</h2><p>Instagram and LinkedIn links open external services, which have their own privacy policies.</p></section>'''

def write_page(path, title, description, content, active="", body_class=""):
    folder = PUBLIC / path
    folder.mkdir(parents=True, exist_ok=True)
    markup = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title><meta name="description" content="{description}">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#f8f5f1">
<meta property="og:title" content="{title}"><meta property="og:description" content="{description}"><meta property="og:type" content="website">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/anton.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-tight.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head>
<body class="{body_class}">{header(active)}<main id="main">{content}</main>{footer()}</body></html>'''
    (folder / "index.html").write_text(markup)

write_page("", "Social Luxe — Marketing & Private Concierge", "Influencer marketing for brands and venues. Private bookings and personal requests with Luxe Concierge by SL.", HOME)
write_page("marketing", "Marketing & Partnerships — Social Luxe", "Influencer campaigns, creator partnerships and venue collaborations with Social Luxe.", MARKETING, "marketing")
write_page("concierge", "Luxe Concierge by SL — Private Concierge", "Private bookings, reservations and personal requests. Explore Luxe Concierge by SL.", CONCIERGE, "concierge", "concierge-page")
write_page("the-house", "The House — Social Luxe", "Meet Social Luxe, the marketing house and private concierge founded by Grace Kelly.", HOUSE, "house")
write_page("enquire", "Make an Enquiry — Social Luxe", "Discuss a brand collaboration or a private booking with Social Luxe.", ENQUIRE)
write_page("privacy", "Privacy & Enquiries — Social Luxe", "How enquiries and information are handled on this site.", PRIVACY)
(PUBLIC / "robots.txt").write_text("User-agent: *\nDisallow: /\n")
(PUBLIC / "404.html").write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found — Social Luxe</title><meta name="robots" content="noindex"><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head><body>{header()}<main id="main" class="shell section"><p class="eyebrow">404 / Page not found</p><h1 class="section-title" style="margin:25px 0">Let’s get you<br>back to Social Luxe.</h1>{button("Back to the homepage", "/")}</main>{footer()}</body></html>''')
print("Built 6 pages and 404 in public/")
