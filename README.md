# KanjiCraft

Interactive kanji learning card game. Import your own kanji data via drag & drop, or use the built-in example set. Built with plain HTML5, CSS3, and ES modules — no build step, no dependencies.

## Features

- **Drag & drop data import** — Drop a `.json` file to add your own kanji groups. Remove groups you don't need.
- **Flashcards** — Flip cards to reveal readings and meanings. Mark cards as "known" to focus on what you still need to learn. Keyboard navigation (arrow keys, space/enter).
- **Matching** — Pair kanji cards with their reading/meaning. Choose 6, 8, or 10 pairs per round.
- **Quiz** — 4-choice multiple choice with 4 directions:
  - Kanji → Meaning
  - Meaning → Kanji
  - Kanji → Reading
  - Reading → Kanji
- **Dynamic group filtering** — Filter buttons update automatically as you add/remove groups.
- **Score & streak tracking** — Gamified learning with points and streaks.
- **Data persistence** — All imported data and progress saved to localStorage.

## Importing Your Own Data

Click **Manage Data** in the nav bar, then drag & drop a `.json` file. Two formats are supported:

**Format 1 — Grouped:**
```json
{
  "group": "JLPT N1 - Set 1",
  "cards": [
    { "kanji": "郷", "reading": "きょう", "meaning": "village" },
    { "kanji": "故郷", "reading": "こきょう", "meaning": "hometown" }
  ]
}
```

**Format 2 — Flat array:**
```json
[
  { "kanji": "郷", "reading": "きょう", "meaning": "village", "group": "My Group" },
  { "kanji": "故郷", "reading": "こきょう", "meaning": "hometown", "group": "My Group" }
]
```

Shorthand keys `k`/`r`/`m`/`g` are also accepted.

## Getting Started

Just open `index.html` in a browser. No server or build tools needed.

For local development with a server (required for ES modules in some browsers):

```bash
npx serve .
```

## Deployment

This project is designed to deploy directly to **GitHub Pages**:

1. Push to GitHub
2. Go to Settings → Pages
3. Set source to the branch root (`/`)
4. Your site will be live at `https://<username>.github.io/kanjicraft/`

## Project Structure

```
kanjicraft/
├── index.html            # Main HTML
├── css/
│   └── styles.css        # All styles
├── js/
│   ├── app.js            # Entry point, mode switching, filters
│   ├── data.js           # Default kanji data (example set)
│   ├── datamanager.js    # Import/export, drag & drop, group management
│   ├── utils.js          # Shared state, shuffle, toast
│   ├── flashcard.js      # Flashcard mode logic
│   ├── matching.js       # Matching game logic
│   └── quiz.js           # Quiz mode logic
├── data/
│   └── kanji_words.md    # Kanji reference in markdown
└── README.md
```

## License

MIT
