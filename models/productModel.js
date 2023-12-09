const { DataTypes } = require('sequelize');
const { createDB } = require('../config/db');

//can also use models to create this
const Product = createDB.define("products",{
    id:{
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    price: DataTypes.DECIMAL,
    content: DataTypes.STRING //will contain url of the uploaded image
})
module.exports = Product;