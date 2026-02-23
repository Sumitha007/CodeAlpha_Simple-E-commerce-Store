const mongoose = require('mongoose');

async function dropOrdersCollection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB\n');

    // Drop the entire orders collection
    try {
      await mongoose.connection.db.dropCollection('orders');
      console.log('✅ Dropped orders collection');
    } catch (err) {
      if (err.message === 'ns not found') {
        console.log('Orders collection doesn\'t exist');
      } else {
        throw err;
      }
    }
    
    console.log('✅ Collection dropped - new schema will be used on next insert\n');
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

dropOrdersCollection();
