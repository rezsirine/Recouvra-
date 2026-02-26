const {Sequelize,DataTypes} = require("sequelize")
const connection = require("./index")

    const Categories = connection.define(("categories"),{
        name: {
            type : DataTypes.STRING,
            allowNull: false,
        }
    })


module.exports = Categories;
