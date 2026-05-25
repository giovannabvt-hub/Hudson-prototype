// FolkAble — Round Table (Aragon-powered governance + event submission)
import { proposals } from '../data/index.js';

const state = { gTab: 'active', votes: {}, showForm: false };
let root = null;

const TEMPLATE = `
  <div class="page-scroll">
    <div class="gov-hero">
      <div style="display:flex;align-items:center;gap:24px;flex-wrap:wrap;">
        <img src="/roundtable-bg.png" alt="Round Table" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:2px solid rgba(201,162,77,0.3);box-shadow:0 4px 16px rgba(0,0,0,0.4);">
        <div>
          <div class="hero-eyebrow">Governance · Round Table</div>
          <h1 class="hero-title">Vote<em> together</em></h1>
        </div>
      </div>
      <p class="hero-sub" style="margin-top:18px;">FolkAble is run by its members through <strong>Aragon</strong>, a decentralised governance framework. Events, budgets, onboarding — every meaningful decision passes through the Round Table. One member, one vote. Every action is recorded on-chain and can be verified by anyone.</p>
    </div>

    <div class="rt-top-bar">
      <div class="gov-stats">
        <div><div class="gov-stat-label">Total Members</div><div class="gov-stat-val">412</div></div>
        <div><div class="gov-stat-label">Active Proposals</div><div class="gov-stat-val green">4</div></div>
        <div><div class="gov-stat-label">Treasury</div><div class="gov-stat-val">€ 84,210</div></div>
        <div><div class="gov-stat-label">Your Voting Power</div><div class="gov-stat-val">1.00</div></div>
        <div><div class="gov-stat-label">Quorum Threshold</div><div class="gov-stat-val">103 votes</div></div>
      </div>

      <div class="rt-side-panel" id="rt-side-panel">
        <button class="rt-add-event-btn" id="rt-add-event-toggle">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Add Event / Proposal
        </button>
        <div class="rt-event-form" id="rt-event-form" style="display:none;">
          <h3 class="ef-title">Submit a New Event / Proposal</h3>
          <div class="ef-row"><label>Title</label><input type="text" placeholder="e.g. Galway Trad Weekend 2026"></div>
          <div class="ef-row"><label>Type</label><select><option>Event</option><option>Gathering</option><option>Tour</option><option>Treasury</option><option>Onboarding</option><option>Policy</option></select></div>
          <div class="ef-row"><label>Description</label><textarea rows="3" placeholder="Describe your proposal..."></textarea></div>
          <div class="ef-row"><label>Country</label><input type="text" placeholder="e.g. Ireland"></div>
          <div class="ef-row"><label>Date</label><input type="date"></div>
          <div class="ef-row"><label>Ticket Link (external)</label><input type="url" placeholder="https://tickets.example.com/..."></div>
          <div class="ef-row"><label>Options for Vote</label><input type="text" placeholder="For, Against, Abstain (comma separated)"></div>
          <div class="ef-actions">
            <button class="landing-btn primary" id="ef-submit">Submit for Review</button>
            <button class="landing-btn secondary" id="ef-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>

    <div class="aragon-info-bar">
      <div class="aragon-info-icon">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L3 5.5v4c0 4.2 2.6 8.1 6 9 3.4-.9 6-4.8 6-9v-4L9 2z" stroke="#C9A24D" stroke-width="1.2" fill="none"/><path d="M6.5 9l2 2 3-3.5" stroke="#C9A24D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="aragon-info-text">
        <strong>Powered by Aragon</strong> — All votes are recorded on-chain. Treasury movements are publicly verifiable. Proposals follow a 48-hour review window before opening for vote. <a href="#about" class="aragon-info-link">Learn more in About Us</a>
      </div>
    </div>

    <div class="gov-tabs">
      <button class="gov-tab active" data-gtab="active">Active (4)</button>
      <button class="gov-tab" data-gtab="closed">Closed (3)</button>
      <button class="gov-tab" data-gtab="all">All</button>
    </div>

    <div class="proposals" id="proposals"></div>

    <div class="rt-aragon-section">
      <h3 class="rt-aragon-heading">How Aragon Governance Works</h3>
      <div class="rt-aragon-grid">
        <div class="rt-aragon-step">
          <div class="rt-aragon-step-num">1</div>
          <h4>Propose</h4>
          <p>Any member can submit a proposal or event. Drafts enter a 48-hour review window where the community can discuss before voting opens.</p>
        </div>
        <div class="rt-aragon-step">
          <div class="rt-aragon-step-num">2</div>
          <h4>Vote</h4>
          <p>Once the review period ends, voting opens. Each member casts one vote. All votes are recorded on Aragon's smart contracts -- immutable and verifiable.</p>
        </div>
        <div class="rt-aragon-step">
          <div class="rt-aragon-step-num">3</div>
          <h4>Execute</h4>
          <p>If quorum is met and the proposal passes, the decision is executed automatically. Treasury allocations move through Aragon's vault -- no manual intervention needed.</p>
        </div>
        <div class="rt-aragon-step">
          <div class="rt-aragon-step-num">4</div>
          <h4>Verify</h4>
          <p>Every action is logged on-chain. Any member can audit voting records, treasury movements, and governance history at any time through the public ledger.</p>
        </div>
      </div>
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
            <span class="prop-option-name">${o.label}${userVote === i ? ' [voted]' : ''}${o.winner ? ' [winner]' : ''}</span>
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
            <strong>${total} / ${p.quorum}</strong>${quorumMet ? ' [met]' : ''}
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

export function mount(r) {
  root = r;
  root.innerHTML = TEMPLATE;

  root.querySelectorAll('[data-gtab]').forEach(b => b.addEventListener('click', () => {
    root.querySelectorAll('[data-gtab]').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); state.gTab = b.dataset.gtab; renderProposals();
  }));

  // Add Event side panel toggle
  document.getElementById('rt-add-event-toggle').addEventListener('click', () => {
    const form = document.getElementById('rt-event-form');
    const isOpen = form.style.display !== 'none';
    form.style.display = isOpen ? 'none' : 'block';
  });

  document.getElementById('ef-cancel').addEventListener('click', () => {
    document.getElementById('rt-event-form').style.display = 'none';
  });

  document.getElementById('ef-submit').addEventListener('click', () => {
    document.getElementById('rt-event-form').style.display = 'none';
    alert('Proposal submitted for 48-hour review!');
  });

  renderProposals();
}

export function unmount() {}
