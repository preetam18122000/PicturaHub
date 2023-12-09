const { DataTypes } = require('sequelize');
const { createDB } = require('../config/db');

//can also use models to create this
const Order = createDB.define("orders",{
    id:{
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    productId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER
})
module.exports = Order;