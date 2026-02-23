import { Receipt, Package } from "lucide-react";
import { getPurchases, getTotalSpent, getTotalPurchases } from "@/lib/purchaseStore";

const PurchaseHistory = () => {
  const purchases = getPurchases();
  const totalSpent = getTotalSpent();
  const totalCount = getTotalPurchases();

  if (purchases.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-fade-in">
        <Receipt className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2">No purchases yet</h2>
        <p className="text-muted-foreground">Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Purchase History</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-foreground">{totalCount}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-muted-foreground text-sm">Total Spent</p>
          <p className="text-2xl font-bold text-primary">₹{totalSpent.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {purchases.map((order) => (
          <div key={order.orderId} className="bg-card border border-border rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">{order.orderId}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(order.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover bg-secondary" />
                  <span className="flex-1 text-foreground">{item.name} × {item.quantity}</span>
                  <span className="text-muted-foreground">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 text-right">
              <span className="font-bold text-foreground">Total: ₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchaseHistory;
