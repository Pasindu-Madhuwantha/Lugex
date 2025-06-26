const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// Get all games
router.get('/all', async (req, res) => {
  const games = await Game.findAll();
  res.json(games);
});

// Add a game
router.post('/add', async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit Game
router.put('/edit', async (req, res) => {
  try {
    const { id, name, category, releaseDate, price } = req.body;

    // Find the game by ID
    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Update the fields
    game.name = name;
    game.category = category;
    game.releaseDate = releaseDate;
    game.price = price;

    await game.save();

    res.status(200).json({ message: 'Game updated successfully', game });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Game
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findByPk(id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    await game.destroy();
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
