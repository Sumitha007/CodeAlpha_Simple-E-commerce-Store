const mongoose = require('mongoose');
const Order = require('./models/Order');

async function manageOldOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB\n');

    // Find all orders
    const allOrders = await Order.find().sort({ date: -1 });
    console.log(`Total orders in database: ${allOrders.length}\n`);

    // Separate old and new orders
    const oldOrders = allOrders.filter(order => !order.userInfo);
    const newOrders = allOrders.filter(order => order.userInfo);

    console.log('=== OLD ORDERS (without userInfo) ===');
    console.log(`Count: ${oldOrders.length}`);
    oldOrders.forEach(order => {
      console.log(`- ID: ${order._id}, Total: ${order.total}, Date: ${order.date}`);
    });

    console.log('\n=== NEW ORDERS (with userInfo) ===');
    console.log(`Count: ${newOrders.length}`);
    newOrders.forEach(order => {
      console.log(`- ID: ${order._id}`);
      console.log(`  User: ${order.userInfo.name} (${order.userInfo.email})`);
      console.log(`  Products: ${order.products.map(p => `${p.name} x${p.quantity}`).join(', ')}`);
      console.log(`  Total: $${order.total}`);
      console.log(`  Date: ${order.date}\n`);
    });

    console.log('\n=== OPTIONS ===');
    console.log('To delete all old orders, run:');
    console.log('  node deleteOldOrders.js\n');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

manageOldOrders();
