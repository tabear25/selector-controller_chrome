console.log('[SC] loaded', location.href);

const HIGHLIGHT_STYLE =
  'outline: 2px solid rgba(255,0,0,.7); outline-offset: 2px;';
let selecting = false;
let queue = [];

// ── message handler ────────────────────────────────────────────
console.log('[SC] onMessage ready');
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.action === 'toggle-selection') {
    selecting = !!msg.state;
    selecting ? enable() : disable();
    sendResponse?.({ ok: true });
  }
  if (msg?.action === 'clear-selection') {
    queue = [];
    chrome.storage.local.set({ textQueue: queue });
    sendResponse?.({ ok: true });
  }
});

function enable() {
  document.addEventListener('click', onClick, true);
  document.body.style.cursor = 'crosshair';
}

function disable() {
  document.removeEventListener('click', onClick, true);
  document.body.style.cursor = '';
}

function onClick(e) {
  if (!selecting) return;
  e.preventDefault();
  e.stopPropagation();

  const el = e.target;
  if (!(el instanceof HTMLElement)) return;     // SVG 等を除外
  const text = (el.innerText || el.textContent || '').trim();
  if (!text) return;

  queue.push(text);
  flash(el);
  chrome.storage.local.set({ textQueue: queue });
}

function flash(el) {
  const prev = el.getAttribute('data-sc-prev') ?? '';
  if (!el.hasAttribute('data-sc-prev'))
    el.setAttribute('data-sc-prev', el.getAttribute('style') || '');
  el.style.cssText += HIGHLIGHT_STYLE;
  setTimeout(() => {
    el.style.cssText = prev;
    el.removeAttribute('data-sc-prev');
  }, 500);
}
