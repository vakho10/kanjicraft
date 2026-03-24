import { state, filterCards } from './utils.js';
import { initFlashcards, setupFlashcards } from './flashcard.js';
import { initMatch, setupMatch } from './matching.js';
import { initQuiz, setupQuiz } from './quiz.js';
import { getAllCards, getGroupNames, setupDataManager } from './datamanager.js';

// Setup all game modules
setupFlashcards();
setupMatch();
setupQuiz();

// Mode switching
document.querySelectorAll('.nav-btn[data-mode]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn[data-mode]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentMode = btn.dataset.mode;

    document.getElementById('flashcard-mode').classList.toggle('hidden', state.currentMode !== 'flashcard');
    document.getElementById('match-mode').classList.toggle('hidden', state.currentMode !== 'match');
    document.getElementById('quiz-mode').classList.toggle('hidden', state.currentMode !== 'quiz');

    if (state.currentMode === 'flashcard') initFlashcards();
    else if (state.currentMode === 'match') initMatch();
    else if (state.currentMode === 'quiz') initQuiz();
  });
});

// Dynamic filter bar
function buildFilterBar() {
  const bar = document.getElementById('filter-bar');
  bar.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn active';
  allBtn.dataset.group = 'all';
  allBtn.textContent = 'All';
  bar.appendChild(allBtn);

  getGroupNames().forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.group = name;
    btn.textContent = name.replace(/^漢字\s*/, '');
    bar.appendChild(btn);
  });

  bar.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentGroup = btn.dataset.group;
      filterCards(getAllCards());
      reinitCurrentMode();
    });
  });
}

function reinitCurrentMode() {
  if (state.currentMode === 'flashcard') initFlashcards();
  else if (state.currentMode === 'match') initMatch();
  else if (state.currentMode === 'quiz') initQuiz();
}

function refreshAll() {
  state.currentGroup = 'all';
  buildFilterBar();
  filterCards(getAllCards());
  reinitCurrentMode();
}

// Setup data manager (drag & drop, group management)
setupDataManager(refreshAll);

// Init
refreshAll();
