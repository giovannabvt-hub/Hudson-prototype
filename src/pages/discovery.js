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
      <span class="chip on" data-cat="event"><span class="chip-dot" style="background:#c9a84c;"></span>Events</span>
      <span class="chip on" data-cat="gathering"><span class="chip-dot" style="background:#3d6b4f;"></span>Gatherings</span>
    </div>
    <div class="ctrl-spacer"></div>
    <button class="rotate-btn on" id="rotate-btn">&#x27F3; Auto-rotate</button>
  </div>
  <div class="globe-wrap"><div id="globe-el"></div></div>
  <div class="legend">
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#c9a84c"/></svg> Event</div>
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#3d6b4f"/></svg> Gathering</div>
    <div class="leg-sep"></div>
    <span class="leg-hint">drag · scroll · click a marker</span>
  </div>
`;

const BASE_FILL = 'rgba(60,48,30,0.40)';
const RAMP = ['rgba(201,168,76,0.35)','rgba(201,168,76,0.52)','rgba(212,168,67,0.68)','rgba(201,168,76,0.85)'];

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
      const base = catColors[d.category] || '#c9a84c';
      const hex = base.startsWith('#') ? base : '#c9a84c';
      const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${(1-t)})`;
    },
    ringMaxRadius: 2.6,
    ringPropagationSpeed: 2.4,
    ringRepeatPeriod: 1600,
    pointColor: d => catColors[d.category] || '#c9a84c',
    pointRadius: 0.22,
  });
}

function showCountryDetail(name) {
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
      return `
      <div class="offering-card">
        <div class="o-bar" style="background:${catColors[o.category]};"></div>
        <div style="flex:1;min-width:0;">
          <div class="o-title">${o.title}</div>
          <div class="o-meta">${o.member} · ${o.category} · ${o.date} · ${o.price}</div>
          <div class="o-desc">${o.desc}</div>
          ${artist ? `<button class="o-artist-link" data-artist="${artist.id}">${artist.emoji} ${artist.name} &rarr;</button>` : ''}
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
  document.getElementById('dp-close').addEventListener('click', () => document.getElementById('detail-panel').classList.remove('open'));

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
        tip.innerHTML = `<strong style="font-family:'Playfair Display',serif;">${n}</strong><br><span style="font-size:11.5px;color:rgba(232,220,200,0.58);">${cnt} offering${cnt!==1?'s':''}</span>`;
        tip.style.opacity = '1';
      },
      onPolygonClick: p => showCountryDetail(p.properties.name),
      onPointHover: p => {
        if (!p) { tip.style.opacity = '0'; return; }
        tip.innerHTML = `<strong style="font-family:'Playfair Display',serif;">${p.title}</strong><br><span style="font-size:11.5px;color:rgba(232,220,200,0.58);">${p.member} · ${p.country}</span>`;
        tip.style.opacity = '1';
      },
      onPointClick: d => showCountryDetail(d.country),
    });
  }
  refreshGlobe();
  mounted = true;
}

export function unmount() {
  document.getElementById('detail-panel').classList.remove('open');
  document.getElementById('tip').style.opacity = '0';
}
