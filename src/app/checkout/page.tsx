"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";
import { useAuth } from "@/components/auth-context";

const SHIPPING = 12;
const TAX_RATE = 0.08;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Tunisie");
  const [phone, setPhone] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name && !fullName) setFullName(user.name);
  }, [user, fullName]);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      // If the cart is empty after hydration, bounce back to the bag.
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  const shipping = items.length > 0 ? SHIPPING : 0;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          address: {
            fullName,
            line1,
            line2: line2 || undefined,
            city,
            state: stateRegion || undefined,
            postalCode,
            country,
            phone: phone || undefined,
          },
          cardNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not place your order.");
        return;
      }
      clear();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <MeshGradientBackground speed={0.4}>
      <main className="min-h-screen">
        <Navbar />
        <section className="px-6 md:px-10 pt-40 pb-24 max-w-[1200px] mx-auto">
          <p className="text-label text-[#999] mb-3">CHECKOUT</p>
          <h1 className="heading-medium text-white mb-10">CHECKOUT</h1>

          {!user && (
            <div className="backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-5 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-sm text-[#aaa]">
                Sign in to complete your order.
              </p>
              <div className="flex gap-3">
                <Link
                  href="/login?next=/checkout"
                  className="text-xs tracking-[0.2em] bg-white text-black px-5 py-3 hover:bg-[#eee] transition-colors"
                >
                  SIGN IN
                </Link>
                <Link
                  href="/signup?next=/checkout"
                  className="text-xs tracking-[0.2em] border border-white/[0.2] text-white px-5 py-3 hover:border-white transition-colors"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </div>
          )}

          {!hydrated || items.length === 0 ? (
            <p className="text-xs text-[#666]">Loading…</p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16"
            >
              {/* Left — forms */}
              <div className="lg:col-span-2 flex flex-col gap-12">
                <Fieldset legend="Shipping address">
                  <TwoCol>
                    <Input
                      label="Full name"
                      value={fullName}
                      onChange={setFullName}
                      autoComplete="name"
                      required
                    />
                    <Input
                      label="Phone (optional)"
                      value={phone}
                      onChange={setPhone}
                      autoComplete="tel"
                    />
                  </TwoCol>
                  <Input
                    label="Address"
                    value={line1}
                    onChange={setLine1}
                    autoComplete="address-line1"
                    required
                  />
                  <Input
                    label="Apt, suite, etc. (optional)"
                    value={line2}
                    onChange={setLine2}
                    autoComplete="address-line2"
                  />
                  <TwoCol>
                    <Input
                      label="City"
                      value={city}
                      onChange={setCity}
                      autoComplete="address-level2"
                      required
                    />
                    <Input
                      label="State / Region"
                      value={stateRegion}
                      onChange={setStateRegion}
                      autoComplete="address-level1"
                    />
                  </TwoCol>
                  <TwoCol>
                    <Input
                      label="Postal code"
                      value={postalCode}
                      onChange={setPostalCode}
                      autoComplete="postal-code"
                      required
                    />
                    <Input
                      label="Country"
                      value={country}
                      onChange={setCountry}
                      autoComplete="country-name"
                      required
                    />
                  </TwoCol>
                </Fieldset>

                <Fieldset legend="Payment">
                  <p className="text-[11px] tracking-[0.05em] text-[#666] mb-4 leading-relaxed">
                    Paiement sécurisé — compatible avec les cartes bancaires
                    tunisiennes (Attijari Bank, BIAT, STB, BNA, Amen Bank).
                    Seuls les 4 derniers chiffres sont enregistrés.
                  </p>
                  <Input
                    label="Card number"
                    value={cardNumber}
                    onChange={(v) =>
                      setCardNumber(v.replace(/[^\d\s-]/g, "").slice(0, 23))
                    }
                    inputMode="numeric"
                    required
                    placeholder="4242 4242 4242 4242"
                  />
                  <TwoCol>
                    <Input
                      label="Expiry (MM/YY)"
                      value={cardExp}
                      onChange={(v) => setCardExp(v.slice(0, 5))}
                      placeholder="12/28"
                      required
                    />
                    <Input
                      label="CVC"
                      value={cardCvc}
                      onChange={(v) =>
                        setCardCvc(v.replace(/\D/g, "").slice(0, 4))
                      }
                      inputMode="numeric"
                      required
                    />
                  </TwoCol>
                </Fieldset>

                {error && (
                  <p className="text-xs tracking-[0.05em] text-red-400">
                    {error}
                  </p>
                )}
              </div>

              {/* Right — summary */}
              <aside className="backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-6 md:p-8 h-fit lg:sticky lg:top-32">
                <p className="text-[10px] tracking-[0.2em] text-[#999] uppercase mb-6">
                  Order summary
                </p>
                <ul className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
                  {items.map((it) => (
                    <li
                      key={`${it.productId}-${it.size ?? ""}`}
                      className="flex gap-3"
                    >
                      <div className="relative w-14 h-20 bg-[#111] overflow-hidden flex-shrink-0 rounded">
                        <Image
                          src={it.image}
                          alt={it.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-white tracking-[0.05em] uppercase truncate">
                          {it.name}
                        </p>
                        <p className="text-[10px] text-[#666] mt-1">
                          QTY {it.quantity}
                          {it.size ? ` · ${it.size}` : ""}
                        </p>
                      </div>
                      <p className="text-xs text-white whitespace-nowrap">
                        {(it.price * it.quantity).toFixed(0)} TND
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/[0.08] mt-6 pt-5">
                  <Row label="Subtotal" value={`${subtotal.toFixed(2)} TND`} />
                  <Row label="Livraison" value={`${shipping.toFixed(2)} TND`} />
                  <Row label="TVA" value={`${tax.toFixed(2)} TND`} />
                  <div className="border-t border-white/[0.08] mt-4 pt-4">
                    <Row label="Total" value={`${total.toFixed(2)} TND`} bold />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-8 text-xs tracking-[0.2em] bg-white text-black py-4 hover:bg-[#eee] transition-colors disabled:opacity-50"
                >
                  {submitting ? "PLACING ORDER…" : "PLACE ORDER"}
                </button>
              </aside>
            </form>
          )}
        </section>
        <Footer />
      </main>
    </MeshGradientBackground>
  );
}

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-6 md:p-8 flex flex-col gap-5">
      <legend className="px-2 text-[10px] tracking-[0.2em] text-[#999] uppercase">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
  );
}

function Input({
  label,
  value,
  onChange,
  autoComplete,
  required,
  inputMode,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
  inputMode?: "text" | "numeric" | "email" | "tel";
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] tracking-[0.2em] text-[#888] uppercase">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        inputMode={inputMode}
        placeholder={placeholder}
        className="bg-transparent border-b border-white/[0.15] py-3 text-sm text-white outline-none focus:border-white transition-colors placeholder:text-[#444]"
      />
    </label>
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
      className={`flex items-center justify-between py-1.5 ${
        bold ? "text-white text-sm" : "text-[#aaa] text-xs"
      }`}
    >
      <span className="text-[#888] uppercase tracking-[0.15em] text-[10px]">
        {label}
      </span>
      <span>{value}</span>
    </div>
  );
}
