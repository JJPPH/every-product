const mongoose = require('mongoose')
require('dotenv').config()

const { MONGODB_URL } = process.env

const connect = () => {
  mongoose
    .connect(MONGODB_URL)
    .then(() => {
      console.log('몽고디비 연결')
    })
    .catch((error) => {
      console.log('몽고디비 연결 에러 : ', error)
    })
}

mongoose.connection.on('error', (error) => {
  console.log('몽고디비 연결 에러 : ', error)
})

mongoose.connection.on('disconnected', () => {
  console.log('몽고디비 연결 끊김')
  console.log('몽고디비 재접속 시도')
  connect()
})

module.exports = connect
