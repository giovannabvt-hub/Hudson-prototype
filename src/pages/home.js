// FolkAble — Landing Page
let mounted = false;

const TEMPLATE = `
<div class="page-scroll landing-scroll">
  <section class="landing-hero">
    <div class="landing-hero-bg"></div>
    <div class="landing-hero-content">
      <h1 class="landing-title"><span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span></h1>
      <p class="landing-tagline">A decentralised platform connecting folk communities across the globe.</p>
      <p class="landing-desc">Discover events, support artists, join gatherings, and shape the future of folk music through collective governance. Built by musicians, for musicians.</p>
      <div class="landing-ctas">
        <a class="landing-btn primary" href="#discovery">Explore the Globe</a>
        <a class="landing-btn secondary" href="#story">Our Story</a>
      </div>
      <div class="landing-stats">
        <div class="landing-stat"><strong>184</strong><span>Members</span></div>
        <div class="landing-stat"><strong>7</strong><span>Labels</span></div>
        <div class="landing-stat"><strong>18</strong><span>Countries</span></div>
        <div class="landing-stat"><strong>6</strong><span>Artists</span></div>
      </div>
    </div>
  </section>

  <section class="landing-section">
    <div class="landing-section-inner">
      <span class="landing-eyebrow">Platform</span>
      <h2 class="landing-h2">What is <span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span>?</h2>
      <p class="landing-body">FolkAble is a community-owned web platform where folk musicians, labels, and listeners converge. No algorithms. No corporate gatekeepers. Every artist has their own microcosmos — a personal space to share their story, blog, music, and connect directly with supporters. Every decision about the platform is made collectively through transparent governance.</p>
    </div>
  </section>

  <section class="landing-features">
    <div class="landing-section-inner">
      <span class="landing-eyebrow">Layers</span>
      <h2 class="landing-h2">How It Works</h2>
      <div class="feature-grid">
        <a href="#discovery" class="feature-card">
          <div class="feature-icon">🌍</div>
          <h3>Discovery</h3>
          <p>Browse an interactive 3D globe. Find events, gatherings, and artists across 18+ countries. Click any marker to dive deeper.</p>
        </a>
        <a href="#artists" class="feature-card">
          <div class="feature-icon">🎻</div>
          <h3>Artists</h3>
          <p>Each artist has their own microcosmos — biography, blog, releases, events, and a direct channel to their supporters.</p>
        </a>
        <a href="#companies" class="feature-card">
          <div class="feature-icon">🏷️</div>
          <h3>Companies</h3>
          <p>Independent labels and collectives publish news, events, and releases from their own dedicated pages.</p>
        </a>
        <a href="#community" class="feature-card">
          <div class="feature-icon">💬</div>
          <h3>Community</h3>
          <p>A Discord-style server for all members. Chat in general channels or filter by artist and topic.</p>
        </a>
        <a href="#roundtable" class="feature-card">
          <div class="feature-icon">🗳️</div>
          <h3>Round Table</h3>
          <p>Snapshot-style governance. Vote on events, budgets, and proposals. Every member has a voice.</p>
        </a>
        <a href="#story" class="feature-card">
          <div class="feature-icon">📖</div>
          <h3>Our Story</h3>
          <p>Learn how Hudson Records built FolkAble to connect the global folk community.</p>
        </a>
      </div>
    </div>
  </section>

  <section class="landing-section landing-cta-section">
    <div class="landing-section-inner" style="text-align:center;">
      <h2 class="landing-h2">Join the Community</h2>
      <p class="landing-body" style="max-width:560px;margin:0 auto 28px;">Whether you are an artist, a label, or a listener — FolkAble is built for you. Register as a creator or a supporter and become part of the global folk network.</p>
      <div class="landing-ctas" style="justify-content:center;">
        <button class="landing-btn primary" onclick="document.getElementById('auth-modal').classList.add('open')">Sign Up</button>
        <a class="landing-btn secondary" href="#discovery">Browse First</a>
      </div>
    </div>
  </section>

  <footer class="landing-footer">
    <div class="landing-footer-inner">
      <span class="landing-footer-brand"><span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span></span>
      <span class="landing-footer-text">Built by Hudson Records · A decentralised folk community platform</span>
    </div>
  </footer>
</div>
`;

export function mount(root) {
  if (mounted) return;
  root.innerHTML = TEMPLATE;
  mounted = true;
}

export function unmount() {}
