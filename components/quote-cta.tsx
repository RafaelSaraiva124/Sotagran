import ContactForm from "@/components/contact/contact-form";

export default function QuoteCta() {
    return (
        <section
            id="quote"
            className="px-6 pb-28 text-graphite md:px-16 md:pb-36"
        >
            <div className="mx-auto max-w-7xl">

                <div className="flex flex-col gap-12 border-t border-graphite/15 pt-8 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/50">
                            O próximo passo
                        </span>

                        <p className="mt-3 max-w-xl font-display text-3xl leading-tight md:text-5xl">
                            Gostou de algum material?
                            <br />
                            <span className="italic text-stone">
                                Vamos trabalhar juntos.
                            </span>
                        </p>

                        <p className="mt-3 max-w-md font-body leading-relaxed text-graphite/60">
                            Fale connosco sobre o seu projecto e descubra
                            como podemos encontrar a pedra certa para o
                            seu espaço.
                        </p>
                    </div>

                    <ContactForm />

                </div>

            </div>
        </section>
    );
}