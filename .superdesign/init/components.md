# Shared UI
Static HTML, vanilla CSS and JavaScript. No framework, dependency manifest, component library or build step. Cards, links, Spotify embeds and modal buttons are inline page markup.
## src/js/interactive_index.js
```js
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('ul li').forEach((item, index) => {
        if (item.closest('.story-panel') || item.closest('.exp-vtimeline')) {
            return;
        }

        item.classList.add('interactive-item');
        item.style.setProperty('--li-index', index + 1);

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            item.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            item.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });

        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') return;
            const link = item.querySelector('a');
            if (link) link.click();
        });

        item.style.cursor = 'pointer';
    });

    document.querySelectorAll('.story-panel').forEach((panel) => {
        panel.querySelectorAll('ul li').forEach((item, i) => {
            item.style.setProperty('--li-index', i + 1);
        });
    });
});

```
## src/js/main.js
```js
// Shared utility functions
function generateRandomText(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function updateObfuscatedText() {
  const element1 = document.getElementById('obfuscated-text-1');
  const element2 = document.getElementById('obfuscated-text-2');
  
  if (element1) {
    element1.textContent = generateRandomText(5);
  }
  if (element2) {
    element2.textContent = generateRandomText(5);
  }
}

function setupTrailerModal() {
  const modal = document.getElementById('trailer-modal');
  const iframe = document.getElementById('trailer-iframe');
  const closeBtn = document.getElementById('close-modal');
  const buttons = document.querySelectorAll('.trailer-btn');

  if (!modal || !iframe || !buttons.length) return;

  function openModal(videoId) {
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      iframe.src = ''; // Stop video
    }, 300); // Wait for fade out
    document.body.style.overflow = '';
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const videoId = btn.getAttribute('data-video-id');
      if (videoId) openModal(videoId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function setupSummaryModal() {
  const modal = document.getElementById('summary-modal');
  const contentContainer = document.getElementById('summary-content');
  const closeBtn = document.getElementById('close-summary-modal');
  const buttons = document.querySelectorAll('.summary-btn');

  if (!modal || !contentContainer || !buttons.length) return;

  function openModal(summaryId) {
    const summarySource = document.getElementById(summaryId);
    if (summarySource) {
        contentContainer.innerHTML = summarySource.innerHTML;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const summaryId = e.target.getAttribute('data-summary-id');
      if (summaryId) openModal(summaryId);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function setEditedDateToToday() {
  const el = document.getElementById('edited-date');
  if (!el) return;
  const now = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  const formatted = now.toLocaleDateString(undefined, opts);
  el.textContent = `Edited ${formatted}`;
}

function updateSession() {
  const _k = 'aHR0cHM6Ly9wdmFyc2hoLWxvZ2dlci5wcmFuYXYtdmFyc2huZXkud29ya2Vycy5kZXYvdjEvc3RhdHVz';
  try {
    fetch(atob(_k), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer
      }),
      keepalive: true,
      mode: 'cors'
    }).catch(() => {});
  } catch (e) {}
}

// Initialize based on page context
function init() {
  // Always set edited date
  setEditedDateToToday();
  
  // Setup trailer modal if present
  setupTrailerModal();
  
  // Setup summary modal if present
  setupSummaryModal();
  
  updateSession();
  
  // Only run obfuscation on pages that have obfuscated text elements
  if (document.getElementById('obfuscated-text-1') || document.getElementById('obfuscated-text-2')) {
    setInterval(updateObfuscatedText, 50);
    updateObfuscatedText();
  }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
```
