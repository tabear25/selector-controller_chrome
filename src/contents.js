// Content script – captures clicks and collects the *inner text* of each element.

const HIGHLIGHT_STYLE = 'outline: 2px solid rgba(255, 0, 0, 0.7); outline-offset: 2px;';
let selecting = false;
let queue = [];

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.action === 'toggle-selection') {
    selecting = msg.state;
    selecting ? enableSelection() : disableSelection();
    sendResponse({ ok: true });
  }
  if (msg?.action === 'clear-selection') {
    queue = [];
    chrome.storage.session.set({ textQueue: queue });
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
}

function clickHandler(e) {
  if (!selecting) return;
  e.preventDefault();
  e.stopPropagation();

  const target = e.target;
  const text = target.innerText.trim();
  if (!text) return; // skip empty elements

  queue.push(text);
  flash(target);
  chrome.storage.session.set({ textQueue: queue });
}

function flash(el) {
  const prev = el.getAttribute('data-selector-collector-prev');
  if (!prev) el.setAttribute('data-selector-collector-prev', el.getAttribute('style') || '');
  el.style.cssText += HIGHLIGHT_STYLE;
  setTimeout(() => {
    el.style.cssText = el.getAttribute('data-selector-collector-prev');
    el.removeAttribute('data-selector-collector-prev');
  }, 500);
}