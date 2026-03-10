const API_BASE = 'http://localhost:3000';

async function getPendingConversation() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['pendingConversation'], ({ pendingConversation }) => {
      resolve(pendingConversation || null);
    });
  });
}

async function checkLoginAndLoadChapters() {
  const status = document.getElementById('status');
  const chapterSelect = document.getElementById('chapter');

  const chaptersRes = await fetch(`${API_BASE}/api/chapters`, { credentials: 'include' });
  if (!chaptersRes.ok) {
    status.textContent = 'Not logged in. Please login on website first.';
    return null;
  }

  const chapters = await chaptersRes.json();
  status.textContent = 'Logged in';

  chapterSelect.innerHTML = chapters
    .map((chapter) => `<option value="${chapter.id}">${chapter.name}</option>`)
    .join('');

  return chapters;
}

async function saveConversation() {
  const pending = await getPendingConversation();
  if (!pending) {
    alert('No captured conversation found. Click Save in ChatGPT first.');
    return;
  }

  const chapterId = document.getElementById('chapter').value;
  const title = document.getElementById('title').value || 'Untitled ChatGPT Note';
  const notes = document.getElementById('notes').value;

  const response = await fetch(`${API_BASE}/api/conversation`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chapterId,
      title,
      notes,
      question: pending.question,
      answer: pending.answer,
      pageUrl: pending.pageUrl
    })
  });

  if (!response.ok) {
    alert('Failed to save conversation.');
    return;
  }

  chrome.storage.local.remove(['pendingConversation']);
  alert('Saved successfully!');
}

document.getElementById('saveBtn').addEventListener('click', saveConversation);
checkLoginAndLoadChapters();
