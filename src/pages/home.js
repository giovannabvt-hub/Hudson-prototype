import { offerings, catColors, companies, companyMap, artists, threads, motifs } from '../data/index.js';
import { init as initGlobe } from '../lib/globe.js';
import { playMotif, startWave, resetWave } from '../lib/audio.js';
import { hexToRgba } from '../lib/utils.js';

const state = {
  mode: 'discovery',
  cats: new Set(['event','community','record','product']),
  folkCats: new Set(['event','community','record','product']),
  selectedCompanies: new Set(),
  selectedArtist: null,
  rotate: true,
};

let globeApi = null;
let expandedThread = null;
let mounted = false;

const TEMPLATE = `
  <div class="ctrl-bar">
    <button class="mode-btn active" data-mode="discovery"><span class="mode-dot" style="background:rgba(250,199,117,0.55);"></span>Discovery</button>
    <button class="mode-btn" data-mode="visitor"><span class="mode-dot" style="background:#1D9E75;"></span>Visitor</button>
    <button class="mode-btn" data-mode="company"><span class="mode-dot" style="background:#EF9F27;"></span>Company</button>
    <button class="mode-btn" data-mode="artist"><span class="mode-dot" style="background:#7F77DD;"></span>Artist</button>
    <button class="mode-btn" data-mode="folk"><span class="mode-dot" style="background:#0F9488;"></span>Folk Community</button>

    <div class="ctrl-sep"></div>

    <div id="visitor-chips">
      <span class="chip on" data-cat="event"><span class="chip-dot" style="background:#1D9E75;"></span>Events</span>
      <span class="chip on" data-cat="community"><span class="chip-dot" style="background:#EF9F27;"></span>Gatherings</span>
      <span class="chip on" data-cat="record"><span class="chip-dot" style="background:#7F77DD;"></span>Records</span>
      <span class="chip on" data-cat="product"><span class="chip-dot" style="background:#D85A30;"></span>Products</span>
    </div>
    <div id="company-chips"></div>
    <div id="folk-chips">
      <span class="chip on" data-fcat="event"><span class="chip-dot" style="background:#1D9E75;"></span>Events</span>
      <span class="chip on" data-fcat="community"><span class="chip-dot" style="background:#EF9F27;"></span>Gatherings</span>
      <span class="chip on" data-fcat="record"><span class="chip-dot" style="background:#7F77DD;"></span>Records</span>
      <span class="chip on" data-fcat="product"><span class="chip-dot" style="background:#D85A30;"></span>Products</span>
    </div>

    <div class="ctrl-spacer"></div>
    <button class="rotate-btn on" id="rotate-btn">⟳ Auto-rotate</button>
  </div>

  <div class="globe-wrap">
    <div id="globe-el"></div>
  </div>

  <div class="legend">
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#1D9E75"/></svg> Event</div>
    <div class="leg-item"><svg width="10" height="10"><polygon points="5,0 10,5 5,10 0,5" fill="#EF9F27"/></svg> Gathering</div>
    <div class="leg-item"><svg width="10" height="10"><rect x="1" y="1" width="8" height="8" fill="#7F77DD"/></svg> Record</div>
    <div class="leg-item"><svg width="10" height="10"><polygon points="5,1 9,9 1,9" fill="#D85A30"/></svg> Product</div>
    <div class="leg-sep"></div>
    <span class="leg-hint">drag · scroll · click a marker</span>
  </div>
`;

const BASE_FILL    = 'rgba(96,68,42,0.40)';
const VISITOR_RAMP = ['rgba(250,199,117,0.42)','rgba(239,159,39,0.62)','rgba(216,90,48,0.78)','rgba(186,117,23,0.90)'];
const FOLK_RAMP    = ['rgba(15,148,136,0.35)','rgba(15,148,136,0.52)','rgba(20,184,166,0.68)','rgba(94,234,212,0.82)'];

function countryFill(name) {
  if (state.mode === 'discovery') return BASE_FILL;
  if (state.mode === 'visitor') {
    const n = offerings.filter(o => o.country === name && state.cats.has(o.category)).length;
    return n ? VISITOR_RAMP[Math.min(n, VISITOR_RAMP.length) - 1] : BASE_FILL;
  }
  if (state.mode === 'company') {
    if (!state.selectedCompanies.size) return BASE_FILL;
    const matched = companies.filter(c => state.selectedCompanies.has(c.id) && offerings.some(o => o.country === name && companyMap[o.company] === c.id));
    return matched.length ? hexToRgba(matched[0].color, 0.70) : BASE_FILL;
  }
  if (state.mode === 'artist') {
    if (!state.selectedArtist) return BASE_FILL;
    const a = artists.find(x => x.id === state.selectedArtist);
    return (a && a.countries.includes(name)) ? 'rgba(250,199,117,0.72)' : BASE_FILL;
  }
  if (state.mode === 'folk') {
    const n = threads.filter(t => t.country === name && state.folkCats.has(t.cat)).length;
    return n ? FOLK_RAMP[Math.min(n, FOLK_RAMP.length) - 1] : BASE_FILL;
  }
  return BASE_FILL;
}

function visibleOfferings() {
  if (state.mode === 'discovery') return offerings;
  if (state.mode === 'visitor')   return offerings.filter(o => state.cats.has(o.category));
  if (state.mode === 'company')   return state.selectedCompanies.size ? offerings.filter(o => state.selectedCompanies.has(companyMap[o.company])) : [];
  if (state.mode === 'artist')    return state.selectedArtist ? offerings.filter(o => o.artist === state.selectedArtist) : [];
  if (state.mode === 'folk') return threads.filter(t => state.folkCats.has(t.cat)).map(t => {
    const o = offerings.find(o => o.country === t.country);
    return { lat: o?.lat ?? 0, lng: o?.lng ?? 0, category: t.cat, title: t.title, member: t.author, country: t.country };
  });
  return [];
}

function markerColor(d) {
  if (state.mode === 'company') {
    const c = companies.find(x => x.id === companyMap[d.company]);
    return c ? c.color : '#FAC775';
  }
  return catColors[d.category];
}

function refreshGlobe() {
  if (!globeApi) return;
  globeApi.setCapColor(countryFill);
  const data = visibleOfferings();
  const isFolk = state.mode === 'folk';
  const alpha = state.mode === 'discovery' ? 0.28 : 1;

  globeApi.setMarkers({
    data,
    ringColor: d => t => {
      const base = isFolk ? catColors[d.category] : markerColor(d);
      const hex = base.startsWith('#') ? base : '#FAC775';
      const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${(1-t)*alpha})`;
    },
    ringMaxRadius: isFolk ? 3.2 : 2.6,
    ringPropagationSpeed: isFolk ? 2.0 : 2.4,
    ringRepeatPeriod: isFolk ? 2200 : 1600,
    pointColor: d => {
      const base = markerColor(d);
      if (state.mode === 'discovery') {
        const r=parseInt(base.slice(1,3),16), g=parseInt(base.slice(3,5),16), b=parseInt(base.slice(5,7),16);
        return `rgba(${r},${g},${b},0.45)`;
      }
      if (state.mode === 'folk') return '#5EEAD4';
      return base;
    },
    pointRadius: state.mode === 'discovery' ? 0.18 : 0.22,
  });
}

// ── DETAIL PANEL (country / artist) ──────────────────────────────────────
function showCountryDetail(name) {
  const offs = offerings.filter(o => {
    if (o.country !== name) return false;
    if (state.mode === 'visitor') return state.cats.has(o.category);
    if (state.mode === 'company') return state.selectedCompanies.has(companyMap[o.company]);
    if (state.mode === 'artist') return state.selectedArtist && o.artist === state.selectedArtist;
    return true;
  });
  const dpTitle = document.getElementById('dp-title');
  const dpSub = document.getElementById('dp-sub');
  const dpBody = document.getElementById('dp-body');
  const dpAudio = document.getElementById('dp-audio');
  dpTitle.textContent = name;
  dpSub.textContent = `${offs.length} offering${offs.length !== 1 ? 's' : ''}`;
  if (!offs.length) {
    dpBody.innerHTML = `<div style="font-family:'Cormorant Garamond',serif;font-size:14px;color:rgba(250,238,218,0.42);margin-top:10px;font-style:italic;">No active offerings in this region.</div>`;
    dpAudio.style.display = 'none';
  } else {
    dpBody.innerHTML = offs.map(o => `
      <div class="offering-card">
        <div class="o-bar" style="background:${catColors[o.category]};"></div>
        <div style="flex:1;min-width:0;">
          <div class="o-title">${o.title}</div>
          <div class="o-meta">${o.member} · ${o.category} · ${o.date} · ${o.price}</div>
          <div class="o-desc">${o.desc}</div>
        </div>
      </div>
    `).join('');
    if (motifs[name]) {
      dpAudio.style.display = 'block';
      resetWave();
      setTimeout(() => startWave(document.getElementById('wave-canvas')), 40);
      document.getElementById('play-btn').onclick = () => playMotif(name);
    } else dpAudio.style.display = 'none';
  }
  document.getElementById('detail-panel').classList.add('open');
}

function showArtistProfile(a) {
  const artistOffs = offerings.filter(o => o.artist === a.id);
  document.getElementById('dp-title').textContent = a.name;
  document.getElementById('dp-sub').textContent = `${a.instrument} · ${a.country}`;
  document.getElementById('dp-body').innerHTML = `
    <div class="artist-hero">
      <div class="artist-avatar-lg">${a.emoji}</div>
      <div><div class="artist-name">${a.name}</div><div class="artist-meta">${a.instrument}</div><div class="artist-meta">${a.country} · Age ${a.age}</div></div>
    </div>
    <div class="artist-bio">${a.history}</div>
    <div class="section-lbl">Active Regions</div>
    <div>${a.countries.map(r => `<span class="region-tag">${r}</span>`).join('')}</div>
    <div class="section-lbl">Products & Releases</div>
    ${a.products.map(p => `<div class="product-row">— ${p}</div>`).join('')}
    <div class="section-lbl">Offerings (${artistOffs.length})</div>
    ${artistOffs.map(o => `
      <div class="offering-card">
        <div class="o-bar" style="background:${catColors[o.category]};"></div>
        <div style="flex:1;min-width:0;">
          <div class="o-title">${o.title}</div>
          <div class="o-meta">${o.country} · ${o.date} · ${o.price}</div>
        </div>
      </div>
    `).join('')}
  `;
  document.getElementById('dp-audio').style.display = 'none';
  document.getElementById('detail-panel').classList.add('open');
}

function selectCountry(name) {
  if (state.mode === 'folk') {
    const match = threads.find(t => t.country === name && state.folkCats.has(t.cat));
    if (match) { expandedThread = match.id; renderThreads(); }
    return;
  }
  if (state.mode === 'artist' && state.selectedArtist) {
    showArtistProfile(artists.find(x => x.id === state.selectedArtist));
    return;
  }
  showCountryDetail(name);
}

// ── FOLK PANEL ───────────────────────────────────────────────────────────
const catLabel = { event:'Event', community:'Gathering', record:'Record', product:'Product' };
function catBadgeStyle(cat) {
  const m = { event:'background:rgba(29,158,117,0.18);color:#1D9E75;', community:'background:rgba(239,159,39,0.18);color:#EF9F27;', record:'background:rgba(127,119,221,0.18);color:#7F77DD;', product:'background:rgba(216,90,48,0.18);color:#D85A30;' };
  return m[cat] || '';
}

function renderThreads() {
  const fpBody = document.getElementById('fp-body');
  const visible = threads.filter(t => state.folkCats.has(t.cat));
  if (!visible.length) {
    fpBody.innerHTML = `<div style="font-family:'Cormorant Garamond',serif;font-size:14px;color:rgba(94,234,212,0.35);padding:20px 18px;font-style:italic;">No discussions match the current filter.</div>`;
    return;
  }
  fpBody.innerHTML = '';
  visible.forEach(t => {
    const isExp = expandedThread === t.id;
    const card = document.createElement('div');
    card.className = `thread-card${isExp ? ' expanded' : ''}`;
    card.innerHTML = `
      <div class="thread-head">
        <div class="thread-avatar">${t.emoji}</div>
        <div class="thread-meta">
          <div class="thread-title">${t.title}</div>
          <div class="thread-info">
            <span class="thread-badge" style="${catBadgeStyle(t.cat)}">${catLabel[t.cat]}</span>
            <span class="thread-country">${t.country}</span>
            <span class="thread-stats">${t.members} members · ${t.active} ago</span>
          </div>
        </div>
        <div class="thread-chevron">▶</div>
      </div>
      <div class="thread-messages">
        ${t.posts.map(p => `<div class="msg"><div class="msg-author">${p.a}</div><div class="msg-text">${p.t}</div></div>`).join('')}
        <div class="thread-reply">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="rgba(94,234,212,0.55)" stroke-width="1.2" stroke-linecap="round"/></svg>
          Reply to this thread
        </div>
      </div>
    `;
    card.querySelector('.thread-head').addEventListener('click', () => {
      expandedThread = isExp ? null : t.id;
      renderThreads();
    });
    fpBody.appendChild(card);
  });
}

function syncFolkChips() {
  document.querySelectorAll('#folk-chips .chip').forEach(chip => chip.classList.toggle('on', state.folkCats.has(chip.dataset.fcat)));
  document.querySelectorAll('#fp-filter-row .fp-chip').forEach(chip => chip.classList.toggle('on', state.folkCats.has(chip.dataset.fcat)));
}

// ── MODE SWITCHING ───────────────────────────────────────────────────────
function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('visitor-chips').classList.toggle('show', mode === 'visitor');
  document.getElementById('company-chips').classList.toggle('show', mode === 'company');
  document.getElementById('folk-chips').classList.toggle('show', mode === 'folk');
  document.getElementById('artist-panel').classList.toggle('open', mode === 'artist');
  document.getElementById('folk-panel').classList.toggle('open', mode === 'folk');
  if (mode !== 'artist') {
    state.selectedArtist = null;
    document.querySelectorAll('.artist-item').forEach(el => el.classList.remove('active'));
    if (mode !== 'folk') document.getElementById('detail-panel').classList.remove('open');
  }
  if (mode !== 'company') {
    state.selectedCompanies.clear();
    document.querySelectorAll('#company-chips .chip').forEach(c => c.classList.remove('on'));
  }
  if (mode === 'folk') {
    renderThreads();
    document.getElementById('detail-panel').classList.remove('open');
  }
  refreshGlobe();
}

// ── MOUNT / UNMOUNT ──────────────────────────────────────────────────────
export function mount(root) {
  if (mounted) return;
  root.innerHTML = TEMPLATE;

  // Build dynamic chips on first mount only
  if (!mounted) {
    const companyChipsEl = document.getElementById('company-chips');
    companies.forEach(c => {
      const span = document.createElement('span');
      span.className = 'chip'; span.dataset.cid = c.id;
      span.innerHTML = `<span class="chip-dot" style="background:${c.color};"></span>${c.name}`;
      span.addEventListener('click', () => {
        if (state.selectedCompanies.has(c.id)) state.selectedCompanies.delete(c.id);
        else state.selectedCompanies.add(c.id);
        span.classList.toggle('on', state.selectedCompanies.has(c.id));
        refreshGlobe();
      });
      companyChipsEl.appendChild(span);
    });

    const artistListEl = document.getElementById('artist-list');
    artists.forEach(a => {
      const div = document.createElement('div');
      div.className = 'artist-item'; div.dataset.aid = a.id;
      div.innerHTML = `<div class="artist-thumb">${a.emoji}</div><div><div class="artist-item-name">${a.name}</div><div class="artist-item-inst">${a.instrument}</div></div>`;
      div.addEventListener('click', () => {
        if (state.selectedArtist === a.id) {
          state.selectedArtist = null; div.classList.remove('active');
          document.getElementById('detail-panel').classList.remove('open');
        } else {
          document.querySelectorAll('.artist-item').forEach(el => el.classList.remove('active'));
          state.selectedArtist = a.id; div.classList.add('active');
          showArtistProfile(a);
        }
        refreshGlobe();
      });
      artistListEl.appendChild(div);
    });

    // folk panel chips & close
    document.querySelectorAll('#fp-filter-row .fp-chip').forEach(chip => chip.addEventListener('click', () => {
      const cat = chip.dataset.fcat;
      if (state.folkCats.has(cat)) state.folkCats.delete(cat); else state.folkCats.add(cat);
      syncFolkChips(); refreshGlobe(); renderThreads();
    }));
    document.getElementById('fp-close').addEventListener('click', () => setMode('discovery'));

    // detail panel close
    document.getElementById('dp-close').addEventListener('click', () => document.getElementById('detail-panel').classList.remove('open'));

    // tooltip mouse follow
    document.body.addEventListener('mousemove', e => {
      if (state.mode === 'discovery' && !document.querySelector('.globe-wrap:hover')) return;
      const tip = document.getElementById('tip');
      let nx = e.clientX + 14, ny = e.clientY + 14;
      if (nx + 260 > window.innerWidth)  nx = e.clientX - 260;
      if (ny + 60  > window.innerHeight) ny = e.clientY - 60;
      tip.style.left = nx + 'px';
      tip.style.top  = ny + 'px';
    });

    mounted = true;
  }

  // Re-bind events on each mount (innerHTML rebuilds nodes)
  document.querySelectorAll('.mode-btn').forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
  document.querySelectorAll('#visitor-chips .chip').forEach(chip => chip.addEventListener('click', () => {
    const cat = chip.dataset.cat;
    if (state.cats.has(cat)) state.cats.delete(cat); else state.cats.add(cat);
    chip.classList.toggle('on', state.cats.has(cat));
    refreshGlobe();
  }));
  document.querySelectorAll('#folk-chips .chip').forEach(chip => chip.addEventListener('click', () => {
    const cat = chip.dataset.fcat;
    if (state.folkCats.has(cat)) state.folkCats.delete(cat); else state.folkCats.add(cat);
    syncFolkChips(); refreshGlobe(); renderThreads();
  }));
  document.getElementById('rotate-btn').addEventListener('click', function() {
    state.rotate = !state.rotate;
    this.classList.toggle('on', state.rotate);
    if (globeApi) globeApi.setRotate(state.rotate);
  });

  // Initialise globe (only first time — globe.gl owns its DOM)
  const tip = document.getElementById('tip');
  if (!globeApi) {
    globeApi = initGlobe({
      el: document.getElementById('globe-el'),
      onPolygonHover: p => {
        if (!p) { tip.style.opacity = '0'; return; }
        const n = p.properties.name;
        if (countryFill(n) === BASE_FILL) { tip.style.opacity = '0'; return; }
        const cnt = state.mode === 'folk'
          ? threads.filter(t => t.country === n && state.folkCats.has(t.cat)).length
          : offerings.filter(o => o.country === n).length;
        const label = state.mode === 'folk' ? `${cnt} discussion${cnt!==1?'s':''}` : `${cnt} offering${cnt!==1?'s':''}`;
        tip.innerHTML = `<strong style="font-family:'Playfair Display',serif;font-size:13px;">${n}</strong><br><span style="font-size:11.5px;color:rgba(250,238,218,0.58);">${label}</span>`;
        tip.style.opacity = '1';
      },
      onPolygonClick: p => selectCountry(p.properties.name),
      onPointHover: p => {
        if (!p) { tip.style.opacity = '0'; return; }
        tip.innerHTML = `<strong style="font-family:'Playfair Display',serif;font-size:13px;">${p.title}</strong><br><span style="font-size:11.5px;color:rgba(250,238,218,0.58);">${p.member} · ${p.country}</span>`;
        tip.style.opacity = '1';
      },
      onPointClick: d => selectCountry(d.country),
    });
  }
  refreshGlobe();
}

export function unmount() {
  // hide overlays when leaving home
  document.getElementById('detail-panel').classList.remove('open');
  document.getElementById('folk-panel').classList.remove('open');
  document.getElementById('artist-panel').classList.remove('open');
  document.getElementById('tip').style.opacity = '0';
}
