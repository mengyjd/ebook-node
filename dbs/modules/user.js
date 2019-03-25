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
  shelfList: Array,
  settings: Object
})

module.exports = Mongoose.model('user', userSchema)
