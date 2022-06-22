/* eslint-disable no-undef */
const createError = require('http-errors')
const productsModel = require('../models/products')
const commonHelper = require('../helper/common')
const { v4: uuidv4 } = require('uuid');
const errorServ = new createError.InternalServerError()

// exports.selectRecipeWithCondition = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page) || 1
//     let limit = parseInt(req.query.limit) || 4
//     const offset = (page - 1) * limit

//     const sortBy = req.query.sortby || 'random ()'
//     const sortOrder = req.query.sortorder || ''
//     const search = req.query.search || ''

//     const result = await productsModel.selectRecipeWithCondition({ limit, offset, sortBy, sortOrder, search })

//     const { rows: [count] } = await productsModel.countRecipe()
//     const totalData = search === '' ? parseInt(count.total) : (result.rows).length

//     if (totalData < limit) {
//       limit = totalData
//     }

//     if ((result.rows).length === 0) {
//       notFoundRes(res, 404, 'Data not found')
//     }

//     const totalPage = Math.ceil(totalData / limit)
//     const pagination = {
//       currentPage: page,
//       dataPerPage: limit,
//       totalData,
//       totalPage
//     }

//     response(res, result.rows, 200, 'Get data success', pagination)
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
    console.log(req.files.image[0]);
    const { id_user, ingredients, title } = req.body
    // const image = JSON.parse(req.body.image)
    // const video = JSON.parse(req.body.video)
    let image
    let video
    if (req.files.image) {
      image = `${process.env.HOST_LOCAL_IMAGE}image/${req.files.image[0].filename}`
    }
    if (req.files.video) {
      video = `${process.env.HOST_LOCAL_IMAGE}video/${req.files.video[0].filename}` 
    }
    const data = {
      id: uuidv4(), 
      id_user, 
      ingredients, 
      title, 
      image,
      // : JSON.stringify(
      //   image.map((item) => `${process.env.HOST_LOCAL}/upload/image/${item.image}`)
      // ), 
      video
      // : JSON.stringify(
      //   video.map((item) => `${process.env.HOST_LOCAL}/upload/video/${item.video}`)
      // ), 
  
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


