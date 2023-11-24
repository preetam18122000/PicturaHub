const { Sequelize } = require('sequelize');

const createDB = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './config/db.sqlite',
});

const connectDB = () => {
    createDB.sync.then(() => {
        console.log('DB connected successfully');
    })
    .catch((e) => {
        console.log('DB connection unsuccessful', e);
    })
}

module.exports = { createDB, connectDB }