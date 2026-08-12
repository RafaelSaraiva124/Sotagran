import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

const FILTERS = ["Granite", "Finish", "Color"];

const STONES = [
  { name: "Nero Absolute", image: "/media/stone-1.jpg" },
  { name: "Baltic Brown", image: "/media/stone-2.jpg" },
  { name: "Verde Aran", image: "/media/stone-3.jpg" },
];

export default function SectionMaterial() {
  return (
    <section id="materials" className="bg-quarry text-graphite px-6 md:px-16 py-28">
      <div className="survey-label mb-4 flex items-center gap-4">
        <span>03</span>
        <span className="w-8 h-px bg-current opacity-40" />
        <span>MATERIAL</span>
      </div>

      <h2 className="font-display text-4xl md:text-6xl mb-4">
        The stone collection
      </h2>
      <p className="font-body text-graphite/70 max-w-lg mb-10">
        A preview of the library — filter by stone, colour, and finish inside
        the full catalog.
      </p>

      <div className="flex flex-wrap gap-3 mb-12">
        {FILTERS.map((f) => (
          <span
            key={f}
            className="font-mono text-[11px] uppercase tracking-widest2 border border-graphite/30 px-4 py-2 hover:border-feldspar hover:text-feldspar transition-colors cursor-pointer"
          >
            {f}
          </span>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-14">
        {STONES.map((stone) => (
          <Link
            href={`/materials/${stone.name.toLowerCase().replace(/\s+/g, "-")}`}
            key={stone.name}
            className="group relative aspect-[3/4] overflow-hidden bg-graphite/10"
          >
            <Image
              src={stone.image}
              alt={stone.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-basalt/80 to-transparent">
              <span className="font-mono text-xs uppercase tracking-widest2 text-quartz">
                {stone.name}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/materials"
        className={buttonVariants({ variant: "primary", size: "lg" })}
      >
        View collection →
      </Link>
    </section>
  );
}
