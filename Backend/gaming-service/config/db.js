const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('lugx_games', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
