const bcrypt = require('bcryptjs')

// const response = (res, result, status, message, pagination) => {
//     const resultPrint = {}
//     resultPrint.status = 'success'
//     resultPrint.statusCode = status
//     resultPrint.data = result
//     resultPrint.message = message || null
//     if (pagination)resultPrint.pagination = pagination
//     res.status(status).json(resultPrint)
//   }
  const response = (res, result, status, message, pagination) => {
    const resultPrint = {}
    resultPrint.status = 'success'
    resultPrint.message = message || null
    resultPrint.statusCode = status
    if (pagination) resultPrint.pagination = pagination
    resultPrint.data = result
    res.status(status).json(resultPrint)
  }
  
  const notFoundRes = (res, status, message) => {
    const resultPrint = {}
    resultPrint.status = 'Not Found'
    resultPrint.message = message || null
    resultPrint.statusCode = status
    if (status === 403) {
      resultPrint.status = 'Access Denied'
    }
    res.status(status).json(resultPrint)
  }
  

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, function (err, salt) {
      // console.log(salt);
      bcrypt.hash(password, salt, async function (err, hash) {
        if (!err) {
          resolve(hash)
        } else {
          reject(err)
        }
      })
    })
  })
}

  module.exports = {
    response,
    notFoundRes,
    hashPassword
  }