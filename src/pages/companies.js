// FolkAble — Companies page (label catalogue + individual pages)
import { companies, offerings, catColors } from '../data/index.js';

let mounted = false;
let currentView = 'catalogue';
let selectedCompany = null;
let root = null;

function renderCatalogue() {
  root.innerHTML = `
    <div class="page-scroll">
      <div class="page-hero">
        <span class="hero-eyebrow">Network</span>
        <h1 class="hero-title">Companies & Labels</h1>
        <p class="hero-sub">Independent labels and collectives that form the backbone of the FolkAble network. Each has their own page to publish news, events, and releases.</p>
      </div>
      <div class="company-grid">
        ${companies.map(c => `
          <div class="company-card" data-cid="${c.id}">
            <div class="cc-logo" style="background:${c.color}20;border-color:${c.color}40;">${c.logo}</div>
            <div class="cc-info">
              <div class="cc-name">${c.name}</div>
              <div class="cc-meta">${c.location} · Est. ${c.founded}</div>
              <div class="cc-meta">${c.members} members</div>
              <p class="cc-bio">${c.bio.substring(0, 120)}...</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  root.querySelectorAll('.company-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedCompany = card.dataset.cid;
      currentView = 'profile';
      renderCompany();
    });
  });
}

function renderCompany() {
  const c = companies.find(x => x.id === selectedCompany);
  if (!c) return renderCatalogue();
  const companyOffs = offerings.filter(o => o.company === c.name);

  root.innerHTML = `
    <div class="page-scroll">
      <div class="micro-hero">
        <button class="micro-back" id="company-back">&larr; All Companies</button>
        <div class="micro-header">
          <div class="micro-avatar" style="background:${c.color}20;border-color:${c.color}40;">${c.logo}</div>
          <div class="micro-info">
            <h1 class="micro-name">${c.name}</h1>
            <div class="micro-meta">${c.location} · Founded ${c.founded} · ${c.members} members</div>
          </div>
        </div>
        <div class="micro-actions">
          <div class="micro-socials">
            ${c.socials.website ? `<a class="micro-social" href="${c.socials.website}" target="_blank" rel="noopener">Website</a>` : ''}
            ${c.socials.instagram ? `<a class="micro-social" href="https://instagram.com/${c.socials.instagram.replace('@','')}" target="_blank" rel="noopener">Instagram</a>` : ''}
            ${c.socials.twitter ? `<a class="micro-social" href="#" target="_blank" rel="noopener">Twitter</a>` : ''}
          </div>
        </div>
      </div>

      <div class="micro-body">
        <div class="micro-main">
          <section class="micro-section">
            <h2 class="micro-h2">About</h2>
            <p class="micro-text">${c.bio}</p>
          </section>

          <section class="micro-section">
            <h2 class="micro-h2">News & Articles</h2>
            ${c.articles.map(a => `
              <div class="micro-blog-post">
                <div class="mbp-date">${a.date}</div>
                <h3 class="mbp-title">${a.title}</h3>
                <p class="mbp-text">${a.excerpt}</p>
              </div>
            `).join('')}
          </section>

          <section class="micro-section">
            <h2 class="micro-h2">Events & Gatherings</h2>
            ${companyOffs.map(o => `
              <div class="offering-card">
                <div class="o-bar" style="background:${catColors[o.category]};"></div>
                <div style="flex:1;min-width:0;">
                  <div class="o-title">${o.title}</div>
                  <div class="o-meta">${o.country} · ${o.date} · ${o.price}</div>
                  <div class="o-desc">${o.desc}</div>
                </div>
              </div>
            `).join('')}
          </section>

          <section class="micro-section">
            <h2 class="micro-h2">Releases</h2>
            <div class="micro-releases">
              ${c.releases.map(r => `<div class="micro-product"><span>${r}</span></div>`).join('')}
            </div>
          </section>
        </div>
      </div>
    </div>
  `;

  root.querySelector('#company-back').addEventListener('click', () => {
    currentView = 'catalogue';
    selectedCompany = null;
    renderCatalogue();
  });
}

export function mount(r) {
  if (mounted) return;
  root = r;
  renderCatalogue();
  mounted = true;
}

export function unmount() {}
