import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import SectionMaterial from "@/components/section-material";
import SectionApplication from "@/components/section-application";
import SectionCatalogCta from "@/components/section-catalog-cta";
import QuoteCta from "@/components/quote-cta";
import Footer from "@/components/footer";
import Aboutus from "@/components/aboutus";

export default function Home() {
    return (
        <main className="overflow-x-clip">
            <Navbar />
            <Hero />
            <Aboutus/>
            <SectionMaterial />
            <SectionApplication />
            <section id="materials">
                <SectionCatalogCta />
            </section>
            <QuoteCta />
            <Footer />
        </main>
    );
}