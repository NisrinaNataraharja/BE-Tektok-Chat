/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const { response } = require('../helper/common')
const protect = (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next(createError(400, 'server need token'))
        }
        let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);

        // let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
        // console.log(decoded);
        req.decoded = decoded
        return next()
        } else {
            next(createError(400, 'server need token'))
        }

    } catch (error) {
        console.log(error.name);
        if (error && error.name === 'JsonWebTokenError'
        ) {
            next(createError(400, 'token invalid'))
        } else if (error && error.name === 'TokenExpiredError') {
            next(createError(400, 'token expired'))
        } else {
            next(createError(400, 'token not active'))
        }
    }
}

const isSeller = (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
        if (decoded.role === "seller") {
            next();
        } else {
            response(res, null, 400, 'seller only')
        }
    }
}

const isAdmin = (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
        if (decoded.role === "admin") {
            next();
        } else {
            response(res, null, 400, 'admin only')
        }
    }
}

module.exports = {
    protect,
    isSeller,
    isAdmin
}