// Entry point: create one persistent container per page, mount each, then start the router.
// (CSS is loaded via <link> in index.html so this works in plain browsers + Vite.)

import * as home       from './pages/home.js';
import * as records    from './pages/records.js';
import * as merch      from './pages/merch.js';
import * as table      from './pages/table.js';
import * as governance from './pages/governance.js';

import { register, start } from './lib/router.js';

const app = document.getElementById('app');

// Build one section per page and mount each module once
const PAGES = [
  { name: 'home',    id: 'page-home',    mod: home },
  { name: 'records', id: 'page-records', mod: records },
  { name: 'merch',   id: 'page-merch',   mod: merch },
  { name: 'table',   id: 'page-table',   mod: table },
  { name: 'vote',    id: 'page-vote',    mod: governance },
];

const sections = {};
PAGES.forEach(({ name, id, mod }) => {
  const section = document.createElement('section');
  section.className = 'page';
  section.id = id;
  app.appendChild(section);
  sections[name] = section;
  // mount the page once into its own container
  mod.mount(section);
});

// Router: just toggle the active section
PAGES.forEach(({ name, mod }) => {
  register(name, {
    onEnter: () => {
      Object.values(sections).forEach(s => s.classList.remove('active'));
      sections[name].classList.add('active');
      // home has overlays that need clearing when leaving — handle via onLeave on home
    },
    onLeave: () => {
      if (mod.unmount) mod.unmount();
    },
  });
});

start();
