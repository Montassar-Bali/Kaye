"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, User as UserIcon, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { useAuth } from "@/components/auth-context";
import { BrandLogo } from "@/components/brand-logo";

const navLinks = [
  { label: "NEW IN", href: "/new-in" },
  { label: "MEN", href: "/men" },
  { label: "WOMEN", href: "/women" },
  { label: "ACCESSORIES", href: "/accessories" },
  { label: "UNDERWEARS", href: "/underwears" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, hydrated } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md border-b border-[#222]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          {/* Hamburger */}
          <button
            id="nav-menu-toggle"
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-white hover:opacity-60 transition-opacity"
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            id="nav-logo"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <BrandLogo size="md" />
          </Link>

          {/* Right side: account + cart */}
          <div className="flex items-center gap-2">
            <Link
              href={user ? "/account" : "/login"}
              className="w-10 h-10 flex items-center justify-center text-white hover:opacity-60 transition-opacity"
              aria-label={user ? "Your account" : "Sign in"}
              title={user ? `Signed in as ${user.name}` : "Sign in"}
            >
              <UserIcon size={20} strokeWidth={1.5} />
            </Link>
            <Link
              href="/cart"
              id="nav-cart"
              className="w-10 h-10 flex items-center justify-center text-white hover:opacity-60 transition-opacity relative"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {hydrated && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-white text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xl overflow-y-auto"
          >
            <div className="flex items-center justify-between px-6 md:px-10 py-5">
              <button
                onClick={() => setMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-white hover:opacity-60 transition-opacity"
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
              <BrandLogo size="md" />
              <div className="w-10" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="flex flex-col items-start px-10 md:px-20 pt-10 gap-8"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl md:text-5xl font-light tracking-[0.1em] text-white hover:opacity-50 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="px-10 md:px-20 pt-16 pb-10 flex flex-col gap-3">
              {user ? (
                <>
                  <p className="text-xs tracking-[0.15em] text-[#666]">
                    SIGNED IN AS{" "}
                    <span className="text-white">
                      {user.name.toUpperCase()}
                    </span>
                  </p>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm tracking-[0.2em] text-white hover:opacity-60"
                  >
                    MY ACCOUNT
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      setMenuOpen(false);
                    }}
                    className="text-sm tracking-[0.2em] text-left text-[#888] hover:text-white transition-colors"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm tracking-[0.2em] text-white hover:opacity-60"
                  >
                    SIGN IN
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm tracking-[0.2em] text-[#888] hover:text-white transition-colors"
                  >
                    CREATE ACCOUNT
                  </Link>
                </>
              )}
              <p className="text-label text-[#444] mt-10">
                © 2026 KAYE. ALL RIGHTS RESERVED.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
