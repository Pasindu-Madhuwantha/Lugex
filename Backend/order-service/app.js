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
  app.listen(3001, () => {
    console.log('Order Service running at http://localhost:3001');
  });
});
