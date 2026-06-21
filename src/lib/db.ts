import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order, User } from "./types";

// File-backed JSON store. Good enough for a demo / dev environment.
// In production you'd swap this for Postgres, Mongo, etc.
const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

async function ensureFile(file: string, initial: string) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(file);
  } catch {
    await fs.writeFile(file, initial, "utf8");
  }
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    await ensureFile(file, JSON.stringify(fallback, null, 2));
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

// ————————— Users —————————

export async function getAllUsers(): Promise<User[]> {
  return readJson<User[]>(USERS_FILE, []);
}

export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  const users = await getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id: string): Promise<User | undefined> {
  const users = await getAllUsers();
  return users.find((u) => u.id === id);
}

export async function createUser(user: User): Promise<User> {
  const users = await getAllUsers();
  users.push(user);
  await writeJson(USERS_FILE, users);
  return user;
}

// ————————— Orders —————————

export async function getAllOrders(): Promise<Order[]> {
  return readJson<Order[]>(ORDERS_FILE, []);
}

export async function createOrder(order: Order): Promise<Order> {
  const orders = await getAllOrders();
  orders.push(order);
  await writeJson(ORDERS_FILE, orders);
  return order;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getAllOrders();
  return orders.find((o) => o.id === id);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const orders = await getAllOrders();
  return orders
    .filter((o) => o.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
