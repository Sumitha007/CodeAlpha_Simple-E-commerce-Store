import { useState, useMemo, useEffect } from "react";
import { Search, X, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/lib/products";
import { toggleWishlist, isInWishlist } from "@/lib/wishlistStore";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [, setTick] = useState(0); // force re-render on wishlist toggle
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend API
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        // Transform backend products to match frontend interface
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

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory, products]);

  const handleWishlist = (id: number) => {
    toggleWishlist(id);
    setTick((t) => t + 1);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Explore Products</h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Explore Products</h2>

      {/* Search bar */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="group bg-card rounded-lg border border-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <Link to={`/product/${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-secondary">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => handleWishlist(product.id)}
                  className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isInWishlist(product.id) ? "fill-destructive text-destructive" : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>
              <div className="p-4">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </span>
                <h3 className="font-semibold text-foreground mt-1 line-clamp-1">{product.name}</h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Dashboard;
