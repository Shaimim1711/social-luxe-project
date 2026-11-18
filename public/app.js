(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu');
  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    menu.hidden = true;
    document.body.classList.remove('menu-open');
    document.querySelectorAll('main, .site-footer').forEach(element => { element.inert = false; });
  };
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      menu.hidden = isOpen;
      document.body.classList.toggle('menu-open', !isOpen);
      document.querySelectorAll('main, .site-footer').forEach(element => { element.inert = !isOpen; });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); }
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  }
  const updateHeader = () => { if (header) header.classList.toggle('scrolled', window.scrollY > 20); };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px 25px 0px' });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  }
  const form = document.getElementById('enquiry-form');
  if (!form) return;
  const draftPanel = document.getElementById('draft-panel');
  const draftText = document.getElementById('draft-text');
  const draftOpen = document.getElementById('draft-open');
  const draftCopy = document.getElementById('draft-copy');
  const status = document.getElementById('form-status');
  const serviceRadios = form.querySelectorAll('input[name="service"]');
  const updateService = () => {
    const isConcierge = form.elements.service.value === 'concierge';
    document.getElementById('context-label').textContent = isConcierge ? 'Destination or venue' : 'Brand or venue';
    document.getElementById('context').placeholder = isConcierge ? 'Where would you like to go?' : 'Your business name';
    document.getElementById('message').placeholder = isConcierge ? 'Your plans, preferred dates and number of guests…' : 'Your project, audience and what you would like to achieve…';
    document.getElementById('concierge-note').hidden = !isConcierge;
    draftPanel.hidden = true;
    status.textContent = '';
  };
  const initial = new URLSearchParams(window.location.search).get('service');
  if (initial === 'marketing' || initial === 'concierge') form.querySelector('input[value="' + initial + '"]').checked = true;
  serviceRadios.forEach(radio => radio.addEventListener('change', updateService));
  updateService();
  form.addEventListener('input', event => {
    if (event.target.name !== 'service') { draftPanel.hidden = true; status.textContent = ''; }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const type = data.get('service') === 'concierge' ? 'Luxe Concierge by SL' : 'Marketing & Partnerships';
    const subject = type + ' enquiry — ' + String(data.get('name')).trim();
    const body = [
      'Hello Social Luxe,', '', 'I would like to enquire about ' + type + '.', '',
      'Name: ' + String(data.get('name')).trim(),
      'Email: ' + String(data.get('email')).trim(),
      (data.get('service') === 'concierge' ? 'Destination / venue: ' : 'Brand / venue: ') + (String(data.get('context')).trim() || 'To discuss'),
      'Timing: ' + (String(data.get('timing')).trim() || 'Flexible / to discuss'),
      'Budget: ' + (String(data.get('budget')).trim() || 'To discuss'),
      '', String(data.get('message')).trim(), '', 'Kind regards,', String(data.get('name')).trim()
    ].join('\n');
    draftText.value = body;
    draftOpen.href = 'mailto:hello@socialluxe.com.au?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    draftPanel.hidden = false;
    status.textContent = 'Your draft is ready. Open it in your email app, or copy it below.';
    draftPanel.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    draftOpen.focus({ preventScroll: true });
  });
  draftCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(draftText.value);
      status.textContent = 'Copied. Paste your enquiry into an email to hello@socialluxe.com.au.';
    } catch {
      draftText.focus(); draftText.select();
      status.textContent = 'Select and copy the text, then email hello@socialluxe.com.au.';
    }
  });
})();
