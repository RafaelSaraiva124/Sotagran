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

export const INTRO_FADE_START = 0.05;


export const INTRO_END = 0.15;

export const ARRIVE_END = 0.2;

export type StonePose = { fracX: number; fracY: number; scale: number };


export const LAYOUT_POSE: { intro: StonePose; end: StonePose } = {
    intro: { fracX: 0.5, fracY: 0.42, scale: 0.5 },
    end: { fracX: 0.76, fracY: 0.46, scale: 0.72 },
};


export const MOBILE_POSE: StonePose = { fracX: 0.5, fracY: 0.37, scale: 0.3 };


export const PHASES = [
    {
        id: "formed",
        eyebrow: "FASE 01 / ORIGEM",
        title: "Nascida sob pressão",
        body: "Milhões de anos de tempo, calor e pressão deram origem a uma matéria que não se fabrica. Na Sotragran, acreditamos que cada pedra começa a contar a sua história muito antes de chegar às nossas mãos.",
        enter: 0.2,
        holdStart: 0.25,
        holdEnd: 0.38,
        exit: 0.43,
    },

    {
        id: "quarried",
        eyebrow: "FASE 02 / EXTRAÇÃO",
        title: "Da terra para as nossas mãos",
        body: "É na sua forma mais pura que a pedra revela a sua verdadeira identidade. A Sotragran, fundada em 1990 em Oliveira do Hospital, trabalha o granito desde a matéria-prima, preservando aquilo que a natureza criou.",
        enter: 0.38,
        holdStart: 0.43,
        holdEnd: 0.56,
        exit: 0.61,
    },

    {
        id: "revealed",
        eyebrow: "FASE 03 / TRANSFORMAÇÃO",
        title: "Revelar o que já estava lá",
        body: "Cortar, serrar, amaciar, polir. Cada transformação revela uma nova face da pedra. É aqui que a experiência da Sotragran encontra a matéria, através de diferentes acabamentos pensados para cada projecto.",
        enter: 0.56,
        holdStart: 0.61,
        holdEnd: 0.74,
        exit: 0.79,
    },

    {
        id: "applied",
        eyebrow: "FASE 04 / APLICAÇÃO",
        title: "Da pedra ao espaço",
        body: "Uma bancada. Um degrau. Um revestimento. Um detalhe que permanece. A Sotragran transforma granito em soluções para construção e arquitectura, levando a pedra desde Oliveira do Hospital até aos espaços onde ganha uma nova vida.",
        enter: 0.74,
        holdStart: 0.79,
        holdEnd: 0.92,
        exit: 0.97,
    },
];


export const MORPH = {
    toQuarried: { start: 0.38, end: 0.43 },
    toPolished: { start: 0.56, end: 0.61 },
};

export const PHOTO_CROSSFADE = { start: 0.74, end: 0.79 };
export const OUTRO_FADE = { start: 0.92, end: 1 };

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


export function smoothstep(t: number) {
    return t * t * (3 - 2 * t);
}

export function phaseOpacity(progress: number, phase: StoryPhase) {
    if (progress <= phase.enter || progress >= phase.exit) {
        return 0;
    }

    if (progress < phase.holdStart) {
        return smoothstep(remap(progress, phase.enter, phase.holdStart));
    }

    if (progress > phase.holdEnd) {
        return 1 - smoothstep(remap(progress, phase.holdEnd, phase.exit));
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
        return lerp(40, 0, smoothstep(remap(progress, phase.enter, phase.holdStart)));
    }

    if (progress > phase.holdEnd) {
        return lerp(0, -40, smoothstep(remap(progress, phase.holdEnd, phase.exit)));
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
    pose: { intro: StonePose; end: StonePose } = LAYOUT_POSE,
): StonePose {
    if (progress <= INTRO_FADE_START) {
        return pose.intro;
    }

    if (progress < ARRIVE_END) {
        const t = smoothstep(remap(progress, INTRO_FADE_START, ARRIVE_END));

        return lerpPose(pose.intro, pose.end, t);
    }

    return pose.end;
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
