const createError = require('http-errors')
const transactionModel = require('../models/transaction')
const commonHelper = require('../helper/common')
const errorServ = new createError.InternalServerError()

exports.selectTransaction = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const result = await transactionModel.selectTransaction({ offset, limit })

    const { rows: [count] } = await transactionModel.countTransaction()
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

exports.insertTransaction = (req, res, next) => {
  const { productId, userId, quantity, totalShopping, deliveryCost, orderStatus, paymentMethod } = req.body

  const data = {
    productId, 
    userId, 
    quantity, 
    totalShopping, 
    deliveryCost, 
    orderStatus, 
    paymentMethod
  }
  transactionModel.insertTransaction(data)
    .then(() => {
      commonHelper.response(res, data, 201, 'insert data success')
    })
    .catch((error) => {
      console.log(error)
      next(errorServ)
    })
}

exports.updateTransaction = (req, res, next) => {
  const idTransaction = req.params.idTransaction
  const { productId, userId, quantity, totalShopping, deliveryCost, orderStatus, paymentMethod } = req.body
  transactionModel.updateTransaction({ idTransaction, productId, userId, quantity, totalShopping, deliveryCost, orderStatus, paymentMethod })
    .then(() => {
        commonHelper.response(res, null, 202, 'update data success')
    })
    .catch((error) => {
      console.log(error)
      next(errorServ)
    })
}

exports.deleteTransaction = (req, res, next) => {
  const idTransaction = req.params.idTransaction
  transactionModel.deleteTransaction(idTransaction)
    .then(() => {
        commonHelper.response(res, null, 203, 'delete data success')
    })
    .catch((error) => {
      console.log(error)
      next(new createError.InternalServerError())
    })
}
