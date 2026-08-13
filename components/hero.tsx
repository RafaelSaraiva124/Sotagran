"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    ARRIVE_END,
    INTRO_END,
    INTRO_FADE_START,
    PHASES,
    outroOpacityAt,
    phaseOffsetY,
    phaseOpacity,
    photoOpacityAt,
    remap,
} from "@/lib/hero-story";

gsap.registerPlugin(ScrollTrigger);

const GraniteStone = dynamic(() => import("./granite-stone"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center">
            <span className="survey-label">Loading specimen...</span>
        </div>
    ),
});

const SCROLL_INDICATOR_END = 0.04;

function subscribeToReducedMotion(callback: () => void) {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
    return false;
}

function useReducedMotion() {
    return useSyncExternalStore(
        subscribeToReducedMotion,
        getReducedMotionSnapshot,
        getReducedMotionServerSnapshot,
    );
}

export default function Hero() {
    const rootRef = useRef<HTMLElement>(null);
    const progressRef = useRef(0);
    const reducedMotion = useReducedMotion();

    useLayoutEffect(() => {
        if (reducedMotion) {
            return;
        }

        (window as unknown as { __heroDebug?: unknown }).__heroDebug = "effect-started";

        const ctx = gsap.context(() => {
          try {
            const st = ScrollTrigger.create({
                trigger: rootRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: (self) => {
                    const p = self.progress;
                    progressRef.current = p;
                    console.log("[hero-debug] onUpdate", p, self.start, self.end);

                    gsap.set("#scroll-indicator", {
                        opacity: 1 - remap(p, 0, SCROLL_INDICATOR_END),
                    });

                    const introT = remap(p, INTRO_FADE_START, INTRO_END);
                    gsap.set("#hero-copy", {
                        opacity: 1 - introT,
                        y: -80 * introT,
                        scale: 1 - 0.2 * introT,
                    });

                    PHASES.forEach((phase) => {
                        gsap.set(`#phase-${phase.id}`, {
                            opacity: phaseOpacity(p, phase),
                            y: phaseOffsetY(p, phase),
                        });
                    });

                    const photoT = photoOpacityAt(p);
                    gsap.set("#granite-texture", { opacity: photoT });
                    gsap.set("#granite-texture img", { scale: 1.12 - 0.12 * photoT });

                    gsap.set("#granite-3d", { opacity: outroOpacityAt(p) });

                    const captionT = remap(p, ARRIVE_END, 1);
                    gsap.set("#material-intro", {
                        opacity: captionT,
                        y: 50 - 50 * captionT,
                    });
                },
            });

            (window as unknown as { __heroDebug?: unknown }).__heroDebug = {
                start: st.start,
                end: st.end,
                triggerTag: st.trigger?.tagName,
                triggerId: (st.trigger as HTMLElement | undefined)?.id,
            };
          } catch (err) {
            (window as unknown as { __heroDebug?: unknown }).__heroDebug = {
                error: String(err),
            };
          }
        }, rootRef);

        return () => ctx.revert();
    }, [reducedMotion]);

    if (reducedMotion) {
        return (
            <section id="hero-story" className="relative bg-quarry">
                <div className="flex flex-col items-center justify-center px-6 py-28 text-center">
                    <span className="survey-label mb-6 text-warm-white">
                           PEDRA NATURAL · OLIVEIRA DO HOSPITAL · DESDE 1990
                    </span>
                    <h1 className="max-w-6xl text-[15vw] leading-[0.82] tracking-[-0.05em] text-warm-white md:text-[8vw]">
                        Nascida
                        <br />
                        <span className="font-display italic text-stone text-shadow-lg">
                                para permanecer.
                        </span>
                    </h1>
                </div>

                <div className="grid gap-16 px-6 pb-28 md:grid-cols-2 md:items-center md:gap-10 md:px-16">
                    <div className="order-2 flex flex-col gap-14 md:order-1">
                        {PHASES.map((phase) => (
                            <div key={phase.id}>
                                <span className="survey-label mb-4 block text-warm-white/70">
                                    {phase.eyebrow}
                                </span>

                                <h2 className="font-display max-w-md text-3xl leading-tight tracking-[-0.02em] text-warm-white md:text-4xl">
                                    {phase.title}
                                </h2>

                                <p className="mt-4 max-w-md text-sm text-warm-white/70 md:text-base">
                                    {phase.body}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="order-1 h-[50vh] md:order-2 md:h-[65vh]">
                        <GraniteStone progress={progressRef} />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            ref={rootRef}
            id="hero-story"
            className="relative h-[420vh] bg-quarry"
        >
            <div className="sticky top-0 h-[100svh] overflow-hidden">
                <div
                    id="granite-3d"
                    className="absolute inset-0 z-0"
                >
                    <GraniteStone progress={progressRef} />
                </div>

                <div
                    id="granite-texture"
                    className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-0 will-change-transform"
                >
                    <Image
                        src="/media/materials/img.jpg"
                        alt=""
                        fill
                        priority
                        sizes="120vw"
                        className="object-cover will-change-transform"
                    />

                    <div className="absolute inset-0 bg-black/25" />
                </div>

                <div
                    id="hero-copy"
                    className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="survey-label mb-6 text-warm-white mix-blend-difference"
                    >
                        PEDRA NATURAL · OLIVEIRA DO HOSPITAL · DESDE 1990
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.35 }}
                        className="max-w-6xl text-[15vw] leading-[0.82] tracking-[-0.05em] text-warm-white text-shadow-lg md:text-[8vw]"
                    >
                        Nascida
                        <br />
                        <span className="font-display italic text-stone text-shadow-lg ">
        para permanecer.
    </span>
                    </motion.h1>

                    <motion.a
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        href="#materials"
                        className="pointer-events-auto mt-12 border-b border-warm-white/40 pt-15 pb-2 font-mono text-xs uppercase tracking-[0.25em] text-warm-white transition-colors hover:border-stone hover:text-stone"
                    >
                        Ver Catálogo
                    </motion.a>
                </div>

                {PHASES.map((phase) => (
                    <div
                        key={phase.id}
                        id={`phase-${phase.id}`}
                        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end px-6 pb-28 opacity-0 md:justify-center md:px-16 md:pb-0"
                    >
                        <div className="max-w-xl text-left md:max-w-[46%]">
                            <span className="survey-label mb-5 text-warm-white/70">
                                {phase.eyebrow}
                            </span>

                            <h2 className="font-display text-[9vw] leading-[0.9] tracking-[-0.03em] text-warm-white md:text-[4.5vw]">
                                {phase.title}
                            </h2>

                            <p className="mt-6 max-w-md text-sm text-warm-white/70 md:text-base">
                                {phase.body}
                            </p>
                        </div>
                    </div>
                ))}

                <div
                    id="scroll-indicator"
                    className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2"
                >
                    <div className="flex flex-col items-center gap-3 text-warm-white/60">
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em]">
                            Deslize
                        </span>

                        <span className="animate-bounce text-lg">↓</span>
                    </div>
                </div>

                <div
                    id="material-intro"
                    className="pointer-events-none absolute inset-x-0 bottom-12 z-30 flex justify-center text-center opacity-0"
                >
                    <div>
                    <span className="survey-label text-warm-white/70">
                         PEDRA NATURAL
                        </span>

                        <p className="mt-3 font-mono text-xs uppercase tracking-[0.25em] text-warm-white">
                            Oliveira do Hospital · Portugal
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}