/* Shared left slide-out drawer navigation for all pages */
(function () {
  var I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg>',
    about: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r="0.7" fill="currentColor" stroke="none"/></svg>',
    sprints: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></svg>',
    gallery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.5M21 20a6 6 0 0 0-4-5.6"/></svg>'
  };
  var PAGES = [
    { href: 'index.html', label: 'בית', icon: I.home },
    { href: 'about.html', label: 'אודות', icon: I.about },
    { href: 'sprints.html', label: 'ספרינטים', icon: I.sprints },
    { href: 'gallery.html', label: 'גלריה', icon: I.gallery },
    { href: 'team.html', label: 'הצוות', icon: I.team }
  ];

  var nav = document.querySelector('nav');
  if (!nav) return;
  var current = (location.pathname.split('/').pop() || 'index.html');
  if (current === '') current = 'index.html';

  // hamburger button
  var toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-label', 'פתיחת תפריט');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(toggle);

  // overlay
  var overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  document.body.appendChild(overlay);

  // drawer
  var drawer = document.createElement('aside');
  drawer.className = 'drawer';
  drawer.setAttribute('aria-label', 'תפריט ניווט');
  var linksHtml = PAGES.map(function (p) {
    var active = (p.href === current) ? ' class="active"' : '';
    return '<a href="' + p.href + '"' + active + '>' + p.icon + '<span>' + p.label + '</span></a>';
  }).join('');
  drawer.innerHTML =
    '<button class="drawer-close" aria-label="סגירת תפריט">&#10005;</button>' +
    '<div class="drawer-head"><img src="assets/logo.png" alt="" /><span>WaterVision VR</span></div>' +
    linksHtml +
    '<div class="drawer-foot">פרויקט גמר 2026 · WaterVision VR</div>';
  document.body.appendChild(drawer);

  function open() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  toggle.addEventListener('click', function () {
    drawer.classList.contains('open') ? close() : open();
  });
  overlay.addEventListener('click', close);
  drawer.querySelector('.drawer-close').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
