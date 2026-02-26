const {Sequelize, DataTypes} = require("sequelize")
const connection = require("./index")
const Product = require("./product")
const User = require("./user")

    const WishList = connection.define(("wishList"),{
       productId : {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: "id"
        }

       },
       userId:{
        type: DataTypes.INTEGER,
        references:{
            model: User,
            key: "id"
        }
       }
    })
    
module.exports = WishList;