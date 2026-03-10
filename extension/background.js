chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_POPUP_WITH_DATA') {
    chrome.storage.local.set({ pendingConversation: message.payload }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});
