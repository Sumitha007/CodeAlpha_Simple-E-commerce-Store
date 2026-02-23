const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(async () => {
    const products = await Product.find();
    console.log('\nTotal products in DB:', products.length);
    console.log('\nProducts:');
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - ${p.category} - ₹${p.price}`);
    });
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
