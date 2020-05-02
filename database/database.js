const Sequelize = require('sequelize');

const connection = new Sequelize('bruno_guiapress', 'bruninho51', 'bruno41495391', {
    host: 'mysql669.umbler.com',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;