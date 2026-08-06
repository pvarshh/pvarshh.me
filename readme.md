# pvarshh.me

My personal site — a lil about me n what I like.

Hand-written HTML, CSS, and vanilla JS. No framework, no build step, no
dependencies. Every page is a static file you can open directly in a browser.

## Running it

Anything that serves static files works. The site uses absolute paths
(`/src/...`), so serve from the repo root rather than opening `index.html`
off the filesystem:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Layout

```
index.html          home — maze gate, radio tuner, the four panels
pages/
  experience/       internships and research roles, newest first
  writing/          essays
  favorites/        books, music, movies, tv, pictures
  learning/         notes on things I'm working through
  find-me.html      links out
  resume.html
src/
  css/              styles.css is shared; the rest is per-surface
  js/               maze.js, story.js (tuner + panels), subpage.js, footer.js
  images/  pdf/  favicon/
```

## Notes on the home page

- **The maze** (`src/js/maze.js`) generates a random perfect maze with
  randomized DFS and gates the page. Solving it — or taking either escape
  hatch — sets `mazeSolved` in `localStorage`, so it only ever appears once
  per visitor. "Collapse the wavefunction" animates a BFS flood fill to the
  exit; "skip" just opens the door.
- **The tuner** (`src/js/story.js`) maps a dial position to four realms.
  Landing on a station reveals that panel. Arrow keys work; `prefers-reduced-motion`
  skips the whole thing and shows all panels at once.
- With JavaScript disabled, a `<noscript>` block removes the gate and reveals
  every panel, since the maze would otherwise be unsolvable.
