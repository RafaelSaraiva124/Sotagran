import { buttonVariants } from "@/components/ui/button";

export default function QuoteCta() {
  return (
    <section id="quote" className="bg-quarry text-graphite px-6 md:px-16 py-32 text-center">
      <h2 className="font-display text-4xl md:text-6xl mb-10">
        Start your project
      </h2>
      <p className="font-body text-graphite/70 max-w-md mx-auto mb-10">
        Tell us the material, the quantities, and the site — we&apos;ll come
        back with pricing and lead times within one business day.
      </p>
      <a href="mailto:projects@sotragran.pt" className={buttonVariants({ size: "lg" })}>
        Request a quote
      </a>
    </section>
  );
}
