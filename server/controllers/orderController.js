const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, userInfo, items, total } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    if (!userInfo || !userInfo.name || !userInfo.email) {
      return res.status(400).json({ error: 'User information is required' });
    }

    // Fetch complete product details from database
    const enrichedProducts = await Promise.all(
      items.map(async (item) => {
        // Find product in database by _id
        const product = await Product.findById(item.id);
        
        if (!product) {
          console.warn(`Product not found for id: ${item.id}`);
          // Fallback to item data if product not in DB
          return {
            productId: item.id,
            name: item.name || 'Unknown Product',
            category: item.category || 'General',
            price: item.price || 0,
            image: item.image || '',
            description: item.description || 'No description',
            quantity: item.quantity
          };
        }

        // Use complete product details from database
        return {
          productId: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          description: product.description,
          quantity: item.quantity
        };
      })
    );

    const newOrder = new Order({
      user: userId || null,
      userInfo: {
        name: userInfo.name,
        email: userInfo.email
      },
      products: enrichedProducts,
      total: total
    });
    
    await newOrder.save();
    res.status(201).json({ 
      message: 'Order placed successfully',
      orderId: newOrder._id,
      order: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
};

// Get all orders (for admin or testing)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
