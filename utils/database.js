const Sequelize = require('sequelize');

const sequelize = new Sequelize('library', 'root', 'hsrokz786',{
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;