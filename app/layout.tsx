import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import SiteLoader from "@/components/site-loader";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    weight: "variable",
    style: ["normal", "italic"],
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    weight: ["400", "500", "600"],
    display: "swap",
});

const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-plex-mono",
    weight: ["400", "500"],
    display: "swap",
});

const SITE_URL = "https://www.sotragran.com";
const SITE_NAME = "Sotragran";
const SITE_TITLE = "Sotragran — Pedra Natural Desde 1990";
const SITE_DESCRIPTION =
    "A Sotragran transforma e comercializa granito, mármore e quartzito desde 1990, em Oliveira do Hospital. Da pedreira à arquitetura — bancadas, revestimentos e soluções em pedra natural.";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_TITLE,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "Sotragran",
        "pedra natural",
        "granito",
        "mármore",
        "quartzito",
        "Oliveira do Hospital",
        "bancadas de granito",
        "revestimentos em pedra",
    ],
    authors: [{ name: SITE_NAME }],
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "pt_PT",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary_large_image",
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="pt-PT"
            suppressHydrationWarning
            className={cn(
                "font-sans",
                geist.variable,
                fraunces.variable,
                inter.variable,
                plexMono.variable,
            )}
        >
        <head>
            <script
                dangerouslySetInnerHTML={{
                    __html: `try{if(localStorage.getItem("sotragran-theme")==="light"){document.documentElement.classList.add("light")}}catch(e){}`,
                }}
            />
        </head>
        <body>
        <SiteLoader />
        {children}
        </body>
        </html>
    );
}
