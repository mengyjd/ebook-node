// const user = 'mongodb://127.0.0.1:27017/user'
const constant = require('../constant')

module.exports = {
  ebookMongo: 'mongodb://0.0.0.0:27017/ebook',
  mysql: {
    get host() {
      return constant.dbHost
    },
    get port() {
      return constant.dbPort
    },
    get user() {
      return constant.dbUser
    },
    get password() {
      return constant.dbPassword
    },
    get database() {
      return constant.database
    }
  },
  redis: {
    get host() {
      return '127.0.0.1'
    },
    get port() {
      return 6379
    }
  }
}
