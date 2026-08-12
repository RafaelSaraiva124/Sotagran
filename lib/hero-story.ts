// Shared scroll-progress timing config for the hero storytelling sequence.
// Both hero.tsx (text + photo crossfade) and granite-stone.tsx (3D pose + shape
// morph) read the SAME boundaries here, so nothing drifts out of sync.
// progress is always the hero section's own scroll fraction, 0 to 1.

export type StoryPhase = {
    id: string;
    eyebrow: string;
    title: string;
    body: string;
    enter: number;
    holdStart: number;
    holdEnd: number;
    exit: number;
};

// Progress at which the centered intro title starts fading out.
export const INTRO_FADE_START = 0.05;

// Progress at which the centered intro title has fully faded and the stone
// has finished traveling from its centered/intro pose to its top/small one;
// from here it starts traveling on toward the right/large pose.
export const INTRO_END = 0.15;

// Progress at which the stone has fully arrived at its right-side pose.
export const ARRIVE_END = 0.2;

export type StonePose = { fracX: number; fracY: number; scale: number };

// fracX/fracY are screen-space fractions (0 = left/top, 1 = right/bottom);
// scale is relative to the stone's own resting radius. Two keyframes: the
// centered/normal pose visitors see before any scroll (matching today's
// look), and the pose it holds for Phase 1 onward — the stone travels
// straight there, with no intermediate stop at the top.
export const LAYOUT_POSE: { intro: StonePose; end: StonePose } = {
    intro: { fracX: 0.5, fracY: 0.42, scale: 0.6 },
    end: { fracX: 0.76, fracY: 0.46, scale: 0.85 },
};

// Below the mobile breakpoint there is no "right side" to travel to: the
// stone stays small and pinned near the top while text stacks underneath.
export const MOBILE_POSE: StonePose = { fracX: 0.5, fracY: 0.13, scale: 0.3 };

export const PHASES: StoryPhase[] = [
    {
        id: "formed",
        eyebrow: "PHASE 01 / FORMATION",
        title: "Born under pressure",
        body: "Formed over millions of years, compressed deep within the earth's crust under immense heat and pressure.",
        enter: 0.15,
        holdStart: 0.19,
        holdEnd: 0.3,
        exit: 0.34,
    },
    {
        id: "quarried",
        eyebrow: "PHASE 02 / EXTRACTION",
        title: "Cut from the earth",
        body: "Extracted in solid blocks, true to its raw origin — never manufactured, only revealed.",
        enter: 0.36,
        holdStart: 0.4,
        holdEnd: 0.51,
        exit: 0.55,
    },
    {
        id: "revealed",
        eyebrow: "PHASE 03 / REVELATION",
        title: "Polished to truth",
        body: "Cut, cross-sectioned, and polished until the stone finally reveals its truest face.",
        enter: 0.57,
        holdStart: 0.61,
        holdEnd: 0.72,
        exit: 0.76,
    },
    {
        id: "applied",
        eyebrow: "PHASE 04 / APPLICATION",
        title: "Ready for the space",
        body: "From quarry to countertop — the same stone, now shaped for the rooms people live in.",
        enter: 0.78,
        holdStart: 0.82,
        holdEnd: 0.92,
        exit: 0.92,
    },
];

// Morph target weights ramp across these windows, bracketing the text
// transition they correspond to: the shape visibly changes exactly as the
// words describing that change enter and exit.
export const MORPH = {
    toQuarried: { start: 0.3, end: 0.4 },
    toPolished: { start: 0.52, end: 0.62 },
};

export const PHOTO_CROSSFADE = { start: 0.77, end: 0.79 };
export const OUTRO_FADE = { start: 0.94, end: 1 };

export function clamp01(value: number) {
    return value < 0 ? 0 : value > 1 ? 1 : value;
}

export function remap(value: number, start: number, end: number) {
    if (start === end) {
        return value < start ? 0 : 1;
    }

    return clamp01((value - start) / (end - start));
}

export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

// Ease-in-out curve (0 and 1 stay fixed, midpoint accelerates then
// decelerates) so a transition reads as smooth motion rather than a linear
// slide.
export function smoothstep(t: number) {
    return t * t * (3 - 2 * t);
}

export function phaseOpacity(progress: number, phase: StoryPhase) {
    if (progress <= phase.enter || progress >= phase.exit) {
        return 0;
    }

    if (progress < phase.holdStart) {
        return remap(progress, phase.enter, phase.holdStart);
    }

    if (progress > phase.holdEnd) {
        return 1 - remap(progress, phase.holdEnd, phase.exit);
    }

    return 1;
}

export function phaseOffsetY(progress: number, phase: StoryPhase) {
    if (progress <= phase.enter) {
        return 40;
    }

    if (progress >= phase.exit) {
        return -40;
    }

    if (progress < phase.holdStart) {
        return lerp(40, 0, remap(progress, phase.enter, phase.holdStart));
    }

    if (progress > phase.holdEnd) {
        return lerp(0, -40, remap(progress, phase.holdEnd, phase.exit));
    }

    return 0;
}

function lerpPose(a: StonePose, b: StonePose, t: number): StonePose {
    return {
        fracX: lerp(a.fracX, b.fracX, t),
        fracY: lerp(a.fracY, b.fracY, t),
        scale: lerp(a.scale, b.scale, t),
    };
}

export function stonePoseAt(
    progress: number,
    pose: { intro: StonePose; start: StonePose; end: StonePose } = LAYOUT_POSE,
): StonePose {
    if (progress <= INTRO_FADE_START) {
        return pose.intro;
    }

    if (progress < INTRO_END) {
        const t = smoothstep(remap(progress, INTRO_FADE_START, INTRO_END));

        return lerpPose(pose.intro, pose.start, t);
    }

    return lerpPose(pose.start, pose.end, remap(progress, INTRO_END, ARRIVE_END));
}

export function morphWeightsAt(progress: number) {
    const toQuarried = remap(progress, MORPH.toQuarried.start, MORPH.toQuarried.end);
    const toPolished = remap(progress, MORPH.toPolished.start, MORPH.toPolished.end);

    return {
        wQuarried: toQuarried * (1 - toPolished),
        wPolished: toPolished,
    };
}

export function photoOpacityAt(progress: number) {
    return remap(progress, PHOTO_CROSSFADE.start, PHOTO_CROSSFADE.end);
}

export function outroOpacityAt(progress: number) {
    return 1 - remap(progress, OUTRO_FADE.start, OUTRO_FADE.end);
}
