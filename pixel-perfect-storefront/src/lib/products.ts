export interface Product {
  id: number | string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock?: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 5999,
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions. Experience crystal-clear sound with deep bass.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
  },
  {
    id: 2,
    name: "Smart Watch Pro",
    price: 14999,
    description: "Advanced smartwatch with health monitoring, GPS tracking, and a stunning AMOLED display. Water-resistant up to 50 meters with 7-day battery life.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
  },
  {
    id: 3,
    name: "Minimalist Backpack",
    price: 3499,
    description: "Sleek and functional backpack with padded laptop compartment, water-resistant fabric, and ergonomic design. Perfect for daily commute or travel.",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 8999,
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper. Engineered for comfort during long-distance runs.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "Footwear",
  },
  {
    id: 5,
    name: "Portable Speaker",
    price: 4499,
    description: "Compact Bluetooth speaker with 360° sound, waterproof design, and 12-hour playback. Take your music anywhere with rich, full-range audio.",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "Electronics",
  },
  {
    id: 6,
    name: "Leather Wallet",
    price: 2499,
    description: "Handcrafted genuine leather wallet with RFID blocking technology. Slim design with multiple card slots and a bill compartment.",
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: 7,
    name: "Sunglasses Classic",
    price: 6999,
    description: "Timeless aviator sunglasses with polarized lenses and UV400 protection. Lightweight titanium frame for all-day comfort.",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    category: "Accessories",
  },
  {
    id: 8,
    name: "Coffee Maker Deluxe",
    price: 11999,
    description: "Professional-grade coffee maker with programmable brewing, built-in grinder, and thermal carafe. Brew barista-quality coffee at home.",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=400&fit=crop",
    category: "Home",
  },
];
