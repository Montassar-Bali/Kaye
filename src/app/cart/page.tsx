"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-context";
import { Minus, Plus, X } from "lucide-react";

const SHIPPING = 12;
const TAX_RATE = 0.08;

export default function CartPage() {
  const router = useRouter();
  const { items, subtotal, updateQuantity, removeItem, hydrated } = useCart();
  const shipping = items.length > 0 ? SHIPPING : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return (
    <MeshGradientBackground speed={0.5}>
      <main className="min-h-screen">
        <Navbar />
        <section className="px-6 md:px-10 pt-40 pb-24 max-w-[1200px] mx-auto">
          <p className="text-label text-[#999] mb-3">YOUR BAG</p>
          <h1 className="heading-medium text-white mb-12">SHOPPING BAG</h1>

          {!hydrated ? (
            <p className="text-xs text-[#666]">Loading…</p>
          ) : items.length === 0 ? (
            <div className="backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-16 text-center">
              <p className="text-sm text-[#888] mb-8">Your bag is empty.</p>
              <Link
                href="/new-in"
                className="inline-block text-xs tracking-[0.2em] bg-white text-black px-8 py-4 hover:bg-[#eee] transition-colors"
              >
                DISCOVER THE COLLECTION
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
              {/* Items */}
              <div className="lg:col-span-2 backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-6 md:p-8">
                <div className="flex flex-col divide-y divide-white/[0.06]">
                  {items.map((it) => (
                    <div
                      key={`${it.productId}-${it.size ?? ""}`}
                      className="flex gap-5 py-6"
                    >
                      <div className="relative w-24 h-32 md:w-28 md:h-36 flex-shrink-0 bg-[#111] overflow-hidden rounded">
                        <Image
                          src={it.image}
                          alt={it.name}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/products/${it.slug}`}
                              className="text-xs tracking-[0.1em] text-white hover:opacity-70 uppercase"
                            >
                              {it.name}
                            </Link>
                            <p className="text-[10px] tracking-[0.1em] text-[#666] mt-1">
                              {it.size ? `SIZE ${it.size}` : null}
                              {it.size && it.color ? " · " : ""}
                              {it.color?.toUpperCase()}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(it.productId, it.size)}
                            className="text-[#666] hover:text-white transition-colors"
                            aria-label="Remove"
                          >
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-auto pt-4">
                          <div className="flex items-center border border-white/[0.12] rounded">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  it.productId,
                                  it.quantity - 1,
                                  it.size,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/[0.05]"
                              aria-label="Decrease"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs">
                              {it.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  it.productId,
                                  it.quantity + 1,
                                  it.size,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/[0.05]"
                              aria-label="Increase"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="text-sm text-white tracking-[0.05em]">
                            {(it.price * it.quantity).toFixed(0)} TND
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <aside className="backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-6 md:p-8 h-fit lg:sticky lg:top-32">
                <p className="text-[10px] tracking-[0.2em] text-[#999] uppercase mb-6">
                  Summary
                </p>
                <Row label="Subtotal" value={`${subtotal.toFixed(2)} TND`} />
                <Row label="Shipping" value={`${shipping.toFixed(2)} TND`} />
                <Row label="TVA" value={`${tax.toFixed(2)} TND`} />
                <div className="border-t border-white/[0.08] mt-5 pt-5">
                  <Row label="Total" value={`${total.toFixed(2)} TND`} bold />
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full mt-8 text-xs tracking-[0.2em] bg-white text-black py-4 hover:bg-[#eee] transition-colors"
                >
                  CHECKOUT
                </button>
                <Link
                  href="/new-in"
                  className="block w-full text-center mt-3 text-[11px] tracking-[0.15em] text-[#888] hover:text-white transition-colors"
                >
                  CONTINUE SHOPPING
                </Link>
              </aside>
            </div>
          )}
        </section>
        <Footer />
      </main>
    </MeshGradientBackground>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between text-xs tracking-[0.05em] py-1.5 ${
        bold ? "text-white text-sm" : "text-[#aaa]"
      }`}
    >
      <span className="text-[#888] uppercase tracking-[0.15em] text-[10px]">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}
