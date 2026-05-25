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

    <aside class="disc-sidebar" id="disc-sidebar">
      <div class="disc-sidebar-head">
        <h3 class="disc-sidebar-title" id="disc-sidebar-title">Offering Details</h3>
        <button class="disc-sidebar-close" id="disc-sidebar-close">&times;</button>
      </div>
      <div class="disc-sidebar-list" id="disc-sidebar-list"></div>
    </aside>
  </div>

  <div class="legend">
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#8B6842"/></svg> Event</div>
    <div class="leg-item"><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="#5C3A1E"/></svg> Gathering</div>
    <div class="leg-sep"></div>
    <span class="leg-hint">hover to preview -- click a dot for full details</span>
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
    ringMaxRadius: 3,
    ringPropagationSpeed: 2.4,
    ringRepeatPeriod: 1600,
    pointColor: d => catColors[d.category] || '#8B6842',
    pointRadius: 0.7,
    onPointHover: showOfferingTooltip,
    onPointClick: d => { if (d) openOfferingSidebar(d); },
  });

  globeApi.setLabels({
    data,
    onLabelClick: d => { if (d) openOfferingSidebar(d); },
    onLabelHover: showOfferingTooltip,
  });
}

/* Show tooltip for an offering (used by point hover AND label hover) */
function showOfferingTooltip(d) {
  const tip = document.getElementById('tip');
  if (!d) { tip.style.opacity = '0'; return; }
  const catLabel = d.category === 'event' ? 'Event' : 'Gathering';
  const artist = artists.find(a => a.id === d.artist);
  const artistName = artist ? artist.name : '';
  tip.innerHTML = `
    <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:${catColors[d.category]};margin-bottom:3px;">${catLabel}</div>
    <strong style="font-family:'Playfair Display',serif;font-size:14px;">${d.title}</strong>
    <br><span style="font-size:11.5px;color:rgba(232,220,200,0.72);">${d.member} -- ${d.country}</span>
    <br><span style="font-size:11px;color:rgba(232,220,200,0.52);">${d.date} -- ${d.price}</span>
    ${d.desc ? `<br><span style="font-size:11px;color:rgba(232,220,200,0.42);line-height:1.4;display:block;margin-top:3px;">${d.desc}</span>` : ''}
    ${artistName ? `<br><span style="font-size:10.5px;color:${catColors[d.category]};margin-top:2px;display:block;">by ${artistName}</span>` : ''}
    <div style="font-size:9px;color:rgba(232,220,200,0.28);margin-top:4px;text-transform:uppercase;letter-spacing:0.1em;">click for details</div>
  `;
  tip.style.opacity = '1';
}

/* Close the sidebar */
function closeSidebar() {
  const sidebar = document.getElementById('disc-sidebar');
  if (sidebar) sidebar.classList.remove('open');
  // Trigger resize so globe reclaims space
  setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
}

/* Open sidebar with a single offering's full details */
function openOfferingSidebar(d) {
  const sidebar = document.getElementById('disc-sidebar');
  const list = document.getElementById('disc-sidebar-list');
  const title = document.getElementById('disc-sidebar-title');
  if (!sidebar || !list) return;

  const o = d;
  const artist = artists.find(a => a.id === o.artist);
  const companyId = companyMap[o.company];
  const company = companies.find(c => c.id === companyId);
  const catClass = o.category === 'event' ? 'disc-cat-event' : 'disc-cat-gathering';
  const catLabel = o.category === 'event' ? 'Event' : 'Gathering';

  title.textContent = o.country;

  // Show ALL offerings in this country, with the clicked one expanded
  const countryOffs = offerings.filter(x => x.country === o.country && state.cats.has(x.category));

  list.innerHTML = countryOffs.map(item => {
    const isActive = item.title === o.title;
    const itemArtist = artists.find(a => a.id === item.artist);
    const itemCompanyId = companyMap[item.company];
    const itemCompany = companies.find(c => c.id === itemCompanyId);
    const itemCatClass = item.category === 'event' ? 'disc-cat-event' : 'disc-cat-gathering';
    const itemCatLabel = item.category === 'event' ? 'Event' : 'Gathering';

    if (isActive) {
      // Expanded card for the clicked offering
      return `
        <div class="disc-detail-card active">
          <div class="disc-detail-cat ${itemCatClass}">${itemCatLabel}</div>
          <h3 class="disc-detail-title">${item.title}</h3>
          <div class="disc-detail-meta">${item.member} -- ${item.date}</div>
          <div class="disc-detail-meta">${item.country} -- ${item.price}</div>
          <p class="disc-detail-desc">${item.desc}</p>
          <div class="disc-detail-links">
            ${itemArtist ? `<button class="disc-detail-link" data-artist="${itemArtist.id}"><span class="disc-link-label">Artist</span> ${itemArtist.name} ></button>` : ''}
            ${itemCompany ? `<button class="disc-detail-link" data-company="${itemCompany.id}"><span class="disc-link-label">Label</span> ${itemCompany.name} ></button>` : ''}
          </div>
        </div>
      `;
    } else {
      // Compact card for other offerings in same country
      return `
        <div class="disc-detail-card compact" data-offering-idx="${item.id}">
          <div class="disc-detail-cat ${itemCatClass}">${itemCatLabel}</div>
          <div class="disc-detail-title-sm">${item.title}</div>
          <div class="disc-detail-meta">${item.member} -- ${item.date} -- ${item.price}</div>
        </div>
      `;
    }
  }).join('');

  // Bind artist links
  list.querySelectorAll('.disc-detail-link[data-artist]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.__folkable_artist = btn.dataset.artist;
      go('artists');
    });
  });

  // Bind company links
  list.querySelectorAll('.disc-detail-link[data-company]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.__folkable_company = btn.dataset.company;
      go('companies');
    });
  });

  // Bind compact cards — clicking expands them
  list.querySelectorAll('.disc-detail-card.compact').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.offeringIdx);
      const clickedOff = offerings.find(x => x.id === idx);
      if (clickedOff) openOfferingSidebar(clickedOff);
    });
  });

  // Open the sidebar
  sidebar.classList.add('open');
  setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
}

/* Open sidebar showing all offerings for a country */
function openCountrySidebar(country) {
  const countryOffs = offerings.filter(x => x.country === country && state.cats.has(x.category));
  if (!countryOffs.length) return;
  // Open with the first offering expanded
  openOfferingSidebar(countryOffs[0]);
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

  // Sidebar close
  document.getElementById('disc-sidebar-close').addEventListener('click', closeSidebar);

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
        const evts = offerings.filter(o => o.country === n && o.category === 'event' && state.cats.has('event')).length;
        const gths = offerings.filter(o => o.country === n && o.category === 'gathering' && state.cats.has('gathering')).length;
        let details = [];
        if (evts) details.push(`${evts} event${evts!==1?'s':''}`);
        if (gths) details.push(`${gths} gathering${gths!==1?'s':''}`);
        tip.innerHTML = `<strong style="font-family:'Playfair Display',serif;">${n}</strong><br><span style="font-size:11.5px;color:rgba(232,220,200,0.58);">${details.join(', ')}</span>`;
        tip.style.opacity = '1';
      },
      onPolygonClick: p => openCountrySidebar(p.properties.name),
    });
  }
  refreshGlobe();
  mounted = true;
}

export function unmount() {
  closeSidebar();
  document.getElementById('tip').style.opacity = '0';
}
