import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import SectionOrigin from "@/components/section-origin";
import SectionTransformation from "@/components/section-transformation";
import SectionMaterial from "@/components/section-material";
import SectionCraft from "@/components/section-craft";
import SectionApplication from "@/components/section-application";
import SectionCatalogCta from "@/components/section-catalog-cta";
import QuoteCta from "@/components/quote-cta";
import Footer from "@/components/footer";

export default function Home() {
    return (
        <main className="overflow-x-clip">
            <Navbar />

            <Hero />

            <section id="origin">
                <SectionOrigin />
            </section>

            <SectionTransformation />

            <SectionMaterial />

            <SectionCraft />

            <SectionApplication />

            <section id="materials">
                <SectionCatalogCta />
            </section>

            <QuoteCta />

            <Footer />
        </main>
    );
}