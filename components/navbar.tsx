"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

const LINKS = [
  { label: "Materials", href: "#materials" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Architects", href: "#architects" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
      <nav className="flex items-center justify-between px-6 md:px-10 h-20 text-quartz">
        <Link href="/" className="font-display text-lg tracking-[0.2em]">
          SOTRAGRAN
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

        <Link href="#quote" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Contact
        </Link>
      </nav>
    </header>
  );
}
