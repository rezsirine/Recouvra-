const  express = require('express')
const { getAll, getOne, addCategory, updateCategory, deleteCategory }  = require('../controller/categories.controller')
const router = express.Router()

router.get('/getAll', getAll)
router.post('/add', addCategory)
router.get('/:categoryId', getOne)
router.put('/:categoryId', updateCategory)
router.delete('/:categoryId', deleteCategory)

module.exports =  router