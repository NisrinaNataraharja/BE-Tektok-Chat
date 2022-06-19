const express = require('express')
const router = express.Router()
const productController = require('../controller/products')
const { protect, isSeller } = require('../middlewares/auth')
const middUpload = require('../middlewares/upload')


router
  .get('/', productController.selectProductsWithCondition)
  .post('/', protect, isSeller, middUpload("image"), productController.insertProducts)
  .put('/:id', protect, isSeller, middUpload("image"), productController.updateProducts)
  .delete('/:id', protect, isSeller, productController.deleteProducts)

module.exports = router