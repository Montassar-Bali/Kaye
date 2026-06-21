"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";

export function SignOutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await logout();
        router.push("/");
        router.refresh();
      }}
      className="text-sm tracking-[0.1em] text-[#888] hover:text-red-400 transition-colors text-left mt-6"
    >
      Sign out
    </button>
  );
}
