const mongoose = require('mongoose');
const Order = require('./models/Order');

async function cleanupInvalidOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB\n');

    // Find orders with undefined user info
    const invalidOrders = await Order.find({
      $or: [
        { 'userInfo.email': { $in: [null, undefined, 'undefined'] } },
        { 'userInfo.name': { $in: [null, undefined, 'undefined'] } }
      ]
    });
    
    console.log(`Found ${invalidOrders.length} orders with invalid user information:\n`);
    
    invalidOrders.forEach(order => {
      console.log(`- ID: ${order._id}`);
      console.log(`  User: ${order.userInfo?.name || 'undefined'} (${order.userInfo?.email || 'undefined'})`);
      console.log(`  Products: ${order.products.map(p => `${p.name} x${p.quantity}`).join(', ')}`);
      console.log(`  Total: $${order.total}\n`);
    });
    
    if (invalidOrders.length > 0) {
      console.log('Deleting invalid orders...');
      const result = await Order.deleteMany({
        $or: [
          { 'userInfo.email': { $in: [null, undefined, 'undefined'] } },
          { 'userInfo.name': { $in: [null, undefined, 'undefined'] } }
        ]
      });
      console.log(`✅ Deleted ${result.deletedCount} invalid orders\n`);
    }
    
    // Show remaining valid orders
    const validOrders = await Order.find().sort({ date: -1 });
    console.log(`\n=== REMAINING VALID ORDERS: ${validOrders.length} ===\n`);
    
    validOrders.forEach((order, index) => {
      console.log(`${index + 1}. Order ID: ${order._id}`);
      console.log(`   👤 User: ${order.userInfo.name} (${order.userInfo.email})`);
      console.log(`   📦 Products:`);
      order.products.forEach(p => {
        console.log(`      • ${p.name} - $${p.price} x ${p.quantity} = $${p.price * p.quantity}`);
      });
      console.log(`   💰 Total: $${order.total}`);
      console.log(`   📅 Date: ${new Date(order.date).toLocaleString()}\n`);
    });
    
    await mongoose.connection.close();
    console.log('✅ Cleanup complete! Refresh MongoDB Compass to see the changes.');
  } catch (error) {
    console.error('Error:', error);
  }
}

cleanupInvalidOrders();
