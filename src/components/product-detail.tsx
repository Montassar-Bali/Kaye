"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import type { Product } from "@/lib/types";

function formatPrice(price: number) {
  return `${price.toFixed(0)} TND`;
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [size, setSize] = useState<string | undefined>(product.sizes?.[0]);
  const [color, setColor] = useState<string | undefined>(product.colors?.[0]);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);

  function onAdd() {
    if (product.sizes && product.sizes.length > 0 && !size) {
      setError("Please select a size.");
      return;
    }
    setError(null);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      size,
      color,
    });
  }

  function onBuyNow() {
    onAdd();
    router.push("/checkout");
  }

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-3"
        >
          <div className="relative w-full aspect-[3/4] bg-[#111] overflow-hidden">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3">
              {gallery.map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-20 h-28 bg-[#111] overflow-hidden border transition-colors ${
                    activeImage === img ? "border-white" : "border-transparent"
                  }`}
                  aria-label="Change image"
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:sticky md:top-32 md:self-start"
        >
          <p className="text-label text-[#666] mb-3">
            {product.categories[0].toUpperCase()}
          </p>
          <h1 className="heading-medium text-white">{product.name}</h1>
          <p className="text-lg text-white mt-4 tracking-[0.05em]">
            {formatPrice(product.price)}
          </p>

          <p className="text-sm text-[#aaa] leading-relaxed mt-8 max-w-md">
            {product.description}
          </p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.2em] text-[#666] uppercase mb-3">
                Color · {color}
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`text-[11px] tracking-[0.15em] border px-4 py-2 transition-colors ${
                      color === c
                        ? "border-white text-white"
                        : "border-[#333] text-[#888] hover:border-[#666]"
                    }`}
                  >
                    {c.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-8">
              <p className="text-[10px] tracking-[0.2em] text-[#666] uppercase mb-3">
                Size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-12 h-11 text-xs tracking-[0.1em] border transition-colors ${
                      size === s
                        ? "border-white text-white"
                        : "border-[#333] text-[#888] hover:border-[#666]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <p className="text-[10px] tracking-[0.2em] text-[#666] uppercase mb-3">
              Quantity
            </p>
            <div className="flex items-center border border-[#333] w-max">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 text-white hover:bg-[#111]"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="w-10 h-10 text-white hover:bg-[#111]"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-xs tracking-[0.05em] text-red-400">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 mt-10">
            <button
              onClick={onAdd}
              className="text-xs tracking-[0.2em] bg-white text-black py-4 hover:bg-[#eee] transition-colors"
            >
              ADD TO BAG
            </button>
            <button
              onClick={onBuyNow}
              className="text-xs tracking-[0.2em] border border-[#444] text-white py-4 hover:border-white transition-colors"
            >
              BUY NOW
            </button>
          </div>

          {product.details && product.details.length > 0 && (
            <div className="mt-12 border-t border-[#1e1e1e] pt-8">
              <p className="text-[10px] tracking-[0.2em] text-[#666] uppercase mb-4">
                Details
              </p>
              <ul className="text-xs text-[#aaa] leading-loose">
                {product.details.map((d) => (
                  <li key={d}>— {d}</li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href="/new-in"
            className="mt-10 text-[10px] tracking-[0.2em] text-[#666] hover:text-white transition-colors"
          >
            ← BACK TO COLLECTION
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
