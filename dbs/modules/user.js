const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

let userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  books: Array
})

module.exports = Mongoose.model('user', userSchema)
