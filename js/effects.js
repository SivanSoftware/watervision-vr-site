/* Interactive water effects — shared across all pages */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var noHover = window.matchMedia('(hover: none)').matches || ('ontouchstart' in window);

  /* ── 1. Scroll progress bar + back-to-top droplet ── */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);

  var toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'חזרה למעלה');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0C6 9.5 12 3 12 3z"/><path d="M9.5 14.5 12 12l2.5 2.5"/></svg>';
  document.body.appendChild(toTop);

  function onScroll() {
    var h = document.documentElement;
    var st = h.scrollTop || document.body.scrollTop || 0;
    var max = (h.scrollHeight - h.clientHeight) || 1;
    bar.style.width = Math.min(100, (st / max) * 100) + '%';
    toTop.classList.toggle('show', st > 420);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ── 2. Click water ripple ── */
  if (!reduce) {
    document.addEventListener('pointerdown', function (e) {
      var r = document.createElement('span');
      r.className = 'water-ripple';
      r.style.left = e.clientX + 'px';
      r.style.top = e.clientY + 'px';
      document.body.appendChild(r);
      setTimeout(function () { r.remove(); }, 720);
    });
  }

  /* ── 3. Cursor trailing bubbles (pointer devices only) ── */
  if (!noHover && !reduce) {
    var last = 0;
    document.addEventListener('mousemove', function (e) {
      var now = Date.now();
      if (now - last < 110) return;
      last = now;
      var b = document.createElement('span');
      b.className = 'cursor-bubble';
      var size = 4 + Math.random() * 8;
      b.style.width = b.style.height = size.toFixed(1) + 'px';
      b.style.left = (e.clientX + (Math.random() * 16 - 8)) + 'px';
      b.style.top = e.clientY + 'px';
      document.body.appendChild(b);
      setTimeout(function () { b.remove(); }, 1300);
    });
  }

  /* ── 4. 3D tilt on cards (pointer devices only) ── */
  if (!noHover && !reduce) {
    var cards = document.querySelectorAll('.feat-card, .af-card, .tech-card, .member-card, .qn-card');
    cards.forEach(function (card) {
      card.classList.add('tiltable');
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = 'transform 0.06s linear';
        card.style.transform = 'perspective(720px) rotateX(' + (-py * 8).toFixed(2) +
          'deg) rotateY(' + (px * 8).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.4s ease';
        card.style.transform = '';
      });
    });
  }

  /* ── 5. Splash screen (home page only) ── */
  var splash = document.getElementById('splash');
  if (splash) {
    try { sessionStorage.setItem('wv_splash', '1'); } catch (e) {}
    setTimeout(function () { splash.classList.add('hide'); }, 1500);
    setTimeout(function () { if (splash.parentNode) splash.remove(); }, 2200);
  }
})();
