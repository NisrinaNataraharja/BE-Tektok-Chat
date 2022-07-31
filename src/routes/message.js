const express = require('express')
const router = express.Router()
const {getMessage} = require('../controller/message')
const { protect } = require('../middlewares/auth.js')

router

  .get('/:receiver_id', protect, getMessage)


module.exports = router