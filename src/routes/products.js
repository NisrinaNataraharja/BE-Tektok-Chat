const express = require('express')
const router = express.Router()
const productController = require('../controller/products')
const { protect } = require('../middlewares/auth')
const middUpload = require('../middlewares/upload')


router
  .get('/', productController.selectProductsRecipeWithCondition)
  .post('/', protect, middUpload("image"), productController.insertRecipe)
  .put('/:id', protect, middUpload("image"), productController.updateRecipe)
  .delete('/:id', protect, productController.deleteRecipe)

module.exports = router