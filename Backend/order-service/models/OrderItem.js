const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('../models/Order');

const OrderItem = sequelize.define('OrderItem', {
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = OrderItem;
