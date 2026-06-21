"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-context";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/account";
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.ok) {
      router.push(next);
      router.refresh();
    } else {
      setError(result.error ?? "Login failed");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-email"
          className="text-[10px] tracking-[0.2em] text-[#888] uppercase"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-transparent border-b border-[#333] py-3 text-sm text-white outline-none focus:border-white transition-colors"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="login-password"
          className="text-[10px] tracking-[0.2em] text-[#888] uppercase"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-transparent border-b border-[#333] py-3 text-sm text-white outline-none focus:border-white transition-colors"
        />
      </div>

      {error && (
        <p className="text-xs tracking-[0.05em] text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 text-xs tracking-[0.2em] bg-white text-black py-4 hover:bg-[#eee] transition-colors disabled:opacity-50"
      >
        {loading ? "SIGNING IN…" : "SIGN IN"}
      </button>

      <p className="text-xs tracking-[0.05em] text-[#777] text-center">
        New to KAYE?{" "}
        <Link
          href={`/signup?next=${encodeURIComponent(next)}`}
          className="text-white underline underline-offset-2"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <MeshGradientBackground speed={0.6}>
      <main className="min-h-screen">
        <Navbar />
        <section className="px-6 md:px-10 pt-40 pb-24 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="backdrop-blur-md bg-black/30 border border-white/[0.08] rounded-lg p-8 md:p-10 shadow-2xl">
              <p className="text-label text-[#999] mb-3">ACCOUNT</p>
              <h1 className="heading-medium text-white mb-10">SIGN IN</h1>
              <Suspense fallback={<p className="text-xs text-[#666]">Loading…</p>}>
                <LoginForm />
              </Suspense>
            </div>
          </motion.div>
        </section>
        <Footer />
      </main>
    </MeshGradientBackground>
  );
}
