// Content script – executed on every page but inert until selection mode is toggled.
import { buildSelector } from './utils/selectorBuilder.js';

const HIGHLIGHT_STYLE = 'outline: 2px solid rgba(255, 0, 0, 0.7); outline-offset: 2px;';
let selecting = false;
let queue = [];

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.action === 'toggle-selection') {
    selecting = msg.state;
    if (selecting) enableSelection();
    else disableSelection();
    sendResponse({ ok: true });
  }
  if (msg?.action === 'clear-selection') {
    queue = [];
    sendResponse({ ok: true });
  }
});

function enableSelection() {
  document.addEventListener('click', clickHandler, true);
  document.body.style.cursor = 'crosshair';
}

function disableSelection() {
  document.removeEventListener('click', clickHandler, true);
  document.body.style.cursor = '';
  chrome.storage.session.set({ selectorQueue: queue });
}

function clickHandler(e) {
  if (!selecting) return;
  e.preventDefault();
  e.stopPropagation();

  const target = e.target;
  const selector = buildSelector(target, { preferCss: true });

  queue.push(selector);
  flash(target);

  chrome.storage.session.set({ selectorQueue: queue });
}

function flash(el) {
  const prev = el.getAttribute('data-selector‑collector-prev');
  if (!prev) {
    el.setAttribute('data-selector‑collector-prev', el.getAttribute('style') || '');
  }
  el.style.cssText += HIGHLIGHT_STYLE;
  setTimeout(() => {
    el.style.cssText = el.getAttribute('data-selector‑collector-prev');
    el.removeAttribute('data-selector‑collector-prev');
  }, 500);
}