const mongoose = require('mongoose');
const Order = require('./models/Order');

async function deleteOldOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB\n');

    // Find orders without userInfo (old format)
    const oldOrders = await Order.find({ userInfo: { $exists: false } });
    
    console.log(`Found ${oldOrders.length} old orders without user information\n`);
    
    if (oldOrders.length > 0) {
      console.log('Deleting old orders...');
      const result = await Order.deleteMany({ userInfo: { $exists: false } });
      console.log(`✅ Deleted ${result.deletedCount} old orders\n`);
      
      // Show remaining orders
      const remainingOrders = await Order.find().sort({ date: -1 });
      console.log(`Remaining orders: ${remainingOrders.length}`);
      remainingOrders.forEach(order => {
        console.log(`\n- Order ID: ${order._id}`);
        console.log(`  User: ${order.userInfo.name} (${order.userInfo.email})`);
        console.log(`  Products:`);
        order.products.forEach(p => {
          console.log(`    • ${p.name} - $${p.price} x ${p.quantity}`);
        });
        console.log(`  Total: $${order.total}`);
      });
    } else {
      console.log('No old orders found. All orders have user information! ✅');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

deleteOldOrders();
