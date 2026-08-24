"use client";

import { useState } from "react";
import Link from "next/link";

import ProjectCard from "./project-card";

import { Button } from "@/components/ui/button";
import { PROJECTS, PROJECT_CATEGORIES } from "@/lib/projects";

export default function ProjectsShowcase() {
    const [activeCategory, setActiveCategory] =
        useState("Todos");

    const filteredProjects =
        activeCategory === "Todos"
            ? PROJECTS
            : PROJECTS.filter(
                (project) =>
                    project.category === activeCategory,
            );

    return (
        <section className="border-t border-graphite/15 px-6 py-24 md:px-16 md:py-32">
            <div className="mx-auto max-w-7xl">

                <div className="survey-label mb-12 flex items-center gap-4">
                    <span>01</span>

                    <span className="h-px w-8 bg-current opacity-40" />

                    <span>Seleção de projetos</span>
                </div>

                <div className="mb-14 flex flex-wrap gap-2">
                    {PROJECT_CATEGORIES.map((category) => (
                        <Button
                            key={category}
                            variant={
                                activeCategory === category
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() =>
                                setActiveCategory(category)
                            }
                            className="rounded-none px-4 font-mono text-[10px] uppercase tracking-[0.2em]"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-16 md:grid-cols-2 xl:grid-cols-3">

                    {filteredProjects.map((project, index) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            priority={index < 3}
                        />
                    ))}

                </div>

                <div className="mt-24 border-t border-graphite/15 pt-8">

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/40">
                                O seu projeto
                            </span>

                            <p className="mt-3 font-display text-2xl leading-tight md:text-4xl">
                                Tem um projeto em mente?
                                <br />

                                <span className="italic text-stone">
                                    Vamos conversar.
                                </span>
                            </p>
                        </div>

                        <Link href="/contactos">
                            <Button
                                size="lg"
                                className="rounded-none"
                            >
                                Contacte-nos →
                            </Button>
                        </Link>

                    </div>

                </div>

            </div>
        </section>
    );
}
