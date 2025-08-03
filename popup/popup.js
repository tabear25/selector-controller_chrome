// Popup UI controller — ES module
const list = document.getElementById('list');

init();

async function init() {
  await refreshList();

  document.getElementById('start').addEventListener('click', () => toggleSelection(true));
  document.getElementById('stop').addEventListener('click', async () => {
    await toggleSelection(false);
    await copyAndClose();
  });
  document.getElementById('clear').addEventListener('click', async () => {
    await sendToActiveTab({ action: 'clear-selection' });
    await refreshList();
  });
}

// ── core helpers ──────────────────────────────────────────────────────────
async function toggleSelection(state) {
  await sendToActiveTab({ action: 'toggle-selection', state });
  await refreshList();
}

async function copyAndClose() {
  try {
    // ── ここで直接コピー ─────────────────────────────
    const { textQueue = [] } = await chrome.storage.local.get('textQueue');
    await navigator.clipboard.writeText(textQueue.join('\n'));
    // ────────────────────────────────────────────────
  } catch (err) {
    console.error('Clipboard write failed:', err);
    alert('コピーに失敗しました… Console を確認してください');
    return;
  }
  window.close();
}

/**
 * Send a message to the *active* tab.
 * If the tab has no content script, inject src/content.js once and retry.
 */
async function sendToActiveTab(msg) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !/^https?:/.test(tab.url)) return; // chrome://, about:blank … は無視

  try {
    await chrome.tabs.sendMessage(tab.id, msg); // 1st attempt
  } catch {
    try {
      // fallback: dynamic injection for iframes / initial load
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/content.js']
      });
      await chrome.tabs.sendMessage(tab.id, msg); // retry once
    } catch (injErr) {
      console.warn('Injection failed:', injErr.message);
    }
  }
}

// ── UI refresh ───────────────────────────────────────────────────────────
async function refreshList() {
  const { textQueue = [] } = await chrome.storage.local.get('textQueue');
  list.innerHTML = textQueue.map(t => `<li>${t}</li>`).join('');

  chrome.action.setBadgeText({ text: String(textQueue.length) });
  chrome.action.setBadgeBackgroundColor({ color: '#ff3b30' });
}
