require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Order = require('./models/Order');

// Test order data
const testOrder = {
  user: null,
  products: [
    {
      id: 1,
      name: 'Test Product',
      price: 2999,
      image: 'https://example.com/image.jpg',
      quantity: 2
    }
  ],
  total: 5998
};

// Connect and create test order
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    const newOrder = new Order(testOrder);
    await newOrder.save();
    
    console.log('✅ Test order created successfully!');
    console.log('Order ID:', newOrder._id);
    console.log('Total:', newOrder.total);
    
    // Verify it was saved
    const orders = await Order.find();
    console.log(`\nTotal orders in database: ${orders.length}`);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
  });
