import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";
import { getCurrentUser } from "@/lib/auth";
import { getOrdersByUserId } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=/account");
  }
  const orders = await getOrdersByUserId(user.id);

  return (
    <MeshGradientBackground speed={0.5}>
      <main className="min-h-screen">
        <Navbar />
        <section className="px-6 md:px-10 pt-40 pb-24 max-w-[1100px] mx-auto">
          <p className="text-label text-[#999] mb-3">ACCOUNT</p>
          <h1 className="heading-medium text-white mb-2">
            HELLO, {user.name.split(" ")[0].toUpperCase()}
          </h1>
          <p className="text-sm text-[#888] mb-10">{user.email}</p>

          <div className="flex flex-col md:flex-row gap-12 mt-8">
            <aside className="md:w-64 backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-6 h-fit">
              <p className="text-[10px] tracking-[0.2em] text-[#777] uppercase mb-4">
                Navigation
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/account"
                  className="text-sm tracking-[0.1em] text-white"
                >
                  Orders
                </Link>
                <Link
                  href="/cart"
                  className="text-sm tracking-[0.1em] text-[#888] hover:text-white transition-colors"
                >
                  Cart
                </Link>
                <Link
                  href="/new-in"
                  className="text-sm tracking-[0.1em] text-[#888] hover:text-white transition-colors"
                >
                  Continue shopping
                </Link>
                <SignOutButton />
              </div>
            </aside>

            <div className="flex-1">
              <p className="text-[10px] tracking-[0.2em] text-[#777] uppercase mb-6">
                Order history
              </p>

              {orders.length === 0 ? (
                <div className="backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-10 text-center">
                  <p className="text-sm text-[#888] mb-6">
                    You have no orders yet.
                  </p>
                  <Link
                    href="/new-in"
                    className="inline-block text-xs tracking-[0.2em] bg-white text-black px-8 py-3 hover:bg-[#eee] transition-colors"
                  >
                    DISCOVER THE COLLECTION
                  </Link>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {orders.map((o) => (
                    <li
                      key={o.id}
                      className="backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                    >
                      <div>
                        <p className="text-xs tracking-[0.1em] text-white">
                          ORDER #{o.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[11px] text-[#666] mt-1">
                          {new Date(o.createdAt).toLocaleDateString()} ·{" "}
                          {o.items.length} item{o.items.length === 1 ? "" : "s"}{" "}
                          · ${o.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-[10px] tracking-[0.2em] px-3 py-1 border rounded ${
                            o.status === "paid"
                              ? "border-green-700 text-green-400"
                              : "border-white/[0.15] text-[#888]"
                          }`}
                        >
                          {o.status.toUpperCase()}
                        </span>
                        <Link
                          href={`/order-confirmation/${o.id}`}
                          className="text-[11px] tracking-[0.15em] text-white hover:opacity-70 underline underline-offset-2"
                        >
                          VIEW
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </MeshGradientBackground>
  );
}
