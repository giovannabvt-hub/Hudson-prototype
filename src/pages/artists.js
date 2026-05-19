// FolkAble — Artists page (catalogue + microcosmos)
import { artists, offerings, catColors } from '../data/index.js';

let mounted = false;
let currentView = 'catalogue'; // 'catalogue' or 'profile'
let selectedArtist = null;
let root = null;

function renderCatalogue() {
  root.innerHTML = `
    <div class="page-scroll">
      <div class="page-hero">
        <span class="hero-eyebrow">Creators</span>
        <h1 class="hero-title">Artists</h1>
        <p class="hero-sub">Each artist on FolkAble has their own microcosmos — a personal space for their story, music, blog, and direct connection with supporters.</p>
      </div>
      <div class="artist-grid">
        ${artists.map(a => `
          <div class="artist-card" data-aid="${a.id}">
            <div class="ac-avatar avatar-bronze">${a.emoji}</div>
            <div class="ac-info">
              <div class="ac-name">${a.name}</div>
              <div class="ac-detail">${a.instrument}</div>
              <div class="ac-detail">${a.country} · ${a.supporters} supporters</div>
              <div class="ac-label">${a.label}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  root.querySelectorAll('.artist-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedArtist = card.dataset.aid;
      currentView = 'profile';
      renderProfile();
    });
  });
}

function renderProfile() {
  const a = artists.find(x => x.id === selectedArtist);
  if (!a) return renderCatalogue();
  const artistOffs = offerings.filter(o => o.artist === a.id);

  root.innerHTML = `
    <div class="page-scroll">
      <div class="micro-hero">
        <button class="micro-back" id="micro-back">&larr; All Artists</button>
        <div class="micro-header">
          <div class="micro-avatar avatar-bronze">${a.emoji}</div>
          <div class="micro-info">
            <h1 class="micro-name">${a.name}</h1>
            <div class="micro-meta">${a.instrument} · ${a.country} · Age ${a.age}</div>
            <div class="micro-meta">Label: ${a.label} · ${a.supporters} supporters</div>
          </div>
        </div>
        <div class="micro-actions">
          <button class="landing-btn primary micro-support">&#9829; Support This Artist</button>
          <div class="micro-socials">
            ${a.socials.instagram ? `<a class="micro-social" href="https://instagram.com/${a.socials.instagram.replace('@','')}" target="_blank" rel="noopener">Instagram</a>` : ''}
            ${a.socials.spotify ? `<a class="micro-social" href="#" target="_blank" rel="noopener">Spotify</a>` : ''}
            ${a.socials.youtube ? `<a class="micro-social" href="#" target="_blank" rel="noopener">YouTube</a>` : ''}
            ${a.socials.website ? `<a class="micro-social" href="${a.socials.website}" target="_blank" rel="noopener">Website</a>` : ''}
          </div>
        </div>
      </div>

      <div class="micro-body">
        <div class="micro-main">
          <section class="micro-section">
            <h2 class="micro-h2">Biography</h2>
            <p class="micro-text">${a.bio}</p>
          </section>

          <section class="micro-section">
            <h2 class="micro-h2">Active Regions</h2>
            <div class="micro-tags">${a.countries.map(c => `<span class="micro-tag">${c}</span>`).join('')}</div>
          </section>

          <section class="micro-section">
            <h2 class="micro-h2">Blog</h2>
            ${a.blog.map(b => `
              <div class="micro-blog-post">
                <div class="mbp-date">${b.date}</div>
                <h3 class="mbp-title">${b.title}</h3>
                <p class="mbp-text">${b.text}</p>
              </div>
            `).join('')}
          </section>

          <section class="micro-section">
            <h2 class="micro-h2">Events & Gatherings</h2>
            ${artistOffs.map(o => `
              <div class="offering-card">
                <div class="o-bar" style="background:${catColors[o.category]};"></div>
                <div style="flex:1;min-width:0;">
                  <div class="o-title">${o.title}</div>
                  <div class="o-meta">${o.country} · ${o.date} · ${o.price}</div>
                  <div class="o-desc">${o.desc}</div>
                  <a class="o-ticket-link" href="#" target="_blank">Get Tickets &rarr;</a>
                </div>
              </div>
            `).join('')}
          </section>

          <section class="micro-section">
            <h2 class="micro-h2">Products & Releases</h2>
            ${a.products.map(p => `
              <div class="micro-product">
                <span>${p}</span>
                <a class="o-ticket-link" href="#" target="_blank">View &rarr;</a>
              </div>
            `).join('')}
          </section>
        </div>

        <aside class="micro-chat">
          <div class="mc-header">
            <h3 class="mc-title">💬 ${a.name.split(' ')[0]}'s Community</h3>
            <span class="mc-members">${Math.floor(a.supporters * 0.12)} online</span>
          </div>
          <div class="mc-messages" id="mc-messages">
            <div class="mc-msg"><span class="mc-author">${a.name}</span><span class="mc-time">1h ago</span><p>Welcome to my community space! Feel free to ask anything about my music or upcoming events.</p></div>
            <div class="mc-msg"><span class="mc-author">Folk Listener</span><span class="mc-time">45m ago</span><p>Your latest recording is incredible. Will there be a vinyl release?</p></div>
            <div class="mc-msg"><span class="mc-author">${a.name}</span><span class="mc-time">30m ago</span><p>Thank you! We are pressing a limited edition — keep an eye on announcements.</p></div>
            <div class="mc-msg"><span class="mc-author">Community Member</span><span class="mc-time">15m ago</span><p>Any chance of a workshop in my city? We have a great venue here.</p></div>
          </div>
          <div class="mc-input-wrap">
            <input class="mc-input" type="text" placeholder="Type a message..." disabled>
            <button class="mc-send" disabled>Send</button>
          </div>
        </aside>
      </div>
    </div>
  `;

  root.querySelector('#micro-back').addEventListener('click', () => {
    currentView = 'catalogue';
    selectedArtist = null;
    renderCatalogue();
  });
}

export function mount(r) {
  if (mounted) return;
  root = r;
  // Check if navigated from discovery with a specific artist
  if (window.__folkable_artist) {
    selectedArtist = window.__folkable_artist;
    currentView = 'profile';
    delete window.__folkable_artist;
    renderProfile();
  } else {
    renderCatalogue();
  }
  mounted = true;
}

export function onEnter() {
  if (window.__folkable_artist && root) {
    selectedArtist = window.__folkable_artist;
    currentView = 'profile';
    delete window.__folkable_artist;
    renderProfile();
  }
}

export function unmount() {}
