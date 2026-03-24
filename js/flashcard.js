import { shuffle, showToast, state, updateStats } from './utils.js';

let fcIndex = 0;
let fcDeck = [];

export function initFlashcards() {
  fcDeck = state.filteredCards.filter(c => !state.knownSet.has(c.k));
  if (fcDeck.length === 0) fcDeck = [...state.filteredCards];
  fcIndex = 0;
  renderFlashcard();
}

function renderFlashcard() {
  if (fcDeck.length === 0) { initFlashcards(); return; }
  const card = fcDeck[fcIndex];
  document.getElementById('fc-kanji').textContent = card.k;
  document.getElementById('fc-reading').textContent = card.r;
  document.getElementById('fc-meaning').textContent = card.m;
  document.getElementById('fc-kanji-back').textContent = card.k;
  document.getElementById('fc-group').textContent = card.g.replace('漢字 ', '');
  document.getElementById('fc-counter').textContent = `${fcIndex + 1} / ${fcDeck.length}`;
  document.getElementById('flashcard').classList.remove('flipped');
}

export function setupFlashcards() {
  document.getElementById('flashcard-wrapper').addEventListener('click', () => {
    document.getElementById('flashcard').classList.toggle('flipped');
  });

  document.getElementById('fc-prev').addEventListener('click', e => {
    e.stopPropagation();
    fcIndex = (fcIndex - 1 + fcDeck.length) % fcDeck.length;
    renderFlashcard();
  });

  document.getElementById('fc-next').addEventListener('click', e => {
    e.stopPropagation();
    fcIndex = (fcIndex + 1) % fcDeck.length;
    renderFlashcard();
  });

  document.getElementById('fc-shuffle').addEventListener('click', () => {
    fcDeck = shuffle(fcDeck);
    fcIndex = 0;
    renderFlashcard();
    showToast('Shuffled!');
  });

  document.getElementById('fc-know').addEventListener('click', () => {
    if (fcDeck.length === 0) return;
    const card = fcDeck[fcIndex];
    state.knownSet.add(card.k);
    localStorage.setItem('kanjiKnown', JSON.stringify([...state.knownSet]));
    state.score += 5;
    state.streak++;
    updateStats();
    fcDeck.splice(fcIndex, 1);
    if (fcDeck.length === 0) {
      showToast('All cards known! Resetting deck.');
      initFlashcards();
    } else {
      fcIndex = fcIndex % fcDeck.length;
      renderFlashcard();
      showToast(`Marked known! ${fcDeck.length} remaining`);
    }
  });

  document.getElementById('fc-reset-known').addEventListener('click', () => {
    state.knownSet.clear();
    localStorage.removeItem('kanjiKnown');
    initFlashcards();
    showToast('Reset all known cards');
  });

  document.addEventListener('keydown', e => {
    if (state.currentMode !== 'flashcard') return;
    if (e.key === 'ArrowLeft') document.getElementById('fc-prev').click();
    else if (e.key === 'ArrowRight') document.getElementById('fc-next').click();
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      document.getElementById('flashcard').classList.toggle('flipped');
    }
  });
}
