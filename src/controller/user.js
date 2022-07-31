/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const createError = require('http-errors')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { findByEmail, create, getUsersId, updateUserProfile } = require('../models/user')
const {response, hashPassword} = require('../helper/common')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const authHelper = require('../helper/auth')
const { sendEmail } = require('../helper/mail')
const errorServ = new createError.InternalServerError()
const cloudinary = require('../config/cloudinary')

exports.register = async (req, res, next) =>{
  try {
    const {name, email, phone, password} = req.body
    const {rowCount} = await findByEmail(email)
    if (rowCount) {
      return next(createError(403, 'user already registered'))
    }
    console.log(password);
    const data = {
      id: uuidv4(), 
      name, 
      email, 
      phone,
      password: await hashPassword(password),  
  
    }

    create(data)
    // sendEmail(email)
    response(res, data.email, 201, 'user successfullyy register')
  } catch (error) {
    console.log(error)
    next(errorServ)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const { rows: [user] } = await findByEmail(email)
    // const user = rows[0]
    if (!user) {
      return response(res, null, 403, 'email atau password anda salah')
    }
    const validPassword = bcrypt.compareSync(password, user.password)
    if (!validPassword) {
      return response(res, null, 403, 'email atau password anda salah')
    }
    delete user.password

    const payload = {
      email: user.email,
      id: user.id,
    }
    // generate token
    user.token = authHelper.generateToken(payload)
    user.refreshToken = authHelper.gerateRefreshToken(payload)
    response(res, user, 201, 'anda berhasil login')
  } catch (error) {
    console.log(error)
    next(new createError.InternalServerError())
  }
}
exports.profile = async(req, res, next)=>{
  let token = req.headers.authorization.split(' ')[1];
  let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
  const email = decoded.email
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

exports.getUsersId = async(req, res, next)=>{
  const idUser = req.decoded.id
  // console.log(req.decoded);
  const {rows} = await getUsersId(idUser)
  response(res, rows, 200)
}


exports.selectUser = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const result = await userModel.selectUser({ offset, limit })

   
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

exports.updateUserProfile = async (req, res, next) => {
  try {
    // console.log(req.files);
    let token = req.headers.authorization.split(' ')[1];
    let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    const id = decoded.id
    const { name, email, phone, username, bio } = req.body
    let image
    if (req.files.image) {
      image = req.files.image[0].path
      // image = `${process.env.HOST_LOCAL_IMAGE}image/${req.files.image[0].filename}`
      const url = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, { folder: 'tektok/image' }, function (error, result) {
          if (result) {
            resolve(result.url)
          } else if (error) {
            reject(error)
          }
        })
      })
      image = url
    }
    const data = {
      id,
      name, 
      email, 
      phone, 
      username,
      image, 
      bio
    }
    console.log(data);
    await updateUserProfile(data)
    response(res, data, 202, 'update data success')
  } catch (error) {
    console.log(error)
    next(errorServ)
  }

}


