import Link from "next/link";
import Image from "next/image";


export default function Aboutus() {
    return (
        <section
            id="about"
            className="px-6 pt-28 text-graphite md:px-16 md:pt-36"
        >
            <div className="mx-auto max-w-7xl">

                <div className="survey-label mb-8 flex items-center gap-4">
                    <span>01</span>
                    <span className="h-px w-8 bg-current opacity-40" />
                    <span>Sobre Nós</span>
                </div>

                <div className="grid gap-12 md:grid-cols-12 md:items-end">

                    <div className="md:col-span-7">
                        <h2 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl">
                            Sotragran
                            <br />
                            <span className="italic text-stone">
                                desde 1990.
                            </span>
                        </h2>
                    </div>

                    <div className="md:col-span-4 md:col-start-9">
                        <p className="font-body text-base leading-relaxed text-graphite md:text-lg">
                            A Sotragran é uma empresa dedicada à
                            transformação e comercialização de pedra
                            natural, com sede em Oliveira do Hospital.
                        </p>
                    </div>

                </div>

                <div className="my-16 h-px bg-graphite/15" />

                <div className="grid gap-12 md:grid-cols-3">

                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">
                            Experiência
                        </span>

                        <p className="mt-4 font-body leading-relaxed text-graphite">
                            Mais de três décadas de experiência
                            dedicada ao trabalho da pedra natural.
                        </p>
                    </div>

                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">
                            Especialização
                        </span>

                        <p className="mt-4 font-body leading-relaxed text-graphite">
                            Transformação de granito e produção de
                            soluções para diferentes necessidades
                            de construção e arquitectura.
                        </p>
                    </div>

                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone">
                            Localização
                        </span>

                        <p className="mt-4 font-body leading-relaxed text-graphite">
                            Oliveira do Hospital, no centro de uma
                            região com forte tradição na indústria
                            da pedra.
                        </p>
                    </div>

                </div>

                <div className="mt-20 flex flex-col gap-3 border-t border-graphite/15 pt-6 md:flex-row md:items-center md:justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-graphite/50">
                        SOTRAGRAN
                    </span>

                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-graphite/50">
                        Pedra natural · Oliveira do Hospital · Portugal
                    </span>
                </div>

            </div>
        </section>
    );
}
