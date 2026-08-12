"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface StorySectionProps {
  index: string; // "01"
  coordinate: string; // survey-style label, e.g. "STRATA 03"
  eyebrow: string; // "ORIGIN"
  title: ReactNode;
  children?: ReactNode;
  media?: ReactNode; // image / video / grid filling the background layer
  tone?: "dark" | "light";
  className?: string;
}

export default function StorySection({
  index,
  coordinate,
  eyebrow,
  title,
  children,
  media,
  tone = "dark",
  className,
}: StorySectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Background media drifts slower than the viewport → parallax.
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], [40, 0]);

  const isDark = tone === "dark";

  return (
    <section
      ref={ref}
      className={cn(
        "relative min-h-[90vh] w-full overflow-hidden flex items-center",
        isDark ? "bg-basalt text-quartz" : "bg-quarry text-graphite",
        className
      )}
    >
      {media && (
        <motion.div style={{ y: mediaY }} className="absolute inset-0 scale-110">
          {media}
        </motion.div>
      )}

      {isDark && <div className="absolute inset-0 bg-basalt/40" />}

      <motion.div
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 w-full px-6 md:px-16 py-24"
      >
        <div className="flex items-center gap-4 mb-6 survey-label">
          <span>{index}</span>
          <span className="w-8 h-px bg-current opacity-40" />
          <span>{coordinate}</span>
        </div>

        <h2 className="font-display text-4xl md:text-6xl leading-tight max-w-3xl mb-8">
          {eyebrow ? (
            <span className="block text-sm md:text-base font-mono tracking-widest2 uppercase mb-3 opacity-60">
              {eyebrow}
            </span>
          ) : null}
          {title}
        </h2>

        {children}
      </motion.div>
    </section>
  );
}
