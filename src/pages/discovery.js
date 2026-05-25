// FolkAble — Discovery page
// Hotspot-driven globe: hover for preview, click for immersive detail panel
import { offerings, catColors, artists, companies, companyMap } from '../data/index.js';
import { init as initGlobe } from '../lib/globe.js';
import { go } from '../lib/router.js';

const state = {
  cats: new Set(['event','gathering']),
  rotate: true,
};

let globeApi = null;
let mounted = false;

/* ── helpers ─────────────────────────────────────────────── */

function artistFor(o) { return artists.find(a => a.id === o.artist) || null; }
function companyFor(o) {
  const cid = companyMap[o.company];
  return cid ? companies.find(c => c.id === cid) || null : null;
}
function catLabel(o) { return o.category === 'event' ? 'Event' : 'Gathering'; }
function catClass(o) { return o.category === 'event' ? 'hp-cat-event' : 'hp-cat-gathering'; }

/* ── template ────────────────────────────────────────────── */

const TEMPLATE = `
  <div class="ctrl-bar">
    <span class="ctrl-label">Discovery</span>
    <div class="ctrl-sep"></div>
    <div id="disc-chips" style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
      <span class="chip on" data-cat="event"><span class="chip-dot" style="background:#8B6842;"></span>Events</span>
      <span class="chip on" data-cat="gathering"><span class="chip-dot" style="background:#5C3A1E;"></span>Gatherings</span>
    </div>
    <div class="ctrl-spacer"></div>
    <button class="rotate-btn on" id="rotate-btn">Auto-rotate</button>
  </div>

  <div class="disc-layout">
    <div class="globe-wrap"><div id="globe-el"></div></div>
  </div>

  <div class="legend">
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#8B6842"/></svg> Event</div>
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#5C3A1E"/></svg> Gathering</div>
    <div class="leg-sep"></div>
    <span class="leg-hint">hover to preview -- click for full details</span>
  </div>

  <!-- Hover card (follows cursor) -->
  <div class="hp-hover-card" id="hp-hover"></div>

  <!-- Click detail panel (overlay) -->
  <div class="hp-panel-overlay" id="hp-overlay">
    <div class="hp-panel" id="hp-panel">
      <button class="hp-panel-close" id="hp-panel-close">&times;</button>
      <div class="hp-panel-body" id="hp-panel-body"></div>
    </div>
  </div>
`;

/* ── globe data ──────────────────────────────────────────── */

const BASE_FILL = 'rgba(15,61,46,0.25)';
const RAMP = ['rgba(92,58,30,0.35)','rgba(139,104,66,0.50)','rgba(139,104,66,0.65)','rgba(184,134,11,0.82)'];

function countryFill(name) {
  const n = offerings.filter(o => o.country === name && state.cats.has(o.category)).length;
  return n ? RAMP[Math.min(n, RAMP.length) - 1] : BASE_FILL;
}

function visibleOfferings() {
  const data = offerings.filter(o => state.cats.has(o.category));
  // Pre-compute ring RGB
  data.forEach(d => {
    const hex = catColors[d.category] || '#8B6842';
    d._ringRgb = [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
  });
  return data;
}

function refreshGlobe() {
  if (!globeApi) return;
  globeApi.setCapColor(countryFill);
  const data = visibleOfferings();
  globeApi.setHotspots({
    data,
    pointColor: d => catColors[d.category] || '#8B6842',
    onHover: onHotspotHover,
    onClick: onHotspotClick,
  });
}

/* ── HOVER — lightweight preview card ────────────────────── */

let hoverTarget = null;

function onHotspotHover(d) {
  const card = document.getElementById('hp-hover');
  if (!d) {
    hoverTarget = null;
    card.classList.remove('visible');
    return;
  }
  hoverTarget = d;
  const artist = artistFor(d);
  const participants = 12 + Math.floor(Math.abs(d.lat * 3.7 + d.lng * 1.3) % 180);

  card.innerHTML = `
    <div class="hp-hc-cat ${catClass(d)}">${catLabel(d)}</div>
    <div class="hp-hc-title">${d.title}</div>
    <div class="hp-hc-meta">${d.member} -- ${d.country}</div>
    <div class="hp-hc-row">
      <span class="hp-hc-date">${d.date}</span>
      <span class="hp-hc-price">${d.price}</span>
    </div>
    <div class="hp-hc-desc">${d.desc}</div>
    ${artist ? `<div class="hp-hc-artist">by ${artist.name}</div>` : ''}
    <div class="hp-hc-footer">
      <span class="hp-hc-participants">${participants} active</span>
      <span class="hp-hc-cta">click for details</span>
    </div>
  `;
  card.classList.add('visible');
}

/* ── CLICK — immersive detail panel ──────────────────────── */

function onHotspotClick(d) {
  if (!d) return;
  const artist = artistFor(d);
  const company = companyFor(d);
  const participants = 12 + Math.floor(Math.abs(d.lat * 3.7 + d.lng * 1.3) % 180);

  // Determine CTA based on category
  let ctaText = 'View Details';
  if (d.category === 'gathering') ctaText = 'Join Gathering';
  else if (d.category === 'event') ctaText = 'Enter Experience';

  // Other offerings in same country
  const related = offerings.filter(o =>
    o.country === d.country && o.title !== d.title && state.cats.has(o.category)
  );

  const body = document.getElementById('hp-panel-body');
  body.innerHTML = `
    <div class="hp-p-cat ${catClass(d)}">${catLabel(d)}</div>
    <h2 class="hp-p-title">${d.title}</h2>
    <div class="hp-p-location">${d.country} -- ${d.member}</div>

    <div class="hp-p-info-grid">
      <div class="hp-p-info-item">
        <span class="hp-p-info-label">Date</span>
        <span class="hp-p-info-value">${d.date}</span>
      </div>
      <div class="hp-p-info-item">
        <span class="hp-p-info-label">Price</span>
        <span class="hp-p-info-value">${d.price}</span>
      </div>
      <div class="hp-p-info-item">
        <span class="hp-p-info-label">Participants</span>
        <span class="hp-p-info-value">${participants}</span>
      </div>
      <div class="hp-p-info-item">
        <span class="hp-p-info-label">Status</span>
        <span class="hp-p-info-value hp-p-status">Upcoming</span>
      </div>
    </div>

    <div class="hp-p-section">
      <h3 class="hp-p-section-title">About</h3>
      <p class="hp-p-desc">${d.desc}</p>
    </div>

    <div class="hp-p-tags">
      <span class="hp-p-tag">${d.category}</span>
      <span class="hp-p-tag">${d.country}</span>
      ${d.company ? `<span class="hp-p-tag">${d.company}</span>` : ''}
    </div>

    ${artist ? `
      <div class="hp-p-section">
        <h3 class="hp-p-section-title">Artist</h3>
        <div class="hp-p-artist-card" data-go-artist="${artist.id}">
          <div class="hp-p-artist-info">
            <div class="hp-p-artist-name">${artist.name}</div>
            <div class="hp-p-artist-detail">${artist.instrument} -- ${artist.country}</div>
            <div class="hp-p-artist-detail">${artist.supporters} supporters</div>
          </div>
          <span class="hp-p-artist-arrow">View Artist ></span>
        </div>
      </div>
    ` : ''}

    ${company ? `
      <div class="hp-p-section">
        <h3 class="hp-p-section-title">Label</h3>
        <div class="hp-p-company-card" data-go-company="${company.id}">
          <div class="hp-p-company-info">
            <div class="hp-p-company-name">${company.name}</div>
            <div class="hp-p-company-detail">${company.location}</div>
          </div>
          <span class="hp-p-company-arrow">View Label ></span>
        </div>
      </div>
    ` : ''}

    <button class="hp-p-cta">${ctaText}</button>

    ${related.length ? `
      <div class="hp-p-section">
        <h3 class="hp-p-section-title">Also in ${d.country}</h3>
        ${related.map(r => {
          const rArtist = artistFor(r);
          return `
            <div class="hp-p-related" data-related-id="${r.id}">
              <div class="hp-p-related-bar ${catClass(r)}"></div>
              <div class="hp-p-related-body">
                <div class="hp-p-related-cat ${catClass(r)}">${catLabel(r)}</div>
                <div class="hp-p-related-title">${r.title}</div>
                <div class="hp-p-related-meta">${r.date} -- ${r.price}${rArtist ? ` -- ${rArtist.name}` : ''}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : ''}
  `;

  // Bind navigation
  body.querySelectorAll('[data-go-artist]').forEach(el => {
    el.addEventListener('click', () => {
      closePanel();
      window.__folkable_artist = el.dataset.goArtist;
      go('artists');
    });
  });
  body.querySelectorAll('[data-go-company]').forEach(el => {
    el.addEventListener('click', () => {
      closePanel();
      window.__folkable_company = el.dataset.goCompany;
      go('companies');
    });
  });
  body.querySelectorAll('[data-related-id]').forEach(el => {
    el.addEventListener('click', () => {
      const r = offerings.find(o => o.id === parseInt(el.dataset.relatedId));
      if (r) onHotspotClick(r);
    });
  });

  openPanel();
}

function openPanel() {
  document.getElementById('hp-overlay').classList.add('open');
  document.getElementById('hp-panel').scrollTop = 0;
  // Hide hover card
  document.getElementById('hp-hover').classList.remove('visible');
}

function closePanel() {
  document.getElementById('hp-overlay').classList.remove('open');
}

/* ── MOUNT ───────────────────────────────────────────────── */

export function mount(root) {
  if (mounted) return;
  root.innerHTML = TEMPLATE;

  // Chips
  document.querySelectorAll('#disc-chips .chip').forEach(chip => chip.addEventListener('click', () => {
    const cat = chip.dataset.cat;
    if (state.cats.has(cat)) state.cats.delete(cat); else state.cats.add(cat);
    chip.classList.toggle('on', state.cats.has(cat));
    refreshGlobe();
  }));

  // Rotate
  document.getElementById('rotate-btn').addEventListener('click', function() {
    state.rotate = !state.rotate;
    this.classList.toggle('on', state.rotate);
    if (globeApi) globeApi.setRotate(state.rotate);
  });

  // Panel close
  document.getElementById('hp-panel-close').addEventListener('click', closePanel);
  document.getElementById('hp-overlay').addEventListener('click', e => {
    if (e.target.id === 'hp-overlay') closePanel();
  });

  // ESC to close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanel();
  });

  // Hover card follows cursor
  document.body.addEventListener('mousemove', e => {
    const card = document.getElementById('hp-hover');
    if (!card.classList.contains('visible')) return;
    let x = e.clientX + 18, y = e.clientY + 18;
    // Keep on screen
    const rect = card.getBoundingClientRect();
    if (x + rect.width + 10 > window.innerWidth) x = e.clientX - rect.width - 12;
    if (y + rect.height + 10 > window.innerHeight) y = e.clientY - rect.height - 12;
    card.style.left = x + 'px';
    card.style.top = y + 'px';
  });

  // Init globe
  if (!globeApi) {
    globeApi = initGlobe({
      el: document.getElementById('globe-el'),
      onPolygonHover: p => {
        // Hide hover card when on empty land
        if (!p || countryFill(p.properties.name) === BASE_FILL) {
          if (!hoverTarget) document.getElementById('hp-hover').classList.remove('visible');
          return;
        }
      },
      onPolygonClick: p => {
        // Click a country -> open first offering in that country
        const offs = offerings.filter(o => o.country === p.properties.name && state.cats.has(o.category));
        if (offs.length) onHotspotClick(offs[0]);
      },
    });
  }

  refreshGlobe();
  mounted = true;
}

export function unmount() {
  closePanel();
  const card = document.getElementById('hp-hover');
  if (card) card.classList.remove('visible');
}
