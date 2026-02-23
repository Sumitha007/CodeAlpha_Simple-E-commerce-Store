const http = require('http');

// Test data with user information and product details
const testOrder = {
  userInfo: {
    name: "John Doe",
    email: "john@example.com"
  },
  items: [
    {
      id: 1,
      name: "Test Product",
      price: 299,
      quantity: 2,
      image: "https://example.com/image.jpg"
    }
  ],
  total: 598
};

async function testCreateOrder() {
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

  console.log('Testing new order creation with user info...');
  console.log('Order data:', JSON.stringify(testOrder, null, 2));
  
  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (res.statusCode === 201) {
          console.log('\n✅ Order created successfully!');
          console.log('Order ID:', response.orderId);
          console.log('\nFull order details:');
          console.log(JSON.stringify(response.order, null, 2));
          console.log('\n✅ Check MongoDB Compass - the order should now have:');
          console.log('   - userInfo.name:', response.order.userInfo.name);
          console.log('   - userInfo.email:', response.order.userInfo.email);
          console.log('   - products with name, price, quantity, id');
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
}

testCreateOrder();
