import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CategoryGrid } from "@/components/category-grid";
import { CategoryHero } from "@/components/category-hero";
import { categoryMeta, getProductsByCategory } from "@/lib/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New In | KAYE",
  description: "The latest additions to the KAYE Fall/Winter 2026 collection.",
};

export default function NewInPage() {
  const meta = categoryMeta["new-in"];
  const products = getProductsByCategory("new-in");
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
