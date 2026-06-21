import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductDetail } from "@/components/product-detail";
import { getProductBySlug, products } from "@/lib/products";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product | KAYE" };
  return {
    title: `${product.name} | KAYE`,
    description: product.description,
    openGraph: {
      title: `${product.name} | KAYE`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
