const express = require('express')
const router = express.Router()
const { register, login, profile, deleteUser, refreshToken, getUsersId, updateUserProfile } = require('../controller/user')
const userController = require('../controller/user')
const { protect } = require('../middlewares/auth.js')
const middUpload = require('../middlewares/upload')


router
  .post('/register', register)
  .post('/login', login)
  .post('/refresh-token', refreshToken)
  .get('/profile', protect, profile)
  .delete('/:id', protect, deleteUser)
  .get('/profileUser', protect ,getUsersId)
  .put('/update', middUpload, updateUserProfile)
  .get('/', userController.selectUser)
// .post('/register', userController.register)
// .post('/', userController.insertUser)
// .put('/:id', userController.updateUser)
// .delete('/:id', userController.deleteUser)

module.exports = router