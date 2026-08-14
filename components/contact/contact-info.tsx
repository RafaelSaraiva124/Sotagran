export default function ContactInfo() {
    return (
        <section className="border-t border-graphite/15 px-6 py-24 md:px-16 md:py-32">
            <div className="mx-auto max-w-7xl">

                <div className="survey-label mb-12 flex items-center gap-4">
                    <span>01</span>
                    <span className="h-px w-8 bg-current opacity-40" />
                    <span>Contactos</span>
                </div>

                <div className="grid gap-12 md:grid-cols-3">


                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/45">
                            Telefone
                        </span>

                        <a
                            href="tel:+351238605754"
                            aria-label="Ligar para o número de telefone 238 605 754"
                            className="mt-4 block font-display text-2xl transition-colors hover:text-stone md:text-3xl"
                        >
                            238 605 754
                        </a>
                    </div>


                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/45">
                            Email
                        </span>

                        <a
                            href="mailto:geral@sotragran.com"
                            className="mt-4 block font-display text-2xl transition-colors hover:text-stone md:text-3xl"
                        >
                            geral@sotragran.com
                        </a>
                    </div>


                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/45">
                            Localização
                        </span>

                        <p className="mt-4 max-w-xs font-body leading-relaxed text-graphite/70">
                            Zona Industrial, Lote 24D
                            <br />
                            3400-060 Oliveira do Hospital
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
}