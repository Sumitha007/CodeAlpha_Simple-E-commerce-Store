import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Truck, Shield } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Landing = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in">
            <span className="text-sm font-semibold text-primary uppercase tracking-widest">
              Welcome to ShopHub
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mt-3 leading-tight">
              Premium Products,{" "}
              <span className="text-primary">Unbeatable Prices</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-md">
              Discover a curated collection of top-quality electronics, accessories, footwear & more — all at amazing prices with free shipping on orders over ₹500.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-lg hover:opacity-90 transition-opacity text-base"
              >
                Login <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 border border-border text-foreground font-semibold px-8 py-3.5 rounded-lg hover:bg-accent transition-colors text-base"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <img
              src={heroBanner}
              alt="Featured products showcase"
              className="rounded-xl shadow-card-hover w-full"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: ShoppingBag, title: "Wide Selection", desc: "Browse thousands of products across multiple categories" },
          { icon: Truck, title: "Free Shipping", desc: "Free delivery on orders above ₹500 across India" },
          { icon: Shield, title: "Secure Payments", desc: "Your transactions are safe with end-to-end encryption" },
        ].map((f) => (
          <div key={f.title} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-card-hover transition-shadow">
            <f.icon className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-bold text-foreground text-lg">{f.title}</h3>
            <p className="text-muted-foreground text-sm mt-2">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Landing;
