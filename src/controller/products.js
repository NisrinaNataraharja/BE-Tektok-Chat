/* eslint-disable no-undef */
const createError = require('http-errors')
const productsModel = require('../models/products')
const commonHelper = require('../helper/common')
const { v4: uuidv4 } = require('uuid');
const errorServ = new createError.InternalServerError()

// exports.selectProducts = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1
//     const limit = parseInt(req.query.limit) || 5
//     const offset = (page - 1) * limit
//     const result = await productsModel.selectProducts({ offset, limit })

//         const { rows: [count] } = await productsModel.countProducts()
//         const totalData = parseInt(count.total)
//         const totalPage = Math.ceil(totalData / limit)
//         const pagination = {
//           currentPage: page,
//           limit,
//           totalData,
//           totalPage
//         }

//         commonHelper.response(res, result.rows, 200, 'get data success', pagination)
//   } catch (error) {
//     console.log(error)
//     next(errorServ)
//   }
// }

exports.selectRecipeWithCondition = async (req, res, next) => {
  try {
    const condition = req.query
    condition.search = condition.search || ''
    condition.page = parseInt(condition.page) || 1
    condition.limit = parseInt(condition.limit) || 5
    condition.offset = (condition.page * condition.limit) - condition.limit
    condition.sort = condition.sort || 'id'
    condition.order = condition.order || 'ASC'
    const result = await productsModel.selectRecipeWithCondition(condition)


    const { rows: [count] } = await productsModel.countRecipe()
    const totalData = parseInt(count.total)
    const totalPage = Math.ceil(totalData / condition.limit)
    const pagination = {
      currentPage: condition.page,
      limit: condition.limit,
      totalData,
      totalPage
    }

    commonHelper.response(res, result.rows, 200, 'get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}


exports.insertRecipe = async (req, res, next) => {
  try {
    console.log(req.file);
    const { id, id_user, ingredients, title, image, video, like, create_at } = req.body

    const data = {
      id: uuidv4(id), 
      id_user, 
      ingredients, 
      title, 
      image, 
      video, 
      like, 
      create_at
      // : JSON.stringify(
      //   image.map((item) => `${process.env.HOST}/image/${item.image}`)
      // )
    }
    console.log(data);
    await productsModel.insertRecipe(data)
    commonHelper.response(res, data, 201, 'insert data success')
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}


exports.updateRecipe = async(req, res, next) => {
  try {
    const id = req.params.id
  const {ingredients, title, image, video, like, create_at } = req.body
  // const image = JSON.parse(req.body.image)
  // console.log(image.length);
  const data = {
    id,
    ingredients, 
    title, 
    image, 
    video, 
    like, 
    create_at
    
    // image: image.length > 0 ? JSON.stringify(image.map((item) => `${process.env.HOST}/image/${item.image}`)) : undefined
    
  }
  await productsModel.updateRecipe(data)
  commonHelper.response(res, data, 202, 'update data success')
  } catch (error) {
    console.log(error)
      next(errorServ)
  }
  
}

exports.deleteRecipe = (req, res, next) => {
  const id = req.params.id
  productsModel.deleteRecipe(id)
    .then(() => {
      commonHelper.response(res, null, 203, 'delete data success')
    })
    .catch((error) => {
      console.log(error)
      next(new createError.InternalServerError())
    })
}


