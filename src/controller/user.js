/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { findByEmail, create } = require('../models/user')
const {response, hashPassword} = require('../helper/common')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const authHelper = require('../helper/auth')
const { sendEmail } = require('../helper/mail')
const errorServ = new createError.InternalServerError()


exports.register = async (req, res, next) =>{
  try {
    const {id, name, email, phone, avatar, password, active} = req.body
    const {rowCount} = await findByEmail(email)
    if (rowCount) {
      return next(createError(403, 'user already registered'))
    }
    const data = {
      id: uuidv4(id), 
      name, 
      email, 
      phone,
      avatar,
      password: await hashPassword(password),  
      active
    }
    create(data)
    // sendEmail(email)
    response(res, data.email, 201, 'user successfullyy register')
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}

exports.login = async (req, res, next) =>{
  try {
    const {email, password} = req.body
  const {rows:[user]} = await findByEmail(email)
 if (!user) {
   return response(res, null, 401, 'wrong email or password')
 }
 const validPassword = await bcrypt.compare(password, user.password) ;
 if (!validPassword) {
   return response(res, null, 403, 'wrong email or password')
 }
 delete user.password

const payload ={
  email: user.email,
  // role: user.role
} 
 //generate token
user.token = authHelper.generateToken(payload)
user.refreshToken = authHelper.gerateRefreshToken(payload)

 response(res, user, 201, 'login success')

  } catch (error) {
    console.log(error);
    next(errorServ)
  }
} 

exports.profile = async(req, res, next)=>{
  const email = req.decoded.email
  const {rows: [user]} = await findByEmail(email)
  delete user.password
  response(res, user, 200)
}

exports.deleteUser = (req, res, next) => {
    const id = req.params.id
    userModel.deleteUser(id)
      .then(() => {
        response(res, null, 203, 'delete user success')
     
      })
      .catch((error) => {
        console.log(error)
        next(new createError.InternalServerError())
      })
  }

exports.refreshToken = (req, res, next)=>{
  const refreshToken = req.body.refreshToken
  const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY_JWT)
  const payload = {
    email: decoded.email,
    role: decoded.role
  }
  const result = {
    token: authHelper.generateToken(payload),
    refreshToken: authHelper.gerateRefreshToken(payload)
  }
  response(res, result, 200)
} 


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
    
   response(res, result.rows, 200, 'get data success', pagination)
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}

// exports.register = async (req, res, next) =>{
//   try {
//     const {idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name, city, image, isActive} = req.body
//     const {rowCount} = await findByEmail(email)
//     if (rowCount) {
//       return next(createError(403, 'user already registered'))
//     }
//     const data = {
//       idUser: uuidv4(idUser), 
//       nameStore, 
//       descriptionStore, 
//       email, 
//       password: hashPassword(password), 
//       role, 
//       phone, 
//       gender, 
//       birthday, 
//       name, 
//       city, 
//       image, 
//       isActive
//     }
//     await create(data)
//     console.log(data);
//     //sendEmail(email)
//     commonHelper.response(res, null, 201, 'user successfullyy registered')
//   } catch (error) {
//     console.log(error)
//     next(new createError.InternalServerError())
//   }
// }

// // const register = (req, res, next) =>{
// //   res.send('ini register')

// // }

// exports.insertUser = async(req, res, next) => {
//   const { nameStore, descriptionStore, email, password, role, phone, gender, birthday, name } = req.body

//   const data = {
//     idUser: uuidv4(), 
//     nameStore, 
//     descriptionStore, 
//     email, 
//     password: await commonHelper.hashPassword(password), 
//     role, 
//     phone, 
//     gender, 
//     birthday,
//     name
//   }
//   userModel.insertUser(data)
//     .then(() => {
//       commonHelper.response(res, data, 201, 'insert data success')
//     })
//     .catch((error) => {
//       console.log(error)
//       next(errorServ)
//     })
// }

// exports.updateUser = (req, res, next) => {
//   const id = req.params.id
//   const { idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name } = req.body
//   userModel.updateUser({ id, idUser, nameStore, descriptionStore, email, password, role, phone, gender, birthday, name })
//     .then(() => {
//       res.json({
//         message: 'update data success'
//       })
//     })
//     .catch((error) => {
//       console.log(error)
//       next(errorServ)
//     })
// }

// exports.deleteUser = (req, res, next) => {
//   const id = req.params.id
//   userModel.deleteUser(id)
//     .then(() => {
//       res.json({
//         message: 'delete data success'
//       })
//     })
//     .catch((error) => {
//       console.log(error)
//       next(new createError.InternalServerError())
//     })
// }

