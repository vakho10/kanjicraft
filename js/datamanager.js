import { DEFAULT_CARDS } from './data.js';
import { showToast } from './utils.js';

const STORAGE_KEY = 'kanjicraft_groups';

// Load saved groups from localStorage, or initialize with defaults
function loadGroups() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

function saveGroups(groups) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

// Groups stored as { "Group Name": [ {k, r, m}, ... ], ... }
function groupsFromCards(cards) {
  const groups = {};
  cards.forEach(c => {
    if (!groups[c.g]) groups[c.g] = [];
    groups[c.g].push({ k: c.k, r: c.r, m: c.m });
  });
  return groups;
}

function cardsFromGroups(groups) {
  const cards = [];
  Object.entries(groups).forEach(([g, entries]) => {
    entries.forEach(e => cards.push({ k: e.k, r: e.r, m: e.m, g }));
  });
  return cards;
}

// Initialize: load from storage or use defaults
let groups = loadGroups();
if (!groups) {
  groups = groupsFromCards(DEFAULT_CARDS);
  saveGroups(groups);
}

export function getAllCards() {
  return cardsFromGroups(groups);
}

export function getGroupNames() {
  return Object.keys(groups);
}

export function removeGroup(name) {
  delete groups[name];
  saveGroups(groups);
}

export function addGroup(name, cards) {
  groups[name] = cards.map(c => ({ k: c.k, r: c.r, m: c.m }));
  saveGroups(groups);
}

export function hasGroup(name) {
  return name in groups;
}

export function getGroupCount(name) {
  return groups[name] ? groups[name].length : 0;
}

export function resetToDefaults() {
  groups = groupsFromCards(DEFAULT_CARDS);
  saveGroups(groups);
}

// Parse imported JSON. Supports two formats:
//
// Format 1 (flat array):
// [
//   { "kanji": "郷", "reading": "きょう", "meaning": "village", "group": "My Group" },
//   ...
// ]
//
// Format 2 (grouped):
// {
//   "group": "My Group",
//   "cards": [
//     { "kanji": "郷", "reading": "きょう", "meaning": "village" },
//     ...
//   ]
// }
//
// Also accepts shorthand keys: k/r/m instead of kanji/reading/meaning
export function parseImportedJSON(text) {
  const data = JSON.parse(text);
  const results = []; // Array of { group, cards }

  if (Array.isArray(data)) {
    // Format 1: flat array
    const byGroup = {};
    data.forEach(item => {
      const group = item.group || item.g || 'Imported';
      const card = {
        k: item.kanji || item.k || '',
        r: item.reading || item.r || '',
        m: item.meaning || item.m || '',
      };
      if (!card.k) return;
      if (!byGroup[group]) byGroup[group] = [];
      byGroup[group].push(card);
    });
    Object.entries(byGroup).forEach(([group, cards]) => {
      results.push({ group, cards });
    });
  } else if (data && typeof data === 'object') {
    // Format 2: grouped object
    const group = data.group || data.name || 'Imported';
    const items = data.cards || data.items || data.data || [];
    const cards = items.map(item => ({
      k: item.kanji || item.k || '',
      r: item.reading || item.r || '',
      m: item.meaning || item.m || '',
    })).filter(c => c.k);
    if (cards.length > 0) {
      results.push({ group, cards });
    }
  }

  return results;
}

let renderGroupListGlobal = () => {};

// Setup drag-and-drop and data manager UI
export function setupDataManager(onDataChanged) {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const groupList = document.getElementById('group-list');
  const manageBtn = document.getElementById('manage-data-btn');
  const managerPanel = document.getElementById('data-manager');
  const resetBtn = document.getElementById('reset-defaults-btn');

  // Toggle panel
  manageBtn.addEventListener('click', () => {
    managerPanel.classList.toggle('hidden');
    if (!managerPanel.classList.contains('hidden')) {
      renderGroupList();
    }
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!managerPanel.contains(e.target) && e.target !== manageBtn && !managerPanel.classList.contains('hidden')) {
      managerPanel.classList.add('hidden');
    }
  });

  // Drag and drop
  ['dragenter', 'dragover'].forEach(evt => {
    dropZone.addEventListener(evt, e => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropZone.addEventListener(evt, e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    });
  });

  dropZone.addEventListener('drop', e => {
    const files = e.dataTransfer.files;
    handleFiles(files, onDataChanged);
  });

  // Click to browse
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files, onDataChanged);
    fileInput.value = '';
  });

  // Reset to defaults
  resetBtn.addEventListener('click', () => {
    resetToDefaults();
    renderGroupList();
    onDataChanged();
    showToast('Reset to default data');
  });

  function renderGroupList() {
    groupList.innerHTML = '';
    const names = getGroupNames();

    if (names.length === 0) {
      groupList.innerHTML = '<div class="group-item" style="justify-content:center;color:var(--text-muted)">No groups loaded. Import a JSON file to get started.</div>';
      return;
    }

    names.forEach(name => {
      const count = getGroupCount(name);
      const div = document.createElement('div');
      div.className = 'group-item';
      div.innerHTML = `
        <div class="group-item-info">
          <span class="group-item-name">${escapeHtml(name)}</span>
          <span class="group-item-count">${count} cards</span>
        </div>
        <button class="group-remove-btn" title="Remove group"><i class="fa-solid fa-xmark"></i></button>
      `;
      div.querySelector('.group-remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        removeGroup(name);
        renderGroupList();
        onDataChanged();
        showToast(`Removed "${name}"`);
      });
      groupList.appendChild(div);
    });
  }

  renderGroupListGlobal = renderGroupList;

  // Initial render
  renderGroupList();
}

function handleFiles(files, onDataChanged) {
  Array.from(files).forEach(file => {
    if (!file.name.endsWith('.json')) {
      showToast('Please drop a .json file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseImportedJSON(e.target.result);
        if (parsed.length === 0) {
          showToast('No valid kanji data found in file');
          return;
        }

        let totalCards = 0;
        parsed.forEach(({ group, cards }) => {
          addGroup(group, cards);
          totalCards += cards.length;
        });

        const groupNames = parsed.map(p => p.group).join(', ');
        showToast(`Imported ${totalCards} cards into ${parsed.length} group(s)`);
        onDataChanged();
        renderGroupListGlobal();
      } catch (err) {
        showToast('Invalid JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
