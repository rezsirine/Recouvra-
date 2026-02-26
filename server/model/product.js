const connection = require("./index")
const {Sequelize , DataTypes} = require("sequelize")


const Product = connection.define("product",{
    name: {
        type : DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type : DataTypes.STRING,
        allowNull: false
    },
    color: {
        type : DataTypes.STRING,
        allowNull: false,
    },
    stock: {
        type : DataTypes.BOOLEAN,
        allowNull: false,
    },
    size: {
        type : DataTypes.INTEGER,
        allowNull: false,
    },
    price: {
        type : DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type : DataTypes.INTEGER,
        allowNull: false,
        defaultValue:0
    },
    image: {
        type : DataTypes.STRING,
        allowNull: false,
    },
})

module.exports = Product;