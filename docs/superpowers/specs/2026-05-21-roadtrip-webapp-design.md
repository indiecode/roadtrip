# Road Trip Web App — Design Spec
_Date: 2026-05-21_

## Overview

A read-only React web app that displays a 56-day Tesla road trip plan (Boston → West → Boston) as a browsable day-by-day guide and an annotated Leaflet map. The app is personal-use and publicly shareable via a single Cloudflare Pages URL.

---

## Goals

- Display the trip plan in a clean, stage-by-stage format
- Show the full route on a real map with annotated markers (parks, chargers, camps)
- Be easy to update as the plan evolves — markdown is the single source of truth
- Deployed publicly via Cloudflare Pages, code hosted on GitHub

## Non-Goals

- No user accounts, authentication, or backend
- No editing in the UI — plan changes happen in the markdown file
- No real-time tracking or live data

---

## Architecture

### Stack
- **React + Vite** — SPA, no router (tab switching via state)
- **TypeScript** throughout
- **Leaflet + react-leaflet** — map with OpenStreetMap tiles
- **Cloudflare Pages** — static hosting, auto-deploy from GitHub

### Data Flow

```
data/road_trip_field_guide.md   ← source of truth (edit here)
         ↓
scripts/parse-trip.ts           ← build-time parser
         ↓
src/data/trip.json              ← structured trip data (committed)
         ↓
React components                ← import trip.json statically
         ↓
dist/                           ← Vite build output
         ↓
Cloudflare Pages                ← serves dist/
```

**Build command:** `npm run parse && npm run build`

When the plan changes: update `data/road_trip_field_guide.md`, run `npm run parse` to regenerate `src/data/trip.json`, commit both, push to `main` → Cloudflare auto-deploys.

### trip.json Shape

```ts
interface TripData {
  title: string
  subtitle: string
  stats: { days: number; miles: number; people: number }
  stages: Stage[]
}

interface Stage {
  id: number
  name: string           // e.g. "Boston to the Black Hills"
  days: string           // e.g. "Days 1–8"
  miles: string
  notes: string
  days_list: Day[]
}

interface Day {
  day: string            // e.g. "1" or "10–12"
  route: string
  charge: string
  sleep: string
  sleep_type: 'hotel' | 'camp'
  notes?: string
}

interface MapMarker {
  id: string
  name: string
  lat: number
  lng: number
  type: 'park' | 'charger' | 'camp' | 'city'
  day?: string
  notes?: string
  tags?: string[]
}
```

---

## Components

### `App`
- Holds tab state: `'plan' | 'map'`
- Renders header with tab toggle, then `<PlanView>` or `<MapView>`
- Imports `trip.json` and passes data down as props

### `PlanView`
- Stage filter pills (All + one per stage)
- Scrollable list of `<DayCard>` for the selected stage
- Stage summary header (day range, mileage, notes)

### `DayCard`
- Displays: day number, route, charge note, sleep type
- Color accent: green border for camp nights, blue for hotel nights
- Sleep badge (🏕 Camp / 🏨 Hotel)

### `MapView`
- Full-height Leaflet map with OpenStreetMap tiles
- Dashed polyline for the full route
- Marker layer with color-coded pins:
  - Red — national parks / key stops
  - Blue — Superchargers
  - Green — camp nights
- Filter pills (All / Parks / Chargers / Camps) toggle marker visibility
- Click marker → pop-up with name, day, notes, tags

### `MarkerPopup`
- Name, day range, notes from the field guide
- Type tags (e.g. "Free camp", "Day 5–6")

---

## Visual Design

- **Dark theme** throughout (suits a trip/adventure context)
- **Accent color:** warm gold (`#e2b96f`) for brand/active states
- **Camp nights:** green accent (`#51cf66`)
- **Hotel nights:** blue accent (`#4a9eff`)
- **Font:** system font stack — no custom font load needed
- Mobile-friendly: stage pills scroll horizontally, map is touch-enabled via Leaflet

---

## Deployment

### GitHub
- Repo: new public or private GitHub repo
- `main` branch = production

### Cloudflare Pages
- Connect GitHub repo via Cloudflare Pages dashboard
- Build command: `npm run parse && npm run build`
- Build output directory: `dist`
- Node version: 20
- Auto-deploys on push to `main`
- Preview deployments on PRs (useful for reviewing plan changes before publishing)

### Environment
- No environment variables needed — fully static, no API keys

---

## Project Structure

```
roadtrip/
├── data/
│   └── road_trip_field_guide.md    # source of truth — edit this
├── scripts/
│   └── parse-trip.ts               # markdown → trip.json
├── src/
│   ├── data/
│   │   └── trip.json               # generated, committed
│   ├── components/
│   │   ├── App.tsx
│   │   ├── PlanView.tsx
│   │   ├── MapView.tsx
│   │   ├── DayCard.tsx
│   │   └── MarkerPopup.tsx
│   ├── types.ts                    # shared TypeScript interfaces
│   ├── main.tsx
│   └── index.css
├── public/
├── docs/
│   └── superpowers/specs/
│       └── 2026-05-21-roadtrip-webapp-design.md
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Update Workflow (when plan changes)

1. Edit `data/road_trip_field_guide.md`
2. Run `npm run parse` → regenerates `src/data/trip.json`
3. `git add data/road_trip_field_guide.md src/data/trip.json`
4. `git commit -m "update trip plan"`
5. `git push` → Cloudflare auto-deploys

---

## Map Coordinates

Marker coordinates will be hardcoded in `scripts/parse-trip.ts` as a lookup table keyed by location name. The parser matches day entries to known locations and emits `MapMarker` objects. Unknown locations are skipped (no marker rendered).
