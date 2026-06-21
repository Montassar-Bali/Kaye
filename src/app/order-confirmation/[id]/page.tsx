import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getCurrentUser } from "@/lib/auth";
import { getOrderById } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type Params = { id: string };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=/order-confirmation/${id}`);
  }
  const order = await getOrderById(id);
  if (!order || order.userId !== user.id) notFound();

  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <section className="px-6 md:px-10 pt-40 pb-24 max-w-[1000px] mx-auto">
        <p className="text-label text-[#666] mb-3">THANK YOU</p>
        <h1 className="heading-medium text-white mb-4">ORDER CONFIRMED</h1>
        <p className="text-sm text-[#888] mb-10 max-w-lg leading-relaxed">
          Your order{" "}
          <span className="text-white">
            #{order.id.slice(0, 8).toUpperCase()}
          </span>{" "}
          has been placed. A confirmation has been sent to {user.email}.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 border border-[#1e1e1e] p-6 md:p-8">
            <p className="text-[10px] tracking-[0.2em] text-[#888] uppercase mb-6">
              Items
            </p>
            <ul className="flex flex-col divide-y divide-[#1a1a1a]">
              {order.items.map((it) => (
                <li
                  key={`${it.productId}-${it.size ?? ""}`}
                  className="flex gap-4 py-5"
                >
                  <div className="relative w-16 h-20 bg-[#111] overflow-hidden flex-shrink-0">
                    <Image
                      src={it.image}
                      alt={it.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs tracking-[0.1em] text-white uppercase">
                      {it.name}
                    </p>
                    <p className="text-[10px] tracking-[0.1em] text-[#666] mt-1">
                      QTY {it.quantity}
                      {it.size ? ` · ${it.size}` : ""}
                      {it.color ? ` · ${it.color}` : ""}
                    </p>
                  </div>
                  <p className="text-xs text-white">
                    ${(it.price * it.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#1a1a1a] mt-6 pt-6 flex flex-col gap-2 text-xs">
              <Row label="Subtotal" value={`$${order.subtotal.toFixed(2)}`} />
              <Row label="Shipping" value={`$${order.shipping.toFixed(2)}`} />
              <Row label="Tax" value={`$${order.tax.toFixed(2)}`} />
              <div className="border-t border-[#1a1a1a] mt-3 pt-3">
                <Row label="Total" value={`$${order.total.toFixed(2)}`} bold />
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-8">
            <div className="border border-[#1e1e1e] p-6">
              <p className="text-[10px] tracking-[0.2em] text-[#888] uppercase mb-4">
                Shipping to
              </p>
              <p className="text-xs text-white leading-relaxed">
                {order.address.fullName}
                <br />
                {order.address.line1}
                {order.address.line2 ? (
                  <>
                    <br />
                    {order.address.line2}
                  </>
                ) : null}
                <br />
                {order.address.city}
                {order.address.state ? `, ${order.address.state}` : ""}{" "}
                {order.address.postalCode}
                <br />
                {order.address.country}
              </p>
            </div>

            <div className="border border-[#1e1e1e] p-6">
              <p className="text-[10px] tracking-[0.2em] text-[#888] uppercase mb-4">
                Payment
              </p>
              <p className="text-xs text-white">
                Card ending in ••••{order.paymentLast4}
              </p>
              <p className="text-[10px] tracking-[0.1em] text-[#666] mt-2">
                Status: {order.status.toUpperCase()}
              </p>
            </div>

            <Link
              href="/account"
              className="text-center text-xs tracking-[0.2em] border border-[#333] text-white py-4 hover:border-white transition-colors"
            >
              VIEW ALL ORDERS
            </Link>
            <Link
              href="/new-in"
              className="text-center text-xs tracking-[0.2em] bg-white text-black py-4 hover:bg-[#eee] transition-colors"
            >
              CONTINUE SHOPPING
            </Link>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
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
      className={`flex items-center justify-between py-1 ${
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
