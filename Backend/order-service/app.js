const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/orders', orderRoutes);

sequelize.sync().then(() => {
  app.listen(3001, '0.0.0.0', () => {
    console.log('Order Service running on port 3001');
  });  
});
