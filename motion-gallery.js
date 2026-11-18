/* Continuous editorial reel. Geometry is measured on resize, never in the frame loop. */
(() => {
  'use strict';
  const gallery = document.querySelector('[data-hero-gallery]');
  if (!gallery) return;
  const viewport = gallery.querySelector('.floating-deck');
  const track = gallery.querySelector('.floating-track');
  const original = track.querySelector('[data-original]');
  const cards = [...original.querySelectorAll('.floating-photo')];
  const dots = [...gallery.querySelectorAll('[data-slide]')];
  const status = gallery.querySelector('.hero-rail-status');
  const announcement = gallery.querySelector('.gallery-announcement');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const modulo = (value, size) => ((value % size) + size) % size;

  // Only the original five links belong to the accessibility tree and Tab order.
  const copy = () => {
    const group = original.cloneNode(true);
    group.removeAttribute('data-original');
    group.setAttribute('data-gallery-copy', '');
    group.setAttribute('aria-hidden', 'true');
    group.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
    group.querySelectorAll('a, button, [tabindex]').forEach(node => { node.tabIndex = -1; });
    group.querySelectorAll('img').forEach(img => { img.alt = ''; img.removeAttribute('fetchpriority'); });
    return group;
  };
  track.prepend(copy());
  track.append(copy(), copy());
  gallery.classList.add('is-autoplay');

  let period = 0;
  let width = 0;
  let centres = [];
  let offset = 0;
  let speed = 0;
  let inertia = 0;
  let frame = 0;
  let previousTime = 0;
  let wakeTimer = 0;
  let activeIndex = -1;
  let hover = false;
  let inView = false;
  let focusHeld = false;
  let pointer = null;
  let tween = null;
  let resumeAfter = 0;
  let suppressClickUntil = 0;
  let paused = document.body.classList.contains('motion-paused');

  const blocked = () => !inView || document.hidden || document.body.classList.contains('dialog-open') || document.body.classList.contains('menu-open');
  const mayAutoplay = time => !blocked() && !paused && !reduced.matches && !focusHeld && !pointer && time >= resumeAfter;
  const originalHasFocus = () => focusHeld && original.contains(document.activeElement);
  const normalOffset = value => period + modulo(value - period, period);

  function nearestIndex() {
    const centre = modulo(offset + width / 2 - period, period);
    let nearest = 0;
    let best = Infinity;
    centres.forEach((position, index) => {
      const distance = Math.abs(centre - position);
      const wrappedDistance = Math.min(distance, period - distance);
      if (wrappedDistance < best) { best = wrappedDistance; nearest = index; }
    });
    return nearest;
  }

  function paint() {
    if (!period) return;
    const rendered = originalHasFocus() ? offset : normalOffset(offset);
    track.style.transform = `translate3d(${-rendered.toFixed(3)}px,0,0)`;
    const index = nearestIndex();
    if (index !== activeIndex) {
      activeIndex = index;
      status.textContent = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
      dots.forEach((dot, i) => i === index ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current'));
    }
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    if (wakeTimer) clearTimeout(wakeTimer);
    frame = 0;
    wakeTimer = 0;
    previousTime = 0;
    speed = 0;
  }

  function start() {
    if (!period || blocked() || frame) return;
    if (wakeTimer) clearTimeout(wakeTimer);
    wakeTimer = 0;
    frame = requestAnimationFrame(tick);
  }

  function updateState() {
    gallery.classList.toggle('is-in-view', inView && !document.hidden);
    gallery.classList.toggle('is-interacting', hover || focusHeld || !!pointer || blocked() || paused || reduced.matches);
    if (blocked() || paused || reduced.matches) {
      stop(); inertia = 0; tween = null; paint();
    } else {
      if (focusHeld) { speed = 0; inertia = 0; }
      start();
    }
  }

  function tick(time) {
    frame = 0;
    if (blocked()) { stop(); return; }
    const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.04) : 0;
    previousTime = time;
    let moving = false;
    if (tween) {
      const progress = Math.min(1, (time - tween.started) / tween.duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      offset = tween.from + (tween.to - tween.from) * eased;
      if (progress === 1) tween = null;
      else moving = true;
    } else if (!pointer) {
      if (paused || reduced.matches || focusHeld) inertia = 0;
      if (Math.abs(inertia) > 1) {
        offset += inertia * dt;
        inertia *= Math.exp(-dt * 4.8);
        moving = true;
      } else inertia = 0;
      const targetSpeed = mayAutoplay(time) ? (hover ? 6 : width < 600 ? 22 : 30) : 0;
      // Exponential easing keeps acceleration independent of display refresh rate.
      speed += (targetSpeed - speed) * (1 - Math.exp(-dt * 6));
      if (targetSpeed || speed > 0.05) { offset += speed * dt; moving = true; }
      else speed = 0;
    }
    paint();
    if (moving) frame = requestAnimationFrame(tick);
    else {
      previousTime = 0;
      if (!paused && !reduced.matches && !focusHeld && !pointer && resumeAfter > time) {
        wakeTimer = setTimeout(() => { wakeTimer = 0; start(); }, resumeAfter - time + 20);
      }
    }
  }

  function measure() {
    const ratio = period ? modulo(offset - period, period) / period : null;
    period = original.offsetWidth;
    width = viewport.clientWidth;
    centres = cards.map(card => card.offsetLeft + card.offsetWidth / 2);
    if (!period || !width) return;
    offset = ratio === null ? period + centres[0] - width / 2 : period + ratio * period;
    tween = null;
    inertia = 0;
    const focused = cards.indexOf(document.activeElement);
    if (focused >= 0 && focusHeld) offset = period + centres[focused] - width / 2;
    paint();
    start();
  }

  function show(index, direction = 0) {
    if (!period) return;
    index = modulo(index, cards.length);
    let target = period + centres[index] - width / 2;
    target += Math.round((offset - target) / period) * period;
    if (direction > 0 && target < offset - 1) target += period;
    if (direction < 0 && target > offset + 1) target -= period;
    inertia = 0;
    speed = 0;
    resumeAfter = performance.now() + 3500;
    if (paused || reduced.matches) { offset = target; tween = null; paint(); }
    else tween = { from: offset, to: target, started: performance.now(), duration: 680 };
    announcement.textContent = cards[index].getAttribute('aria-label').replace(/^Explore /, '') + `, ${index + 1} of ${cards.length}`;
    start();
  }
  gallery.querySelector('.hero-prev').addEventListener('click', () => show(nearestIndex() - 1, -1));
  gallery.querySelector('.hero-next').addEventListener('click', () => show(nearestIndex() + 1, 1));
  dots.forEach(dot => dot.addEventListener('click', () => show(Number(dot.dataset.slide))));

  gallery.addEventListener('keydown', event => {
    focusHeld = true;
    if (event.target === viewport && (event.key === 'ArrowRight' || event.key === 'ArrowLeft')) {
      event.preventDefault();
      show(nearestIndex() + (event.key === 'ArrowRight' ? 1 : -1), event.key === 'ArrowRight' ? 1 : -1);
    }
    updateState();
  });
  gallery.addEventListener('focusin', event => {
    if (pointer) return;
    const index = cards.indexOf(event.target);
    if (index >= 0) {
      focusHeld = true;
      tween = null;
      inertia = 0;
      speed = 0;
      offset = period + centres[index] - width / 2;
      // A focused original must be visible, even when its visual twin was clicked.
      viewport.scrollLeft = 0;
      paint();
    } else if (event.target.matches(':focus-visible')) {
      focusHeld = true;
      tween = null;
      inertia = 0;
      speed = 0;
    }
    updateState();
  });
  gallery.addEventListener('focusout', () => queueMicrotask(() => {
    if (!gallery.contains(document.activeElement)) {
      focusHeld = false;
      updateState();
    }
  }));

  viewport.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'touch' && finePointer.matches) { hover = true; updateState(); }
  });
  viewport.addEventListener('pointerleave', () => { hover = false; updateState(); });
  viewport.addEventListener('dragstart', event => event.preventDefault());
  viewport.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !event.isPrimary || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, offset, lastX: event.clientX, lastTime: performance.now(), velocity: 0, dragging: false };
    focusHeld = false;
    tween = null;
    inertia = 0;
    speed = 0;
    if (event.pointerType === 'mouse') event.preventDefault();
    updateState();
  });
  viewport.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.dragging) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { finishPointer(event, true); return; }
      if (Math.abs(dx) < 7 || Math.abs(dx) <= Math.abs(dy)) return;
      pointer.dragging = true;
      viewport.setPointerCapture(event.pointerId);
      gallery.classList.add('is-dragging');
    }
    if (event.cancelable) event.preventDefault();
    const now = performance.now();
    const elapsed = Math.max(8, now - pointer.lastTime);
    const velocity = -(event.clientX - pointer.lastX) / elapsed * 1000;
    pointer.velocity = pointer.velocity * 0.35 + Math.max(-1200, Math.min(1200, velocity)) * 0.65;
    pointer.lastX = event.clientX;
    pointer.lastTime = now;
    offset = pointer.offset - dx;
    start();
  }, { passive: false });

  function finishPointer(event, cancelled = false) {
    if (!pointer || pointer.id !== event.pointerId) return;
    const last = pointer;
    pointer = null;
    if (last.dragging) {
      suppressClickUntil = performance.now() + 700;
      inertia = !cancelled && !paused && !reduced.matches && performance.now() - last.lastTime < 90 ? last.velocity : 0;
    }
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    gallery.classList.remove('is-dragging');
    resumeAfter = performance.now() + (last.dragging ? 2200 : 900);
    updateState();
  }
  viewport.addEventListener('pointerup', event => finishPointer(event));
  viewport.addEventListener('pointercancel', event => finishPointer(event, true));
  viewport.addEventListener('lostpointercapture', event => finishPointer(event, true));
  // A non-drag tap can end beyond the viewport before pointer capture begins.
  window.addEventListener('pointerup', event => finishPointer(event));
  viewport.addEventListener('click', event => {
    if (event.detail > 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClickUntil = 0;
    }
  }, true);

  new ResizeObserver(measure).observe(viewport);
  new ResizeObserver(measure).observe(original);
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    updateState();
  }, { threshold: 0 }).observe(viewport);
  new MutationObserver(() => {
    paused = document.body.classList.contains('motion-paused');
    updateState();
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('sl-motion-change', event => {
    paused = event.detail.paused;
    if (!paused) { focusHeld = false; resumeAfter = 0; }
    updateState();
  });
  reduced.addEventListener('change', () => { inertia = 0; tween = null; updateState(); });
  document.addEventListener('visibilitychange', updateState);
  window.addEventListener('blur', () => {
    if (pointer) finishPointer({ pointerId: pointer.id }, true);
  });
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', updateState);
  measure();
})();
