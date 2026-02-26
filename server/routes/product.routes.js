const express = require('express')
const { getAll, addProduct, updateProduct, deleteProduct, getByStock, getByName, getByPrice,getAllProduact } = require('../controller/product.controller')
const router = express.Router()

router.get('/getAll',getAll)
router.post('/addProduct',addProduct)
router.put('/:id',updateProduct)
router.delete('/:id',deleteProduct)
router.get('/getByStock',getByStock) 
router.get('/getByName/:name',getByName)
router.get('/getByPrice/:price',getByPrice) 
router.get('/getAllProd',getAllProduact) 



module.exports = router