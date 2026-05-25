// FolkAble — About Us page (origins, Aragon governance, white paper)
import { companySymbols } from '../data/index.js';

let mounted = false;

const networkLabels = [
  { id:'hudson',  name:'Hudson Records',       loc:'Sheffield, Yorkshire', est:'2016' },
  { id:'sruth',   name:'Sruth Records',         loc:'Galway, Ireland',      est:'2020' },
  { id:'casa',    name:'Casa do Fado',           loc:'Lisbon, Portugal',     est:'2019' },
  { id:'vestland',name:'Vestland Folk',          loc:'Bergen, Norway',       est:'2017' },
  { id:'hollow',  name:'Hollow Holler Records',  loc:'Asheville, NC',        est:'2021' },
  { id:'pampa',   name:'Pampa Folk',             loc:'Buenos Aires, Argentina', est:'2020' },
  { id:'eastern', name:'Eastern Routes',         loc:'Marrakech / Tokyo',    est:'2019' },
];

export function mount(root) {
  if (mounted) return;

  const networkHtml = networkLabels.map(l => `
    <div class="sn-item">
      <span class="sn-icon bronze-symbol">${companySymbols[l.id] || ''}</span>
      <div>
        <strong>${l.name}</strong>
        <span>${l.loc} -- Est. ${l.est}</span>
      </div>
    </div>
  `).join('');

  root.innerHTML = `
<div class="page-scroll">
  <section class="story-hero">
    <span class="landing-eyebrow">About Us</span>
    <h1 class="story-title">How <span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span> Came to Be</h1>
    <p class="story-subtitle">Born from a Sheffield record label's belief that folk art thrives when artists lead, communities gather, and creativity comes first.</p>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">Origins</div>
      <h2 class="story-h2">Hudson Records, Sheffield</h2>
      <p>Hudson Records was founded in 2016 in Sheffield, Yorkshire, by passionate advocates for folk music who saw the need for something different: an independent label specialising in folk, indie and world music that put artists at the centre of every decision.</p>
      <p>From their home at The Old Workshop on Ecclesall Road South, Hudson built a roster of extraordinary artists -- Karine Polwart, Emily Portman, Jon Boden, Jenny Sturgeon, Salt House, Seckou Keita, Sam Sweeney, The Furrow Collective, and many more -- united by a shared commitment to authenticity and craft.</p>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block">
      <div class="story-label">Philosophy</div>
      <h2 class="story-h2">An Artist-Led Ecosystem</h2>
      <p>Hudson Records set out to create an artist-led, sustainable ecosystem that prioritises creativity, community, and ethical business practices. Beyond a traditional label, they built a network encompassing international distribution, artist management, production support, and publishing.</p>
      <p>That spirit of collaborative making became the seed for something larger.</p>
    </div>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">Initiatives</div>
      <h2 class="story-h2">Hudson Club, Presents, and Unearth</h2>
      <p>Hudson grew well beyond releasing records. The Hudson Club, their Bandcamp subscription community, gave audiences a direct line to the artists they love. Hudson Presents brought folk, indie and world art to stages across the UK through a curated series. And Hudson Unearth became a launchpad for emerging talent -- artists like Anna McLuckie and Birdvox who went on to release acclaimed works like The Little Winters and Shamming The Drama.</p>
      <p>Each initiative reinforced the same principle: folk art is not a product to be consumed, but a living tradition to be sustained. This conviction -- that the community around the craft matters as much as the work itself -- led Hudson to imagine a platform where that community could truly gather.</p>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block">
      <div class="story-label">The Platform</div>
      <h2 class="story-h2">From Sheffield to the World</h2>
      <p>FolkAble grew from Hudson's vision of connecting folk artists across borders. If a label in Sheffield could bring together creators from the Scottish Highlands, West Africa, and Scandinavia under one roof, why not extend that model to the entire global folk world?</p>
      <div class="story-principles">
        <div class="story-principle">
          <div class="sp-num">01</div>
          <h3>Artist Sovereignty</h3>
          <p>Every creator controls their own page, their own story, and their own relationship with supporters. No intermediary takes a cut of that connection.</p>
        </div>
        <div class="story-principle">
          <div class="sp-num">02</div>
          <h3>Collective Governance</h3>
          <p>Budget allocation, event approval, new member onboarding -- every significant decision goes through a transparent voting process at the Round Table, powered by Aragon.</p>
        </div>
        <div class="story-principle">
          <div class="sp-num">03</div>
          <h3>Cultural Preservation</h3>
          <p>Folk art is intangible heritage. FolkAble ensures that traditional knowledge, works, and community memory are preserved and accessible.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">Governance</div>
      <h2 class="story-h2">Transparent by Design -- Powered by Aragon</h2>
      <p>FolkAble's governance is built on Aragon, a leading framework for decentralised organisations. Every decision made on the platform -- from treasury allocations to event approvals -- is recorded transparently and can be verified by any member.</p>

      <div class="aragon-features">
        <div class="aragon-card">
          <div class="aragon-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3L4 8v6c0 6.6 4.3 12.7 10 14 5.7-1.3 10-7.4 10-14V8L14 3z" stroke="#C9A24D" stroke-width="1.5" fill="none"/><path d="M10 14l3 3 5-6" stroke="#C9A24D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h3>On-Chain Voting</h3>
          <p>Every proposal and vote is recorded on-chain through Aragon's smart contracts. Results are immutable -- no one can alter a vote after it is cast. Members can verify any decision at any time.</p>
        </div>
        <div class="aragon-card">
          <div class="aragon-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2" stroke="#C9A24D" stroke-width="1.5" fill="none"/><path d="M3 11h22M8 16h4M8 19h8" stroke="#C9A24D" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <h3>Treasury Transparency</h3>
          <p>The FolkAble treasury is managed through Aragon's vault system. Every inflow and outflow is publicly visible. Members vote on how funds are allocated -- whether for artist grants, event funding, or platform development.</p>
        </div>
        <div class="aragon-card">
          <div class="aragon-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="10" r="4" stroke="#C9A24D" stroke-width="1.5" fill="none"/><path d="M7 22c0-3.9 3.1-7 7-7s7 3.1 7 7" stroke="#C9A24D" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="22" cy="8" r="3" stroke="#C9A24D" stroke-width="1.2" fill="none"/><circle cx="6" cy="8" r="3" stroke="#C9A24D" stroke-width="1.2" fill="none"/></svg>
          </div>
          <h3>Member Equality</h3>
          <p>One member, one vote. Aragon's token-weighted or membership-based governance models ensure that every voice carries equal weight. No single entity can override the collective will.</p>
        </div>
        <div class="aragon-card">
          <div class="aragon-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 4v20M4 14h20" stroke="#C9A24D" stroke-width="1.5" stroke-linecap="round"/><circle cx="14" cy="14" r="10" stroke="#C9A24D" stroke-width="1.5" fill="none"/><circle cx="14" cy="14" r="3" fill="#C9A24D" opacity="0.3"/></svg>
          </div>
          <h3>Open Audit Trail</h3>
          <p>All governance activity is logged and publicly accessible. Proposal histories, voting records, and treasury movements form a permanent, tamper-proof audit trail that anyone can inspect.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block">
      <div class="story-label">The Network</div>
      <h2 class="story-h2">7 Labels, 18 Countries, One Community</h2>
      <div class="story-network">
        ${networkHtml}
      </div>
    </div>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">White Paper</div>
      <h2 class="story-h2">Read the FolkAble White Paper</h2>
      <p>The FolkAble White Paper outlines the full architecture of the platform -- its governance model built on Aragon, the treasury and funding mechanisms, the artist sovereignty framework, the community moderation system, and the technical infrastructure that makes it all work.</p>
      <p>Whether you are a potential member, a partner organisation, or simply curious about how a decentralised arts platform operates, this document provides a comprehensive overview of the rules, systems, and principles that guide FolkAble.</p>
      <div class="wp-download-wrap">
        <a class="wp-download-btn" href="/folkable-whitepaper.pdf" target="_blank" rel="noopener">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 3v12M7 11l4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 15v3a1 1 0 001 1h14a1 1 0 001-1v-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Download White Paper (PDF)
        </a>
        <span class="wp-note">Document covers governance, treasury, membership, and platform architecture.</span>
      </div>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block" style="text-align:center;">
      <div class="story-label">Join Us</div>
      <h2 class="story-h2">This Is Just the Beginning</h2>
      <p>FolkAble is a living platform -- shaped by its members, responsive to its community, and always evolving. Whether you create, perform, curate, or simply love folk art, there is a place for you here.</p>
      <div class="landing-ctas" style="justify-content:center;margin-top:28px;">
        <a class="landing-btn primary" href="#discovery">Explore the Globe</a>
        <a class="landing-btn secondary" href="#artists">Meet the Artists</a>
      </div>
    </div>
  </section>
</div>
`;
  mounted = true;
}

export function unmount() {}
