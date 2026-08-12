import Link from "next/link";
import Image from "next/image";
import StorySection from "./story-section";

const PROJECTS = [
  { name: "Casa Serra", location: "Coimbra, PT", image: "/media/project-1.jpg" },
  { name: "Atrium Office", location: "Porto, PT", image: "/media/project-2.jpg" },
];

export default function SectionApplication() {
  return (
    <StorySection
      index="05"
      coordinate="SITE APPLIED"
      eyebrow="Application"
      title={<>From material to architecture</>}
      tone="light"
    >
      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mb-10">
        {PROJECTS.map((p) => (
          <Link
            key={p.name}
            href="/projects"
            className="group relative aspect-video overflow-hidden bg-graphite/10"
          >
            <Image
              src={p.image}
              alt={p.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-basalt/80 to-transparent">
              <p className="font-mono text-xs uppercase tracking-widest2 text-quartz">
                {p.name}
              </p>
              <p className="font-mono text-[10px] text-quartz/70">{p.location}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/projects"
        className="font-mono text-xs uppercase tracking-widest2 border-b border-graphite/40 pb-1 hover:border-feldspar hover:text-feldspar transition-colors"
      >
        View all projects →
      </Link>
    </StorySection>
  );
}
