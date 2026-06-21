"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MeshGradientBackground } from "@/components/ui/mesh-gradient-background";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth-context";

function SignupForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/account";
  const { signup, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!accept) {
      setError("Please accept the Terms & Privacy Policy.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const result = await signup(name, email, password);
    if (result.ok) {
      router.push(next);
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <Field
        label="Full name"
        id="signup-name"
        type="text"
        value={name}
        onChange={setName}
        autoComplete="name"
        required
      />
      <Field
        label="Email"
        id="signup-email"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
        required
      />
      <Field
        label="Password"
        id="signup-password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        required
        hint="At least 8 characters"
      />
      <Field
        label="Confirm password"
        id="signup-confirm"
        type="password"
        value={confirm}
        onChange={setConfirm}
        autoComplete="new-password"
        required
      />

      <label className="flex items-start gap-3 text-xs tracking-[0.05em] text-[#888]">
        <input
          type="checkbox"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
          className="mt-[3px] accent-white"
        />
        <span>
          I agree to the{" "}
          <span className="text-white underline underline-offset-2">
            Terms
          </span>{" "}
          &{" "}
          <span className="text-white underline underline-offset-2">
            Privacy Policy
          </span>
          .
        </span>
      </label>

      {error && (
        <p className="text-xs tracking-[0.05em] text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 text-xs tracking-[0.2em] bg-white text-black py-4 hover:bg-[#eee] transition-colors disabled:opacity-50"
      >
        {loading ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
      </button>

      <p className="text-xs tracking-[0.05em] text-[#777] text-center">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="text-white underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  id,
  type,
  value,
  onChange,
  autoComplete,
  required,
  hint,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[10px] tracking-[0.2em] text-[#888] uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required={required}
        className="bg-transparent border-b border-[#333] py-3 text-sm text-white outline-none focus:border-white transition-colors"
      />
      {hint && <p className="text-[10px] tracking-[0.05em] text-[#555]">{hint}</p>}
    </div>
  );
}

export default function SignupPage() {
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
              <h1 className="heading-medium text-white mb-10">CREATE ACCOUNT</h1>
              <Suspense fallback={<p className="text-xs text-[#666]">Loading…</p>}>
                <SignupForm />
              </Suspense>
            </div>
          </motion.div>
        </section>
        <Footer />
      </main>
    </MeshGradientBackground>
  );
}
