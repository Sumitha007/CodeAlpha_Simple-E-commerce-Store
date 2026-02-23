import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Check, Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { addToCart } from "@/lib/cartStore";
import { toggleWishlist, isInWishlist } from "@/lib/wishlistStore";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    // Fetch product from backend API
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct({
          id: data._id,
          name: data.name,
          price: data.price,
          description: data.description,
          image: data.image,
          category: data.category,
          stock: data.stock
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Product not found</h2>
        <Link to="/dashboard" className="text-primary font-medium hover:underline">← Back to shop</Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const totalAmount = product.price * qty;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to products
      </Link>
      <div className="grid md:grid-cols-2 gap-10 animate-fade-in">
        <div className="bg-secondary rounded-xl overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {product.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2">{product.name}</h1>
          <p className="text-2xl font-bold text-primary mt-4">₹{product.price.toLocaleString("en-IN")}</p>
          <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-4 mt-8">
            <span className="text-sm font-medium text-foreground">Quantity</span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-secondary transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-medium text-foreground min-w-[3rem] text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-secondary transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 bg-card border border-border rounded-lg px-4 py-3">
            <span className="text-sm text-muted-foreground">Total Amount:</span>
            <span className="text-xl font-bold text-primary ml-2">₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAdd}
              className={`flex-1 inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-lg transition-all text-base ${
                added
                  ? "bg-success text-success-foreground"
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}
            >
              {added ? <><Check className="w-5 h-5" /> Added to Cart</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
            </button>
            <button
              onClick={() => { toggleWishlist(product.id); setTick((t) => t + 1); }}
              className="px-4 py-3.5 border border-border rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
