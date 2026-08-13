import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-basalt px-6 py-16 text-quartz/60 md:px-16 md:py-20">
            <div className="mx-auto max-w-7xl">

                {/* =========================================
                    TOP
                ========================================= */}

                <div className="grid gap-12 md:grid-cols-12">

                    {/* BRAND */}

                    <div className="md:col-span-5">
                        <span className="font-display text-2xl tracking-[0.18em] text-quartz">
                            SOTRAGRAN
                        </span>

                        <p className="mt-5 max-w-sm font-body text-sm leading-relaxed text-quartz/50">
                            Transformação e comercialização de
                            pedra natural desde 1990.
                        </p>

                        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-quartz/35">
                            Oliveira do Hospital · Portugal
                        </p>
                    </div>

                    {/* NAVIGATION */}

                    <div className="md:col-span-3 md:col-start-7">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-quartz/35">
                            Navegação
                        </span>

                        <nav className="mt-5 flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">

                            <Link
                                href="/"
                                className="transition-colors hover:text-stone"
                            >
                                Início
                            </Link>

                            <Link
                                href="/sobre-nos"
                                className="transition-colors hover:text-stone"
                            >
                                Sobre nós
                            </Link>

                            <Link
                                href="/materiais"
                                className="transition-colors hover:text-stone"
                            >
                                Materiais
                            </Link>

                            <Link
                                href="/contactos"
                                className="transition-colors hover:text-stone"
                            >
                                Contactos
                            </Link>

                        </nav>
                    </div>

                    {/* CONTACT */}

                    <div className="md:col-span-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-quartz/35">
                            Contacto
                        </span>

                        <div className="mt-5 flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.15em]">

                            <a
                                href="mailto:geral@sotragran.com"
                                className="transition-colors hover:text-stone"
                            >
                                geral@sotragran.com
                            </a>

                            <Link
                                href="/contactos"
                                className="mt-2 inline-flex w-fit border-b border-quartz/30 pb-1 transition-colors hover:border-stone hover:text-stone"
                            >
                                Fale connosco →
                            </Link>

                        </div>
                    </div>

                </div>

                {/* =========================================
                    DIVIDER
                ========================================= */}

                <div className="my-12 h-px bg-quartz/10" />

                {/* =========================================
                    BOTTOM
                ========================================= */}

                <div className="flex flex-col gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-quartz/30 md:flex-row md:items-center md:justify-between">

                    <span>
                        © {new Date().getFullYear()} Sotragran
                    </span>

                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <span>
                            Pedra natural
                        </span>

                        <span>
                            Oliveira do Hospital
                        </span>

                        <span>
                            Portugal
                        </span>
                    </div>

                </div>

            </div>
        </footer>
    );
}