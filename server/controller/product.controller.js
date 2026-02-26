const  {Product}  = require("../model/populate");
// The list products.
module.exports.getAll = async (req, res) => {
  try {
    const getall = await Product.findAll({});
    res.status(200).send(getall);
  } catch (error) {
    console.log(error);
  }
};
// As an admin, I want to be able to view and manage the products listed on the platform.
// As a seller, I want to add and manage my products for sale.
module.exports.addProduct = async (req, res) => {
  try {
    const add = await Product.create(req.body);
    res.status(200).send(add);
  } catch (error) {
    console.log(error);
  }
};
module.exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.update(req.body,{ where: { id: req.params.id } });
    res.json(updated);
  } catch (error) {
    console.log(error);
  }
};
module.exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    res.json(deleted);
  } catch (error) {
    console.log(error);
  }
};
// As a client, I want to view the list of available products.(didn't work)
module.exports.getByStock = async (req, res) => {
  try {
    const available = await Product.findAll({ where: { stock:true } });
    res.json(available);
  } catch (error) {
    console.log(error);
  }
};
// As a client, I want to search for products based on different criteria.
module.exports.getByName = async (req, res) => {
  try {
    const getbyname = await Product.findAll({
      where: { name: req.params.name },
    });
    res.json(getbyname);
  } catch (error) {
    console.log(error);
  }
};
module.exports.getByPrice = async (req, res) => {
  try {
    const getbyprice = await Product.findAll({
      where: { price:req.params.price },
    });
    res.json(getbyprice);
  } catch (error) {
    console.log(error);
  }
};
module.exports.getAllProduact = async (req,res)=>{
  try {
    const all = await Product.findAll({include:{all:true,nested:true}})
    res.status(200).send(all);
  } catch (error) {
    throw Error(error)
  }
}
// get by category


