const WISHLIST_KEY = "ecommerce_wishlist";

export function getWishlist(): (number | string)[] {
  try {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(productId: number | string): boolean {
  const list = getWishlist();
  const idx = list.indexOf(productId);
  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(productId);
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-updated"));
  return idx < 0; // true if added
}

export function isInWishlist(productId: number | string): boolean {
  return getWishlist().includes(productId);
}

export function removeFromWishlist(productId: number | string) {
  const list = getWishlist().filter((id) => id !== productId);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("wishlist-updated"));
}
