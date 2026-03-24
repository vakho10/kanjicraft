import { ALL_CARDS } from './data.js';
import { state, filterCards } from './utils.js';
import { initFlashcards, setupFlashcards } from './flashcard.js';
import { initMatch, setupMatch } from './matching.js';
import { initQuiz, setupQuiz } from './quiz.js';

// Setup all game modules
setupFlashcards();
setupMatch();
setupQuiz();

// Mode switching
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
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

// Group filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentGroup = btn.dataset.group;
    filterCards(ALL_CARDS);

    if (state.currentMode === 'flashcard') initFlashcards();
    else if (state.currentMode === 'match') initMatch();
    else if (state.currentMode === 'quiz') initQuiz();
  });
});

// Init
filterCards(ALL_CARDS);
initFlashcards();
