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
                                title="Localização da Sotragran"
                                src="https://www.openstreetmap.org/export/embed.html?bbox=-7.8443073%2C40.3572774%2C-7.8323073%2C40.3652774&layer=mapnik&marker=40.3612774%2C-7.8383073"
                                className="absolute inset-0 h-full w-full border-0"
                                loading="lazy"
                            />
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                            <p className="max-w-sm font-body text-sm leading-relaxed text-graphite/65">
                                Zona Industrial, Lote 24D — 3400-060
                                Oliveira do Hospital, no centro de uma
                                região com forte tradição na indústria
                                da pedra.
                            </p>

                            <a
                                href="https://www.google.com/maps/search/?api=1&query=Zona+Industrial%2C+Lote+24D%2C+3400-060+Oliveira+do+Hospital"
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
