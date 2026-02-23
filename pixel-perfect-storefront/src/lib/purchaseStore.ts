import type { CartItem } from "./cartStore";

const PURCHASE_KEY = "ecommerce_purchases";

export interface Purchase {
  orderId: string;
  date: string;
  items: CartItem[];
  total: number;
}

export function getPurchases(): Purchase[] {
  try {
    const data = localStorage.getItem(PURCHASE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addPurchase(items: CartItem[], total: number) {
  const purchases = getPurchases();
  const orderId = "ORD-" + Date.now().toString(36).toUpperCase();
  purchases.unshift({
    orderId,
    date: new Date().toISOString(),
    items,
    total,
  });
  localStorage.setItem(PURCHASE_KEY, JSON.stringify(purchases));
  return orderId;
}

export function getTotalSpent(): number {
  return getPurchases().reduce((sum, p) => sum + p.total, 0);
}

export function getTotalPurchases(): number {
  return getPurchases().length;
}
