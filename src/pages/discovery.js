// FolkAble — Discovery page (globe with events & gatherings)
import { offerings, catColors, artists, companies, companyMap, motifs } from '../data/index.js';
import { init as initGlobe } from '../lib/globe.js';
import { playMotif, startWave, resetWave } from '../lib/audio.js';
import { hexToRgba } from '../lib/utils.js';
import { go } from '../lib/router.js';

const state = {
  cats: new Set(['event','gathering']),
  rotate: true,
};

let globeApi = null;
let mounted = false;

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

    <aside class="disc-sidebar open" id="disc-sidebar">
      <div class="disc-sidebar-head">
        <h3 class="disc-sidebar-title">All Offerings</h3>
        <span class="disc-sidebar-count" id="disc-sidebar-count">0</span>
      </div>
      <div class="disc-sidebar-list" id="disc-sidebar-list"></div>
    </aside>
  </div>

  <div class="legend">
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#8B6842"/></svg> Event</div>
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#5C3A1E"/></svg> Gathering</div>
    <div class="leg-sep"></div>
    <span class="leg-hint">drag -- scroll -- click a marker or label</span>
  </div>
`;

const BASE_FILL = 'rgba(15,61,46,0.25)';
const RAMP = ['rgba(92,58,30,0.35)','rgba(139,104,66,0.50)','rgba(139,104,66,0.65)','rgba(184,134,11,0.82)'];

function countryFill(name) {
  const n = offerings.filter(o => o.country === name && state.cats.has(o.category)).length;
  return n ? RAMP[Math.min(n, RAMP.length) - 1] : BASE_FILL;
}

function visibleOfferings() {
  return offerings.filter(o => state.cats.has(o.category));
}

function refreshGlobe() {
  if (!globeApi) return;
  globeApi.setCapColor(countryFill);
  const data = visibleOfferings();

  globeApi.setMarkers({
    data,
    ringColor: d => t => {
      const base = catColors[d.category] || '#8B6842';
      const hex = base.startsWith('#') ? base : '#8B6842';
      const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${(1-t)})`;
    },
    ringMaxRadius: 2.6,
    ringPropagationSpeed: 2.4,
    ringRepeatPeriod: 1600,
    pointColor: d => catColors[d.category] || '#8B6842',
    pointRadius: 0.32,
  });

  // Add text labels on the globe
  globeApi.setLabels({
    data,
    onLabelClick: d => highlightOffering(d),
  });

  // Update sidebar list
  renderSidebar(data);
}

function renderSidebar(data) {
  const list = document.getElementById('disc-sidebar-list');
  const count = document.getElementById('disc-sidebar-count');
  if (!list || !count) return;

  count.textContent = data.length;

  // Group by country
  const grouped = {};
  data.forEach(o => {
    if (!grouped[o.country]) grouped[o.country] = [];
    grouped[o.country].push(o);
  });

  const countries = Object.keys(grouped).sort();

  list.innerHTML = countries.map(country => {
    const items = grouped[country];
    return `
      <div class="disc-country-group" data-country-group="${country}">
        <div class="disc-country-name" data-country="${country}">${country} <span class="disc-country-badge">${items.length}</span></div>
        ${items.map(o => {
          const catClass = o.category === 'event' ? 'disc-cat-event' : 'disc-cat-gathering';
          const artist = artists.find(a => a.id === o.artist);
          return `
            <div class="disc-item" data-offering-title="${o.title}" data-country="${o.country}">
              <div class="disc-item-bar ${catClass}"></div>
              <div class="disc-item-body">
                <div class="disc-item-type ${catClass}">${o.category}</div>
                <div class="disc-item-title">${o.title}</div>
                <div class="disc-item-meta">${o.member} -- ${o.date} -- ${o.price}</div>
                <div class="disc-item-desc">${o.desc}</div>
                ${artist ? `<button class="disc-item-artist" data-artist="${artist.id}">${artist.name} ></button>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }).join('');

  // Bind country group clicks -> highlight all in that country
  list.querySelectorAll('.disc-country-name').forEach(el => {
    el.addEventListener('click', () => highlightCountry(el.dataset.country));
  });

  // Bind item clicks -> highlight that specific item
  list.querySelectorAll('.disc-item').forEach(el => {
    el.addEventListener('click', () => {
      highlightItem(el);
    });
  });

  // Bind artist links
  list.querySelectorAll('.disc-item-artist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.__folkable_artist = btn.dataset.artist;
      go('artists');
    });
  });
}

/* Highlight a specific offering when clicking a dot/label on the globe */
function highlightOffering(d) {
  const list = document.getElementById('disc-sidebar-list');
  if (!list) return;

  // Clear previous highlights
  list.querySelectorAll('.disc-item.active').forEach(el => el.classList.remove('active'));
  list.querySelectorAll('.disc-country-group.active').forEach(el => el.classList.remove('active'));

  // Find the matching item by title
  const item = list.querySelector(`.disc-item[data-offering-title="${d.title}"]`);
  if (item) {
    item.classList.add('active');
    // Also highlight the country group
    const group = item.closest('.disc-country-group');
    if (group) group.classList.add('active');
    // Scroll into view
    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Also show the detail panel for full info
  showCountryDetail(d.country, d.title);
}

/* Highlight all offerings in a country (clicking country name in sidebar) */
function highlightCountry(country) {
  const list = document.getElementById('disc-sidebar-list');
  if (!list) return;

  // Clear previous highlights
  list.querySelectorAll('.disc-item.active').forEach(el => el.classList.remove('active'));
  list.querySelectorAll('.disc-country-group.active').forEach(el => el.classList.remove('active'));

  // Highlight the country group
  const group = list.querySelector(`.disc-country-group[data-country-group="${country}"]`);
  if (group) {
    group.classList.add('active');
    group.querySelectorAll('.disc-item').forEach(el => el.classList.add('active'));
    group.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  showCountryDetail(country);
}

/* Highlight a single item when clicking it in the sidebar */
function highlightItem(el) {
  const list = document.getElementById('disc-sidebar-list');
  if (!list) return;

  // Clear previous highlights
  list.querySelectorAll('.disc-item.active').forEach(el => el.classList.remove('active'));
  list.querySelectorAll('.disc-country-group.active').forEach(el => el.classList.remove('active'));

  el.classList.add('active');
  const group = el.closest('.disc-country-group');
  if (group) group.classList.add('active');

  showCountryDetail(el.dataset.country, el.dataset.offeringTitle);
}

function showCountryDetail(name, focusTitle) {
  const offs = offerings.filter(o => o.country === name && state.cats.has(o.category));
  const dpTitle = document.getElementById('dp-title');
  const dpSub = document.getElementById('dp-sub');
  const dpBody = document.getElementById('dp-body');
  const dpAudio = document.getElementById('dp-audio');
  dpTitle.textContent = name;
  dpSub.textContent = `${offs.length} offering${offs.length !== 1 ? 's' : ''}`;

  if (!offs.length) {
    dpBody.innerHTML = `<div style="font-family:'Cormorant Garamond',serif;font-size:14px;color:rgba(232,220,200,0.42);margin-top:10px;font-style:italic;">No active offerings in this region.</div>`;
    dpAudio.style.display = 'none';
  } else {
    dpBody.innerHTML = offs.map(o => {
      const artist = artists.find(a => a.id === o.artist);
      const catClass = o.category === 'event' ? 'disc-cat-event' : 'disc-cat-gathering';
      const isHighlighted = focusTitle && o.title === focusTitle;
      return `
      <div class="offering-card ${isHighlighted ? 'highlighted' : ''}">
        <div class="o-bar" style="background:${catColors[o.category]};"></div>
        <div style="flex:1;min-width:0;">
          <div class="o-cat-tag ${catClass}">${o.category}</div>
          <div class="o-title">${o.title}</div>
          <div class="o-meta">${o.member} -- ${o.date} -- ${o.price}</div>
          <div class="o-desc">${o.desc}</div>
          ${artist ? `<button class="o-artist-link" data-artist="${artist.id}">${artist.name} ></button>` : ''}
        </div>
      </div>
    `}).join('');

    // Bind artist links
    dpBody.querySelectorAll('.o-artist-link').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.__folkable_artist = btn.dataset.artist;
        go('artists');
      });
    });

    if (motifs[name]) {
      dpAudio.style.display = 'block';
      resetWave();
      setTimeout(() => startWave(document.getElementById('wave-canvas')), 40);
      document.getElementById('play-btn').onclick = () => playMotif(name);
    } else dpAudio.style.display = 'none';
  }
  document.getElementById('detail-panel').classList.add('open');
}

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

  // Detail close
  document.getElementById('dp-close').addEventListener('click', () => {
    document.getElementById('detail-panel').classList.remove('open');
    // Also clear sidebar highlights
    const list = document.getElementById('disc-sidebar-list');
    if (list) {
      list.querySelectorAll('.disc-item.active').forEach(el => el.classList.remove('active'));
      list.querySelectorAll('.disc-country-group.active').forEach(el => el.classList.remove('active'));
    }
  });

  // Tooltip
  document.body.addEventListener('mousemove', e => {
    const tip = document.getElementById('tip');
    let nx = e.clientX + 14, ny = e.clientY + 14;
    if (nx + 260 > window.innerWidth)  nx = e.clientX - 260;
    if (ny + 60  > window.innerHeight) ny = e.clientY - 60;
    tip.style.left = nx + 'px'; tip.style.top = ny + 'px';
  });

  // Init globe
  const tip = document.getElementById('tip');
  if (!globeApi) {
    globeApi = initGlobe({
      el: document.getElementById('globe-el'),
      onPolygonHover: p => {
        if (!p) { tip.style.opacity = '0'; return; }
        const n = p.properties.name;
        if (countryFill(n) === BASE_FILL) { tip.style.opacity = '0'; return; }
        const cnt = offerings.filter(o => o.country === n && state.cats.has(o.category)).length;
        const evts = offerings.filter(o => o.country === n && o.category === 'event' && state.cats.has('event')).length;
        const gths = offerings.filter(o => o.country === n && o.category === 'gathering' && state.cats.has('gathering')).length;
        let details = [];
        if (evts) details.push(`${evts} event${evts!==1?'s':''}`);
        if (gths) details.push(`${gths} gathering${gths!==1?'s':''}`);
        tip.innerHTML = `<strong style="font-family:'Playfair Display',serif;">${n}</strong><br><span style="font-size:11.5px;color:rgba(232,220,200,0.58);">${details.join(', ')}</span>`;
        tip.style.opacity = '1';
      },
      onPolygonClick: p => highlightCountry(p.properties.name),
      onPointHover: p => {
        if (!p) { tip.style.opacity = '0'; return; }
        const catLabel = p.category === 'event' ? 'Event' : 'Gathering';
        tip.innerHTML = `<div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:${catColors[p.category]};margin-bottom:3px;">${catLabel}</div><strong style="font-family:'Playfair Display',serif;">${p.title}</strong><br><span style="font-size:11.5px;color:rgba(232,220,200,0.58);">${p.member} -- ${p.country}</span><br><span style="font-size:11px;color:rgba(232,220,200,0.42);">${p.date} -- ${p.price}</span>`;
        tip.style.opacity = '1';
      },
      onPointClick: d => highlightOffering(d),
    });
  }
  refreshGlobe();
  mounted = true;
}

export function unmount() {
  document.getElementById('detail-panel').classList.remove('open');
  document.getElementById('tip').style.opacity = '0';
}
