import Link from "next/link";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { buttonVariants } from "@/components/ui/button";

export default function SectionMaterial() {
    return (
        <section
            id="materials"
            className="bg-quarry px-6 py-28 text-graphite md:px-16 md:py-36"
        >
            <div className="mx-auto max-w-7xl">


                <div className="survey-label mb-8 flex items-center gap-4">
                    <span>03</span>
                    <span className="h-px w-8 bg-current opacity-40" />
                    <span>Materiais</span>
                </div>

                <div className="grid gap-12 md:grid-cols-12 md:items-end">

                    <div className="md:col-span-7">
                        <h2 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] md:text-7xl">
                            A nossa
                            <br />
                            <span className="italic text-stone">
                                colecção.
                            </span>
                        </h2>
                    </div>

                    <div className="md:col-span-4 md:col-start-9">
                        <p className="font-body text-base leading-relaxed text-graphite/70 md:text-lg">
                            Uma selecção de granitos nacionais e
                            internacionais, escolhidos pela sua
                            qualidade, carácter e diversidade.
                        </p>
                    </div>

                </div>


                <div className="my-16 h-px bg-graphite/15" />


                <div className="mb-20">

                    <div className="mb-8 flex items-end justify-between gap-6">
                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/50">
                                03.01
                            </span>

                            <h3 className="mt-3 font-display text-3xl md:text-5xl">
                                Granitos{" "}
                                <span className="italic text-stone">
                                    nacionais
                                </span>
                            </h3>
                        </div>

                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-graphite/40 md:block">
                            Portugal
                        </span>
                    </div>

                    <p className="mb-10 max-w-2xl font-body leading-relaxed text-graphite/70">
                        Granitos provenientes de diferentes regiões de
                        Portugal, com características, tonalidades e
                        padrões próprios. Pedra nacional trabalhada
                        com a experiência da Sotragran.
                    </p>

                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {Array.from({ length: 12}).map(
                                (_, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3"
                                    >
                                        <Card className="overflow-hidden rounded-none border-graphite/10 bg-transparent shadow-none">
                                            <CardContent className="relative aspect-[4/5] p-0">
                                                <div className="absolute inset-0 flex items-center justify-center bg-graphite/10">
                                                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-graphite/40">
                                                        Granito Nacional{" "}
                                                        {String(
                                                            index + 1,
                                                        ).padStart(
                                                            2,
                                                            "0",
                                                        )}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ),
                            )}
                        </CarouselContent>

                        <div className="mt-6 flex justify-end gap-2">
                            <CarouselPrevious className="static translate-y-0" />
                            <CarouselNext className="static translate-y-0" />
                        </div>
                    </Carousel>
                </div>


                <div className="border-t border-graphite/15 pt-16">

                    <div className="mb-8 flex items-end justify-between gap-6">
                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/50">
                                03.02
                            </span>

                            <h3 className="mt-3 font-display text-3xl md:text-5xl">
                                Granitos{" "}
                                <span className="italic text-stone">
                                    estrangeiros
                                </span>
                            </h3>
                        </div>

                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-graphite/40 md:block">
                            Internacional
                        </span>
                    </div>

                    <p className="mb-10 max-w-2xl font-body leading-relaxed text-graphite/70">
                        Uma selecção internacional que amplia as
                        possibilidades de escolha, reunindo diferentes
                        cores, texturas e características para projectos
                        de arquitectura e design.
                    </p>

                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4">
                            {Array.from({ length: 5 }).map(
                                (_, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3"
                                    >
                                        <Card className="overflow-hidden rounded-none border-graphite/10 bg-transparent shadow-none">
                                            <CardContent className="relative aspect-[4/5] p-0">
                                                <div className="absolute inset-0 flex items-center justify-center bg-graphite/10">
                                                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-graphite/40">
                                                        Granito Estrangeiro{" "}
                                                        {String(
                                                            index + 1,
                                                        ).padStart(
                                                            2,
                                                            "0",
                                                        )}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                ),
                            )}
                        </CarouselContent>

                        <div className="mt-6 flex justify-end gap-2">
                            <CarouselPrevious className="static translate-y-0" />
                            <CarouselNext className="static translate-y-0" />
                        </div>
                    </Carousel>
                </div>


                <div className="mt-16 border-t border-graphite/15 pt-8">
                    <Link
                        href="/materials"
                        className={buttonVariants({
                            variant: "primary",
                            size: "lg",
                        })}
                    >
                        Explorar catálogo →
                    </Link>
                </div>

            </div>
        </section>
    );
}