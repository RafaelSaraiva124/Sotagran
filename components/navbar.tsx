"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";

const LINKS = [
  { label: "Catálogo", href: "/#materials" },
  { label: "Projetos", href: "/#projects" },
  { label: "Sobre", href: "/#about" },
  { label: "Contactos", href: "/contactos" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
      <nav className="flex items-center justify-between px-6 md:px-10 h-20 text-quartz">
        <Link href="/" className="group font-display text-lg tracking-[0.2em]">
            <Image
                src="/logo completo branco sem linha.svg"
                alt="Sotragran"
                width={300}
                height={62}
                priority
                className="h-8 w-auto transition-transform duration-700 ease-out group-hover:scale-105"
            />
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-mono text-[11px] uppercase tracking-widest2">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-feldspar transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/contactos" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Contact
        </Link>
      </nav>
    </header>
  );
}
