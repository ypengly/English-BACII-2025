# English-BACII-2025
# New Friends — English Practice Quiz

A self-contained, offline quiz website built from the "New Friends" exam paper
(Reading, Grammar, Vocabulary). Open `index.html` in any browser — no server,
build step, or internet connection required.

## Files

| File         | What it does |
|--------------|---------------|
| `index.html` | Page structure: welcome screen, quiz screen, results screen, review screen |
| `style.css`  | Exam-paper look (ruled paper background, serif type, a/b/c/d option grid, word-bank highlighting) |
| `script.js`  | All quiz data + logic: questions, scoring, timer, shuffle, review |

Just keep all three files in the same folder — double-click `index.html` to run it.

## Features

- **Welcome screen** — exam title, question/point counts, and options for:
  - Shuffle questions (Part 2/3 order changes; the reading passage always stays whole)
  - Shuffle answer choices (a/b/c/d order changes per grammar/vocab question)
  - Optional countdown timer (off, 5, 10, 15, or 20 minutes) — auto-submits at zero
- **Part 1 (Reading)** renders as one full paragraph with the word-box at the top,
  just like the original paper. Each gap is an inline dropdown; picking a word
  highlights it **yellow** in the word box so you can see what's already used.
- **Part 2 & 3 (Grammar/Vocabulary)** — one multiple-choice question per screen,
  laid out in the same a/b/c/d grid as the paper.
- **Navigation** — Next/Previous, a flag button to mark a question for later,
  and a jump grid at the bottom (green = answered, red outline = flagged).
- **Results screen** — animated score ring, percentage, correct/total count,
  a per-section breakdown (Reading / Grammar / Vocabulary), and feedback:
  - 90–100% → Excellent
  - 70–89% → Good Job
  - 50–69% → Keep Practicing
  - Below 50% → Review the material again
- **Review screen** — the full passage reprinted with your answers marked
  correct (green) or incorrect (red, struck through, with the right word shown),
  plus each grammar/vocab question with your answer vs. the correct one.
- **Retake Quiz** resets everything and returns to the welcome screen.

## Editing the questions

Everything lives in `script.js`:

- `WORD_BANK` — the list of words available for the Part 1 dropdowns.
- `PASSAGE_SEGMENTS` — the reading passage, written as an array of plain text
  strings mixed with `{given: "word"}` (already-filled example) and
  `{blankId: "rN"}` (an editable gap). Edit the text here to change the passage.
- `QUESTIONS` — every scored question:
  - Reading gaps: `type: "bank"`, matched against `WORD_BANK`.
  - Grammar/Vocabulary: `type: "mc"`, with an `options` object (`a`–`d`) and
    an `answer` letter.

To add a new grammar or vocabulary question, copy an existing object in
`QUESTIONS` and change the `id`, `prompt`, `options`, and `answer`. To add a
new reading gap, add a matching `{blankId: "..."}` segment in
`PASSAGE_SEGMENTS` and a corresponding object in `QUESTIONS`.

## Customizing the look

Colors, fonts, and spacing are all defined as CSS variables at the top of
`style.css` (`:root { ... }`) — e.g. `--pen-red`, `--pen-green`, `--highlight`,
`--font-serif`. Changing a variable updates it everywhere it's used.

## Browser support

Works in any modern browser (Chrome, Firefox, Safari, Edge). Fonts load from
Google Fonts when online; if you're fully offline the page still works, just
with the browser's default serif font instead of Tinos.
