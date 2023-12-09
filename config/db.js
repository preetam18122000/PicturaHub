const { Sequelize, or } = require('sequelize');

const createDB = new Sequelize('test-db', 'user', 'pass', {
    dialect: 'sqlite',
    host: './config/db.sqlite',
});

const connectDB = () => {
    createDB.sync().then(() => {
        console.log('DB connected successfully');
    })
    .catch((e) => {
        console.log('DB connection unsuccessful', e);
    })
}

const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');

orderModel.belongsTo(userModel, {foreignKey: "buyerId"});  //buyerId in orderModel belongs to userModel (creating foreign key)
userModel.hasMany(orderModel, {foreignKey: "id"}); //Single user multiple orders
//The above line should be in their respective  models

module.exports = { createDB, connectDB }