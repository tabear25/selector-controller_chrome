// Manifest V3 service worker – copies queued innerText lines to clipboard.

chrome.runtime.onInstalled.addListener(() => {
  console.log('Selector Collector installed.');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.action === 'copy-to-clipboard') {
    chrome.storage.session.get('textQueue', ({ textQueue = [] }) => {
      const joined = textQueue.join('\n');
      if (!joined) return;

      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: payload => navigator.clipboard.writeText(payload),
        args: [joined]
      });
    });
    sendResponse({ ok: true });
  }
});
