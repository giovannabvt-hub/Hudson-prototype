// FolkAble — Story page (About Hudson Records & mission)
let mounted = false;

const TEMPLATE = `
<div class="page-scroll">
  <section class="story-hero">
    <span class="landing-eyebrow">The Story</span>
    <h1 class="story-title">How <span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span> Came to Be</h1>
    <p class="story-subtitle">A platform born from the belief that folk music belongs to everyone — and should be governed by those who make it.</p>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">Origins</div>
      <h2 class="story-h2">Hudson Records</h2>
      <p>Hudson Records was founded in 2018 in the Hudson Valley, New York, by a small group of musicians and producers who believed that folk music — the oldest form of human storytelling through sound — deserved a home that honoured its traditions while embracing community.</p>
      <p>What started as a boutique vinyl label pressing 200-copy runs of traditional Irish sessions and Appalachian field recordings grew into something much larger: a global network of 7 independent labels, 6 resident artists, and 184 active members spanning 18 countries.</p>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block">
      <div class="story-label">The Problem</div>
      <h2 class="story-h2">Folk Music Was Losing Its Community</h2>
      <p>Streaming platforms reduced folk musicians to algorithm fodder. Social media scattered conversations across walled gardens. There was no single place where a gnawa master in Fez could find a nyckelharpa builder in Uppsala, or where a fado singer in Lisbon could collaborate with a chamamé player in Buenos Aires.</p>
      <p>The folk community is global, but it was fragmented. Artists had no way to control their own narrative, and listeners had no way to participate beyond passive consumption.</p>
    </div>
  </section>

  <section class="story-section">
    <div class="story-block">
      <div class="story-label">The Vision</div>
      <h2 class="story-h2">A Decentralised Folk Platform</h2>
      <p>In 2025, Hudson Records proposed building FolkAble — a community-owned web platform where every artist has their own microcosmos (personal page with biography, blog, releases, and direct supporter chat), every label has a storefront, and every member has a vote.</p>
      <p>Inspired by the metalabel model and decentralised autonomous organisations (DAOs), FolkAble operates on three principles:</p>
      <div class="story-principles">
        <div class="story-principle">
          <div class="sp-num">01</div>
          <h3>Artist Sovereignty</h3>
          <p>Every creator controls their own page, their own story, and their own relationship with supporters. No intermediary takes a cut of that connection.</p>
        </div>
        <div class="story-principle">
          <div class="sp-num">02</div>
          <h3>Collective Governance</h3>
          <p>Budget allocation, event approval, new member onboarding — every significant decision goes through a transparent voting process at the Round Table.</p>
        </div>
        <div class="story-principle">
          <div class="sp-num">03</div>
          <h3>Cultural Preservation</h3>
          <p>Folk music is intangible heritage. FolkAble ensures that traditional knowledge, recordings, and community memory are preserved and accessible.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="story-section story-dark">
    <div class="story-block">
      <div class="story-label">The Network</div>
      <h2 class="story-h2">7 Labels, 18 Countries, One Community</h2>
      <div class="story-network">
        <div class="sn-item"><span class="sn-emoji">🏔️</span><strong>Hudson Records</strong><span>Hudson Valley, NY · Est. 2018</span></div>
        <div class="sn-item"><span class="sn-emoji">🌊</span><strong>Sruth Records</strong><span>Galway, Ireland · Est. 2020</span></div>
        <div class="sn-item"><span class="sn-emoji">🎶</span><strong>Casa do Fado</strong><span>Lisbon, Portugal · Est. 2019</span></div>
        <div class="sn-item"><span class="sn-emoji">🌲</span><strong>Vestland Folk</strong><span>Bergen, Norway · Est. 2017</span></div>
        <div class="sn-item"><span class="sn-emoji">🪕</span><strong>Hollow Holler Records</strong><span>Asheville, NC · Est. 2021</span></div>
        <div class="sn-item"><span class="sn-emoji">🌾</span><strong>Pampa Folk</strong><span>Buenos Aires, Argentina · Est. 2020</span></div>
        <div class="sn-item"><span class="sn-emoji">🧭</span><strong>Eastern Routes</strong><span>Marrakech / Tokyo · Est. 2019</span></div>
      </div>
    </div>
  </section>

  <section class="story-section">
    <div class="story-block" style="text-align:center;">
      <div class="story-label">Join Us</div>
      <h2 class="story-h2">This Is Just the Beginning</h2>
      <p>FolkAble is a living platform — shaped by its members, responsive to its community, and always evolving. Whether you play, produce, listen, or simply love folk music, there is a place for you here.</p>
      <div class="landing-ctas" style="justify-content:center;margin-top:28px;">
        <a class="landing-btn primary" href="#discovery">Explore the Globe</a>
        <a class="landing-btn secondary" href="#artists">Meet the Artists</a>
      </div>
    </div>
  </section>
</div>
`;

export function mount(root) {
  if (mounted) return;
  root.innerHTML = TEMPLATE;
  mounted = true;
}

export function unmount() {}
