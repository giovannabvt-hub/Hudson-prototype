import { tablePosts } from '../data/index.js';

const state = { tTag: 'all' };

const TEMPLATE = `
  <div class="table-wrap">
    <div class="table-hero">
      <div class="table-eyebrow">Member Bulletin Board</div>
      <h1 class="table-title">The White Table<em>—</em></h1>
      <p class="table-sub">A shared canvas where members pin notes — recruiting bandmates, pre-orders, fundraising calls, jobs, collaborations. Bring your own corner of the table; pin a note, see the whole community at a glance.</p>
      <div class="table-toolbar">
        <button class="table-add-btn">+ Pin a new note</button>
        <button class="table-tag-btn on" data-ttag="all">All</button>
        <button class="table-tag-btn" data-ttag="recruiting">Recruiting</button>
        <button class="table-tag-btn" data-ttag="fundraising">Fundraising</button>
        <button class="table-tag-btn" data-ttag="collaboration">Collaboration</button>
        <button class="table-tag-btn" data-ttag="job-offer">Jobs</button>
        <button class="table-tag-btn" data-ttag="for-sale">For Sale</button>
        <button class="table-tag-btn" data-ttag="pre-order">Pre-orders</button>
      </div>
    </div>
    <div class="corkboard" id="corkboard"></div>
  </div>
`;

function renderBoard() {
  const filtered = tablePosts.filter(p => state.tTag === 'all' || p.tag === state.tTag);
  document.getElementById('corkboard').innerHTML = filtered.map(p => `
    <div class="post-it ${p.c}">
      <div class="post-it-pin"></div>
      <div class="pit-author">${p.author}</div>
      <div class="pit-text">${p.text}</div>
      <span class="pit-tag">#${p.tag}</span>
    </div>
  `).join('');
}

export function mount(root) {
  root.innerHTML = `<section class="page active" id="page-table">${TEMPLATE}</section>`;
  root.querySelectorAll('[data-ttag]').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('[data-ttag]').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); state.tTag = b.dataset.ttag; renderBoard();
  }));
  renderBoard();
}
