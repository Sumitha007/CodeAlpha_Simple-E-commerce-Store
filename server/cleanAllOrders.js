const mongoose = require('mongoose');
const Order = require('./models/Order');

async function cleanAllOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB\n');

    // Delete ALL orders
    const result = await Order.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} orders from database\n`);
    
    console.log('Orders collection is now empty and ready for new orders with complete details!');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

cleanAllOrders();
