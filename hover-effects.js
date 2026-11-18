/* Social Luxe — pointer-driven surfaces. The link hitbox never moves here. */
(() => {
  'use strict';

  const selector = '[data-tilt], [data-shine]';
  const targets = document.querySelectorAll(selector);
  if (!targets.length) return;

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const variables = ['--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y'];
  let active = null;
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let motionPaused = document.body.classList.contains('motion-paused');

  function isEnabled() {
    return finePointer.matches && !reducedMotion.matches && !document.hidden &&
      !motionPaused && !document.body.classList.contains('motion-paused');
  }

  function reset() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    if (active) {
      active.classList.remove('is-hovering');
      const ownedVariables = active.hasAttribute('data-tilt') ? variables : variables.slice(2);
      ownedVariables.forEach(name => active.style.removeProperty(name));
    }
    active = null;
  }

  function paint() {
    frame = 0;
    if (!active || !active.isConnected || !isEnabled()) {
      reset();
      return;
    }
    const bounds = active.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) {
      reset();
      return;
    }
    const clamp = value => Math.max(0, Math.min(1, value));
    const x = clamp((pointerX - bounds.left) / bounds.width);
    const y = clamp((pointerY - bounds.top) / bounds.height);
    active.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`);
    active.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`);
    if (active.hasAttribute('data-tilt')) {
      active.style.setProperty('--tilt-x', `${((0.5 - y) * 6).toFixed(2)}deg`);
      active.style.setProperty('--tilt-y', `${((x - 0.5) * 6).toFixed(2)}deg`);
    }
    active.classList.add('is-hovering');
  }

  function track(event) {
    if (!isEnabled() || event.pointerType === 'touch') {
      reset();
      return;
    }
    // Nested shine surfaces, if any, own their pointer instead of updating twice.
    const nearest = event.target instanceof Element ? event.target.closest(selector) : null;
    if (nearest !== event.currentTarget) return;
    if (active !== event.currentTarget) {
      reset();
      active = event.currentTarget;
    }
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!frame) frame = window.requestAnimationFrame(paint);
  }

  targets.forEach(target => {
    target.addEventListener('pointerenter', track, { passive: true });
    target.addEventListener('pointermove', track, { passive: true });
    target.addEventListener('pointerleave', () => {
      if (active === target) reset();
    }, { passive: true });
    target.addEventListener('pointercancel', () => {
      if (active === target) reset();
    }, { passive: true });
  });

  function watch(query) {
    if (query.addEventListener) query.addEventListener('change', reset);
    else query.addListener(reset);
  }
  watch(finePointer);
  watch(reducedMotion);
  window.addEventListener('sl-motion-change', event => {
    if (typeof event.detail?.paused === 'boolean') motionPaused = event.detail.paused;
    reset();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
  });
  window.addEventListener('blur', reset);
  window.addEventListener('pagehide', reset);
})();
