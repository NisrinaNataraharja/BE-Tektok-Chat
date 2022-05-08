const createError = require('http-errors')
const userModel = require('../models/user')
const commonHelper = require('../helper/common')
const { v4: uuidv4 } = require('uuid');
const errorServ = new createError.InternalServerError()

exports.selectUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const result = await userModel.selectUser({ offset, limit })

    // paginatino
    const { rows: [count] } = await userModel.countUser()
    const totalData = parseInt(count.total)
    const totalPage = Math.ceil(totalData / limit)
    const pagination = {
      currentPage: page,
      limit,
      totalData,
      totalPage
    }
    
    commonHelper.response(res, result.rows, 200, 'get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}

exports.insertUser = async(req, res, next) => {
  const { nameStore, descriptionStore, email, password, role, phone, gender, birthday, name } = req.body

  const data = {
    idUser: uuidv4(), 
    nameStore, 
    descriptionStore, 
    email, 
    password: await commonHelper.hashPassword(password), 
    role, 
    phone, 
    gender, 
    birthday,
    name
  }
  userModel.insertUser(data)
    .then(() => {
      commonHelper.response(res, data, 201, 'insert data success')
    })
    .catch((error) => {
      console.log(error)
      next(errorServ)
    })
}

exports.updateUser = (req, res, next) => {
  const id = req.params.id
  const { idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name } = req.body
  userModel.updateUser({ id, idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name })
    .then(() => {
      res.json({
        message: 'update data success'
      })
    })
    .catch((error) => {
      console.log(error)
      next(errorServ)
    })
}

exports.deleteUser = (req, res, next) => {
  const id = req.params.id
  userModel.deleteUser(id)
    .then(() => {
      res.json({
        message: 'delete data success'
      })
    })
    .catch((error) => {
      console.log(error)
      next(new createError.InternalServerError())
    })
}
