const express = require('express')
const router = express.Router()
const productsRouter = require('./products')
const userRouter = require('./user')



 router
    .use('/recipe', productsRouter)
    .use('/user', userRouter)


module.exports = router