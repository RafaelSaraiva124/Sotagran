import Image from "next/image";
import Link from "next/link";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { buttonVariants } from "@/components/ui/button";

const nationalGranites = [
    {
        name: "Amarelo Figueira",
        origin: "Portugal",
        image: "/media/Nacionais/amarelo_figueira.jpg",
    },
    {
        name: "Amarelo Real",
        origin: "Portugal",
        image: "/media/Nacionais/amarelo_real.jpg",
    },
    {
        name: "Amarelo ST",
        origin: "Portugal",
        image: "/media/Nacionais/amarelo_st.jpg",
    },
    {
        name: "Cinza Évora",
        origin: "Portugal",
        image: "/media/Nacionais/cinsa_evora.jpg",
    },
    {
        name: "Cinza Penalva",
        origin: "Portugal",
        image: "/media/Nacionais/cinsa_penalva.jpg",
    },
    {
        name: "Cinza Pinhel",
        origin: "Portugal",
        image: "/media/Nacionais/cinsa_pinhel.jpg",
    },
    {
        name: "Cinza Tragal",
        origin: "Portugal",
        image: "/media/Nacionais/cinza_tragal.jpg",
    },
    {
        name: "Pedras Salgadas",
        origin: "Portugal",
        image: "/media/Nacionais/pedras_salgadas.jpg",
    },
    {
        name: "Rosa Arronches",
        origin: "Portugal",
        image: "/media/Nacionais/rosa_arronches.jpg",
    },
    {
        name: "Rosa Monção",
        origin: "Portugal",
        image: "/media/Nacionais/rosa_moncao.jpg",
    },
    {
        name: "Rosa Monforte",
        origin: "Portugal",
        image: "/media/Nacionais/rosa_monforte.jpg",
    },
    {
        name: "Rosa Santa Eulália",
        origin: "Portugal",
        image: "/media/Nacionais/rosa_santa_eulalia.jpg",
    },
];


const foreignGranites = [
    {
        name: "Amarelo Giallo",
        origin: "Internacional",
        image: "/media/Estrangeiros/amarelo_giallo_13.jpg",
    },
    {
        name: "Amarelo Imperial",
        origin: "Internacional",
        image: "/media/Estrangeiros/amarelo_imperial_14.jpg",
    },
    {
        name: "Azul Lavrador",
        origin: "Internacional",
        image: "/media/Estrangeiros/azul_lavrador_15.jpg",
    },
    {
        name: "Colibri",
        origin: "Internacional",
        image: "/media/Estrangeiros/colibri_16.jpg",
    },
    {
        name: "Impala",
        origin: "Internacional",
        image: "/media/Estrangeiros/impala_17.jpg",
    },
    {
        name: "Kashmir White",
        origin: "Internacional",
        image: "/media/Estrangeiros/kashmir_white_18.jpg",
    },
    {
        name: "Negro Angola",
        origin: "Internacional",
        image: "/media/Estrangeiros/negro_angola_19.jpg",
    },
    {
        name: "Ochavo",
        origin: "Internacional",
        image: "/media/Estrangeiros/ochavo_20.jpg",
    },
    {
        name: "Relíquia",
        origin: "Internacional",
        image: "/media/Estrangeiros/reliquia_21.jpg",
    },
    {
        name: "Rosa Porrinho",
        origin: "Internacional",
        image: "/media/Estrangeiros/rosa_porrinho_22.jpg",
    },
    {
        name: "Verde Eucalipto",
        origin: "Internacional",
        image: "/media/Estrangeiros/verde_eucalipto_23.jpg",
    },
    {
        name: "Verde São Francisco",
        origin: "Internacional",
        image: "/media/Estrangeiros/verde_s_francisco_24.jpg",
    },
];

function MaterialCarousel({
                              materials,
                          }: {
    materials: typeof nationalGranites;
}) {
    return (
        <Carousel
            opts={{
                align: "start",
                loop: false,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-4">
                {materials.map((material, index) => (
                    <CarouselItem
                        key={material.name}
                        className="basis-[88%] pl-4 sm:basis-[55%] md:basis-[42%] lg:basis-[32%] xl:basis-[27%]"
                    >
                        <div className="group">


                            <div className="relative aspect-[4/5] overflow-hidden bg-graphite/10">

                                <Image
                                    src={material.image}
                                    alt={material.name}
                                    fill
                                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 42vw, 27vw"
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />


                                <div className="absolute left-5 top-5">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/80">
                                        {String(index + 1).padStart(2, "0")} /{" "}
                                        {String(materials.length).padStart(2, "0")}
                                    </span>
                                </div>

                            </div>


                            <div className="mt-4 flex items-start justify-between gap-4 border-b border-graphite/15 pb-5">

                                <div>
                                    <h4 className="font-display text-xl leading-tight md:text-2xl">
                                        {material.name}
                                    </h4>

                                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-graphite/45">
                                        {material.origin}
                                    </p>
                                </div>

                                <span className="mt-1 text-graphite/30 transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>

                            </div>

                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>


            <div className="mt-8 flex items-center justify-between">

                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-graphite/40">
                    {materials.length} variedades
                </span>

                <div className="flex gap-2">
                    <CarouselPrevious className="static translate-y-0" />
                    <CarouselNext className="static translate-y-0" />
                </div>

            </div>
        </Carousel>
    );
}


export default function SectionMaterial() {
    return (
        <section
            id="materials"
            className="px-6 py-28 text-graphite md:px-16 md:py-36"
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


                <div className="mb-24">

                    <div className="mb-10 flex items-end justify-between gap-6">

                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/50">
                                03.01
                            </span>

                            <h3 className="mt-3 font-display text-3xl md:text-5xl">
                                Granitos{" "}
                                <span className="italic text-stone">
                                    Nacionais
                                </span>
                            </h3>
                        </div>

                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-graphite/40 md:block">
                            Portugal
                        </span>

                    </div>

                    <p className="mb-10 max-w-2xl font-body leading-relaxed text-graphite/70">
                        Granitos de origem nacional, com diferentes
                        tonalidades, texturas e características, seleccionados
                        para responder às exigências de cada projecto.
                    </p>

                    <MaterialCarousel
                        materials={nationalGranites}
                    />

                </div>

                <div className="border-t border-graphite/15 pt-20">

                    <div className="mb-10 flex items-end justify-between gap-6">

                        <div>
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-graphite/50">
                                03.02
                            </span>

                            <h3 className="mt-3 font-display text-3xl md:text-5xl">
                                Granitos{" "}
                                <span className="italic text-stone">
                                    Estrangeiros
                                </span>
                            </h3>
                        </div>

                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-graphite/40 md:block">
                            Internacional
                        </span>

                    </div>

                    <p className="mb-10 max-w-2xl font-body leading-relaxed text-graphite/70">
                        Uma selecção internacional que amplia as
                        possibilidades, reunindo pedras com diferentes
                        cores, padrões e identidades.
                    </p>

                    <MaterialCarousel
                        materials={foreignGranites}
                    />

                </div>


            </div>
        </section>
    );
}