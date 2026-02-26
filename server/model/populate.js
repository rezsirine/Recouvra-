const connection = require("./index")

  const User = require('./user')
  const Product = require('./product')
  const Categories = require('./categories')
  const WishList = require("./wishList")
  
  Product.hasOne(Categories)  
  User.belongsToMany(Product, {through: WishList})
  Product.belongsToMany(User, {through: WishList})
  //  connection.sync({force:true})

module.exports = { User, Product, Categories , WishList }