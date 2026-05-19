// FolkAble — Entry point
import * as home       from './pages/home.js';
import * as story      from './pages/story.js';
import * as discovery  from './pages/discovery.js';
import * as artists    from './pages/artists.js';
import * as companies  from './pages/companies.js';
import * as community  from './pages/community.js';
import * as roundtable from './pages/roundtable.js';

import { register, start } from './lib/router.js';

const app = document.getElementById('app');

const PAGES = [
  { name: 'home',       id: 'page-home',       mod: home },
  { name: 'story',      id: 'page-story',      mod: story },
  { name: 'discovery',  id: 'page-discovery',  mod: discovery },
  { name: 'artists',    id: 'page-artists',    mod: artists },
  { name: 'companies',  id: 'page-companies',  mod: companies },
  { name: 'community',  id: 'page-community',  mod: community },
  { name: 'roundtable', id: 'page-roundtable', mod: roundtable },
];

const sections = {};
PAGES.forEach(({ name, id, mod }) => {
  const section = document.createElement('section');
  section.className = 'page';
  section.id = id;
  app.appendChild(section);
  sections[name] = section;
  mod.mount(section);
});

PAGES.forEach(({ name, mod }) => {
  register(name, {
    onEnter: () => {
      Object.values(sections).forEach(s => s.classList.remove('active'));
      sections[name].classList.add('active');
      if (mod.onEnter) mod.onEnter();
    },
    onLeave: () => {
      if (mod.unmount) mod.unmount();
    },
  });
});

start();
