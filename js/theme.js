const STORAGE_KEY = 'kanjicraft-theme';
const mq = window.matchMedia('(prefers-color-scheme: dark)');

function getStoredChoice() {
  return localStorage.getItem(STORAGE_KEY) || 'system';
}

function resolveTheme(choice) {
  if (choice === 'system') {
    return mq.matches ? 'dark' : 'light';
  }
  return choice;
}

function applyTheme(choice) {
  const resolved = resolveTheme(choice);
  document.documentElement.dataset.bsTheme = resolved;
}

function updateToggleUI(choice) {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.themeChoice === choice);
  });
}

export function initTheme() {
  const choice = getStoredChoice();
  applyTheme(choice);
  updateToggleUI(choice);

  // Listen for OS preference changes (only matters in system mode)
  mq.addEventListener('change', () => {
    if (getStoredChoice() === 'system') {
      applyTheme('system');
    }
  });

  // Setup toggle buttons
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newChoice = btn.dataset.themeChoice;
      localStorage.setItem(STORAGE_KEY, newChoice);
      applyTheme(newChoice);
      updateToggleUI(newChoice);
    });
  });
}
