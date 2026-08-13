export default function ContactHero() {
    return (
        <section className="px-6 pb-24 pt-36 md:px-16 md:pb-32 md:pt-44">
            <div className="mx-auto max-w-7xl">

                <div className="survey-label mb-8 flex items-center gap-4">
                    <span>CONTACTOS</span>
                    <span className="h-px w-8 bg-current opacity-40" />
                    <span>Fale connosco</span>
                </div>

                <div className="grid gap-12 md:grid-cols-12 md:items-end">

                    <div className="md:col-span-8">
                        <h1 className="font-display text-6xl leading-[0.88] tracking-[-0.04em] md:text-8xl lg:text-[9vw]">
                            Fale
                            <br />
                            <span className="italic text-stone">
                                connosco.
                            </span>
                        </h1>
                    </div>

                    <div className="md:col-span-4">
                        <p className="max-w-md font-body text-base leading-relaxed text-graphite/70 md:text-lg">
                            Tem um projecto em mente? Estamos
                            disponíveis para ajudar a encontrar a
                            solução em pedra natural adequada às
                            suas necessidades.
                        </p>
                    </div>

                </div>

                <div className="mt-16 h-px bg-graphite/15" />

                <div className="mt-6 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/40">
                        Sotragran · Desde 1990
                    </span>

                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/40">
                        Oliveira do Hospital · Portugal
                    </span>
                </div>

            </div>
        </section>
    );
}