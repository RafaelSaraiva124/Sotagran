import type { Metadata } from "next";
import ContactHero from "@/components/contact/contact-hero";
import ContactInfo from "@/components/contact/contact-info";
import ContactMap from "@/components/contact/contact-map";
import Navbar from "@/components/navbar";

const TITLE = "Contactos e Pedidos de Orçamento";
const DESCRIPTION =
    "Entre em contacto com a SerraGran para informações, pedidos de orçamento e soluções em granito, mármore e quartzito. Zona Industrial, Vila Nova de Poiares, Portugal.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: {
        canonical: "/contactos",
    },
    openGraph: {
        url: "/contactos",
        title: TITLE,
        description: DESCRIPTION,
    },
};

export default function ContactosPage() {
    return (
        <main className="text-graphite">
            <Navbar />
            <ContactHero />
            <ContactInfo />
            <ContactMap />
        </main>
    );
}