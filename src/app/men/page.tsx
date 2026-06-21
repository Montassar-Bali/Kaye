import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CategoryGrid } from "@/components/category-grid";
import { CategoryHero } from "@/components/category-hero";
import { categoryMeta, getProductsByCategory } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Men | KAYE",
  description:
    "Men's ready-to-wear for Fall/Winter 2026. Explore the KAYE collection.",
};

export default function MenPage() {
  const meta = categoryMeta.men;
  const products = getProductsByCategory("men");
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <CategoryHero
        eyebrow={meta.eyebrow}
        heading={meta.heading}
        description={meta.description}
      />
      <section className="px-4 md:px-8 py-14 md:py-20 max-w-[1400px] mx-auto">
        <CategoryGrid products={products} />
      </section>
      <Footer />
    </main>
  );
}
