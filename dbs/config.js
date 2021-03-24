// const user = 'mongodb://127.0.0.1:27017/user'
const constant = require('../constant')

module.exports = {
  ebookMongo: 'mongodb://127.0.0.1:27017/ebook',
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
      return 'xl123456'
    },
    get database() {
      return 'ebook'
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
