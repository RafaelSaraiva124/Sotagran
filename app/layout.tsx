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

export const metadata: Metadata = {
    title: "Sotragran — Stone Shaped by Nature",
    description:
        "Granite, marble and quartzite from quarry to architecture. Explore the Sotragran material collection.",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={cn(
                "font-sans",
                geist.variable,
                fraunces.variable,
                inter.variable,
                plexMono.variable,
            )}
        >
        <body>
        <SiteLoader />
        {children}
        </body>
        </html>
    );
}
