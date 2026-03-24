import { shuffle, showToast, state, updateStats } from './utils.js';

let quizDirection = 'kanji-to-meaning';
let quizQueue = [];
let quizIndex = 0;
let quizCorrect = 0;
let quizAnswered = false;

export function initQuiz() {
  quizQueue = shuffle(state.filteredCards).slice(0, Math.min(20, state.filteredCards.length));
  quizIndex = 0;
  quizCorrect = 0;
  quizAnswered = false;
  document.getElementById('quiz-complete').classList.remove('visible');
  document.getElementById('quiz-options').classList.remove('hidden');
  document.getElementById('quiz-prompt').classList.remove('hidden');
  renderQuiz();
}

function renderQuiz() {
  if (quizIndex >= quizQueue.length) {
    showQuizComplete();
    return;
  }

  quizAnswered = false;
  document.getElementById('quiz-next').classList.remove('visible');
  document.getElementById('quiz-progress').style.width = `${(quizIndex / quizQueue.length) * 100}%`;

  const card = quizQueue[quizIndex];
  const promptEl = document.getElementById('quiz-prompt');
  const optionsEl = document.getElementById('quiz-options');

  let promptText, correctAnswer, getWrong;

  switch (quizDirection) {
    case 'kanji-to-meaning':
      promptText = card.k;
      promptEl.className = 'quiz-prompt';
      correctAnswer = card.m;
      getWrong = c => c.m;
      break;
    case 'meaning-to-kanji':
      promptText = card.m;
      promptEl.className = 'quiz-prompt show-meaning';
      correctAnswer = card.k;
      getWrong = c => c.k;
      break;
    case 'kanji-to-reading':
      promptText = card.k;
      promptEl.className = 'quiz-prompt';
      correctAnswer = card.r;
      getWrong = c => c.r;
      break;
    case 'reading-to-kanji':
      promptText = card.r;
      promptEl.className = 'quiz-prompt show-meaning';
      correctAnswer = card.k;
      getWrong = c => c.k;
      break;
  }

  promptEl.textContent = promptText;

  const wrongs = shuffle(state.filteredCards.filter(c => c.k !== card.k))
    .slice(0, 3)
    .map(getWrong);

  const options = shuffle([correctAnswer, ...wrongs]);

  optionsEl.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => onQuizAnswer(btn, opt, correctAnswer));
    optionsEl.appendChild(btn);
  });
}

function onQuizAnswer(btn, chosen, correct) {
  if (quizAnswered) return;
  quizAnswered = true;

  document.querySelectorAll('.quiz-option').forEach(b => {
    b.classList.add('answered');
    if (b.textContent === correct) b.classList.add('correct');
  });

  if (chosen === correct) {
    quizCorrect++;
    state.score += 10;
    state.streak++;
    showToast('Correct!');
  } else {
    btn.classList.add('wrong');
    state.streak = 0;
    showToast(`Wrong! Answer: ${correct}`);
  }

  updateStats();
  document.getElementById('quiz-next').classList.add('visible');
}

function showQuizComplete() {
  document.getElementById('quiz-options').classList.add('hidden');
  document.getElementById('quiz-prompt').classList.add('hidden');
  document.getElementById('quiz-next').classList.remove('visible');
  document.getElementById('quiz-complete').classList.add('visible');
  const pct = Math.round((quizCorrect / quizQueue.length) * 100);
  document.getElementById('quiz-result-text').textContent =
    `${quizCorrect} / ${quizQueue.length} correct`;
  document.getElementById('quiz-score-display').textContent = `${pct}%`;
  document.getElementById('quiz-progress').style.width = '100%';
}

export function setupQuiz() {
  document.getElementById('quiz-next').addEventListener('click', () => {
    quizIndex++;
    renderQuiz();
  });

  document.getElementById('quiz-restart').addEventListener('click', initQuiz);

  document.querySelectorAll('.quiz-dir-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-dir-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      quizDirection = btn.dataset.dir;
      initQuiz();
    });
  });
}
