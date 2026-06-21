"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Product } from "@/lib/types";

function formatPrice(price: number) {
  return `${price.toFixed(0)} TND`;
}

function Card({ product, index }: { product: Product; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="product-card group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#111] aspect-[3/4]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover product-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="product-overlay absolute inset-0 bg-black/30 flex items-center justify-center">
            <span className="text-label text-white tracking-[0.2em] border border-white/40 px-6 py-3">
              VIEW PRODUCT
            </span>
          </div>
          {product.isNew && (
            <span className="absolute top-4 left-4 text-[9px] tracking-[0.2em] text-white bg-black/70 px-2 py-1">
              NEW
            </span>
          )}
        </div>
        <div className="mt-4 mb-8 px-1">
          <p className="text-xs tracking-[0.1em] text-[#bbb] font-light uppercase">
            {product.name}
          </p>
          <p className="text-xs tracking-[0.05em] text-[#777] mt-1">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoryGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-label text-[#666]">NO PRODUCTS YET</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 md:gap-x-6 md:gap-y-6">
      {products.map((product, i) => (
        <Card key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
