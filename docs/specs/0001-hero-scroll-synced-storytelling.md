# 0001. Sync the hero stone and story text to one scroll progress value

**Date**: 2026-08-12
**Status**: Proposed

## Summary

The hero section tells the stone's story in stages while you scroll: a small stone at the top slides to a big stone on the right, the story text appears on the left in four short beats, and the stone itself changes shape (rough, then cut, then polished) as each beat plays. Today the 3D stone reads its own separate scroll number instead of sharing the one the text uses, so the two drift apart. This spec locks both to one shared progress number, moves the stone with real 3D positioning instead of CSS, and adds true shape blending (called morph targets) so the stone changes form smoothly instead of jumping.

## Context

The hero (`components/hero.tsx`) pins for 420vh of scroll and today drives its animation with about nine separate GSAP ScrollTrigger instances, each independently reading percentages of `#hero-story`'s own scroll distance (`"10% top"`, `"36% top"`, and so on). In parallel, the 3D stone (`components/granite-stone.tsx`) computes its own progress number with a plain `scroll` event listener: `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`, a fraction of the whole page, not of the hero's own 420vh. Since the page has eight more sections below the hero, this number climbs far slower than the hero's own GSAP timeline while inside the hero, and keeps climbing after the hero's ScrollTriggers have already finished. That mismatch is the concrete cause of the stone's motion (its rotation, bob, and tilt) reading out of step with the text and the CSS driven scale and position on the stone's wrapper `div`.

Two of the four asks are new capability, not a fix to existing behavior. There is no shape blending today: `buildGraniteGeometry()` builds one static noise displaced shape and nothing else. And the stone never moves toward the right of the screen; today it only scales up slightly and dips down while staying centered, and the story text is centered too, not left aligned. This is a single page, purely presentational marketing section: no user data, no backend, no auth boundary, and any change is fully reversible by reverting the commit.

## Requirements

**User stories**:
- As a visitor scrolling the hero, I want the stone and the story text to move and change together, so the storytelling reads as one connected sequence instead of two things happening at slightly different speeds.
- As a visitor on a phone, I want the same story to still make sense stacked vertically, so the experience is not broken on the device most people will actually use.
- As a visitor with reduced motion turned on, I want to read the same story without a scroll driven animation forcing motion on me.

**Acceptance criteria**:
- **AC-1**: At the very start of the hero's pinned scroll (progress 0), the centered title and the centered, normal sized stone look the same as they do today.
- **AC-2**: By the point the intro title has fully faded (progress about 0.15), the stone has moved into a small pose near the top center of the screen, and the story text begins appearing left aligned on the left side of the screen, not centered.
- **AC-3**: From progress about 0.15 to about 0.90, the stone continuously and smoothly slides from its small top pose to a right side pose at a larger scale than its resting size, arriving there by the time the fourth story beat begins.
- **AC-4**: Exactly one story beat (small label, short title, one sentence) is fully visible at any given progress value inside the story span; a beat finishes fading and sliding out before the next one starts fading in. They never overlap.
- **AC-5**: There are four story beats in order: Formation, Extraction, Revelation, Application, each with its label, short title, and one descriptive sentence.
- **AC-6**: The stone's geometry visibly and smoothly blends, vertex by vertex with no popping or sudden cut, between three shape states tied to the beats: rough and organic during Formation, angular and faceted during Extraction, smooth and symmetric from Revelation onward (held through Application).
- **AC-7**: The stone's position, scale, rotation, and shape blend weights; each beat's visibility; and the real granite photo crossfade are all computed from one single scroll progress value (0 to 1), updated by one GSAP ScrollTrigger on the hero section. No component reads `window.scrollY` or keeps its own separate scroll listener.
- **AC-8**: Below the mobile breakpoint, the stone renders small and stays pinned near the top while the beats stack full width underneath it, still appearing one at a time with no overlap.
- **AC-9**: With `prefers-reduced-motion` on, the stone renders statically in its polished pose and the beats are shown stacked and readable without the pinned scroll scrubbed choreography.
- **AC-10**: Resizing the browser window keeps the stone's on screen position and the beat timing correct, with no snapping or misalignment, and without needing a page reload.

## Options considered

### Option 1: Fix in place

Keep today's structure (about nine independent ScrollTrigger instances, CSS transform positioning on the stone's wrapper `div`, one static geometry) and patch the specific bugs: swap the stone's own scroll listener for a prop, retarget the CSS transform to move right instead of only scaling, and fake shape change by opacity crossfading between two or three separate meshes.

**Pros**:
- Smallest diff from what exists today.
- No new geometry building code.

**Cons**:
- Crossfading separate meshes is an opacity trick, not the vertex by vertex blend AC-6 asks for; it would visibly double expose two shapes mid transition instead of one shape changing.
- Keeping nine separate ScrollTrigger blocks, each with its own hand typed percentage, keeps the exact duplication that makes them easy to drift out of sync again the next time someone tweaks one number and forgets the others.

### Option 2: Replace with a strangler (build alongside, flag, cut over)

Build the new synced hero next to the old one behind a feature flag, verify it in production, then cut over and delete the old.

**Pros**:
- Instant rollback in production without a redeploy, useful for a change many visitors will see immediately.

**Cons**:
- This is one visual component on a marketing site with no user data and no backend; reverting a bad deploy is one `git revert` away, so a flag mainly adds two parallel implementations to maintain for a while with little matching benefit.
- Flag plumbing and a temporary duplicate component add real code for a low blast radius change.

### Option 3: Replace directly

Rewrite the choreography in `hero.tsx` and the geometry and positioning in `granite-stone.tsx` in place, same component boundary, same import in `page.tsx`. Remove the page wide scroll listener and the nine separate ScrollTrigger blocks; replace them with one shared progress ref and one shared timing config that both files read from.

**Pros**:
- Matches the actual size and risk of the change: no live user data, one page, trivially reversible by reverting the commit.
- Avoids running two parallel hero implementations, even briefly, for a component this small.

**Cons**:
- No built in gradual rollout or instant in place fallback if the new choreography reads worse live; relies on scrubbing through the whole scroll range by hand before merging.

## Decision

**Chosen option**: Option 3: Replace directly

Rework `hero.tsx` and `granite-stone.tsx` in place around one shared scroll progress ref and one shared timing config, replacing CSS transform positioning of the stone with real 3D positioning inside the canvas, and replacing the single static geometry with three shape variants blended through morph targets (three.js's built in vertex blending between geometries that share the same vertex layout).

## Rationale

Option 1 cannot satisfy AC-6: an opacity crossfade between separate meshes is a cut with a fade over it, not a blend, and mesh swapping still leaves the desync bug's root cause, the page wide scroll listener, unaddressed if patched only around its edges. Option 2's safety net does not match the actual risk here, described in Context: no user data, one component, one page, and a revert is trivial: the flag's ongoing maintenance cost is not earned back. Option 3 fixes the literal desync described in Context (a page-wide fraction feeding one file, a hero-scoped fraction feeding another) at its source by giving both files the same number from the same place, and it is the only option that gives AC-6 a true vertex level blend by construction, since morph targets are exactly a vertex by vertex interpolation between geometries that share the same vertex count and order.

The engineer's choice to position the stone in 3D space (camera and object transforms inside the canvas) over a CSS transform on the wrapper `div`, made during design, changes where "screen position" lives: it now has to be computed inside the R3F component using the camera's viewport, not read off a CSS class. That is reflected in Feature design below.

## Feature design

**Shared timing module** (new file, e.g. `lib/hero-story.ts`): a single source of the normalized 0 to 1 progress breakpoints that both `hero.tsx` (text, photo crossfade) and `granite-stone.tsx` (stone position and shape) read, so no percentage is hand typed twice. Shape:

```ts
export const INTRO_END = 0.15;      // title fully faded, story choreography begins
export const ARRIVE_END = 0.90;     // stone has reached its right-side resting pose

export const LAYOUT_POSE = {
  start: { fracX: 0.50, fracY: 0.18, scale: 0.45 }, // top center, small
  end:   { fracX: 0.78, fracY: 0.50, scale: 1.15 }, // right side, larger than resting
};

export const PHASES = [
  { id: "formed",    eyebrow: "PHASE 01 / FORMATION",     title: "Born under pressure",  body: "…", enter: 0.15, holdStart: 0.19, holdEnd: 0.30, exit: 0.34 },
  { id: "quarried",  eyebrow: "PHASE 02 / EXTRACTION",     title: "Cut from the earth",   body: "…", enter: 0.36, holdStart: 0.40, holdEnd: 0.51, exit: 0.55 },
  { id: "revealed",  eyebrow: "PHASE 03 / REVELATION",     title: "Polished to truth",    body: "…", enter: 0.57, holdStart: 0.61, holdEnd: 0.72, exit: 0.76 },
  { id: "applied",   eyebrow: "PHASE 04 / APPLICATION",    title: "Ready for the space",  body: "…", enter: 0.78, holdStart: 0.82, holdEnd: 0.90, exit: 0.90 },
];

export const MORPH = {
  toQuarried: { start: 0.30, end: 0.40 }, // ramps while phase 1 exits / phase 2 enters
  toPolished: { start: 0.52, end: 0.62 }, // ramps while phase 2 exits / phase 3 enters; holds through phase 4
};
```

The exact numbers are a starting point for `/develop` to tune by eye; what is load bearing is that both files import them from this one module instead of each holding its own copy.

**Progress ref (single source of truth)**: `hero.tsx` creates one `progressRef = useRef(0)` and one GSAP ScrollTrigger (`trigger: "#hero-story", start: "top top", end: "bottom bottom", scrub: true`) whose `onUpdate` does three things every tick: (1) writes `progressRef.current = self.progress`, (2) computes each phase's opacity and translateY directly from `PHASES` and applies them with `gsap.set` (replacing the current nine independent `scrollTrigger:` blocks with one `onUpdate` callback driven by the numbers above), (3) computes the photo crossfade opacity the same way. `progressRef` is passed to `<GraniteStone progress={progressRef} />` as a plain ref, read inside R3F's `useFrame`, never through React state, so scrolling causes zero React re-renders.

**Stone positioning (3D space, per the engineer's choice over CSS)**: inside `granite-stone.tsx`, wrap the mesh in a `<group>`. Each frame, read `useThree().viewport` (R3F's current camera viewport size in three.js units, recomputed automatically on resize) and lerp between `LAYOUT_POSE.start` and `LAYOUT_POSE.end` using a remapped progress (`0` below `INTRO_END`, `1` at `ARRIVE_END`, linear between). Convert the resulting `{fracX, fracY, scale}` to world position with `x = -viewport.width/2 + fracX * viewport.width`, `y = viewport.height/2 - fracY * viewport.height`, keeping the group's `z` constant so the viewport-to-screen-fraction mapping stays valid throughout. This makes AC-10 (resize correctness) fall out of using `useThree().viewport` rather than needing a manual resize handler.

**Shape blending (morph targets)**: build one base `IcosahedronGeometry(1.45, detail)` and read its `position` attribute three times with three different displacement functions applied to clones of the same array (same vertex count, same vertex order, since all three start from the same buffer): raw (today's noise displacement, kept as is), quarried (angular/faceted: lower frequency, larger flat facets), polished (near the undisplaced sphere, minimal noise). Compute normals for each with `computeVertexNormals()`. Set the raw variant as the base geometry's `position`/`normal`, and `geometry.morphAttributes.position = [quarriedPositions, polishedPositions]`, `geometry.morphAttributes.normal = [quarriedNormals, polishedNormals]` (both targets, so lighting stays correct mid blend, not just position). This version of three.js derives morph target rendering straight from `geometry.morphAttributes` (no `material.morphTargets` flag needed). Each frame, set `mesh.morphTargetInfluences = [wQuarried, wPolished]`, computed from `MORPH.toQuarried` / `MORPH.toPolished` and the shared progress the same way the layout pose is computed, so the shape change and the text transition it corresponds to are driven by the exact same numbers.

**Reduced motion**: `hero.tsx` checks `window.matchMedia("(prefers-reduced-motion: reduce)")` once on mount. When true, skip creating the ScrollTrigger entirely: render the stone in its resting, right side, polished pose (progress pinned at 1) and render all four phase blocks stacked and visible without the enter/hold/exit choreography. `globals.css` already disables CSS animations/transitions globally under this media query; this is the equivalent for the imperative GSAP/R3F path, which that CSS rule cannot reach.

**Mobile layout (below the existing responsive breakpoint used elsewhere in the project)**: the stone's `LAYOUT_POSE` becomes a single fixed small top-center pose (no travel to the right; there is no "right side" to travel to next to stacked text), and the phase blocks render `w-full` stacked instead of anchored to the left half, still driven by the same `PHASES` enter/hold/exit windows so AC-4's no-overlap rule holds on mobile too.

**Value sourcing** (every value the acceptance criteria need, and where it comes from):
| Where it's used | Value | Source |
|---|---|---|
| Stone position/scale each frame | `{fracX, fracY, scale}` at current progress | Lerp of `LAYOUT_POSE.start`/`end` from the shared config, keyed by `progressRef.current` remapped between `INTRO_END` and `ARRIVE_END` |
| Stone position each frame | World `x, y` | `useThree().viewport` (current camera viewport in world units) combined with the fraction above |
| Stone shape each frame | `morphTargetInfluences[0..1]` | `MORPH.toQuarried` / `MORPH.toPolished` windows from the shared config, keyed by `progressRef.current` |
| Each phase block | opacity / translateY at current progress | That phase's `enter/holdStart/holdEnd/exit` from the shared `PHASES` config, keyed by the same `progressRef.current` read inside the one `onUpdate` |
| Photo crossfade opacity | opacity at current progress | A fixed window aligned to the Revelation phase's `holdStart`/`holdEnd`, same shared config |
| Reduced-motion pose | which pose to render | `window.matchMedia("(prefers-reduced-motion: reduce)")`, read once on mount |
| Mobile vs desktop pose | which `LAYOUT_POSE` shape to use | The existing Tailwind breakpoint already used elsewhere in the project, read via a resize-aware check in the same component |

**Key invariants**:
- Exactly one `progressRef` exists per hero mount; nothing else reads `window.scrollY` or keeps a second scroll listener (AC-7).
- At most one phase block has non-zero opacity at any progress value (AC-4).
- `PHASES`, `LAYOUT_POSE`, and `MORPH` boundaries live only in the shared config module; no percentage is duplicated in either component file.

**Security model**: not applicable. Purely presentational marketing content; no user data, no auth boundary, nothing to authorize.

**Critical test scenarios**:
- Happy path: scrub the full 420vh of the hero at a steady rate and confirm the stone's pose, its shape, the active phase block, and the photo crossfade all read as one connected sequence with no visible lag between them, verifies **AC-1** through **AC-7**.
- Failure/edge case: resize the window mid-scroll (or rotate a mobile device) and confirm the stone's screen position and the active phase stay correct with no snap, verifies **AC-10**.
- Failure/edge case: scroll very fast past the whole hero in one gesture and confirm no phase block is left stuck visible (the exit windows still apply even when scroll is fast because everything is a function of progress, not of elapsed time), verifies **AC-4**, **AC-7**.
- Accessibility: enable `prefers-reduced-motion` at the OS level and confirm the stone renders static and all four phases are readable without scroll-scrubbed motion, verifies **AC-9**.
- Responsive: view at a mobile viewport width and confirm the stacked layout from AC-8 with no overlapping phase blocks.

## Build plan

1. Add the shared timing config module (`INTRO_END`, `ARRIVE_END`, `LAYOUT_POSE`, `PHASES`, `MORPH`) that both files will import, satisfies **AC-7**
2. In `hero.tsx`, replace the nine independent ScrollTrigger blocks with one ScrollTrigger whose `onUpdate` writes `progressRef.current` and imperatively sets phase opacity/position and the photo crossfade from the shared config, satisfies **AC-4**, **AC-7**
3. Update the hero markup: left-align the phase blocks (drop `items-center text-center` for that block, add a left column), extend from three `STORY_BEATS` to the four `PHASES` (write the Application phase's eyebrow/title/body), satisfies **AC-2**, **AC-5**
4. In `granite-stone.tsx`, build the three geometry variants (raw, quarried, polished) from one shared base vertex buffer, wire them as `morphAttributes.position`/`normal`, and drive `morphTargetInfluences` from `MORPH` and the passed-in progress each frame, satisfies **AC-6**
5. Change `GraniteStone` to accept `progress: MutableRefObject<number>` as a prop instead of its own `useScrollProgress` hook; remove the page-wide `window.scrollY` listener entirely, satisfies **AC-7**
6. Wrap the mesh in a `<group>` and drive its position/scale each frame from `LAYOUT_POSE` and `useThree().viewport`, satisfies **AC-1**, **AC-3**, **AC-10**
7. Add the `prefers-reduced-motion` branch in `hero.tsx` (skip the ScrollTrigger, render the resting pose and stacked phases), satisfies **AC-9**
8. Add the mobile pose and stacked phase layout, satisfies **AC-8**
9. Manually scrub the full hero scroll range, resize mid-scroll, and check reduced motion and mobile, per Critical test scenarios above, verifies **AC-1** through **AC-10**

## Consequences

**Positive**:
- One number, computed in one place, drives everything the acceptance criteria describe; there is no longer a page-wide fraction feeding one file and a hero-scoped fraction feeding another.
- Morph targets are a native, GPU-blended three.js feature for exactly this shape-count and this need, cheap per frame once built.
- `useThree().viewport` based positioning keeps the stone correctly placed across resizes without a manual resize handler.

**Negative / tradeoffs**:
- The geometry module gets more complex: three vertex-displacement functions instead of one, plus normal recomputation for each, roughly tripling the position/normal buffer memory the stone's mesh holds.
- Screen position for the stone now lives inside the R3F component, computed from camera viewport math, instead of a plain CSS class; a future contributor who only knows CSS has a higher bar to safely change where the stone sits on screen.
- No feature flag safety net; shipping requires a manual scroll-through QA pass (Build plan step 9) before merging, since there is no instant in-production fallback beyond reverting the commit.
- One new phase (Application) needs real copy; the draft text in Feature design is a placeholder for whoever owns the site's copy to approve or rewrite.

**Neutral**:
- Introduces a new shared-config pattern (one timing module read by two components) that does not exist elsewhere in the project yet; any future scroll-driven section that wants the same "one progress number" guarantee should follow the same pattern rather than inventing its own.

## Follow-up

- [ ] This project has no `docs/scope/` yet, so this spec is not linked to a tracked feature row. Consider running `/scope` if the team wants this and future work tracked there.
- [ ] The project currently defines two separate, slightly conflicting color token sets (`app/globals.css`'s `@theme` block: `quarry`/`stone`/`warm-white`/`mica`, versus `tailwind.config.ts`: `quarry`/`basalt`/`quartz`/`mica` with different values for the same names). `hero.tsx` uses the `globals.css` set; `story-section.tsx` and its callers use the `tailwind.config.ts` set. Not in scope for this change, but worth reconciling separately since it is easy to accidentally pull the wrong `quarry`.
- [ ] Confirm and finalize the Application phase's copy (eyebrow/title/body) with whoever owns the site's content; the draft in Feature design is a placeholder.
