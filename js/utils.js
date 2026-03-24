export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

export const state = {
  currentMode: 'flashcard',
  currentGroup: 'all',
  filteredCards: [],
  score: 0,
  streak: 0,
  knownSet: new Set(JSON.parse(localStorage.getItem('kanjiKnown') || '[]')),
};

export function updateStats() {
  document.getElementById('score').textContent = state.score;
  document.getElementById('streak').textContent = state.streak;
  document.getElementById('card-count').textContent = state.filteredCards.length;
}

export function filterCards(allCards) {
  state.filteredCards = state.currentGroup === 'all'
    ? [...allCards]
    : allCards.filter(c => c.g === state.currentGroup);
  updateStats();
}
