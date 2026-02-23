import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Store, Heart, Receipt, LogOut } from "lucide-react";
import { getCartCount } from "@/lib/cartStore";
import { isLoggedIn, getUser, logoutUser } from "@/lib/authStore";

const Navbar = () => {
  const [cartCount, setCartCount] = useState(getCartCount());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateCart = () => setCartCount(getCartCount());
    const updateAuth = () => setLoggedIn(isLoggedIn());
    window.addEventListener("cart-updated", updateCart);
    window.addEventListener("auth-updated", updateAuth);
    updateCart();
    updateAuth();
    return () => {
      window.removeEventListener("cart-updated", updateCart);
      window.removeEventListener("auth-updated", updateAuth);
    };
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const user = getUser();

  const authLinks = [
    { to: "/dashboard", label: "Products", icon: Store },
    { to: "/wishlist", label: "Wishlist", icon: Heart },
    { to: "/cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { to: "/purchases", label: "Orders", icon: Receipt },
  ];

  const publicLinks = [
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md shadow-navbar border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to={loggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 text-foreground font-bold text-xl">
          <Store className="w-6 h-6 text-primary" />
          <span>ShopHub</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5">
          {loggedIn ? (
            <>
              {authLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === l.to ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <l.icon className="w-4 h-4" />
                  {l.label}
                  {l.badge ? (
                    <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                      {l.badge}
                    </span>
                  ) : null}
                </Link>
              ))}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="w-4 h-4" /> {user?.name}
                </span>
                <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            publicLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === l.to ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border animate-slide-in">
          <div className="flex flex-col px-4 py-3 gap-3">
            {loggedIn ? (
              <>
                {authLinks.map((l) => (
                  <Link key={l.to} to={l.to} className="text-sm font-medium text-foreground hover:text-primary py-2 flex items-center gap-2">
                    <l.icon className="w-4 h-4" /> {l.label}
                    {l.badge ? <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">{l.badge}</span> : null}
                  </Link>
                ))}
                <button onClick={handleLogout} className="text-sm font-medium text-destructive hover:text-destructive/80 py-2 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              publicLinks.map((l) => (
                <Link key={l.to} to={l.to} className="text-sm font-medium text-foreground hover:text-primary py-2">
                  {l.label}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
