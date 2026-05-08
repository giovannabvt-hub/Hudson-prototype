# Hudson Records

Global folk community website — cinematic 3D globe, member catalogue, governance.

## Stack

- **Vanilla JS modules** (no framework)
- **Vite** for the dev/build pipeline (optional — see below)
- **globe.gl** + **topojson-client** — 3D Earth with country polygons
- **Web Audio API** — regional folk motifs

## Run

### Option A — Python (no install)

You don't need Node.js. The page uses an `<script type="importmap">` so the browser loads `globe.gl` and `topojson-client` from `esm.sh`.

```bash
python3 -m http.server 5173
```

Then open <http://localhost:5173>.

### Option B — Vite (full dev experience, hot reload)

Requires Node.js 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produces dist/
npm run preview  # serve the build
```

## Structure

```
src/
├── main.js              # entry — mounts each page, starts router
├── styles.css           # all styles
├── data/
│   └── index.js         # offerings, artists, companies, threads, records, merch, posts, proposals, motifs
├── lib/
│   ├── globe.js         # globe.gl wrapper
│   ├── audio.js         # Web Audio motif playback + waveform
│   ├── router.js        # tiny hash router with onEnter / onLeave
│   └── utils.js         # shadeColor, hexToRgba, statusLabel
└── pages/
    ├── home.js          # globe + 5 modes (Discovery, Visitor, Company, Artist, Folk Community)
    ├── records.js       # release catalogue
    ├── merch.js         # member shop
    ├── table.js         # White Table — horizontal corkboard
    └── governance.js    # Snapshot-style proposals + voting
```

## Pages

| Route        | Description                                      |
|--------------|--------------------------------------------------|
| `#home`      | Cinematic globe with 5 filter modes              |
| `#records`   | Past / present / upcoming releases               |
| `#merch`     | Member-made instruments, books, prints, apparel  |
| `#table`     | White Table — horizontal pinboard                |
| `#vote`      | Governance — Snapshot-style member voting        |
