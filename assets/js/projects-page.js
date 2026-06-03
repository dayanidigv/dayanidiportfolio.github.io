/* ================================================================
   PROJECTS PAGE ORCHESTRATION JS
   Orchestrates the dedicated `/projects` route: filters, live search,
   sorting, dynamic counts, and modal handlers.
   Loads data from the single-source-of-truth projects.js (PROJECTS).
================================================================ */

const PROJECT_LIST = (typeof PROJECTS !== 'undefined' && Array.isArray(PROJECTS)) ? PROJECTS : [];
const projectById = {};
PROJECT_LIST.forEach((p) => { projectById[p.id] = p; });

// Current filter, search, and sorting states
let currentFilter = 'all';
let searchQuery = '';
let currentSort = 'newest';

const escapeHTML = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const VIEW_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"><path fill="currentColor" d="M11 12H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1Zm-1 8H4v-6h6ZM21.92 2.62a1 1 0 0 0-.54-.54A1 1 0 0 0 21 2h-6a1 1 0 0 0 0 2h3.59l-5.3 5.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0L20 5.41V9a1 1 0 0 0 2 0V3a1 1 0 0 0-.08-.38Z"/></svg>';

// Link metadata mapping for modal buttons
const LINK_META = {
  live:      { label: 'Visit',  cls: 'primary', icon: 'uil uil-external-link-alt' },
  demo:      { label: 'Demo',   cls: 'primary', icon: 'uil uil-play' },
  github:    { label: 'Code',   cls: 'ghost',   icon: 'bx bxl-github' },
  play:      { label: 'Play Store', cls: 'primary', icon: 'uil uil-google-play' },
  docs:      { label: 'Docs',   cls: 'ghost',   icon: 'uil uil-file-alt' },
  linkedin:  { label: 'LinkedIn', cls: 'ghost', icon: 'bx bxl-linkedin' },
  link:      { label: 'Link',   cls: 'ghost',   icon: 'uil uil-link' },
};

const modal = document.getElementById('myModal');

/**
 * Filter and sort projects based on user controls
 */
function getProcessedProjects() {
  // 1. Filter by category group
  let items = PROJECT_LIST.filter((p) => {
    if (currentFilter === 'innak') return p.group === 'Innak';
    if (currentFilter === 'thb') return p.group === 'The Half Brick';
    if (currentFilter === 'personal') return p.group === 'Personal';
    return true;
  });

  // 2. Filter by search query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    items = items.filter((p) => {
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchTagline = (p.tagline || '').toLowerCase().includes(q);
      const matchDesc = (p.description || '').toLowerCase().includes(q);
      const matchTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
      const matchGroup = (p.group || '').toLowerCase().includes(q);
      
      return matchTitle || matchTagline || matchDesc || matchTags || matchGroup;
    });
  }

  // 3. Sort by year
  items.sort((a, b) => {
    const yearA = parseInt(a.year || 0);
    const yearB = parseInt(b.year || 0);
    
    if (currentSort === 'newest') {
      return yearB - yearA; // Newest first
    } else {
      return yearA - yearB; // Oldest first
    }
  });

  return items;
}

/**
 * Render filter buttons and bind click events
 */
function renderFilters() {
  const container = document.getElementById('portfolio-filters');
  if (!container) return;

  const groups = {
    all: 'All',
    innak: 'Innak',
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
      renderFilters();
      renderProjects();
    });
  });
}

/**
 * Render matching project cards to grid
 */
function renderProjects() {
  const grid = document.getElementById('work-grid');
  const visibleCountEl = document.getElementById('visible-count');
  const totalCountEl = document.getElementById('total-count');
  if (!grid) return;

  const processed = getProcessedProjects();
  
  // Update counts
  if (visibleCountEl) visibleCountEl.textContent = processed.length;
  if (totalCountEl) totalCountEl.textContent = PROJECT_LIST.length;

  if (processed.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 5rem 0; font-family: var(--mono);">No projects match your query or category filter.</div>';
    return;
  }

  grid.innerHTML = processed.map((p) => {
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
}

/**
 * Open modal details panel
 */
function openModal(id) {
  const p = projectById[id];
  if (!p || !modal) return;
  fillOut(p);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-open'); // scroll-lock
  if (window.__lenis) window.__lenis.stop();
}

/**
 * Close modal details panel
 */
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-open');
  if (window.__lenis) window.__lenis.start();
}

/**
 * Populate modal contents
 */
function fillOut(p) {
  const titleEl = document.getElementById('title');
  const infoEl = document.getElementById('info');
  const modalIcon = document.querySelector('#modalIcon i');
  const modalSvc = document.getElementById('modalSvc');
  const statusEl = modal.querySelector('.pw-modal-status');
  const modalTags = document.getElementById('modalTags');
  const foot = document.getElementById('modalFoot');

  if (titleEl) titleEl.innerHTML = p.title;
  if (infoEl) infoEl.innerHTML = p.description || p.tagline || '';
  if (modalIcon) modalIcon.className = p.icon || 'uil uil-apps';
  if (modalSvc) modalSvc.innerHTML = p.year;
  if (statusEl) {
    statusEl.style.display = 'none';
  }
  if (modalTags) modalTags.innerHTML = (p.tags || []).map((t) => '<span>' + escapeHTML(t) + '</span>').join('');

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

// Initial setup & bindings on page load
document.addEventListener('DOMContentLoaded', () => {
  renderFilters();
  renderProjects();

  // Search input binding
  const searchInput = document.getElementById('projects-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProjects();
    });
  }

  // Sort selector binding
  const sortSelect = document.getElementById('projects-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProjects();
    });
  }

  // Close modal controls
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
  }
});
