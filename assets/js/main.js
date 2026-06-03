/* ================================================================
   API endpoint — Cloudflare Worker that proxies Telegram so the bot
   token is never exposed in client code. Deploy: see /worker/README.md
   then replace the placeholder below with your Worker URL.
================================================================ */
const API_BASE = 'https://notify-telegram-proxy.dayanidigv954.workers.dev';
const API_READY = /^https:\/\/.+\.workers\.dev$/.test(API_BASE) && !API_BASE.includes('YOUR-SUBDOMAIN');

// visit ping via the proxy (was an inline token'd fetch in index.html)
if (API_READY) {
  fetch(`${API_BASE}/notify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: location.pathname, ref: document.referrer || 'direct' }),
  }).catch(() => {});
}

/* ================================================================
   CONFIG - operational status pill (formerly "open to work")
   Reframed from job-seeker availability to an operator status flex.
   Toggle `open` to false to hide the pills entirely.
================================================================ */
const AVAILABILITY = {
  open: true,                                // master switch
  navLabel: 'Systems online',               // navbar pill text
  contactLabel: 'Operating at scale',       // contact panel text
};
/*==================== TITLE ====================*/
// Keep the real SEO <title>, but show a friendly message when the tab loses focus.
const REAL_TITLE = document.title || "Dayanidi Vadivel | Backend Systems Engineer";
document.addEventListener('visibilitychange', () => {
  document.title = document.hidden ? "👋 Come back! - Dayanidi" : REAL_TITLE;
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*==================== LOADER ====================*/
const loader = document.querySelector('#loader');

function hideLoader() {
  if (!loader) return;
  loader.style.opacity = '0';
  setTimeout(() => { loader.style.display = 'none'; }, 400);
}
// Exposed so the boot sequence (hero-effects.js) can dismiss the loader
// once its terminal animation finishes.
window.__hideLoader = hideLoader;

// When a boot terminal is present, it drives the dismissal; otherwise hide
// shortly after load. The 4s timeout is always a safety net so it never sticks.
if (!document.getElementById('boot-terminal')) {
  window.addEventListener('load', () => setTimeout(hideLoader, 600));
}
setTimeout(hideLoader, 4000);



/*==================== ABOUT CUBE ROTATOR ====================*/
const words = ['Backend Engineer', 'Python Developer', 'Network Automation', 'Infrastructure Engineer', 'Full-Stack Developer'];
let currentCubeIndex = 0;
let isCubeTransitioning = false;

function measureWordWidth(text) {
  const sizer = document.getElementById('cube-sizer');
  if (sizer) {
    sizer.textContent = text;
    return sizer.getBoundingClientRect().width;
  }
  return 140; // fallback default
}

function rotateCube() {
  const container = document.getElementById('cube-container');
  const rotator = document.getElementById('cube-rotator');
  const front = document.getElementById('cube-front');
  const bottom = document.getElementById('cube-bottom');

  if (!container || !rotator || !front || !bottom || isCubeTransitioning) return;

  isCubeTransitioning = true;
  
  const nextIndex = (currentCubeIndex + 1) % words.length;
  const nextWord = words[nextIndex];

  // Set the text of the bottom face (incoming word)
  bottom.textContent = nextWord;

  // Measure the next width and update container width
  const nextWidth = measureWordWidth(nextWord);
  container.style.width = `${nextWidth}px`;

  // Start rotation transition
  rotator.classList.add('flip');

  // Once transition completes, swap and reset
  setTimeout(() => {
    // Disable transitions to snap instantly
    rotator.style.transition = 'none';
    
    // Sync the front face content
    front.textContent = nextWord;
    
    // Revert rotation class
    rotator.classList.remove('flip');
    
    // Trigger reflow
    void rotator.offsetHeight;
    
    // Restore transition style
    rotator.style.transition = '';
    
    currentCubeIndex = nextIndex;
    isCubeTransitioning = false;
  }, 600); // matches the 0.6s css transition
}

function initCubeRotator() {
  const container = document.getElementById('cube-container');
  const front = document.getElementById('cube-front');
  if (!container || !front) return;

  // Sync initial size
  const initialWidth = container.getBoundingClientRect().width;
  container.style.width = `${initialWidth}px`;

  setInterval(rotateCube, 1500);
}

initCubeRotator();



/*==================== Send Message ====================*/

  
function sendMessage(event) {
  event.preventDefault();
  const button = document.getElementById('sendmessage');

  const flash = (ok) => {
    button.style.color = ok ? '#00ff37' : '#ff0000';
    button.style.border = '2px solid ' + (ok ? '#00ff37' : '#ff0000');
    button.style.animation = (ok ? 'glowgreen' : 'glowred') + (ok ? ' 5s' : ' 1s') + ' infinite';
    button.addEventListener('animationend', () => { button.style.animation = ''; }, { once: true });
  };

  if (!API_READY) {
    console.warn('Contact endpoint not configured yet — see /worker/README.md');
    flash(false);
    return;
  }

  const hp = document.getElementById('hpInput');
  const payload = {
    name: document.getElementById('nameInput').value,
    email: document.getElementById('emailInput').value,
    subject: document.getElementById('subjectInput').value,
    description: document.getElementById('descriptionInput').value,
    website: hp ? hp.value : '', // honeypot
  };

  // route through the Worker proxy — no token in the client
  fetch(`${API_BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok === true) {
        ['nameInput', 'emailInput', 'subjectInput', 'descriptionInput'].forEach((id) => {
          const el = document.getElementById(id); if (el) el.value = '';
        });
        flash(true);
      } else {
        flash(false);
      }
    })
    .catch((error) => { console.error(error); flash(false); });
}

/*==================== MOBILE MENU (full-screen overlay) ====================*/
(function mobileMenu() {
  const burger = document.getElementById('nav-burger');
  const menu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');
  if (!burger || !menu) return;

  const open = () => {
    menu.classList.add('open');
    burger.classList.add('open');
    document.body.classList.add('menu-open');
    if (window.__lenis) window.__lenis.stop();
  };
  const close = () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.classList.remove('menu-open');
    if (window.__lenis) window.__lenis.start();
  };

  burger.addEventListener('click', () => {
    menu.classList.contains('open') ? close() : open();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  menu.querySelectorAll('.mobile-link').forEach((l) => l.addEventListener('click', close));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}());

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
  const scrollY = window.scrollY;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 120;
    const sectionId = current.getAttribute('id');
    const links = document.querySelectorAll('a[href="#' + sectionId + '"].nav-item-link, a[href="#' + sectionId + '"].mobile-link');
    if (!links.length) return;

    const inView = scrollY > sectionTop && scrollY <= sectionTop + sectionHeight;
    links.forEach((link) => link.classList.toggle('active', inView));
  });
}
window.addEventListener('scroll', scrollActive, { passive: true });

/*==================== SHOW SCROLL UP ====================*/
function scrollUp() {
  const scrollUpBtn = document.getElementById('scroll-up');
  if (!scrollUpBtn) return;
  if (window.scrollY >= 480) scrollUpBtn.classList.add('show-scroll');
  else scrollUpBtn.classList.remove('show-scroll');
}
window.addEventListener('scroll', scrollUp, { passive: true });

/*===== SCROLL REVEAL ANIMATION =====*/
if (typeof ScrollReveal !== 'undefined') {
  const sr = ScrollReveal({
    origin: 'top',
    distance: '40px',
    duration: 900,
    delay: 100,
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    cleanup: true,
  });

  // Hero
  sr.reveal('.hero-greeting, .hero-name, .hero-role', { interval: 80 });
  sr.reveal('.home__data, .home__social, .hero-stage', { delay: 150 });
  sr.reveal('.code-editor, .hero-stats-bar, .hero-quote', { delay: 150, interval: 80 });
  // Section headers
  sr.reveal('.section-title, .qual-section-tag, .qual-hero-title, .qual-hero-sub, .section-tag', { origin: 'bottom' });
  // Content blocks
  sr.reveal('.qual-new-row', { interval: 120, origin: 'left' });
  sr.reveal('.exp-card', { interval: 100 });
  sr.reveal('.skill-cat-card, .skill-json-section', { interval: 90 });
  sr.reveal('.item', { interval: 80 });
  sr.reveal('.contact__information, .contact__input', { interval: 80 });
  sr.reveal('.quote, .qual-quote-pill', { delay: 120 });
}


/* ==================== PROJECTS (data-driven cards + modal) ====================
   All project data lives in assets/js/projects.js (PROJECTS). Cards and the
   detail modal render from it — edit there, nothing here. */
const PROJECT_LIST = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];
const projectById = {};
PROJECT_LIST.forEach((p) => { projectById[p.id] = p; });

let currentFilter = 'all';
let currentPage = 1;
const ITEMS_PER_PAGE = 6;

const escapeHTML = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// SVG used as the card's "view" affordance
const VIEW_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M11 12H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1Zm-1 8H4v-6h6ZM21.92 2.62a1 1 0 0 0-.54-.54A1 1 0 0 0 21 2h-6a1 1 0 0 0 0 2h3.59l-5.3 5.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L20 5.41V9a1 1 0 0 0 2 0V3a1 1 0 0 0-.08-.38Z"/></svg>';

function getFilteredProjects() {
  if (currentFilter === 'all') {
    return PROJECT_LIST;
  }
  return PROJECT_LIST.filter((p) => {
    if (currentFilter === 'innak') return p.group === 'Innak';
    if (currentFilter === 'thb') return p.group === 'The Half Brick';
    if (currentFilter === 'personal') return p.group === 'Personal';
    return true;
  });
}

function renderFilters() {
  const container = document.getElementById('portfolio-filters');
  if (!container) return;

  const groups = {
    all: 'All',
    cars: 'Innak',
    thb: 'The Half Brick',
    personal: 'Personal'
  };

  container.innerHTML = Object.entries(groups).map(([key, label]) => {
    const activeClass = key === currentFilter ? 'active' : '';
    return '<button type="button" class="filter-btn ' + activeClass + '" data-group="' + key + '">' + label + '</button>';
  }).join('');

  // Add click handlers
  container.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-group');
      currentPage = 1; // reset page
      renderProjects();
      renderFilters();
    });
  });
}

function renderPagination(totalItems) {
  const container = document.getElementById('portfolio-pagination');
  if (!container) return;

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let btns = '';
  // Prev button
  const prevDisabled = currentPage === 1 ? 'disabled' : '';
  btns += '<button type="button" class="page-btn" ' + prevDisabled + ' data-page="' + (currentPage - 1) + '"><i class="uil uil-angle-left-b"></i></button>';

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const activeClass = i === currentPage ? 'active' : '';
    btns += '<button type="button" class="page-btn ' + activeClass + '" data-page="' + i + '">' + i + '</button>';
  }

  // Next button
  const nextDisabled = currentPage === totalPages ? 'disabled' : '';
  btns += '<button type="button" class="page-btn" ' + nextDisabled + ' data-page="' + (currentPage + 1) + '"><i class="uil uil-angle-right-b"></i></button>';

  container.innerHTML = btns;

  // Add click handlers
  container.querySelectorAll('.page-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.getAttribute('data-page'));
      if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProjects();
        // Smooth scroll to top of portfolio section
        const port = document.getElementById('portfolio');
        if (port) {
          if (window.__lenis) {
            window.__lenis.scrollTo(port, { offset: -72, duration: 0.8 });
          } else {
            port.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });
}

function renderProjects() {
  const grid = document.getElementById('work-grid');
  if (!grid) return;

  const filtered = getFilteredProjects();
  const totalItems = filtered.length;

  if (totalItems === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 3rem 0; font-family: var(--mono);">No projects found in this category.</div>';
    renderPagination(0);
    return;
  }

  // Paginate filtered projects
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginated = filtered.slice(startIndex, endIndex);

  grid.innerHTML = paginated.map((p) => {
    const tags = (p.tags || []).map((t) => '<span>' + escapeHTML(t) + '</span>').join('');
    
    // Generate card link icons
    const cardLinks = Object.entries(p.links || {})
      .filter(([, url]) => url && url !== '#')
      .map(([kind, url]) => {
        const m = LINK_META[kind] || { label: kind, cls: 'ghost', icon: 'uil uil-link' };
        return '<a href="' + escapeHTML(url) + '" target="_blank" rel="noopener" class="pw-card-link-icon" title="' + escapeHTML(m.label) + '" onclick="event.stopPropagation()">' +
               '<i class="' + m.icon + '"></i></a>';
      }).join('');

    return (
      '<div class="item" data-id="' + escapeHTML(p.id) + '">' +
        '<div class="pw-status" aria-hidden="true"><span class="pw-live">' + escapeHTML(p.year) + '</span></div>' +
        '<div class="pw-grid" aria-hidden="true"></div>' +
        '<div class="pw-emblem" aria-hidden="true"><i class="' + escapeHTML(p.icon || 'uil uil-apps') + '"></i></div>' +
        '<div class="text">' +
          '<h3>' + escapeHTML(p.title) + '</h3>' +
          '<p>' + escapeHTML(p.tagline || '') + '</p>' +
          '<div class="portfolio-tags">' + tags + '</div>' +
        '</div>' +
        '<div class="pw-card-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.95rem; width: 100%; z-index: 5;">' +
          '<div class="pw-card-links" style="display: flex; gap: 0.5rem; align-items: center;">' + cardLinks + '</div>' +
          '<button type="button" class="button" style="margin-top: 0;" aria-label="View ' + escapeHTML(p.title) + ' details">' +
            VIEW_SVG + '<span class="pw-view">View</span></button>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  if (!grid.dataset.listenerAttached) {
    grid.addEventListener('click', (e) => {
      const item = e.target.closest('.item');
      if (item) openModal(item.getAttribute('data-id'));
    });
    grid.dataset.listenerAttached = 'true';
  }

  renderPagination(totalItems);
}

// link kind → button label + icon (extend freely)
const LINK_META = {
  live:      { label: 'Visit',  cls: 'primary', icon: 'uil uil-external-link-alt' },
  demo:      { label: 'Demo',   cls: 'primary', icon: 'uil uil-play' },
  github:    { label: 'Code',   cls: 'ghost',   icon: 'bx bxl-github' },
  play:      { label: 'Play Store', cls: 'primary', icon: 'uil uil-google-play' },
  docs:      { label: 'Docs',   cls: 'ghost',   icon: 'uil uil-file-alt' },
  linkedin:  { label: 'LinkedIn', cls: 'ghost', icon: 'bx bxl-linkedin' },
  link:      { label: 'Link',   cls: 'ghost',   icon: 'uil uil-link' },
};

var modal = document.getElementById('myModal');

function openModal(id) {
  const p = projectById[id];
  if (!p || !modal) return;
  fillOut(p);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open'); // reuse scroll-lock
  if (window.__lenis) window.__lenis.stop();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  if (window.__lenis) window.__lenis.start();
}

function fillOut(p) {
  setText('title', p.title);
  setText('info', p.description || p.tagline || '');

  const modalIcon = document.querySelector('#modalIcon i');
  if (modalIcon) modalIcon.className = p.icon || 'uil uil-apps';
  setText('modalSvc', p.year);

  const statusEl = modal.querySelector('.pw-modal-status');
  if (statusEl) {
    statusEl.style.display = 'none';
  }

  const modalTags = document.getElementById('modalTags');
  if (modalTags) modalTags.innerHTML = (p.tags || []).map((t) => '<span>' + escapeHTML(t) + '</span>').join('');

  // build link buttons from links{} (any non-empty), then Close
  const foot = document.getElementById('modalFoot');
  if (foot) {
    const btns = Object.entries(p.links || {})
      .filter(([, url]) => url && url !== '#')
      .map(([kind, url]) => {
        const m = LINK_META[kind] || { label: kind, cls: 'ghost', icon: 'uil uil-link' };
        return '<a class="pw-modal-btn ' + m.cls + '" href="' + escapeHTML(url) + '" target="_blank" rel="noopener">' +
               '<i class="' + m.icon + '"></i> ' + escapeHTML(m.label) + '</a>';
      }).join('');
    foot.innerHTML = btns + '<button type="button" class="pw-modal-btn ghost" data-close>Close</button>';
    foot.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  }
}

// Initial renders
renderFilters();
renderProjects();

// Close: backdrop / × / Esc  (footer Close is wired in fillOut)
if (modal) {
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

  /*==================== spark trail on mouse move (desktop only, throttled) ====================*/
const isTouchDevice = window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!isTouchDevice && !prefersReducedMotion) {
  let lastSpark = 0;
  // resolve spark path for both root + sub-directory pages
  const sparkSrc = (location.pathname.includes('view') ? '../' : './') + 'assets/images/spark.png';

  document.addEventListener('mousemove', function (event) {
    const now = Date.now();
    if (now - lastSpark < 45) return; // throttle ~22 sparks/sec max
    lastSpark = now;

    const spark = document.createElement('img');
    spark.className = 'spark';
    spark.src = sparkSrc;
    spark.style.left = event.clientX + 'px';
    spark.style.top = event.clientY + window.scrollY + 'px';
    spark.style.transform = 'rotate(' + Math.floor(Math.random() * 360) + 'deg)';
    spark.style.width = (Math.floor(Math.random() * 28) + 10) + 'px';
    spark.style.height = 'auto';
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 150);
  }, { passive: true });
}

/*==================== Personal details ====================*/

var personalDetails = {
name: "Dayanidi Vadivel",
initial: "GV",
age: 22,
occupation: "Backend Engineer",
college: "K.S.R. College of Engineering, Tiruchengode",
pursuing: "Graduated",
cgpa: 7.5,
about: "",
email: "dayanidigv954@gmail.com",
facebook: "https://www.facebook.com/dayanidi.vadivel/",
instagram: "https://www.instagram.com/dayanidi.vadivel/",
twitter: "https://twitter.com/DayanidiCoder",
linkedin: "https://in.linkedin.com/in/dayanidi-vadivel",
github: "https://github.com/dayanidigv",
sendMail: ""
};
personalDetails.about = `Backend Systems Engineer focused on automation, large-scale infrastructure, and system reliability. Currently building at Nile - working on network automation, anomaly detection, and production systems at scale. B.Tech in Information Technology, ${personalDetails.college} (2025 · CGPA ${personalDetails.cgpa}).`;
personalDetails.sendMail = `mailto:${personalDetails.email}`;

/* ---- small safe helpers (never throw if an element is missing) ---- */
const setText = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
const setHref = (id, val) => { const el = document.getElementById(id); if (el) el.setAttribute('href', val); };
const setAllText = (cls, val) => { document.querySelectorAll('.' + cls).forEach(el => { el.innerHTML = val; }); };

const isNormalView = window.location.pathname.includes('normalview');

/* Brand + name tags (may appear 0..n times per view) */
setAllText('brand-name', personalDetails.name);
setAllText('nametag', personalDetails.name);

/* View-specific bindings */
if (isNormalView) {
  setText('normalviewAbout', personalDetails.about);
} else {
  setText('name', personalDetails.name);
  setText('age', personalDetails.age);
  setText('occupation', personalDetails.occupation);
  setText('year', personalDetails.pursuing);
}

/* Shared bindings (present in both views) */
setText('cgpatag', personalDetails.cgpa);
setText('email', personalDetails.email);
setHref('send_mail', personalDetails.sendMail);

/* All social links by data attribute (hero, contact, mobile menu, footer) */
['linkedin', 'github', 'twitter', 'instagram', 'facebook'].forEach((net) => {
  document.querySelectorAll('[data-social="' + net + '"]').forEach((a) => {
    a.href = personalDetails[net];
    a.target = '_blank';
    a.rel = 'noopener';
  });
});

/* Availability badges - controlled by the AVAILABILITY config at top */
(function applyAvailability() {
  const navPills = document.querySelectorAll('.nav-status');
  const contactPills = document.querySelectorAll('.contact-availability');

  if (!AVAILABILITY.open) {
    navPills.forEach((el) => { el.style.display = 'none'; });
    contactPills.forEach((el) => { el.style.display = 'none'; });
    return;
  }
  navPills.forEach((el) => {
    el.innerHTML = '<span class="status-dot"></span> ' + AVAILABILITY.navLabel;
  });
  contactPills.forEach((el) => {
    el.innerHTML = '<span class="dot"></span> ' + AVAILABILITY.contactLabel;
  });
}());


/*==================== HERO UPTIME COUNTER ====================*/
// Live "uptime" = days since Dayanidi started this journey (1 Jan 2022).
// Grows on its own — no hardcoded number to go stale.
(function uptimeCounter() {
  const el = document.getElementById('uptime-days');
  if (!el) return;
  const start = new Date('2022-01-01T00:00:00');
  const days = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
  el.textContent = days.toLocaleString() + 'd';
}());

/*==================== IDE FILE EXPLORER TAB SWITCHER ====================*/
(function ideTabs() {
  const container = document.querySelector('.ide-container');
  const files = document.querySelectorAll('.ide-file');
  const tabs = document.querySelectorAll('.ide-tab');
  const sections = document.querySelectorAll('.ide-code-section');

  if (!files.length) return;

  let activeIndex = 0;
  let intervalId = null;

  const switchTab = (index) => {
    activeIndex = index;
    const activeFile = files[index];
    if (!activeFile) return;
    const tabId = activeFile.getAttribute('data-tab');

    files.forEach((f, idx) => {
      f.classList.toggle('active', f.getAttribute('data-tab') === tabId);
      f.classList.toggle('loading', idx === index && intervalId !== null);
    });
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabId));
    sections.forEach(s => s.classList.toggle('active', s.getAttribute('id') === 'code-' + tabId));
  };

  const startAutoPlay = () => {
    const activeFile = files[activeIndex];
    if (activeFile) activeFile.classList.add('loading');

    intervalId = setInterval(() => {
      let nextIndex = (activeIndex + 1) % files.length;
      switchTab(nextIndex);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    files.forEach(f => f.classList.remove('loading'));
  };

  files.forEach((f, idx) => {
    f.addEventListener('click', () => {
      stopAutoPlay();
      switchTab(idx);
    });
  });

  tabs.forEach((t) => {
    t.addEventListener('click', () => {
      stopAutoPlay();
      const tabId = t.getAttribute('data-tab');
      const idx = Array.from(files).findIndex(f => f.getAttribute('data-tab') === tabId);
      if (idx !== -1) {
        switchTab(idx);
      }
    });
  });

  if (container) {
    container.addEventListener('mouseenter', stopAutoPlay);
  }

  startAutoPlay();
}());

/*==================== EXPERIENCE TIMELINE TAB SWITCHER ====================*/
(function expTabs() {
  const container = document.querySelector('.exp-tabs-container');
  const tabBtns = document.querySelectorAll('.exp-tab-btn');
  const detailsContents = document.querySelectorAll('.exp-details-content');

  if (!tabBtns.length || !detailsContents.length) return;

  let activeIndex = 0;
  let intervalId = null;

  const switchTab = (index) => {
    activeIndex = index;
    const btn = tabBtns[index];
    if (!btn) return;
    const tabId = btn.getAttribute('data-tab');
    
    tabBtns.forEach((b, idx) => {
      b.classList.toggle('active', b === btn);
      b.classList.toggle('loading', idx === index && intervalId !== null);
    });
    detailsContents.forEach(content => {
      content.classList.toggle('active', content.getAttribute('id') === 'exp-' + tabId);
    });
  };

  const startAutoPlay = () => {
    const activeBtn = tabBtns[activeIndex];
    if (activeBtn) activeBtn.classList.add('loading');

    intervalId = setInterval(() => {
      let nextIndex = (activeIndex + 1) % tabBtns.length;
      switchTab(nextIndex);
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    tabBtns.forEach(b => b.classList.remove('loading'));
  };

  tabBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      stopAutoPlay();
      switchTab(index);
    });
  });

  if (container) {
    container.addEventListener('mouseenter', stopAutoPlay);
  }

  startAutoPlay();
}());


