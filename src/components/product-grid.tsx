"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { getFeaturedProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

type Span = "full" | "half" | "third";

// Lay out featured items into a visually-interesting asymmetric grid.
const layout: { span: Span; aspect: string }[] = [
  { span: "full", aspect: "aspect-[21/9]" },
  { span: "half", aspect: "aspect-[3/4]" },
  { span: "half", aspect: "aspect-[3/4]" },
  { span: "third", aspect: "aspect-[2/3]" },
  { span: "third", aspect: "aspect-[2/3]" },
  { span: "third", aspect: "aspect-[2/3]" },
];

function ProductCard({
  product,
  span,
  aspect,
}: {
  product: Product;
  span: Span;
  aspect: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`product-card group cursor-pointer ${
        span === "full"
          ? "col-span-1 md:col-span-6"
          : span === "half"
          ? "col-span-1 md:col-span-3"
          : "col-span-1 md:col-span-2"
      }`}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className={`relative overflow-hidden bg-[#111] ${aspect}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover product-card-image"
            sizes={
              span === "full" ? "100vw" : span === "half" ? "50vw" : "33vw"
            }
          />
          <div className="product-overlay absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-label text-white tracking-[0.2em] border border-white/40 px-6 py-3 hover:bg-white hover:text-black transition-all duration-300">
              SHOP NOW
            </span>
          </div>
        </div>
        <div className="mt-4 mb-8 px-1">
          <p className="text-xs tracking-[0.1em] text-[#999] font-light uppercase">
            {product.name}
          </p>
          <p className="text-xs tracking-[0.05em] text-[#666] mt-1">
            {product.price.toFixed(0)} TND
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductGrid() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
  const featured = getFeaturedProducts().slice(0, layout.length);

  return (
    <section id="products" className="bg-black px-4 md:px-8 py-20 md:py-32">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 md:mb-24"
      >
        <p className="text-label text-[#666] mb-4">THE EDIT</p>
        <h2 className="heading-large text-white">FEATURED</h2>
      </motion.div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-3">
        {featured.map((product, i) => {
          const l = layout[i] ?? layout[layout.length - 1];
          return (
            <ProductCard
              key={product.id}
              product={product}
              span={l.span}
              aspect={l.aspect}
            />
          );
        })}
      </div>

      <div className="flex justify-center mt-16">
        <Link
          href="/new-in"
          className="text-xs tracking-[0.2em] border border-[#333] text-white px-8 py-4 hover:border-white transition-colors"
        >
          VIEW ALL
        </Link>
      </div>
    </section>
  );
}

export default ProductGrid;
