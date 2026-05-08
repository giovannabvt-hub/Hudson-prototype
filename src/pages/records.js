import { records } from '../data/index.js';
import { shadeColor, statusLabel } from '../lib/utils.js';

const state = { rFilter: 'all', rFormat: 'all' };

const TEMPLATE = `
  <div class="page-scroll">
    <div class="page-hero">
      <div class="hero-eyebrow">Catalogue · 2024–2026</div>
      <h1 class="hero-title">Records<br><em>past · present · future</em></h1>
      <p class="hero-sub">Every release from the Hudson Records family — vinyl, cassette, and digital. Past pressings, current drops, and upcoming albums voted in by the membership.</p>
      <div class="hero-meta">
        <span><strong>14</strong> &nbsp; releases</span>
        <span><strong>7</strong> &nbsp; labels</span>
        <span><strong>6</strong> &nbsp; artists</span>
        <span><strong>3</strong> &nbsp; awaiting vote</span>
      </div>
    </div>
    <div class="filter-row">
      <span class="filter-label">Filter</span>
      <button class="filter-pill on" data-rfilter="all">All</button>
      <button class="filter-pill" data-rfilter="released">Released</button>
      <button class="filter-pill" data-rfilter="preorder">Pre-order</button>
      <button class="filter-pill" data-rfilter="upcoming">Upcoming</button>
      <span class="filter-label" style="margin-left:24px;">Format</span>
      <button class="filter-pill on" data-rformat="all">All</button>
      <button class="filter-pill" data-rformat="vinyl">Vinyl</button>
      <button class="filter-pill" data-rformat="cassette">Cassette</button>
      <button class="filter-pill" data-rformat="digital">Digital</button>
    </div>
    <div class="grid" id="records-grid"></div>
  </div>
`;

function renderGrid() {
  const filtered = records.filter(r =>
    (state.rFilter === 'all' || r.status === state.rFilter) &&
    (state.rFormat === 'all' || r.format === state.rFormat)
  );
  const html = filtered.map(r => `
    <div class="card" data-rid="${r.id}">
      <div class="card-cover" style="background: linear-gradient(145deg, ${r.color}, ${shadeColor(r.color, -40)});">
        <span class="card-status status-${r.status}">${statusLabel(r.status)}</span>
        ${r.emoji}
      </div>
      <div class="card-meta">
        <div class="card-eyebrow">${r.label} · ${r.year} · ${r.format}</div>
        <div class="card-title">${r.title}</div>
        <div class="card-artist">${r.artist}</div>
        <div class="card-row">
          <span>${r.edition}</span>
          <span class="card-price">${r.price}</span>
        </div>
      </div>
    </div>
  `).join('');
  document.getElementById('records-grid').innerHTML = html ||
    `<div style="font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--cream-faint);font-style:italic;grid-column:1/-1;text-align:center;padding:40px;">No releases match this filter.</div>`;
}

export function mount(root) {
  root.innerHTML = `<section class="page active" id="page-records">${TEMPLATE}</section>`;

  root.querySelectorAll('[data-rfilter]').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('[data-rfilter]').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); state.rFilter = b.dataset.rfilter; renderGrid();
  }));
  root.querySelectorAll('[data-rformat]').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('[data-rformat]').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); state.rFormat = b.dataset.rformat; renderGrid();
  }));

  renderGrid();
}
