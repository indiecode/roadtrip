# Journey Tab — Design Spec
_Date: 2026-05-24_

## Overview

Add a third tab — **Journey** — alongside Plan and Map. It lets the user scrub through the trip's 42 day-entries with a slider. As they scrub:

- The map auto-pans/zooms to the entry's location
- A day card below the map updates to that entry
- The slider label shows the current day range and stage name

No auto-play, no animation loop, no plan/map cross-linking. Plain user-driven scrub.

Existing Plan and Map tabs are untouched.

---

## Goals

- Give the trip a sense of "movement through time" without a redesign of the existing views
- Keep the JSON-driven, build-time data pipeline intact
- Improve `scripts/parse-trip.ts` maintainability as a side effect of the work

## Non-Goals

- Auto-play / playback controls beyond scrub + prev/next
- Filtering markers by current day
- Progressive route reveal (dimmed past/future polyline)
- "You are here" pin moving along the route
- Cross-linking Plan/Map ↔ Journey
- Editing the trip in the UI

---

## Layout

Single vertical stack on the Journey tab:

```
┌────────────────────────────┐
│                            │
│          Map               │  ~55–60% of viewport height
│                            │
├────────────────────────────┤
│  Stage 2 — Black Hills     │  small stage label
│  ┌──────────────────────┐  │
│  │  DAY 5               │  │
│  │  Rapid City → Custer │  │  existing DayCard component
│  │  ⚡ Custer SC         │  │
│  │  🏕 Sage Creek        │  │
│  └──────────────────────┘  │
├────────────────────────────┤
│ ‹  ▬▬▬●▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  › │  prev | slider | next
│        Day 10–12 · Yellowstone   │
└────────────────────────────┘
```

Mobile: same stack, full-width.

---

## State

One state value drives the whole tab:

```ts
const [entryIndex, setEntryIndex] = useState(0)  // 0..41
```

The flat day-entry list is derived once:

```ts
const entries = stages.flatMap(stage =>
  stage.days_list.map(day => ({ day, stage }))
)
```

---

## Map behavior

The map pans/zooms to `entries[entryIndex].day.mapCenter` with `entries[entryIndex].day.mapZoom`. Implementation uses `map.flyTo(center, zoom, { duration: 0.6 })` from a child component that calls `useMap()`. The full route polyline and all markers stay visible the whole time.

Zoom tiers (defined in the parser, emitted into the data):

- `8` — park stays (single park region)
- `6` — multi-stop regional travel (e.g. driving across a state)
- `5` — long highway days (e.g. Boston → Cleveland)

---

## Per-entry coordinates

Each `Day` gets two new fields, computed at build time by `parse-trip`:

```ts
interface Day {
  // ...existing fields
  mapCenter: [number, number]  // [lat, lng]
  mapZoom: number              // 5 | 6 | 8
}
```

### Center derivation (in `scripts/lib/day-geometry.ts`)

For each day entry, pick a center using this fallback chain:

1. **Centroid of day-tagged markers**, if the entry has any markers tagged `"Day ${day.day}"`. Works for ~32 of 42 entries today.
2. **Gap lookup** — a small map of `day-string → location-name`, looking up the location's coords in the existing `COORDS` table:
   ```ts
   const GAP_DAY_LOCATIONS: Record<string, string> = {
     '10–12':  'Yellowstone NP',
     '14–15':  'Grand Teton NP',
     '18–19':  'Rocky Mountain NP',
     '21–22':  'Ouray',
     '34–35':  'Sequoia NP',
     '37–39':  'Yosemite NP',
     '42–43':  'Redwood NP',
     '49':     'Bend',
     '55':     'Glacier NP',
     '57+':    'Boston',
   }
   ```
   No duplicate coords — names map back to entries in `COORDS`.
3. **Neighboring entry's center** as last resort, so the slider never freezes on a stale view. The parser logs a warning if this path triggers (it should not in normal use).

### Zoom heuristic

```ts
function pickZoom(day: Day): number {
  if (day.day.includes('–')) return 8                              // multi-day stay
  const r = day.route.toLowerCase()
  if (r.includes('long') || r.includes('interstate')) return 5     // explicit highway day
  return 6                                                          // default regional
}
```

Heuristic, not magic. If a specific entry zooms wrong, override by adding it to the gap-lookup with a sentinel that the geometry module knows to interpret, or hand-edit `trip.json` after the parser runs and accept the regeneration cost. Don't add cleverer logic up front.

---

## Components

### New
- **`JourneyView.tsx`** — owns `entryIndex`, derives the flat entry list, renders map + stage label + day card + slider. Roughly 50 lines.
- **`JourneyMap.tsx`** — small wrapper around `MapContainer` that includes `<MapLayers>` and a `<MapFlyTo center zoom />` inner component. ~25 lines.
- **`MapFlyTo.tsx`** (can live inside `JourneyMap.tsx`) — calls `useMap()` and runs `map.flyTo` in an effect when its props change. ~10 lines.
- **`JourneySlider.tsx`** — prev/next chevrons + styled range input + label. ~40 lines.

### Refactored (no behavior change)
- **`MapLayers.tsx`** (new) — renders `<TileLayer>`, the two route polylines, and the marker layer. Takes `markers`, `route`, `routeSplitIndex` as props. ~35 lines.
- **`MapView.tsx`** — drops the inlined tile/polyline/marker code, uses `<MapLayers>` instead. The filter pills and filter logic stay in `MapView`. Net: ~98 → ~65 lines.

### Modified
- **`App.tsx`** — `Tab` union becomes `'plan' | 'map' | 'journey'`. Third tab button added. Renders `<JourneyView />` for that tab. Passes the same `data` it already has access to.
- **`types.ts`** — `Day` gains `mapCenter: [number, number]` and `mapZoom: number`.

### Unchanged
- `DayCard.tsx`, `MarkerPopup.tsx`, `PlanView.tsx`, `index.html`, `vite.config.ts`.

---

## Parser refactor (prerequisite for the feature)

`scripts/parse-trip.ts` (currently 254 lines, 4 concerns) splits into:

```
scripts/
├── parse-trip.ts                # ~50 lines: entry point only
└── lib/
    ├── coords.ts                # COORDS, ROUTE, matchesName helper
    ├── parse-markdown.ts        # parseDayTable, parseStageBlock, parseStages
    ├── markers.ts               # buildMarkers
    └── day-geometry.ts          # NEW: computeDayGeometry(stages, markers)
```

The split is mechanical — code moves between files, no logic changes — *then* `day-geometry.ts` is added and `parse-trip.ts` calls it.

Existing parser tests (`parse-trip.test.ts` if present, or new ones) update their imports. No behavior changes for the currently emitted `trip.json` shape except the new `mapCenter` / `mapZoom` fields on each Day.

---

## Data flow

```
data/road_trip_field_guide.md
         ↓
scripts/parse-trip.ts (orchestrator)
   ├─ parse-markdown → stages
   ├─ markers        → markers
   ├─ day-geometry   → mapCenter/mapZoom per day (mutates stages)
   └─ writes trip.json
         ↓
src/data/trip.json (now includes mapCenter/mapZoom on each Day)
         ↓
App.tsx → JourneyView → JourneyMap (flyTo) + DayCard + JourneySlider
```

---

## Styling

New rules added to `src/index.css`:

- `.journey-view` — vertical flex layout
- `.journey-map` — fixed-ish height (e.g. `60vh` on desktop, `55vh` on mobile)
- `.journey-stage-label` — small caps, dim accent color
- `.journey-slider-row` — flex row with prev/next + range input + label
- `.journey-day-label` — current `Day X · Stage Name` text

No new colors or design tokens — reuse existing CSS variables.

---

## Testing

### New tests
- **`JourneyView.test.tsx`**
  - Renders the first entry's day card on mount
  - Moving the slider updates the visible day card
  - Prev/next chevrons step `entryIndex` and clamp at 0 and `entries.length - 1`
  - Stage label updates when scrubbing across a stage boundary
- **`JourneyMap.test.tsx`** (or merged into JourneyView test)
  - When `entryIndex` changes, `flyTo` is called on the leaflet map with the expected center/zoom — mock `useMap`
- **`day-geometry.test.ts`**
  - Centroid path: a day with two day-tagged markers gets their mean
  - Gap path: `"10–12"` resolves to Yellowstone's coords from `COORDS`
  - Fallback path: warns and uses neighboring entry's center
  - `pickZoom` returns 8 for multi-day, 5 for long highway, 6 otherwise

### Updated tests
- Existing parser tests update imports from `scripts/parse-trip.ts` → `scripts/lib/*` after the split. No assertion changes.
- `App.test.tsx` adds a check for the third tab being present and clickable.
- `MapView.test.tsx` may need minor updates if it asserted on inline polyline/marker DOM that moves to `MapLayers`.

### Unchanged
- `DayCard.test.tsx`, `MarkerPopup.test.tsx`, `PlanView.test.tsx`.

---

## Maintainability notes

- After this change, every file in `src/components/` and every file in `scripts/lib/` has one job and is under ~80 lines.
- `MapView.tsx` shrinks. `parse-trip.ts` shrinks dramatically. The new `JourneyView` is the only file added that's over 40 lines.
- No new dependencies. No new dev tools. No new build steps.
- The `useMap()` + `flyTo` idiom is the one piece of "new mental model" — isolated to a single ~10-line component so it's easy to read in one sitting.

---

## Out of scope (deferred / will not do)

- Speed control / auto-play
- Day-window marker filtering
- Touch swipe gestures on the slider (range input on mobile already works)
- URL state (deep-link to a specific day) — could come later, not now
- Persisting last-viewed entry across reloads
