import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import ProjectsHero from "@/components/projetos/projects-hero";
import ProjectsShowcase from "@/components/projetos/projects-showcase";
import Footer from "@/components/footer";

const TITLE = "Projetos";
const DESCRIPTION =
    "Projetos residenciais, arquitetónicos e de interiores com granito, mármore e quartzito da Sotragran. Da pedreira em Oliveira do Hospital até ao espaço final.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
        canonical: "/projetos",
    },
    openGraph: {
        url: "/projetos",
        title: TITLE,
        description: DESCRIPTION,
    },
};

export default function ProjetosPage() {
    return (
        <main className="bg-quarry text-graphite">
            <Navbar />
            <ProjectsHero />
            <ProjectsShowcase />
            <Footer />
        </main>
    );
}