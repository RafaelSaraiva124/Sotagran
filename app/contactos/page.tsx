import ContactHero from "@/components/contact/contact-hero";
import ContactInfo from "@/components/contact/contact-info";
import ContactMap from "@/components/contact/contact-map";
import Navbar from "@/components/navbar";

export const metadata = {
    title: "Contactos e Pedidos de Orçamento | Sotragran",
    description:
        "Entre em contacto com a Sotragran para informações, pedidos de orçamento e soluções em granito e pedra natural. Oliveira do Hospital, Portugal.",
};

export default function ContactosPage() {
    return (
        <main className="bg-brand-gradient text-graphite">
            <Navbar />
            <ContactHero />
            <ContactInfo />
            <ContactMap />
        </main>
    );
}