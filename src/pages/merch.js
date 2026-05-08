import { merch } from '../data/index.js';
import { shadeColor, statusLabel } from '../lib/utils.js';

const state = { mFilter: 'all' };

const TEMPLATE = `
  <div class="page-scroll">
    <div class="page-hero">
      <div class="hero-eyebrow">Member Shop · Worldwide Shipping</div>
      <h1 class="hero-title">Merch<br><em>made by members</em></h1>
      <p class="hero-sub">Hand-built instruments, books, prints, apparel, and rare folk objects — sold directly by Hudson members. Every purchase funds the maker and a slice goes to the collective treasury.</p>
      <div class="hero-meta">
        <span><strong>12</strong> &nbsp; products</span>
        <span><strong>9</strong> &nbsp; makers</span>
        <span><strong>5%</strong> &nbsp; treasury share</span>
      </div>
    </div>
    <div class="filter-row">
      <span class="filter-label">Type</span>
      <button class="filter-pill on" data-mfilter="all">All</button>
      <button class="filter-pill" data-mfilter="instrument">Instruments</button>
      <button class="filter-pill" data-mfilter="book">Books</button>
      <button class="filter-pill" data-mfilter="apparel">Apparel</button>
      <button class="filter-pill" data-mfilter="print">Prints</button>
      <button class="filter-pill" data-mfilter="accessory">Accessories</button>
    </div>
    <div class="grid" id="merch-grid"></div>
  </div>
`;

function renderGrid() {
  const filtered = merch.filter(m => state.mFilter === 'all' || m.type === state.mFilter);
  document.getElementById('merch-grid').innerHTML = filtered.map(m => `
    <div class="card" data-mid="${m.id}">
      <div class="card-cover" style="background: linear-gradient(145deg, ${m.color}, ${shadeColor(m.color, -40)});">
        <span class="card-status status-${m.status}">${statusLabel(m.status)}</span>
        ${m.emoji}
      </div>
      <div class="card-meta">
        <div class="card-eyebrow">${m.type} · by ${m.maker}</div>
        <div class="card-title">${m.title}</div>
        <div class="card-artist">${m.detail}</div>
        <div class="card-row">
          <span>${statusLabel(m.status)}</span>
          <span class="card-price">${m.price}</span>
        </div>
      </div>
    </div>
  `).join('');
}

export function mount(root) {
  root.innerHTML = `<section class="page active" id="page-merch">${TEMPLATE}</section>`;
  root.querySelectorAll('[data-mfilter]').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('[data-mfilter]').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); state.mFilter = b.dataset.mfilter; renderGrid();
  }));
  renderGrid();
}
