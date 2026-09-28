# Set Calculator

[![Tests](https://github.com/rafael-mishayev/set-calculator/actions/workflows/test.yml/badge.svg)](https://github.com/rafael-mishayev/set-calculator/actions/workflows/test.yml)

An interactive set-theory calculator: union, intersection, difference, symmetric
difference and cartesian product, with a live Venn diagram and a running history
of every calculation. Vanilla HTML/CSS/JS, no dependencies, no build step.

**Live demo:** https://rafael-mishayev.github.io/set-calculator/

## Features

- **Five set operations** — union (A ∪ B), intersection (A ∩ B), difference in
  both directions (A \ B, B \ A), symmetric difference (A △ B) and cartesian
  product (A × B).
- **Live parsing** — type a comma-separated list into either set and see it
  parsed into unique elements (with duplicates removed and numeric tokens
  normalized) as chips, in real time.
- **Interactive Venn diagram** — an SVG diagram built from the actual
  two-circle intersection geometry, so each operation highlights exactly the
  region it represents (not just "dim the other circle").
- **Cartesian product table** — pairs are rendered as a table instead of a
  flat chip list, capped at 200 rows so a large input can't freeze the page.
- **Calculation history** — the last 15 operations are kept in a sidebar for
  quick reference.
- **Dark mode** — follows the OS color-scheme by default and remembers your
  choice in `localStorage`.
- **Responsive layout** — collapses to a single column on narrow screens.

## Running locally

No build step or dependencies — just serve the folder and open it:

```bash
npx serve .
```

or simply open [index.html](index.html) directly in a browser.

## Running the tests

The set-operations engine is pure JavaScript and is covered by a small
Node-based test suite:

```bash
npm test
```

## Project structure

```
set-calculator/
├── index.html              # page structure
├── css/
│   └── style.css           # layout, theming, animations
├── js/
│   ├── setOperations.js     # pure set-theory functions (framework-free)
│   ├── venn.js               # Venn diagram geometry and rendering
│   └── app.js                 # DOM wiring: parsing, operations, history, theme
└── tests/
    └── setOperations.test.js
```

## How the Venn diagram works

Instead of just fading a whole circle in or out, the diagram is built from
three separate SVG paths — "A only", "B only" and the intersection lens —
derived from the standard two-equal-circles vesica construction. Each
operation lights up exactly the combination of regions it represents, e.g.
symmetric difference highlights both crescents but leaves the lens neutral.

## Tech stack

Vanilla JavaScript (ES6), CSS custom properties for theming, inline SVG for
the diagram, and Node's built-in `assert` module for testing. No frameworks,
no bundler, no npm dependencies.
