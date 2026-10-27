import ContactForm from "@/components/contact/contact-form";

export default function ContactMap() {
    return (
        <section className="border-t border-graphite/15 px-6 py-24 md:px-16 md:py-32">
            <div className="mx-auto max-w-7xl">

                <div className="survey-label mb-12 flex items-center gap-4">
                    <span>02</span>
                    <span className="h-px w-8 bg-current opacity-40" />
                    <span>Envie uma mensagem</span>
                </div>

                <div className="grid gap-16 md:grid-cols-12">

                    <div className="md:col-span-5">
                        <h2 className="font-display text-4xl leading-[0.95] md:text-5xl">
                            Vamos começar
                            <br />
                            <span className="italic text-stone">
                                o seu projecto.
                            </span>
                        </h2>

                        <p className="mt-6 max-w-sm font-body leading-relaxed text-graphite/70">
                            Preencha o formulário com os detalhes do seu
                            projecto e entraremos em contacto brevemente.
                        </p>

                        <div className="mt-10">
                            <ContactForm />
                        </div>
                    </div>

                    <div className="md:col-span-7">
                        <div className="relative aspect-[4/3] overflow-hidden bg-graphite/10 grayscale md:aspect-auto md:h-full">
                            <iframe
                                title="Localização da SerraGran"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=-8.2800%2C40.1900%2C-8.2200%2C40.2400&layer=mapnik&marker=40.2167%2C-8.2500"
                                className="absolute inset-0 h-full w-full border-0"
                                loading="lazy"
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                            <p className="max-w-sm font-body text-sm leading-relaxed text-graphite/65">
                                Zona Industrial, Lote 15 — 3350-123
                                Vila Nova de Poiares, no centro de uma
                                região com forte tradição na indústria
                                da pedra.
                            </p>

                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Zona+Industrial%2C+Lote+15%2C+3350-123+Vila+Nova+de+Poiares"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 border-b border-graphite/40 pb-1 font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:border-stone hover:text-stone"
                            >
                                Abrir no Google Maps →
                            </a>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
