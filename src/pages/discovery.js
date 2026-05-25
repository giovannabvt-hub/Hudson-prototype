// FolkAble — Discovery page
// Globe with labelled dots. Hover = info window. Click = detail sidebar.
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
  </div>

  <div class="legend">
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#8B6842"/></svg> Event</div>
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#5C3A1E"/></svg> Gathering</div>
    <div class="leg-sep"></div>
    <span class="leg-hint">hover for info -- click for full details</span>
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
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${(1-t)})`;
    },
    ringMaxRadius: 2.6,
    ringPropagationSpeed: 2.4,
    ringRepeatPeriod: 1600,
    pointColor: d => catColors[d.category] || '#8B6842',
    pointRadius: 0.32,
  });

  globeApi.setLabels({
    data,
    onLabelClick: d => openDetail(d),
  });
}

/* ── OPEN DETAIL SIDEBAR when clicking a dot ─────────────── */

function openDetail(d) {
  const artist = artists.find(a => a.id === d.artist);
  const companyId = companyMap[d.company];
  const company = companyId ? companies.find(c => c.id === companyId) : null;
  const catLabel = d.category === 'event' ? 'Event' : 'Gathering';

  // Also show other offerings in same country
  const related = offerings.filter(o => o.country === d.country && o.title !== d.title && state.cats.has(o.category));

  const dpTitle = document.getElementById('dp-title');
  const dpSub = document.getElementById('dp-sub');
  const dpBody = document.getElementById('dp-body');
  const dpAudio = document.getElementById('dp-audio');

  dpTitle.textContent = d.title;
  dpSub.textContent = `${catLabel} -- ${d.country}`;

  dpBody.innerHTML = `
    <div class="dp-offering">
      <div class="dp-o-cat dp-cat-${d.category}">${catLabel}</div>
      <div class="dp-o-meta">${d.member}</div>
      <div class="dp-o-meta">${d.date} -- ${d.price}</div>
      <p class="dp-o-desc">${d.desc}</p>

      ${artist ? `
        <div class="dp-link-card" id="dp-go-artist" data-aid="${artist.id}">
          <div class="dp-link-label">Artist</div>
          <div class="dp-link-name">${artist.name}</div>
          <div class="dp-link-detail">${artist.instrument} -- ${artist.country}</div>
          <span class="dp-link-arrow">View Artist ></span>
        </div>
      ` : ''}

      ${company ? `
        <div class="dp-link-card" id="dp-go-company" data-cid="${company.id}">
          <div class="dp-link-label">Label</div>
          <div class="dp-link-name">${company.name}</div>
          <div class="dp-link-detail">${company.location}</div>
          <span class="dp-link-arrow">View Label ></span>
        </div>
      ` : ''}
    </div>

    ${related.length ? `
      <div class="dp-related-section">
        <div class="dp-related-heading">Also in ${d.country}</div>
        ${related.map(r => {
          const rArtist = artists.find(a => a.id === r.artist);
          const rCatClass = r.category === 'event' ? 'dp-cat-event' : 'dp-cat-gathering';
          return `
            <div class="dp-related-item" data-rid="${r.id}">
              <div class="dp-related-bar ${rCatClass}"></div>
              <div class="dp-related-body">
                <div class="dp-related-type ${rCatClass}">${r.category}</div>
                <div class="dp-related-title">${r.title}</div>
                <div class="dp-related-meta">${r.date} -- ${r.price}${rArtist ? ' -- ' + rArtist.name : ''}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : ''}
  `;

  // Bind artist link
  const artistBtn = dpBody.querySelector('#dp-go-artist');
  if (artistBtn) {
    artistBtn.addEventListener('click', () => {
      document.getElementById('detail-panel').classList.remove('open');
      window.__folkable_artist = artistBtn.dataset.aid;
      go('artists');
    });
  }

  // Bind company link
  const companyBtn = dpBody.querySelector('#dp-go-company');
  if (companyBtn) {
    companyBtn.addEventListener('click', () => {
      document.getElementById('detail-panel').classList.remove('open');
      window.__folkable_company = companyBtn.dataset.cid;
      go('companies');
    });
  }

  // Bind related items
  dpBody.querySelectorAll('.dp-related-item').forEach(el => {
    el.addEventListener('click', () => {
      const r = offerings.find(o => o.id === parseInt(el.dataset.rid));
      if (r) openDetail(r);
    });
  });

  // Audio
  if (motifs[d.country]) {
    dpAudio.style.display = 'block';
    resetWave();
    setTimeout(() => startWave(document.getElementById('wave-canvas')), 40);
    document.getElementById('play-btn').onclick = () => playMotif(d.country);
  } else {
    dpAudio.style.display = 'none';
  }

  document.getElementById('detail-panel').classList.add('open');
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

  // Detail panel close
  document.getElementById('dp-close').addEventListener('click', () => {
    document.getElementById('detail-panel').classList.remove('open');
  });

  // ESC to close detail
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.getElementById('detail-panel').classList.remove('open');
  });

  // Tooltip follows cursor
  const tip = document.getElementById('tip');
  document.body.addEventListener('mousemove', e => {
    let nx = e.clientX + 14, ny = e.clientY + 14;
    if (nx + 280 > window.innerWidth)  nx = e.clientX - 280;
    if (ny + 80  > window.innerHeight) ny = e.clientY - 80;
    tip.style.left = nx + 'px';
    tip.style.top = ny + 'px';
  });

  // Init globe
  if (!globeApi) {
    globeApi = initGlobe({
      el: document.getElementById('globe-el'),
      onPolygonHover: p => {
        if (!p) { tip.style.opacity = '0'; return; }
        const n = p.properties.name;
        if (countryFill(n) === BASE_FILL) { tip.style.opacity = '0'; return; }
        const evts = offerings.filter(o => o.country === n && o.category === 'event' && state.cats.has('event')).length;
        const gths = offerings.filter(o => o.country === n && o.category === 'gathering' && state.cats.has('gathering')).length;
        let details = [];
        if (evts) details.push(`${evts} event${evts!==1?'s':''}`);
        if (gths) details.push(`${gths} gathering${gths!==1?'s':''}`);
        tip.innerHTML = `<strong style="font-family:'Playfair Display',serif;">${n}</strong><br><span style="font-size:11.5px;color:rgba(232,220,200,0.58);">${details.join(', ')}</span>`;
        tip.style.opacity = '1';
      },
      onPolygonClick: p => {
        const offs = offerings.filter(o => o.country === p.properties.name && state.cats.has(o.category));
        if (offs.length) openDetail(offs[0]);
      },
      onPointHover: p => {
        if (!p) { tip.style.opacity = '0'; return; }
        const catLabel = p.category === 'event' ? 'Event' : 'Gathering';
        const artist = artists.find(a => a.id === p.artist);
        tip.innerHTML = `
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:${catColors[p.category]};margin-bottom:4px;">${catLabel}</div>
          <strong style="font-family:'Playfair Display',serif;font-size:14px;line-height:1.3;display:block;">${p.title}</strong>
          <span style="font-size:12px;color:rgba(232,220,200,0.7);display:block;margin-top:3px;">${p.member} -- ${p.country}</span>
          <span style="font-size:11px;color:rgba(232,220,200,0.5);display:block;margin-top:2px;">${p.date} -- ${p.price}</span>
          <span style="font-size:11.5px;color:rgba(232,220,200,0.42);display:block;margin-top:4px;line-height:1.4;">${p.desc}</span>
          ${artist ? `<span style="font-size:11px;color:${catColors[p.category]};display:block;margin-top:5px;">by ${artist.name}</span>` : ''}
          <span style="font-size:9px;color:rgba(232,220,200,0.25);display:block;margin-top:6px;text-transform:uppercase;letter-spacing:0.1em;">click for details</span>
        `;
        tip.style.opacity = '1';
      },
      onPointClick: d => openDetail(d),
    });
  }
  refreshGlobe();
  mounted = true;
}

export function unmount() {
  document.getElementById('detail-panel').classList.remove('open');
  document.getElementById('tip').style.opacity = '0';
}
