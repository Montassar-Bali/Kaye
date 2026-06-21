export type Category =
  | "women"
  | "men"
  | "accessories"
  | "new-in"
  | "underwears"
  | "editorial";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: "USD" | "TND";
  image: string;
  gallery?: string[];
  categories: Category[];
  sizes?: string[];
  colors?: string[];
  description: string;
  details?: string[];
  featured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  // Stored hashed — never returned to client
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export type PublicUser = Omit<User, "passwordHash" | "passwordSalt">;

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  address: Address;
  // Last 4 digits only — we never persist full card data
  paymentLast4: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}
