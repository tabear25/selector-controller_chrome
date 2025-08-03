// Manifest V3 service worker – mainly a message broker & clipboard routine.

chrome.runtime.onInstalled.addListener(() => {
  console.log('Selector Collector installed.');
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.action === 'copy-to-clipboard') {
    chrome.storage.session.get('selectorQueue', data => {
      const text = (data.selectorQueue || []).join('\n');
      if (!text) return;
      // Use the Clipboard API in the context of the active tab (required by Chrome permissions)
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        func: (payload) => navigator.clipboard.writeText(payload),
        args: [text],
      });
    });
    sendResponse({ ok: true });
  }
});