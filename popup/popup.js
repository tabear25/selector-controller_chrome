// Popup UI controller  — this file is a plain ES module (type="module" in popup.html)

const list = document.getElementById('list');

init();

async function init() {
  await refreshList();

  document.getElementById('start').addEventListener('click', () => toggle(true));
  document.getElementById('stop').addEventListener('click', async () => {
    await toggle(false);
    await copyAndClose();
  });
  document.getElementById('clear').addEventListener('click', async () => {
    await sendMessage({ action: 'clear-selection' });
    await refreshList();
  });
}

async function toggle(state) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, { action: 'toggle-selection', state });
  await refreshList();
}

async function copyAndClose() {
  await sendMessage({ action: 'copy-to-clipboard' });
  window.close();
}

function sendMessage(msg) {
  return chrome.runtime.sendMessage(msg);
}

async function refreshList() {
  const { textQueue = [] } = await chrome.storage.session.get('textQueue');
  list.innerHTML = textQueue.map(t => `<li>${t}</li>`).join('');
}
