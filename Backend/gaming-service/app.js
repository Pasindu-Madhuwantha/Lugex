const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const gameRoutes = require('./routes/gameRoutes');
const Game = require('./models/game');

const app = express();
app.use(bodyParser.json());
app.use('/games', gameRoutes);

sequelize.sync().then(() => {
  console.log('Database connected and synced.');
  app.listen(3000, '0.0.0.0', () => {
    console.log('Game Service running on http://0.0.0.0:3000');
  });  
});
