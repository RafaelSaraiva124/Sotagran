"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";

const EASE_DURATION_MS = 1600;
const MAX_WAIT_MS = 4000;
const HOLD_MS = 250;
const FADE_MS = 500;

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

export default function SiteLoader() {
    const reducedMotion = useReducedMotion();
    const [mounted, setMounted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (reducedMotion) {
            return;
        }

        document.documentElement.style.overflow = "hidden";

        let finished = false;

        const finish = () => {
            if (finished) {
                return;
            }

            finished = true;
            setProgress(100);

            window.setTimeout(() => {
                setVisible(false);
                document.documentElement.style.overflow = "";
            }, HOLD_MS);

            window.setTimeout(() => {
                setMounted(false);
            }, HOLD_MS + FADE_MS);
        };

        const raf = window.requestAnimationFrame(() => setProgress(90));

        const maxTimer = window.setTimeout(finish, MAX_WAIT_MS);

        if (document.readyState === "complete") {
            finish();
        } else {
            window.addEventListener("load", finish);
        }

        return () => {
            window.cancelAnimationFrame(raf);
            window.clearTimeout(maxTimer);
            window.removeEventListener("load", finish);
            document.documentElement.style.overflow = "";
        };
    }, [reducedMotion]);

    if (reducedMotion || !mounted) {
        return null;
    }

    return (
        <div
            aria-hidden={!visible}
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-quarry transition-opacity duration-500 ease-out ${
                visible ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
        >
            <div className="survey-rule relative p-8">
                <Image
                    src="/logo completo branco sem linha.svg"
                    alt="Sotragran"
                    width={220}
                    height={45}
                    priority
                    className="h-9 w-auto"
                />
            </div>

            <div className="flex w-40 flex-col items-center gap-3">
                <div className="h-px w-full overflow-hidden bg-graphite/20">
                    <div
                        className="h-full bg-copper"
                        style={{
                            width: `${progress}%`,
                            transitionProperty: "width",
                            transitionTimingFunction: "ease-out",
                            transitionDuration: progress === 100 ? "300ms" : `${EASE_DURATION_MS}ms`,
                        }}
                    />
                </div>

                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/50">
                    Sotragran
                </span>
            </div>
        </div>
    );
}
