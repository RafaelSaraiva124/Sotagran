import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function SectionCatalogCta() {
  return (
    <section className="bg-basalt text-quartz px-6 md:px-16 py-32 text-center">
      <div className="survey-label mb-6 inline-flex items-center gap-4">
        <span>06</span>
        <span className="w-8 h-px bg-current opacity-40" />
        <span>CHOOSE YOUR STONE</span>
      </div>

      <h2 className="font-display text-4xl md:text-6xl mb-10">
        Explore the full catalog
      </h2>

      <Link
        href="/materials"
        className={buttonVariants({ variant: "outline", size: "lg" })}
      >
        Full catalog →
      </Link>
    </section>
  );
}
