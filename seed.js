const mongoose = require('mongoose');
const Product = require('./src/models/Productos.model')
const { fakerES_MX: faker } = require('@faker-js/faker');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB is connected');
    seedData();
  })
  .catch(err => console.error(err));
  const serverImg='http://192.168.68.102:8080'
  const images=[
    '/apple.jpeg',
    '/capsu.png',
    '/pera.jpeg',
    '/platano.jpg',
    '/soap.jpeg'
  ]
const seedData = async () => {
  const products = [];

  for (let i = 0; i < 100; i++) {
    products.push({
      nombre: faker.commerce.productName(),
      codigo: i,
      description: faker.commerce.productDescription(),
      precioStandar: faker.commerce.price(10, 1000, 0), 
      precioMayoreo: faker.commerce.price(10, 1000, 0),
      precioVip: faker.commerce.price(10, 1000, 0),
      imagen: serverImg + images[i%5],
    });
  }
  try {
    await Product.deleteMany({}); 
    await Product.insertMany(products); 
    console.log('Seed data added successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};