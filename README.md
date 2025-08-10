# Neocortical Column — React Visualization (Layers I–VI)

A zero-dependency (React + Vite) app that visualizes intra‑layer microcircuits and inter‑layer dataflow in a canonical neocortical column, with:
- **E/I microcircuits** (E↔E, E→I, I→E) per layer.
- **Thalamic core input** to L4, **apical (L1) feedback** to L2/3 and L5, and **corticothalamic** feedback from L6.
- **Feedforward**: L4→L2/3→L5→L6 and **outputs** from L5 to higher cortex.
- Phase presets: **Infer**, **Predict**, **Update**, **All**.
- Keyboard: `F` feedforward, `B` feedback, `R` recurrent, `P` particles.

## Run

```bash
# inside this folder
npm install
npm run dev
# or
pnpm install
pnpm dev
```

Open the printed localhost URL in a browser.

## Build
```bash
npm run build
npm run preview
```

## Files
- `src/components/model.ts` — node/edge layout with richer biological details.
- `src/components/CortexSVG.tsx` — renders SVG + edge particles + phase logic.
- `src/components/Controls.tsx` — UI toggles and phase buttons.
- `src/App.tsx` — page layout.
- `src/styles.css` — styling.

Keep iterating: subdivide L4 (IVcα/β), add distinct IT vs PT vs CT populations, or add laminar‑specific long‑range projections.