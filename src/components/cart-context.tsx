"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
  ) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "noir_cart_v1";

function keyOf(productId: string, size?: string) {
  return `${productId}__${size ?? ""}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate from localStorage once on mount. We intentionally call
  // setState here because localStorage is unavailable on the server, so we
  // can't lazily initialize useState with it without breaking SSR.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore quota errors
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) => keyOf(p.productId, p.size) === keyOf(item.productId, item.size),
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          quantity: next[idx].quantity + item.quantity,
        };
        return next;
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: string, size?: string) => {
    setItems((prev) =>
      prev.filter((p) => keyOf(p.productId, p.size) !== keyOf(productId, size)),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string) => {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter(
            (p) => keyOf(p.productId, p.size) !== keyOf(productId, size),
          );
        }
        return prev.map((p) =>
          keyOf(p.productId, p.size) === keyOf(productId, size)
            ? { ...p, quantity }
            : p,
        );
      });
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    let c = 0;
    let s = 0;
    for (const it of items) {
      c += it.quantity;
      s += it.quantity * it.price;
    }
    return { count: c, subtotal: s };
  }, [items]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    hydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
