import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PROJECTS, getProjectById } from "@/lib/projects";

type Params = { id: string };

export function generateStaticParams(): Params[] {
    return PROJECTS.map((project) => ({ id: project.id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { id } = await params;
    const project = getProjectById(id);

    if (!project) {
        return {};
    }

    const title = `${project.title} — ${project.category}`;
    const description = project.description;

    return {
        title,
        description,
        alternates: {
            canonical: `/projetos/${project.id}`,
        },
        openGraph: {
            url: `/projetos/${project.id}`,
            title,
            description,
            images: [project.image],
        },
    };
}

export default async function ProjectPage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { id } = await params;
    const project = getProjectById(id);

    if (!project) {
        notFound();
    }

    return (
        <main className="bg-quarry text-graphite">
            <Navbar />

            <section className="px-6 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
                <div className="mx-auto max-w-7xl">

                    <Link
                        href="/projetos"
                        className="survey-label inline-flex items-center gap-4"
                    >
                        <span>←</span>
                        <span>Projetos</span>
                    </Link>

                    <div className="mt-10 grid grid-cols-1 gap-12 md:grid-cols-[1.35fr_0.65fr]">

                        <div className="relative aspect-[4/5] overflow-hidden bg-graphite/10 md:aspect-auto">

                            <Image
                                src={project.image}
                                alt={`${project.title} — Sotragran`}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 65vw"
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                            <div className="absolute left-6 top-6 md:left-8 md:top-8">
                                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">
                                    {project.number} / Projeto
                                </span>
                            </div>

                            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
                                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
                                    {project.category}
                                </span>
                            </div>

                        </div>

                        <div className="flex flex-col">

                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/40">
                                    Sotragran · {project.number}
                                </span>

                                <h1 className="mt-5 font-display text-4xl leading-[0.92] tracking-[-0.03em] wrap-anywhere md:text-5xl lg:text-6xl">
                                    {project.title}
                                </h1>

                                <p className="mt-6 max-w-lg font-body text-sm leading-relaxed text-graphite/65 md:text-base">
                                    {project.description}
                                </p>
                            </div>

                            <div className="mt-10 h-px bg-graphite/15" />

                            <div className="mt-2">

                                <div className="grid grid-cols-2 gap-6 border-b border-graphite/10 py-5">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-graphite/40">
                                        Localização
                                    </span>

                                    <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
                                        {project.location}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 border-b border-graphite/10 py-5">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-graphite/40">
                                        Ano
                                    </span>

                                    <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
                                        {project.year}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 border-b border-graphite/10 py-5">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-graphite/40">
                                        Tipo
                                    </span>

                                    <span className="font-mono text-[10px] uppercase tracking-[0.15em]">
                                        {project.category}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 py-5">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-graphite/40">
                                        Materiais
                                    </span>

                                    <div className="flex flex-col gap-2">
                                        {project.materials.map((material) => (
                                            <span
                                                key={material}
                                                className="font-mono text-[10px] uppercase tracking-[0.1em]"
                                            >
                                                {material}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            <div className="mt-10 border-t border-graphite/10 pt-8">
                                <div className="flex flex-col gap-5">
                                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-graphite/40">
                                        Tem um projeto semelhante?
                                    </span>

                                    <Link
                                        href="/contactos"
                                        className="inline-flex w-fit border-b border-graphite/40 pb-2 font-mono text-[10px] uppercase tracking-[0.25em] transition-colors hover:border-stone hover:text-stone"
                                    >
                                        Fale connosco →
                                    </Link>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
