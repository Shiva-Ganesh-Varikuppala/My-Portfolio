# ShivaGanesh.V — Portfolio

A minimal, editorial-style personal portfolio for an aspiring **AI / ML engineer & DSA enthusiast**.

Hand-built with plain HTML, CSS and JavaScript — no build step, no framework. Just open `index.html`.

**Live demo →** [shivaganeshportfolio.netlify.app](https://6a18822c634305b54962a067--shivaganeshportfolio.netlify.app/)

---

## Highlights

- **Editorial minimal aesthetic** — Fraunces serif headings, Inter body, warm off-white paper feel
- **Three theme modes** — Light · Dark · Cyan, cycled by the toggle in the top right; persisted in `localStorage`; first load respects your OS preference
- **Neural-network cursor effect** — full-page canvas of drifting nodes that auto-connect with thin lines; the cursor inflates and links to nearby nodes
- **Animated hero** — staggered line reveal, infinite italic marquee strip
- **Interactive work list** — hover any row to invert it and reveal a floating preview image; click to open the GitHub repo
- **Capabilities grid** — Machine Learning, Deep Learning, DSA, Python & Tooling
- **Live IST clock** in the contact section, scroll-progress bar, fade-in sections
- Fully responsive; respects `prefers-reduced-motion`

---

## File layout

```
My-Portfolio/
├── index.html      # markup + content
├── style.css       # tokens, themes, all visual styling
├── script.js       # theme toggle, canvas constellation, scroll, clock
└── README.md       # this file
```

That's the entire project.

---

## Local preview

No tooling needed:

```bash
open index.html          # macOS — opens in default browser
```

Or just double-click `index.html`. For live-reload while editing:

```bash
npx serve .              # or: python3 -m http.server
```

---

## Customising

| What you want to change | Where to edit |
| --- | --- |
| Name, email, intro copy | `index.html` — search for `ShivaGanesh` |
| Projects in the work list | `index.html` — the `<ul class="work-list">` block; update `data-href`, `data-img`, title and tag |
| Social links | `index.html` — the `.c-links` block in the contact section |
| Theme palettes | `style.css` — the `:root`, `[data-theme="dark"]`, `[data-theme="cyan"]` blocks at the top |
| Cursor / canvas behaviour | `script.js` — the `cfg` object inside the neural-net section (density, link distance, cursor radius, drift speed) |

---

## Themes

| Mode  | Background | Accent | Vibe |
| ----- | ---------- | ------ | ---- |
| Light | warm off-white `#f4efe6` | terracotta `#b14a2f` | editorial, calm |
| Dark  | warm espresso `#0e0a08` | gold `#f2b97a` | atmospheric, premium |
| Cyan  | deep navy `#050c14` | electric cyan `#5ce1ff` | cyberpunk, futuristic |

---

## Tech

Plain web platform: HTML · CSS · vanilla JS · Canvas2D. Fonts via Google Fonts (Fraunces + Inter). No dependencies.

---

## Author

**ShivaGanesh V**

- Email — [vsgvarikuppala@gmail.com](mailto:vsgvarikuppala@gmail.com)
- GitHub — [shiva676466](https://github.com/shiva676466)
- LinkedIn — [shivaganesh-v](https://www.linkedin.com/in/shivaganesh-v)
- X / Twitter — [@mymac688769](https://x.com/mymac688769)
