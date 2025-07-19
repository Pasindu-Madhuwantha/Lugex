const express = require('express');
const axios = require('axios');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');

const router = express.Router();

// CREATE: Add a new order
router.post('/add', async (req, res) => {
  try {
    const { customerName, items } = req.body;

    let total = 0;
    const enrichedItems = [];

    for (let item of items) {
      const response = await axios.get(`http://game-service/games/${item.gameId}`);
      const game = response.data;

      if (!game || !game.price) {
        return res.status(400).json({ error: `Invalid gameId: ${item.gameId}` });
      }

      total += game.price * item.quantity;

      enrichedItems.push({
        gameId: item.gameId,
        quantity: item.quantity,
      });
    }

    const order = await Order.create({ customerName, total });

    const orderItemsWithId = enrichedItems.map(item => ({
      ...item,
      orderId: order.id
    }));

    await OrderItem.bulkCreate(orderItemsWithId);

    res.status(201).json({ message: 'Order placed successfully', orderId: order.id, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ: Get all orders with items
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.findAll({ include: 'items' });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Edit an order
router.put('/edit/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    const { customerName, items } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    let total = 0;
    const enrichedItems = [];

    for (let item of items) {
      const response = await axios.get(`http://game-service/games/${item.gameId}`);
      const game = response.data;

      if (!game || !game.price) {
        return res.status(400).json({ error: `Invalid gameId: ${item.gameId}` });
      }

      total += game.price * item.quantity;

      enrichedItems.push({
        gameId: item.gameId,
        quantity: item.quantity,
        orderId
      });
    }

    // Update order
    order.customerName = customerName;
    order.total = total;
    await order.save();

    // Replace items
    await OrderItem.destroy({ where: { orderId } });
    await OrderItem.bulkCreate(enrichedItems);

    res.json({ message: 'Order updated successfully', total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete an order
router.delete('/delete/:id', async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    await OrderItem.destroy({ where: { orderId } });
    await order.destroy();

    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
