const connection = require("./index")
const {Sequelize, DataTypes} = require("sequelize")


    const User  = connection.define("user",{
        username: {
            type : DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type : DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        phone_number: {
            type : DataTypes.INTEGER,
            allowNull: true,
            unique: true,
        },
        password: {
            type : DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type : DataTypes.ENUM(['admin','client','seller']),
            allowNull: false,
        },
    })


module.exports = User;