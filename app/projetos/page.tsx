import Navbar from "@/components/navbar";
import ProjectsHero from "@/components/projetos/projects-hero";
import ProjectsShowcase from "@/components/projetos/projects-showcase";
import Footer from "@/components/footer";

export const metadata = {
    title: "Projetos | Sotragran",
    description:
        "Conheça alguns dos projetos realizados com pedra natural pela Sotragran.",
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