const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('lugx_games', 'postgres', 'postgres', {
  host: 'postgres',
  dialect: 'postgres',
});

module.exports = sequelize;
