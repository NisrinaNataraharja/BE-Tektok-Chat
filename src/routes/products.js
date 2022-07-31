const express = require('express')
const router = express.Router()
const productController = require('../controller/products')
const { protect } = require('../middlewares/auth')
const middUpload = require('../middlewares/upload')


router
  // .get('/', productController.selectRecipeWithCondition)
  // .post('/', protect, middUpload, productController.insertRecipe)
  // .put('/:id', protect, productController.updateRecipe)
  // .delete('/:id', protect, productController.deleteRecipe)
  .get('/', productController.selectRecipeWithCondition)
  .get('/:id', protect, productController.getRecipeId)
  .get('/static/:id', productController.getRecipeId)
  .post('/', protect,  middUpload, productController.insertRecipe)
  .put('/:id', protect,  middUpload,  productController.updateRecipe)
  .delete('/:id', protect,  productController.deleteRecipe)

module.exports = router

// middUpload("image")