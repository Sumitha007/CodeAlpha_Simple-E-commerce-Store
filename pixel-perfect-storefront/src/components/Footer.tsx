import { Store, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-card border-t border-border mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg text-foreground mb-4">
            <Store className="w-5 h-5 text-primary" />
            ShopHub
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your one-stop shop for quality products at great prices. We deliver excellence with every order.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/dashboard" className="hover:text-primary transition-colors">Products</Link>
            <Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link>
            <Link to="/purchases" className="hover:text-primary transition-colors">Orders</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-4">Contact Us</h3>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@shophub.com</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Mumbai, India</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
        © 2026 ShopHub. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
