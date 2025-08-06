/**
 * ページ上でテキスト要素を選択して収集するコンテンツスクリプト。
 */
// コンテンツスクリプトの初期化ログ
console.log('[SC] loaded', location.href);

// 選択した要素をハイライトする CSS スタイル
const HIGHLIGHT_STYLE =
  'outline: 2px solid rgba(255,0,0,.7); outline-offset: 2px;';
// 選択モードが有効かどうか
let selecting = false;
// クリックで収集したテキストのキュー
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

/**
 * 選択モードを有効化し、クリックイベントを捕捉する。
 */
function enable() {
  document.addEventListener('click', onClick, true);
  document.body.style.cursor = 'crosshair';
}

/**
 * 選択モードを無効化して状態を元に戻す。
 */
function disable() {
  document.removeEventListener('click', onClick, true);
  document.body.style.cursor = '';
}

/**
 * クリックされた要素からテキストを取得し、キューに追加する。
 */
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

/**
 * 一時的に要素をハイライト表示する。
 */
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
