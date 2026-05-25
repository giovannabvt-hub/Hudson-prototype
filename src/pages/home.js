// FolkAble — Landing Page
import { sectionSymbols } from '../data/index.js';

let mounted = false;

const TEMPLATE = `
<div class="page-scroll landing-scroll">
  <section class="landing-hero">
    <div class="landing-hero-bg"></div>
    <div class="landing-hero-content">
      <img src="/logo.png" alt="FolkAble" style="width:120px;height:auto;margin:0 auto 24px;display:block;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.5));mix-blend-mode:screen;">
      <h1 class="landing-title"><span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span></h1>
      <p class="landing-tagline">A decentralised platform connecting folk artists and communities across the globe.</p>
      <p class="landing-desc">Discover events, support folk artists, join gatherings, and shape the future of folk traditions through collective governance. Built by artists, for artists and their audiences.</p>
      <div class="landing-ctas">
        <a class="landing-btn primary" href="#discovery">Explore the Globe</a>
        <a class="landing-btn secondary" href="#about">About Us</a>
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
      <p class="landing-body">FolkAble is a community-owned web platform where folk artists, collectives, and audiences converge. No algorithms. No corporate gatekeepers. Every artist has their own microcosmos -- a personal space to share their story, work, craft, and connect directly with supporters. Every decision about the platform is made collectively through transparent governance.</p>
    </div>
  </section>

  <section class="landing-features">
    <div class="landing-section-inner">
      <span class="landing-eyebrow">Layers</span>
      <h2 class="landing-h2">How It Works</h2>
      <div class="feature-grid" id="feature-grid"></div>
    </div>
  </section>

  <section class="landing-section landing-cta-section">
    <div class="landing-section-inner" style="text-align:center;">
      <h2 class="landing-h2">Join the Community</h2>
      <p class="landing-body" style="max-width:560px;margin:0 auto 28px;">Whether you are a folk artist, a collective, or part of the audience -- FolkAble is built for you. Register as a creator or a supporter and become part of the global folk network.</p>
      <div class="landing-ctas" style="justify-content:center;">
        <button class="landing-btn primary" onclick="document.getElementById('auth-modal').classList.add('open')">Sign Up</button>
        <a class="landing-btn secondary" href="#discovery">Browse First</a>
      </div>
    </div>
  </section>

  <footer class="landing-footer">
    <div class="landing-footer-inner">
      <span class="landing-footer-brand"><span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span></span>
      <span class="landing-footer-text">Built by Hudson Records -- A decentralised platform for folk artists</span>
    </div>
  </footer>
</div>
`;

const features = [
  { key:'discovery', href:'#discovery', title:'Discovery', desc:'Browse an interactive 3D globe. Find events, gatherings, and artists across 18+ countries. Click any marker to dive deeper.' },
  { key:'artists',   href:'#artists',   title:'Artists', desc:'Each folk artist has their own microcosmos -- biography, blog, work, events, and a direct channel to their audience.' },
  { key:'companies', href:'#companies', title:'Companies', desc:'Independent collectives and labels publish news, events, and releases from their own dedicated pages.' },
  { key:'community', href:'#community', title:'Community', desc:'A server for all members. Chat in general channels or filter by artist and topic.' },
  { key:'roundtable',href:'#roundtable',title:'Round Table', desc:'Snapshot-style governance. Vote on events, budgets, and proposals. Every member has a voice.' },
  { key:'about',     href:'#about',     title:'About Us', desc:'Learn how Hudson Records built FolkAble, our governance through Aragon, and download the White Paper.' },
];

export function mount(root) {
  if (mounted) return;
  root.innerHTML = TEMPLATE;

  const grid = root.querySelector('#feature-grid');
  grid.innerHTML = features.map(f => `
    <a href="${f.href}" class="feature-card">
      <div class="feature-icon bronze-symbol">${sectionSymbols[f.key] || ''}</div>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </a>
  `).join('');

  mounted = true;
}

export function unmount() {}
