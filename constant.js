const env = require('./env')

let resUrl = ''  // 资源路径 即nginx服务器中的资源
let dbHost = ''
let dbPort = ''
let dbUser = ''
let dbPassword = ''
let database = ''
if (env === 'development') {
  resUrl = 'http://localhost:3001/e_r2'
  dbHost = 'localhost'
  dbPort = '3306'
  dbUser = 'root'
  dbPassword = 'xl123456'
  database = 'reader_book'
} else {
  resUrl = 'http://116.62.199.170/e_r2'
  dbHost = 'localhost'
  dbPort = '3306'
  dbUser = 'root'
  dbPassword = 'xl123456'
  database = 'reader_book'
}

const categoryIds = [1, 3, 4, 9]

module.exports = {
  resUrl,
  categoryIds,
  dbHost,
  dbPort,
  dbUser,
  dbPassword,
  database
}
