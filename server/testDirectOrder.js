const mongoose = require('mongoose');
const Product = require('./models/Product');

// Define schema inline to avoid cache issues
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

async function testNewOrder() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB\n');

    // Delete existing model if cached
    delete mongoose.models.Order;
    delete mongoose.connection.models.Order;

    // Create fresh model
    const Order = mongoose.model('Order', orderSchema);

    // Get a product from database
    const product = await Product.findOne();

    console.log('Creating order with product:', product.name, '\n');

    // Create order directly
    const order = new Order({
      userInfo: {
        name: "Sumitha",
        email: "jsumitha07@gmail.com"
      },
      products: [{
        productId: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        description: product.description,
        quantity: 2
      }],
      total: product.price * 2
    });

    await order.save();

    console.log('✅ Order created successfully!\n');
    console.log('Order ID:', order._id);
    console.log('\n📦 ORDER DETAILS:');
    console.log('===========================================');
    console.log('👤 USER:',order.userInfo.name, '-', order.userInfo.email);
    console.log('\n📦 PRODUCTS:');
    order.products.forEach((p, i) => {
      console.log(`\n   ${i + 1}. ${p.name}`);
      console.log(`      Category: ${p.category}`);
      console.log(`      Price: $${p.price}`);
      console.log(`      Quantity: ${p.quantity}`);
      console.log(`      Description: ${p.description}`);
    });
    console.log('\n💰 Total: $' + order.total);
    console.log('===========================================\n');
    console.log('✅ Check MongoDB Compass - refresh the orders collection!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
}

testNewOrder();
