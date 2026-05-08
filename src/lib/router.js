// Tiny hash router: maps `#name` → page handler, calls onEnter/onLeave.

const routes = {};
let current = null;

export function register(name, handlers) {
  routes[name] = handlers; // { onEnter(), onLeave() }
}

export function go(name) {
  if (!routes[name]) name = 'home';
  if (current === name) return;
  if (current && routes[current]?.onLeave) routes[current].onLeave();
  current = name;
  if (routes[name]?.onEnter) routes[name].onEnter();
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === name));
}

export function start() {
  const apply = () => {
    const hash = (location.hash || '#home').slice(1);
    go(hash);
  };
  window.addEventListener('hashchange', apply);
  apply();
}

export function getCurrent() { return current; }
