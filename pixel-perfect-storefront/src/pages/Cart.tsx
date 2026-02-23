import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { getCart, updateQuantity, removeFromCart, getCartTotal, saveCart, type CartItem } from "@/lib/cartStore";
import { addPurchase } from "@/lib/purchaseStore";
import { getUser } from "@/lib/authStore";

const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const refresh = () => setItems(getCart());

  useEffect(() => {
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  const handleCheckout = async () => {
    const user = getUser();
    
    if (!user) {
      alert('Please login to place an order');
      return;
    }

    const total = getCartTotal();
    const finalTotal = total >= 500 ? total : total + 49;
    
    try {
      // Send order to backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: null, // Will implement user authentication later
          userInfo: {
            name: user.name,
            email: user.email
          },
          items: items,
          total: finalTotal
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Also save to localStorage for purchase history
        addPurchase(items, finalTotal);
        saveCart([]);
        refresh();
        alert(`Order placed successfully! Order ID: ${data.orderId}`);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to connect to server. Please check if backend is running.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started!</p>
        <Link to="/dashboard" className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-card border border-border rounded-lg p-4 items-center">
              <Link to={`/product/${item.id}`}>
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover bg-secondary" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-primary font-bold mt-1">₹{item.price.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => { updateQuantity(item.id, item.quantity - 1); refresh(); }} className="px-2 py-1 hover:bg-secondary transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 py-1 text-sm font-medium text-foreground">{item.quantity}</span>
                <button onClick={() => { updateQuantity(item.id, item.quantity + 1); refresh(); }} className="px-2 py-1 hover:bg-secondary transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="font-bold text-foreground w-24 text-right">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              <button onClick={() => { removeFromCart(item.id); refresh(); }} className="text-destructive hover:text-destructive/80 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
          <h3 className="font-bold text-lg text-foreground mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{total >= 500 ? "Free" : "₹49"}</span>
            </div>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold text-foreground text-lg">
            <span>Total</span>
            <span>₹{(total >= 500 ? total : total + 49).toLocaleString("en-IN")}</span>
          </div>
          <button onClick={handleCheckout} className="w-full mt-6 bg-primary text-primary-foreground font-semibold py-3.5 rounded-lg hover:opacity-90 transition-opacity">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
