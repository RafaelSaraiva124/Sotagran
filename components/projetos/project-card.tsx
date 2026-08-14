"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

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

interface ProjectCardProps {
    project: Project;
    onSelect: (project: Project) => void;
    priority?: boolean;
}

export default function ProjectCard({
                                        project,
                                        onSelect,
                                        priority = false,
                                    }: ProjectCardProps) {
    return (
        <Card
            onClick={() => onSelect(project)}
            className="group cursor-pointer overflow-hidden rounded-none border-graphite/10 bg-transparent p-0 shadow-none transition-colors hover:border-graphite/25"
        >
            <CardContent className="p-0">

                <div className="relative aspect-[4/5] overflow-hidden bg-graphite/10">

                    <Image
                        src={project.image}
                        alt={`${project.title} — Sotragran`}
                        fill
                        priority={priority}
                        sizes="(max-width: 768px) 92vw, (max-width: 1200px) 45vw, 30vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70" />

                    <div className="absolute left-5 top-5">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
                            {project.number} / PROJECT
                        </span>
                    </div>

                    <div className="absolute bottom-5 left-5">
                        <Badge
                            variant="outline"
                            className="rounded-none border-white/30 bg-black/10 font-mono text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-sm"
                        >
                            {project.category}
                        </Badge>
                    </div>

                    <div className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center border border-white/30 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                    </div>

                </div>

                <div className="flex items-start justify-between gap-6 py-5">

                    <div>
                        <h3 className="font-display text-2xl leading-tight text-warm-white">
                            {project.title}
                        </h3>

                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-graphite/40">
                            {project.location} · {project.year}
                        </p>
                    </div>

                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-graphite/30">
                        Ver →
                    </span>

                </div>

            </CardContent>
        </Card>
    );
}
