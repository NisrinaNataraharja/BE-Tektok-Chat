const express = require('express')
const router = express.Router()
const productsRouter = require('./products')
const userRouter = require('./user')
const messageRoute = require('./message')



 router
    .use('/recipe', productsRouter)
    .use('/message', messageRoute)
    .use('/user', userRouter)


module.exports = router