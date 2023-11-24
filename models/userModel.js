const { DataTypes } = require('sequelize');
const createDB = require('../config/db');

const User = createDB.define("users",{ //can also use models to create thhis
    id:{
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isSeller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
})
module.exports = User;