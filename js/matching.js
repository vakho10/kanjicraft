import { shuffle, state, updateStats } from './utils.js';

let matchPairCount = 6;
let matchSelected = null;
let matchFound = 0;
let matchAttempts = 0;
let matchCards = [];

export function initMatch() {
  matchFound = 0;
  matchAttempts = 0;
  matchSelected = null;
  matchCards = [];

  const pool = shuffle(state.filteredCards).slice(0, matchPairCount);
  const grid = [];

  pool.forEach((card, i) => {
    grid.push({ id: i, type: 'kanji', text: card.k, pairId: i });
    grid.push({ id: i, type: 'reading', text: `${card.r}\n${card.m}`, pairId: i });
  });

  matchCards = shuffle(grid);

  const gridEl = document.getElementById('match-grid');
  gridEl.innerHTML = '';

  matchCards.forEach((mc, idx) => {
    const div = document.createElement('div');
    div.className = `match-card ${mc.type === 'kanji' ? 'kanji-card' : 'reading-card'}`;
    div.textContent = mc.text;
    div.dataset.idx = idx;
    div.addEventListener('click', () => onMatchClick(idx, div));
    gridEl.appendChild(div);
  });

  document.getElementById('match-found').textContent = 0;
  document.getElementById('match-total').textContent = matchPairCount;
  document.getElementById('match-attempts').textContent = 0;
  document.getElementById('match-progress').style.width = '0%';
  document.getElementById('match-complete').classList.remove('visible');
}

function onMatchClick(idx, el) {
  if (el.classList.contains('matched') || el.classList.contains('disabled')) return;

  const mc = matchCards[idx];

  if (matchSelected === null) {
    matchSelected = { idx, el, mc };
    el.classList.add('selected');
    return;
  }

  if (matchSelected.idx === idx) {
    matchSelected.el.classList.remove('selected');
    matchSelected = null;
    return;
  }

  matchAttempts++;
  document.getElementById('match-attempts').textContent = matchAttempts;

  const prev = matchSelected;
  matchSelected = null;

  if (prev.mc.pairId === mc.pairId && prev.mc.type !== mc.type) {
    prev.el.classList.remove('selected');
    prev.el.classList.add('correct-flash');
    el.classList.add('correct-flash');
    setTimeout(() => {
      prev.el.classList.remove('correct-flash');
      el.classList.remove('correct-flash');
      prev.el.classList.add('matched');
      el.classList.add('matched');
    }, 500);
    matchFound++;
    state.score += 10;
    state.streak++;
    updateStats();
    document.getElementById('match-found').textContent = matchFound;
    document.getElementById('match-progress').style.width = `${(matchFound / matchPairCount) * 100}%`;

    if (matchFound === matchPairCount) {
      const bonus = Math.max(0, matchPairCount * 3 - matchAttempts) * 5;
      state.score += bonus;
      updateStats();
      document.getElementById('match-complete').classList.add('visible');
      document.getElementById('match-score-display').textContent = `+${matchFound * 10 + bonus} pts`;
    }
  } else {
    prev.el.classList.remove('selected');
    prev.el.classList.add('wrong-flash');
    el.classList.add('wrong-flash');
    state.streak = 0;
    updateStats();
    setTimeout(() => {
      prev.el.classList.remove('wrong-flash');
      el.classList.remove('wrong-flash');
    }, 500);
  }
}

export function setupMatch() {
  document.getElementById('match-new').addEventListener('click', initMatch);
  [6, 8, 10].forEach(n => {
    document.getElementById(`match-size-${n}`).addEventListener('click', () => {
      matchPairCount = n;
      initMatch();
    });
  });
}
