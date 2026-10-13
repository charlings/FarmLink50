import { FarmLinkApi } from './api.js';

// Configure with the deployed FastAPI origin when the backend is available.
export const api = new FarmLinkApi({ baseUrl: window.FARMLINK_API_URL || '/api/v1' });

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.primary-nav');

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  toggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

document.querySelector('.newsletter')?.addEventListener('submit', (event) => {
  // The mailing-list endpoint is not part of the supplied FastAPI API yet.
  event.preventDefault();
  const button = event.currentTarget.querySelector('button');
  button.textContent = '✓';
  button.setAttribute('aria-label', 'Subscribed');
});
