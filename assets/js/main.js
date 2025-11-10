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

function setEditedDateToToday() {
  const el = document.getElementById('edited-date');
  if (!el) return;
  const now = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  const formatted = now.toLocaleDateString(undefined, opts);
  el.textContent = `Edited ${formatted}`;
}

// Initialize based on page context
function init() {
  // Always set edited date
  setEditedDateToToday();
  
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
