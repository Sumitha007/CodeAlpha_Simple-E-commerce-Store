const http = require('http');
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function testOrderWithRealProduct() {
  try {
    // Connect to MongoDB to fetch a real product
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB\n');

    // Get a real product from database
    const product = await Product.findOne();
    
    if (!product) {
      console.error('❌ No products found in database. Please seed products first.');
      await mongoose.connection.close();
      return;
    }

    console.log('Using product from database:');
    console.log(`  Name: ${product.name}`);
    console.log(`  Category: ${product.category}`);
    console.log(`  Price: $${product.price}`);
    console.log(`  Description: ${product.description}\n`);

    await mongoose.connection.close();

    // Create order with this product
    const testOrder = {
      userInfo: {
        name: "Sumitha",
        email: "jsumitha07@gmail.com"
      },
      items: [
        {
          id: product._id.toString(),
          quantity: 2
        }
      ],
      total: product.price * 2
    };

    const postData = JSON.stringify(testOrder);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/orders',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    console.log('Creating order...\n');
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 201) {
            console.log('✅ Order created successfully!\n');
            console.log('Order ID:', response.orderId);
            console.log('\n📦 ORDER DETAILS:');
            console.log('=====================================');
            console.log('👤 USER INFORMATION:');
            console.log(`   Name: ${response.order.userInfo.name}`);
            console.log(`   Email: ${response.order.userInfo.email}`);
            console.log('\n📦 PRODUCTS:');
            response.order.products.forEach((p, index) => {
              console.log(`\n   Product ${index + 1}:`);
              console.log(`   - Name: ${p.name}`);
              console.log(`   - Category: ${p.category}`);
              console.log(`   - Price: $${p.price}`);
              console.log(`   - Quantity: ${p.quantity}`);
              console.log(`   - Description: ${p.description}`);
              console.log(`   - Image: ${p.image}`);
              console.log(`   - Subtotal: $${p.price * p.quantity}`);
            });
            console.log('\n💰 TOTAL: $' + response.order.total);
            console.log('📅 DATE:', new Date(response.order.date).toLocaleString());
            console.log('=====================================\n');
            console.log('✅ Check MongoDB Compass - orders collection now has complete details like products collection!');
          } else {
            console.error('❌ Error creating order:', response);
          }
        } catch (error) {
          console.error('❌ Error parsing response:', error.message);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Connection error:', error.message);
      console.log('\nMake sure the server is running on http://localhost:5000');
    });
    
    req.write(postData);
    req.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

testOrderWithRealProduct();
