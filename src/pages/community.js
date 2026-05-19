// FolkAble — Community page (Discord-style chat)
import { communityChannels, artists, sectionSymbols, artistSymbols } from '../data/index.js';

let mounted = false;
let activeChannel = 'general';
let root = null;

function render() {
  const channel = communityChannels.find(c => c.id === activeChannel) || communityChannels[0];

  root.innerHTML = `
    <div class="comm-layout">
      <aside class="comm-sidebar">
        <div class="comm-sidebar-head">
          <h2 class="comm-logo"><span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span></h2>
          <span class="comm-subtitle">Community Server</span>
        </div>
        <div class="comm-channels">
          <div class="comm-ch-label">Channels</div>
          ${communityChannels.map(ch => `
            <button class="comm-ch-btn ${ch.id === activeChannel ? 'active' : ''}" data-ch="${ch.id}">
              <span class="comm-ch-icon bronze-symbol-sm">${sectionSymbols[ch.symbolKey] || ''}</span>
              <span class="comm-ch-name">${ch.name}</span>
              <span class="comm-ch-count">${ch.members}</span>
            </button>
          `).join('')}
          <div class="comm-ch-label" style="margin-top:16px;">Artist Channels</div>
          ${artists.map(a => `
            <button class="comm-ch-btn artist-ch" data-artist="${a.id}">
              <span class="comm-ch-icon bronze-symbol-sm">${artistSymbols[a.id] || ''}</span>
              <span class="comm-ch-name">${a.name.split(' ')[0]}</span>
            </button>
          `).join('')}
        </div>
      </aside>

      <main class="comm-main">
        <div class="comm-main-head">
          <span class="comm-main-icon bronze-symbol">${sectionSymbols[channel.symbolKey] || ''}</span>
          <h3 class="comm-main-title">${channel.name}</h3>
          <span class="comm-main-desc">${channel.description}</span>
          <span class="comm-main-members">${channel.members} members</span>
        </div>
        <div class="comm-messages" id="comm-messages">
          ${channel.messages.map(m => `
            <div class="comm-msg">
              <div class="comm-msg-avatar avatar-bronze">${m.avatar}</div>
              <div class="comm-msg-body">
                <div class="comm-msg-head">
                  <span class="comm-msg-author">${m.author}</span>
                  <span class="comm-msg-time">${m.time}</span>
                </div>
                <p class="comm-msg-text">${m.text}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="comm-input-bar">
          <input class="comm-input" type="text" placeholder="Message #${channel.name.toLowerCase()}..." disabled>
          <button class="comm-send-btn" disabled>Send</button>
        </div>
      </main>
    </div>
  `;

  // Channel switching
  root.querySelectorAll('.comm-ch-btn:not(.artist-ch)').forEach(btn => {
    btn.addEventListener('click', () => {
      activeChannel = btn.dataset.ch;
      render();
    });
  });

  // Artist channels (show placeholder)
  root.querySelectorAll('.artist-ch').forEach(btn => {
    btn.addEventListener('click', () => {
      const a = artists.find(x => x.id === btn.dataset.artist);
      if (!a) return;
      const main = root.querySelector('.comm-main');
      main.innerHTML = `
        <div class="comm-main-head">
          <span class="comm-main-icon bronze-symbol">${artistSymbols[a.id] || ''}</span>
          <h3 class="comm-main-title">${a.name}</h3>
          <span class="comm-main-desc">Artist community channel</span>
          <span class="comm-main-members">${Math.floor(a.supporters * 0.05)} online</span>
        </div>
        <div class="comm-messages">
          <div class="comm-msg">
            <div class="comm-msg-avatar avatar-bronze">${a.name[0]}</div>
            <div class="comm-msg-body">
              <div class="comm-msg-head"><span class="comm-msg-author">${a.name}</span><span class="comm-msg-time">pinned</span></div>
              <p class="comm-msg-text">Welcome to my channel. This is a space for my supporters to connect, discuss my music, and stay updated on upcoming events.</p>
            </div>
          </div>
          <div class="comm-msg">
            <div class="comm-msg-avatar avatar-bronze">S</div>
            <div class="comm-msg-body">
              <div class="comm-msg-head"><span class="comm-msg-author">Supporter</span><span class="comm-msg-time">2h ago</span></div>
              <p class="comm-msg-text">Excited for the next release. Any preview available?</p>
            </div>
          </div>
        </div>
        <div class="comm-input-bar">
          <input class="comm-input" type="text" placeholder="Message ${a.name.split(' ')[0]}..." disabled>
          <button class="comm-send-btn" disabled>Send</button>
        </div>
      `;
      // Update active state in sidebar
      root.querySelectorAll('.comm-ch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Scroll to bottom
  const msgs = root.querySelector('#comm-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

export function mount(r) {
  if (mounted) return;
  root = r;
  render();
  mounted = true;
}

export function unmount() {}
