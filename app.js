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
    window.matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
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
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.getElementById('motion-toggle');
  if (motionToggle) {
    let motionPaused = reducedMotion.matches;
    const setMotion = () => {
      document.body.classList.toggle('motion-paused', motionPaused);
      motionToggle.setAttribute('aria-pressed', String(motionPaused));
      motionToggle.innerHTML = motionPaused ? '<span aria-hidden="true">▷</span> Resume motion' : '<span aria-hidden="true">Ⅱ</span> Pause motion';
      window.dispatchEvent(new CustomEvent('sl-motion-change', { detail: { paused: motionPaused } }));
    };
    motionToggle.addEventListener('click', () => { motionPaused = !motionPaused; setMotion(); });
    reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; setMotion(); });
    setMotion();
  }

  const heroGallery = document.querySelector('[data-hero-gallery]');
  if (heroGallery) {
    const rail = heroGallery.querySelector('.floating-deck');
    const cards = [...rail.querySelectorAll('.floating-photo')];
    const previous = heroGallery.querySelector('.hero-prev');
    const next = heroGallery.querySelector('.hero-next');
    const status = heroGallery.querySelector('.hero-rail-status');
    const mobileGallery = window.matchMedia('(max-width: 1100px)');
    const activeIndex = () => {
      const inset = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
      return cards.reduce((closest, card, index) =>
        Math.abs(card.offsetLeft - inset - rail.scrollLeft) < Math.abs(cards[closest].offsetLeft - inset - rail.scrollLeft) ? index : closest, 0);
    };
    const updateHero = () => {
      previous.disabled = rail.scrollLeft < 5;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 5;
      status.textContent = String(activeIndex() + 1).padStart(2, '0') + ' / 05';
      rail.tabIndex = mobileGallery.matches ? 0 : -1;
    };
    const moveHero = direction => {
      const index = Math.max(0, Math.min(cards.length - 1, activeIndex() + direction));
      const inset = parseFloat(getComputedStyle(rail).paddingLeft) || 0;
      rail.scrollTo({ left: cards[index].offsetLeft - inset, behavior: reducedMotion.matches || document.body.classList.contains('motion-paused') ? 'instant' : 'smooth' });
    };
    previous.addEventListener('click', () => moveHero(-1));
    next.addEventListener('click', () => moveHero(1));
    rail.addEventListener('scroll', updateHero, { passive: true });
    rail.addEventListener('keydown', event => {
      if (event.target !== rail || !mobileGallery.matches) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveHero(event.key === 'ArrowRight' ? 1 : -1);
      }
    });
    new ResizeObserver(updateHero).observe(rail);
    updateHero();
  }

  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const rail = gallery.querySelector('.project-rail');
    const prev = gallery.querySelector('.gallery-prev');
    const next = gallery.querySelector('.gallery-next');
    const updateControls = () => {
      if (prev) prev.disabled = rail.scrollLeft < 5;
      if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 5;
    };
    const scrollGallery = direction => {
      const card = [...rail.querySelectorAll('.project-card')].find(card => !card.hidden);
      rail.scrollBy({ left: direction * ((card?.getBoundingClientRect().width || 300) + 22), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    };
    prev?.addEventListener('click', () => scrollGallery(-1));
    next?.addEventListener('click', () => scrollGallery(1));
    rail.addEventListener('scroll', updateControls, { passive: true });
    rail.addEventListener('keydown', event => {
      if (event.target !== rail) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); scrollGallery(event.key === 'ArrowRight' ? 1 : -1); }
    });
    gallery.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      gallery.querySelectorAll('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
      let count = 0;
      rail.querySelectorAll('.project-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== card.dataset.category; if (!card.hidden) count++; });
      rail.scrollTo({ left: 0, behavior: 'instant' });
      const status = gallery.querySelector('.gallery-status');
      if (status) status.textContent = count + (count === 1 ? ' project' : ' projects');
      updateControls();
    }));
    new ResizeObserver(updateControls).observe(rail);
    updateControls();
  });

  const projectData = document.getElementById('projects-data');
  const projectDialog = document.getElementById('project-dialog');
  if (projectData && projectDialog && typeof projectDialog.showModal === 'function') {
    const projects = JSON.parse(projectData.textContent);
    let currentProject = null;
    let photoIndex = 0;
    let opener = null;
    const photo = document.getElementById('dialog-photo');
    const showPhoto = () => {
      photo.src = '/assets/projects/' + currentProject.photos[photoIndex] + '.jpg';
      photo.alt = currentProject.credit + ' — photo ' + (photoIndex + 1);
      document.getElementById('photo-count').textContent = (photoIndex + 1) + ' / ' + currentProject.photos.length;
      document.querySelector('.dialog-photo-controls').hidden = currentProject.photos.length < 2;
    };
    const openProject = (id, trigger, changeUrl = true) => {
      const project = projects.find(item => item.id === id);
      if (!project) return;
      opener = trigger || document.activeElement;
      currentProject = project; photoIndex = 0;
      document.getElementById('project-title').textContent = project.title;
      document.getElementById('project-category').textContent = project.categoryLabel;
      document.getElementById('project-description').textContent = project.description;
      document.getElementById('project-place').textContent = project.place;
      document.getElementById('project-date').textContent = project.date;
      document.getElementById('project-credit').textContent = project.credit;
      document.getElementById('project-source').href = project.source;
      const photoSource = document.getElementById('project-photo-source');
      photoSource.hidden = !project.photoSource;
      if (project.photoSource) photoSource.href = project.photoSource;
      const logo = document.getElementById('dialog-logo');
      logo.replaceChildren();
      if (project.logo) { const img = document.createElement('img'); img.src = '/assets/logos/' + project.logo; img.alt = project.partner; logo.append(img); }
      showPhoto();
      if (changeUrl) history.pushState({ project: id }, '', '#' + id);
      if (!projectDialog.open) projectDialog.showModal();
      projectDialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
      projectDialog.querySelector('.dialog-close').focus({ preventScroll: true });
    };
    document.querySelectorAll('[data-project]').forEach(link => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); openProject(link.dataset.project, link);
    }));
    document.getElementById('photo-prev').addEventListener('click', () => { photoIndex = (photoIndex - 1 + currentProject.photos.length) % currentProject.photos.length; showPhoto(); });
    document.getElementById('photo-next').addEventListener('click', () => { photoIndex = (photoIndex + 1) % currentProject.photos.length; showPhoto(); });
    projectDialog.querySelector('.dialog-close').addEventListener('click', () => projectDialog.close());
    projectDialog.addEventListener('click', event => { if (event.target === projectDialog) { const rect = projectDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) projectDialog.close(); } });
    projectDialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      if (currentProject && location.hash === '#' + currentProject.id) history.replaceState(null, '', location.pathname + location.search);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    const readHash = () => {
      const id = location.hash.slice(1);
      if (projects.some(project => project.id === id)) openProject(id, null, false);
      else if (projectDialog.open) projectDialog.close();
    };
    window.addEventListener('hashchange', readHash);
    readHash();
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
