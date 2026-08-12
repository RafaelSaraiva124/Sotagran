"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import StorySection from "./story-section";

/** Simple scroll-scrubbed block → slab illustration, sits alongside the copy. */
function BlockToSlab() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const width = useTransform(scrollYProgress, [0.1, 0.9], ["9rem", "20rem"]);
  const height = useTransform(scrollYProgress, [0.1, 0.9], ["9rem", "3rem"]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.9], [8, 0]);

  return (
    <div ref={ref} className="flex items-center justify-center h-64 md:h-full">
      <motion.div
        style={{ width, height, rotate }}
        className="bg-gradient-to-br from-mica to-graphite shadow-2xl"
      />
    </div>
  );
}

export default function SectionTransformation() {
  return (
    <StorySection
      index="02"
      coordinate="STRATA → SLAB"
      eyebrow="Transformation"
      title={<>From block to slab</>}
      tone="light"
    >
      <div className="grid md:grid-cols-2 gap-10 items-center max-w-4xl">
        <p className="font-body text-graphite/80 leading-relaxed">
          Raw blocks are gang-sawn, calibrated and polished to a tolerance of
          fractions of a millimetre — the same material, given a surface fit
          for architecture.
        </p>
        <BlockToSlab />
      </div>
    </StorySection>
  );
}
