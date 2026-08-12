import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    weight: ["300", "400", "500", "600"],
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
        <html lang="en">
        <body
            className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
        >
        {children}
        </body>
        </html>
    );
}
