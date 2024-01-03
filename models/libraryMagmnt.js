const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Books = sequelize.define('library', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    dateIssued: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    returnDate: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    returnBook: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    fine: {
        type: Sequelize.INTEGER,
    }
});

module.exports = Books;