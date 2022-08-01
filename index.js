/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
const helmet = require("helmet")
const cors = require('cors')
const createError = require('http-errors')
const morgan = require('morgan')
const mainRoute = require('./src/routes')
const messageModel = require('./src/models/message')
const xss = require('xss-clean')
const path = require('path')
const cookieParser = require('cookie-parser')
const {Server} = require('socket.io')
const jwt = require('jsonwebtoken')
const moment = require('moment')
moment.locale('id');


const app = express()
const PORT = process.env.PORT || 5000
const http = require('http')
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'https://tektok-chat.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
})

io.use((socket, next)=>{
  const token = socket.handshake.query.token
  jwt.verify(token, process.env.SECRET_KEY_JWT, function(error, decoded) {
      if(error){
          if(error && error.name === 'JsonWebTokenError'){
              next(createError(400, 'token invalid'))
          }else if(error && error.name === 'TokenExpiredError'){
              next(createError(400, 'token expired'))
          }else{
              next(createError(400, 'Token not active'))
          }
      }
  
      socket.userId = decoded.id
      socket.join(decoded.id)
      next()
  });
})

io.on('connection', (socket)=>{
  console.log(`ada perankat yg terhubung dengan id ${socket.id} dan id usernya ${socket.userId}`);

  socket.on('inisialRoom', ({room, username})=>{
      console.log(room);
      socket.join(`room:${room}`)
      socket.broadcast.to(`room:${room}`).emit('notifAdmin', {
          sender: 'Admin',
          message: `${username} bergabung dalam group`,
          date: new Date().getHours()+':'+ new Date().getMinutes()
      })
  })

  socket.on('sendMessage', ({idReceiver, messageBody}, callback)=>{
    const message = {
      receiver_id: idReceiver, 
      message: messageBody, 
      sender_id: socket.userId,
      created_at: new Date()
    }
    callback({...message, created_at: moment(message.created_at).format('LT')})
    messageModel.create(message)
    .then(()=>{
      socket.broadcast.to(idReceiver).emit('newMessage', message)
    })
  })

  socket.on('deleteMessage', (data) => {
    console.log(data)
    messageModel.deleteMessage(data.chat_id)

    socket.to(data.chat_id).emit('deleteMessageBE', data)
  })

  socket.on('disconnect', ()=>{
      console.log(`ada perangkat yg terputus dengan id ${socket.id}`);
      // userModel.deleteUserbyId()
  })
})



app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  preflightContinue: true,
  optionsSuccessStatus: 200
}))
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(morgan('dev'))
app.use(xss())
app.use(cookieParser())

//
app.use('/v1', mainRoute)

// app.use('/image', express.static(path.join(__dirname, '/upload/image')))
// app.use('/video', express.static(path.join(__dirname, '/upload/video')))
// app.all('*', (req, res, next) => {

//   next(new createError.NotFound())


// })

app.use('/image', express.static(path.join(__dirname, '/upload')))
app.all('*', (req, res, next) => {
  next(new createError.NotFound())
})


// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const messError = err.message || 'Internal Server Error'
  const statusCode = err.status || 500
  
  res.status(statusCode).json({
    message: messError
  })
})

httpServer.listen(PORT, ()=>{
  console.log(`server is running in port ${PORT}`);
})
// app.listen(PORT, () => {
//   console.log(`Server starting on port ${PORT}`)
// })

