import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import SectionMaterial from "@/components/section-material";
import SectionApplication from "@/components/section-application";
import QuoteCta from "@/components/quote-cta";
import Footer from "@/components/footer";
import Aboutus from "@/components/aboutus";

export const metadata: Metadata = {
    title: {
        absolute: "SerraGran — Pedra Natural Desde 1990",
    },
    description:
        "Granito, mármore e quartzito trabalhados em Vila Nova de Poiares desde 1990. Descubra a coleção de materiais SerraGran, da pedreira à arquitetura.",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        url: "/",
        title: "SerraGran — Pedra Natural Desde 1990",
        description:
            "Granito, mármore e quartzito trabalhados em Vila Nova de Poiares desde 1990. Descubra a coleção de materiais SerraGran, da pedreira à arquitetura.",
    },
};

export default function Home() {
    return (
        <main className="bg-quarry overflow-x-clip">
            <Navbar />
            <Hero />
            <Aboutus/>
            <SectionMaterial />
            <QuoteCta />
            <Footer />
        </main>
    );
}