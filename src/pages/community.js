// FolkAble — Community page (Discord-style chat)
import { communityChannels, artists, sectionSymbols, artistSymbols } from '../data/index.js';

let mounted = false;
let activeChannel = 'general';
let root = null;

const DISCORD_URL = 'https://discord.gg/aE7CJjKw3';

function render() {
  const channel = communityChannels.find(c => c.id === activeChannel) || communityChannels[0];

  root.innerHTML = `
    <div class="comm-layout">
      <aside class="comm-sidebar">
        <div class="comm-sidebar-head">
          <h2 class="comm-logo"><span class="t-accent">F</span><span class="t-olk">olk</span><span class="t-accent">Able</span></h2>
          <span class="comm-subtitle">Community Server</span>
        </div>

        <a class="comm-discord-card" href="${DISCORD_URL}" target="_blank" rel="noopener">
          <svg class="comm-discord-icon" viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
          <div class="comm-discord-text">
            <span class="comm-discord-label">Join us on Discord</span>
            <span class="comm-discord-sub">Live chat with the community</span>
          </div>
          <span class="comm-discord-arrow">></span>
        </a>

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

        <div class="comm-discord-banner">
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
          <div>
            <strong>Join the FolkAble Discord</strong>
            <span>Connect with artists and members in real time</span>
          </div>
          <a class="comm-discord-join" href="${DISCORD_URL}" target="_blank" rel="noopener">Join Server</a>
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

        <div class="comm-discord-banner">
          <svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
          <div>
            <strong>Join the FolkAble Discord</strong>
            <span>Connect with artists and members in real time</span>
          </div>
          <a class="comm-discord-join" href="${DISCORD_URL}" target="_blank" rel="noopener">Join Server</a>
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
