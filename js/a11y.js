/* Accessibility menu — shared across all pages */
(function () {
  var KEY = 'wv_a11y';
  var html = document.documentElement;

  var ICON = {
    a11y: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="3.6" r="1.7" fill="currentColor" stroke="none"/><path d="M4.5 8h15"/><path d="M12 8v6"/><path d="M8 20l4-6 4 6"/></svg>',
    fontUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18 8 6l5 12"/><path d="M4.5 14h7"/><path d="M18 9v8M14 13h8"/></svg>',
    fontDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18 8 8l4 10"/><path d="M5.2 15h5.6"/><path d="M15 13h6"/></svg>',
    contrast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/></svg>',
    grayscale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5C12 2.5 5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.5 12 2.5z"/></svg>',
    links: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/></svg>',
    readable: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7V5h16v2"/><path d="M9 5v14"/><path d="M7 19h4"/><path d="M15 13v-1h6v1"/><path d="M18 12v7"/><path d="M16.5 19h3"/></svg>',
    motion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    cursor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3l7 17 2.5-6.5L20 11 4 3z"/></svg>'
  };

  var MODES = [
    { key: 'contrast', label: 'ניגודיות גבוהה', icon: ICON.contrast },
    { key: 'grayscale', label: 'גווני אפור', icon: ICON.grayscale },
    { key: 'links', label: 'הדגשת קישורים', icon: ICON.links },
    { key: 'readable', label: 'פונט קריא', icon: ICON.readable },
    { key: 'no-motion', label: 'עצירת אנימציות', icon: ICON.motion },
    { key: 'big-cursor', label: 'סמן גדול', icon: ICON.cursor }
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var state = load();
  if (!state.font) state.font = 100;

  function apply() {
    MODES.forEach(function (m) { html.classList.toggle('a11y-' + m.key, !!state[m.key]); });
    html.style.fontSize = (state.font && state.font !== 100) ? state.font + '%' : '';
    // reflect active states in panel
    if (panel) {
      panel.querySelectorAll('[data-mode]').forEach(function (b) {
        b.classList.toggle('active', !!state[b.getAttribute('data-mode')]);
        b.setAttribute('aria-pressed', !!state[b.getAttribute('data-mode')]);
      });
    }
    save();
  }

  // grayscale overlay
  var gray = document.createElement('div');
  gray.className = 'a11y-gray-overlay';
  document.body.appendChild(gray);

  // skip link
  var skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#';
  skip.textContent = 'דלג לתוכן';
  skip.addEventListener('click', function (e) {
    e.preventDefault();
    var t = document.querySelector('.page-header h1, #hero, .sec');
    if (t) { t.setAttribute('tabindex', '-1'); t.focus(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
  document.body.insertBefore(skip, document.body.firstChild);

  // button
  var btn = document.createElement('button');
  btn.className = 'a11y-btn';
  btn.setAttribute('aria-label', 'תפריט נגישות');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = ICON.a11y;
  document.body.appendChild(btn);

  // panel
  var panel = document.createElement('div');
  panel.className = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'תפריט נגישות');
  panel.innerHTML =
    '<h2>תפריט נגישות</h2><div class="a11y-sub">התאמת האתר לצרכים שלך</div>' +
    '<div class="a11y-grid">' +
    '<button class="a11y-opt" data-act="font-up">' + ICON.fontUp + 'הגדלת טקסט</button>' +
    '<button class="a11y-opt" data-act="font-down">' + ICON.fontDown + 'הקטנת טקסט</button>' +
    MODES.map(function (m) {
      return '<button class="a11y-opt" data-mode="' + m.key + '" aria-pressed="false">' + m.icon + m.label + '</button>';
    }).join('') +
    '</div>' +
    '<button class="a11y-reset">איפוס הגדרות</button>';
  document.body.appendChild(panel);

  function openPanel() { panel.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
  function closePanel() { panel.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function () {
    panel.classList.contains('open') ? closePanel() : openPanel();
  });

  panel.addEventListener('click', function (e) {
    var opt = e.target.closest('.a11y-opt');
    if (opt) {
      var act = opt.getAttribute('data-act');
      var mode = opt.getAttribute('data-mode');
      if (act === 'font-up') state.font = Math.min(160, (state.font || 100) + 12);
      else if (act === 'font-down') state.font = Math.max(80, (state.font || 100) - 12);
      else if (mode) state[mode] = !state[mode];
      apply();
      return;
    }
    if (e.target.closest('.a11y-reset')) {
      state = { font: 100 };
      apply();
    }
  });

  // close on outside click / Esc
  document.addEventListener('click', function (e) {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) closePanel();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePanel(); });

  apply();
})();
