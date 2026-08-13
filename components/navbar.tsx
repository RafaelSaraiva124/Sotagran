"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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

        <Link
          href="/contactos"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden md:inline-flex")}
        >
          Contact
        </Link>

        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="md:hidden text-quartz hover:bg-white/10 hover:text-quartz" />}
          >
            <Menu className="size-5" />
            <span className="sr-only">Abrir menu</span>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-full gap-0 border-graphite/20 bg-quarry p-0 text-quartz sm:max-w-xs"
          >
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>

            <nav className="flex flex-col px-6 pt-24">
              {LINKS.map((link) => (
                <SheetClose
                  key={link.href}
                  render={<Link href={link.href} />}
                  className="border-b border-graphite/15 py-4 font-mono text-sm uppercase tracking-[0.2em] text-quartz transition-colors hover:text-feldspar"
                >
                  {link.label}
                </SheetClose>
              ))}

              <SheetClose
                render={<Link href="/contactos" />}
                className="mt-8 inline-flex w-fit items-center gap-2 border-b border-feldspar pb-1 font-mono text-xs uppercase tracking-[0.25em] text-feldspar"
              >
                Contact →
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
