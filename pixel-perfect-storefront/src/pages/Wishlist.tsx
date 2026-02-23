import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { getWishlist, removeFromWishlist } from "@/lib/wishlistStore";
import { addToCart } from "@/lib/cartStore";
import type { Product } from "@/lib/products";

const Wishlist = () => {
  const [ids, setIds] = useState<(number | string)[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = () => setIds(getWishlist());

  useEffect(() => {
    refresh();
    window.addEventListener("wishlist-updated", refresh);
    return () => window.removeEventListener("wishlist-updated", refresh);
  }, []);

  // Fetch all products from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        const transformedProducts = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          description: p.description,
          image: p.image,
          category: p.category,
          stock: p.stock
        }));
        setProducts(transformedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const wishlistProducts = products.filter((p) => ids.includes(p.id));

  const handleMoveToCart = (p: Product) => {
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.image });
    removeFromWishlist(p.id);
    refresh();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
        <p className="text-muted-foreground mb-6">Save products you love!</p>
        <Link to="/dashboard" className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-card">
            <Link to={`/product/${p.id}`}>
              <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" loading="lazy" />
            </Link>
            <div className="p-4">
              <h3 className="font-semibold text-foreground line-clamp-1">{p.name}</h3>
              <p className="text-primary font-bold mt-1">₹{p.price.toLocaleString("en-IN")}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleMoveToCart(p)}
                  className="flex-1 inline-flex items-center justify-center gap-1 text-sm font-medium bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart className="w-4 h-4" /> Move to Cart
                </button>
                <button
                  onClick={() => { removeFromWishlist(p.id); refresh(); }}
                  className="px-3 py-2 border border-border rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
