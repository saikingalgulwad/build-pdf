function extractConversationData(saveButton) {
  const article = saveButton.closest('article');
  const answer = article?.innerText || '';
  const questionNode = article?.previousElementSibling;
  const question = questionNode?.innerText || 'Question not detected';

  return {
    question,
    answer,
    timestamp: new Date().toISOString(),
    pageUrl: window.location.href
  };
}

function injectSaveButtons() {
  const responses = document.querySelectorAll('article');
  responses.forEach((article) => {
    if (article.querySelector('.chapter-save-btn')) return;

    const btn = document.createElement('button');
    btn.textContent = 'Save';
    btn.className = 'chapter-save-btn';
    btn.style.cssText = 'margin-top:8px;padding:6px 12px;border-radius:8px;border:1px solid #333;background:#111;color:#fff;cursor:pointer;';

    btn.addEventListener('click', () => {
      const payload = extractConversationData(btn);
      chrome.runtime.sendMessage({ type: 'OPEN_POPUP_WITH_DATA', payload });
      alert('Conversation captured. Open extension popup to save.');
    });

    article.appendChild(btn);
  });
}

const observer = new MutationObserver(() => injectSaveButtons());
observer.observe(document.body, { childList: true, subtree: true });
injectSaveButtons();
