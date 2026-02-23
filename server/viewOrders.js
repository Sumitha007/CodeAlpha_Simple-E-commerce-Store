require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Order = require('./models/Order');

// Connect to MongoDB and display all orders
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected\n');
    console.log('═'.repeat(80));
    console.log('                         ALL ORDERS IN DATABASE');
    console.log('═'.repeat(80));
    
    const orders = await Order.find().sort({ date: -1 });
    
    if (orders.length === 0) {
      console.log('\n❌ No orders found in database.\n');
    } else {
      console.log(`\n✅ Total Orders: ${orders.length}\n`);
      
      orders.forEach((order, index) => {
        console.log(`\n📦 Order #${index + 1}`);
        console.log('─'.repeat(80));
        console.log(`Order ID       : ${order._id}`);
        console.log(`Date           : ${new Date(order.date).toLocaleString('en-IN')}`);
        console.log(`Total Amount   : ₹${order.total.toLocaleString('en-IN')}`);
        console.log(`Items Count    : ${order.products.length}`);
        console.log('\nProducts:');
        
        order.products.forEach((product, idx) => {
          console.log(`  ${idx + 1}. ${product.name}`);
          console.log(`     Price: ₹${product.price} × ${product.quantity} = ₹${(product.price * product.quantity).toLocaleString('en-IN')}`);
        });
        
        console.log('─'.repeat(80));
      });
      
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      console.log(`\n💰 Total Revenue: ₹${totalRevenue.toLocaleString('en-IN')}\n`);
    }
    
    console.log('═'.repeat(80));
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  })
  .catch(err => {
    console.error('Error:', err);
  });
