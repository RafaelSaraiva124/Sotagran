import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import SectionMaterial from "@/components/section-material";
import SectionApplication from "@/components/section-application";
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
            <QuoteCta />
            <Footer />
        </main>
    );
}