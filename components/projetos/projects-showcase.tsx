"use client";

import { useState } from "react";
import Link from "next/link";

import ProjectCard from "./project-card";
import ProjectDialog from "./project-dialog";

import { Button } from "@/components/ui/button";

const projects = [
    {
        id: "project-01",
        number: "01",
        title: "Projeto Residencial",
        category: "Interiores",
        location: "Portugal",
        year: "2026",
        image: "/media/projects/project-01.jpg",
        description:
            "Aplicação de pedra natural num projeto residencial, onde o material assume um papel central na identidade do espaço.",
        materials: ["Granito", "Acabamento polido"],
    },
    {
        id: "project-02",
        number: "02",
        title: "Projeto Residencial",
        category: "Exteriores",
        location: "Portugal",
        year: "2026",
        image: "/media/projects/project-02.jpg",
        description:
            "Uma solução em pedra natural pensada para integrar materialidade, resistência e expressão arquitetónica.",
        materials: ["Granito", "Acabamento personalizado"],
    },
    {
        id: "project-03",
        number: "03",
        title: "Espaço Interior",
        category: "Interiores",
        location: "Portugal",
        year: "2026",
        image: "/media/projects/project-03.jpg",
        description:
            "Pedra natural utilizada como elemento de destaque na construção de um espaço interior.",
        materials: ["Granito", "Acabamento personalizado"],
    },
];

const categories = [
    "Todos",
    "Interiores",
    "Exteriores",
];

export default function ProjectsShowcase() {
    const [activeCategory, setActiveCategory] =
        useState("Todos");

    const [selectedProject, setSelectedProject] =
        useState<(typeof projects)[number] | null>(null);

    const filteredProjects =
        activeCategory === "Todos"
            ? projects
            : projects.filter(
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
                    {categories.map((category) => (
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
                            onSelect={setSelectedProject}
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

                <ProjectDialog
                    project={selectedProject}
                    open={selectedProject !== null}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSelectedProject(null);
                        }
                    }}
                />

            </div>
        </section>
    );
}