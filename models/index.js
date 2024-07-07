const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_ADDRESS,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql',
    timezone: '+09:00'
});

module.exports = sequelize;