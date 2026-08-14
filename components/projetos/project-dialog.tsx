"use client";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Project {
    id: string;
    number: string;
    title: string;
    category: string;
    location: string;
    year: string;
    image: string;
    description: string;
    materials: string[];
}

interface ProjectDialogProps {
    project: Project | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProjectDialog({
                                          project,
                                          open,
                                          onOpenChange,
                                      }: ProjectDialogProps) {
    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
                    w-[calc(100%-2rem)]
                    max-w-[1400px]
                    sm:max-w-[1400px]
                    overflow-hidden
                    rounded-none
                    border-none
                    bg-quarry
                    p-0
                    text-graphite
                    shadow-2xl

                    h-[90vh]
                    max-h-[90vh]
                    md:h-[85vh]
                    md:max-h-[900px]
                "
            >
                <div className="grid h-full grid-cols-1 md:grid-cols-[1.35fr_0.65fr]">

                    <div className="relative min-h-[45vh] bg-graphite/10 md:min-h-0">

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

                    <div className="flex min-h-0 min-w-0 flex-col overflow-y-auto">

                        <div className="flex-1 p-7 md:p-10 lg:p-12">

                            <div className="mb-10">

                                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/40">
                                    Sotragran · {project.number}
                                </span>

                                <DialogHeader className="mt-5 text-left">

                                    <DialogTitle className="font-display text-4xl leading-[0.92] tracking-[-0.03em] wrap-anywhere max-w-full md:text-5xl lg:text-5xl">
                                        {project.title}
                                    </DialogTitle>

                                    <DialogDescription className="mt-6 max-w-lg font-body text-sm leading-relaxed text-graphite/65 md:text-base">
                                        {project.description}
                                    </DialogDescription>

                                </DialogHeader>

                            </div>

                            <div className="h-px bg-graphite/15" />

                            <div className="mt-8">

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
                                        {project.materials.map(
                                            (material) => (
                                                <span
                                                    key={material}
                                                    className="font-mono text-[10px] uppercase tracking-[0.1em]"
                                                >
                                                    {material}
                                                </span>
                                            ),
                                        )}
                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="border-t border-graphite/10 p-7 md:p-10 lg:p-12">

                            <div className="flex flex-col gap-5">

                                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-graphite/40">
                                    Tem um projeto semelhante?
                                </span>

                                <a
                                    href="/contactos"
                                    className="
                                        inline-flex
                                        w-fit
                                        border-b
                                        border-graphite/40
                                        pb-2
                                        font-mono
                                        text-[10px]
                                        uppercase
                                        tracking-[0.25em]
                                        transition-colors
                                        hover:border-stone
                                        hover:text-stone
                                    "
                                >
                                    Fale connosco →
                                </a>

                            </div>

                        </div>

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
