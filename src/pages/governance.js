import { proposals } from '../data/index.js';

const state = { gTab: 'active', votes: {} };

const TEMPLATE = `
  <div class="page-scroll">
    <div class="gov-hero">
      <div class="hero-eyebrow">Membership Governance · Snapshot v2</div>
      <h1 class="hero-title">Vote<em> together</em></h1>
      <p class="hero-sub">Hudson is run by its members. Treasury, releases, tour funding, onboarding — every meaningful decision passes through this page. One member, one vote. Quorum at 25%, simple majority.</p>
    </div>

    <div class="gov-stats">
      <div><div class="gov-stat-label">Total Members</div><div class="gov-stat-val">412</div></div>
      <div><div class="gov-stat-label">Active Proposals</div><div class="gov-stat-val green">4</div></div>
      <div><div class="gov-stat-label">Treasury</div><div class="gov-stat-val">€ 84,210</div></div>
      <div><div class="gov-stat-label">Your Voting Power</div><div class="gov-stat-val">1.00</div></div>
      <div><div class="gov-stat-label">Quorum Threshold</div><div class="gov-stat-val">103 votes</div></div>
    </div>

    <div class="gov-tabs">
      <button class="gov-tab active" data-gtab="active">Active (4)</button>
      <button class="gov-tab" data-gtab="closed">Closed (3)</button>
      <button class="gov-tab" data-gtab="all">All</button>
    </div>

    <div class="proposals" id="proposals"></div>

    <div class="gov-cta-bar">
      <div class="gov-cta-text">
        <strong>Have a proposal?</strong>
        Anyone with member status can submit a proposal. Drafts go through a 48-hour review window before opening for vote.
      </div>
      <button class="prop-cta">+ New Proposal</button>
    </div>
  </div>
`;

function statusText(s) {
  return s === 'active' ? 'Active' : s === 'passed' ? 'Passed' : s === 'rejected' ? 'Rejected' : 'Closed';
}

function renderProposals() {
  const filtered = proposals.filter(p =>
    state.gTab === 'all' ? true :
    state.gTab === 'active' ? p.status === 'active' :
    p.status !== 'active'
  );

  const html = filtered.map(p => {
    const total = p.options.reduce((s, o) => s + o.votes, 0);
    const userVote = state.votes[p.id];
    const isClosed = p.status !== 'active';
    const optsHtml = p.options.map((o, i) => {
      const pct = total ? (o.votes / total) * 100 : 0;
      const cls = ['prop-option', userVote === i ? 'voted' : '', isClosed ? 'disabled' : '', o.winner ? 'winner' : ''].filter(Boolean).join(' ');
      return `
        <div class="${cls}" data-pid="${p.id}" data-oi="${i}">
          <div class="prop-option-fill" style="width:${pct}%;"></div>
          <div class="prop-option-row">
            <span class="prop-option-name">${o.label}${userVote === i ? ' &nbsp;✓' : ''}${o.winner ? ' &nbsp;★' : ''}</span>
            <span class="prop-option-pct">${pct.toFixed(1)}%</span>
            <span class="prop-option-votes">${o.votes} votes</span>
          </div>
        </div>
      `;
    }).join('');

    const quorumPct = Math.min(100, (total / p.quorum) * 100);
    const quorumMet = total >= p.quorum;

    return `
      <div class="proposal" data-pid="${p.id}">
        <div class="prop-head">
          <div class="prop-head-text">
            <div class="prop-tag-row">
              <span class="prop-status ${p.status}">${statusText(p.status)}</span>
              <span class="prop-cat">${p.cat}</span>
              <span class="prop-id">${p.id}</span>
            </div>
            <div class="prop-title">${p.title}</div>
            <div class="prop-by">Proposed by <strong>${p.by}</strong></div>
          </div>
        </div>
        <div class="prop-body">${p.body}</div>
        <div class="prop-options">${optsHtml}</div>
        <div class="prop-foot">
          <span><strong>${total}</strong> votes</span>
          <span class="quorum-bar">
            Quorum
            <span class="quorum-track"><span class="quorum-fill ${quorumMet ? 'met' : ''}" style="width:${quorumPct}%;"></span></span>
            <strong>${total} / ${p.quorum}</strong>${quorumMet ? ' &nbsp;✓' : ''}
          </span>
          <span>Closes in <strong>${p.closes}</strong></span>
          ${isClosed
            ? `<button class="prop-cta disabled">Vote closed</button>`
            : userVote !== undefined
              ? `<button class="prop-cta">Change vote</button>`
              : `<button class="prop-cta">Cast vote</button>`}
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('proposals').innerHTML = html;

  document.querySelectorAll('.prop-option:not(.disabled)').forEach(opt => {
    opt.addEventListener('click', () => {
      const pid = opt.dataset.pid;
      const oi  = parseInt(opt.dataset.oi, 10);
      const prop = proposals.find(p => p.id === pid);
      if (!prop) return;
      const prev = state.votes[pid];
      if (prev === oi) {
        delete state.votes[pid];
        prop.options[oi].votes = Math.max(0, prop.options[oi].votes - 1);
      } else {
        if (prev !== undefined) prop.options[prev].votes = Math.max(0, prop.options[prev].votes - 1);
        prop.options[oi].votes += 1;
        state.votes[pid] = oi;
      }
      renderProposals();
    });
  });
}

export function mount(root) {
  root.innerHTML = `<section class="page active" id="page-vote">${TEMPLATE}</section>`;
  root.querySelectorAll('[data-gtab]').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('[data-gtab]').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); state.gTab = b.dataset.gtab; renderProposals();
  }));
  renderProposals();
}
