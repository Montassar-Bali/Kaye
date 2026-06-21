"use client";

import { AuthProvider } from "./auth-context";
import { CartProvider } from "./cart-context";
import type { PublicUser } from "@/lib/types";

export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: PublicUser | null;
}) {
  return (
    <AuthProvider initialUser={initialUser}>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
