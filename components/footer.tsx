import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-basalt text-quartz/60 px-6 md:px-16 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
      <span className="font-display text-sm tracking-[0.2em] text-quartz">
        SOTRAGRAN
      </span>
      <span className="font-mono text-[11px] uppercase tracking-widest2">
        © {new Date().getFullYear()} Sotragran — natural stone, quarried in Portugal
      </span>
      <div className="flex gap-6 font-mono text-[11px] uppercase tracking-widest2">
        <Link href="/materials" className="hover:text-feldspar transition-colors">
          Materials
        </Link>
        <Link href="/projects" className="hover:text-feldspar transition-colors">
          Projects
        </Link>
        <Link href="#quote" className="hover:text-feldspar transition-colors">
          Contact
        </Link>
      </div>
    </footer>
  );
}
