# KanjiCraft

Interactive kanji learning card game with Japanese-Georgian translations. Built with plain HTML5, CSS3, and ES modules — no build step, no dependencies.

## Features

- **Flashcards** — Flip cards to reveal readings and Georgian meanings. Mark cards as "known" to focus on what you still need to learn. Keyboard navigation (arrow keys, space/enter).
- **Matching** — Pair kanji cards with their reading/meaning. Choose 6, 8, or 10 pairs per round.
- **Quiz** — 4-choice multiple choice with 4 directions:
  - Kanji → Meaning
  - Meaning → Kanji
  - Kanji → Reading
  - Reading → Kanji
- **Group filtering** — Study specific kanji ranges or all at once.
- **Score & streak tracking** — Gamified learning with points and streaks.
- **Progress persistence** — Known cards saved to localStorage.

## Kanji Groups

| Group | Count |
|-------|-------|
| 漢字 1381-1390 | 24 words |
| 漢字 1391-1400 | 24 words |
| 漢字 1401-1410 | 15 words |
| 漢字 1531-1540 | 27 words |

**Total: 90 kanji words**

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
├── index.html          # Main HTML
├── css/
│   └── styles.css      # All styles
├── js/
│   ├── app.js          # Entry point, mode switching, filters
│   ├── data.js         # Kanji data (easy to extend)
│   ├── utils.js        # Shared state, shuffle, toast
│   ├── flashcard.js    # Flashcard mode logic
│   ├── matching.js     # Matching game logic
│   └── quiz.js         # Quiz mode logic
├── data/
│   └── kanji_words.md  # Kanji reference in markdown
└── README.md
```

## Adding New Kanji

Edit `js/data.js` and add entries to the `ALL_CARDS` array:

```js
{k: "漢字", r: "かんじ", m: "იეროგლიფი", g: "漢字 XXXX-XXXX"},
```

Then add a filter button in `index.html` if it's a new group.

## License

MIT
