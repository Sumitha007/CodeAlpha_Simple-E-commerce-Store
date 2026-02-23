require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Sample product data with real images
const sampleProducts = [
  // Electronics
  {
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life',
    stock: 50
  },
  {
    name: 'Smart Watch Pro',
    category: 'Electronics',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
    description: 'Advanced fitness tracker with GPS, heart rate monitor, and sleep tracking',
    stock: 30
  },
  {
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800',
    description: 'Portable waterproof speaker with 360-degree sound and 12-hour playtime',
    stock: 65
  },
  {
    name: 'Wireless Keyboard',
    category: 'Electronics',
    price: 3299,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
    description: 'Mechanical wireless keyboard with RGB backlight and ergonomic design',
    stock: 45
  },
  {
    name: 'USB-C Hub',
    category: 'Electronics',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery',
    stock: 80
  },
  {
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
    description: 'Ergonomic wireless mouse with adjustable DPI and silent clicks',
    stock: 90
  },

  // Footwear
  {
    name: 'Running Shoes',
    category: 'Footwear',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh',
    stock: 75
  },
  {
    name: 'Casual Sneakers',
    category: 'Footwear',
    price: 6499,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
    description: 'Versatile sneakers perfect for everyday wear with premium leather finish',
    stock: 60
  },
  {
    name: 'High-Top Sneakers',
    category: 'Footwear',
    price: 7999,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800',
    description: 'Classic high-top sneakers with canvas upper and rubber sole',
    stock: 55
  },

  // Accessories
  {
    name: 'Minimalist Backpack',
    category: 'Accessories',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
    description: 'Water-resistant minimalist backpack with laptop compartment up to 15.6 inches',
    stock: 70
  },
  {
    name: 'Leather Wallet',
    category: 'Accessories',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
    description: 'Genuine leather wallet with RFID blocking and multiple card slots',
    stock: 100
  },
  {
    name: 'Sunglasses',
    category: 'Accessories',
    price: 3999,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
    description: 'Polarized sunglasses with UV400 protection and durable frame',
    stock: 85
  },
  {
    name: 'Travel Duffel Bag',
    category: 'Accessories',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800',
    description: 'Spacious duffel bag with multiple compartments and adjustable strap',
    stock: 40
  },
  {
    name: 'Phone Case',
    category: 'Accessories',
    price: 899,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
    description: 'Shockproof phone case with military-grade drop protection',
    stock: 150
  },

  // Home & Living
  {
    name: 'Coffee Maker',
    category: 'Home',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
    description: 'Programmable coffee maker with thermal carafe and auto-brew feature',
    stock: 35
  },
  {
    name: 'LED Desk Lamp',
    category: 'Home',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
    description: 'Adjustable LED desk lamp with touch control and USB charging port',
    stock: 60
  },
  {
    name: 'Wall Clock',
    category: 'Home',
    price: 1999,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800',
    description: 'Modern minimalist wall clock with silent quartz movement',
    stock: 45
  },
  {
    name: 'Throw Pillow Set',
    category: 'Home',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800',
    description: 'Set of 2 decorative throw pillows with premium fabric covers',
    stock: 80
  },

  // Fitness & Sports
  {
    name: 'Yoga Mat Premium',
    category: 'Fitness',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800',
    description: 'Extra thick non-slip yoga mat with carrying strap and alignment marks',
    stock: 70
  },
  {
    name: 'Resistance Bands Set',
    category: 'Fitness',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=800',
    description: 'Set of 5 resistance bands with different resistance levels and door anchor',
    stock: 95
  },
  {
    name: 'Water Bottle',
    category: 'Fitness',
    price: 899,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    description: 'Insulated stainless steel water bottle keeps drinks cold for 24 hours',
    stock: 120
  },
  {
    name: 'Gym Bag',
    category: 'Fitness',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
    description: 'Spacious gym bag with shoe compartment and water bottle holder',
    stock: 55
  },

  // Fashion
  {
    name: 'Cotton T-Shirt',
    category: 'Fashion',
    price: 999,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    description: '100% organic cotton t-shirt with classic fit and soft finish',
    stock: 150
  },
  {
    name: 'Denim Jacket',
    category: 'Fashion',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    description: 'Classic denim jacket with button closure and multiple pockets',
    stock: 40
  }
];

// Connect to MongoDB and insert sample products
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products added successfully');
    
    // Display the products
    const products = await Product.find();
    console.log(`Total products in database: ${products.length}`);
    
    mongoose.connection.close();
    console.log('Database connection closed');
  })
  .catch(err => {
    console.error('Error:', err);
  });
