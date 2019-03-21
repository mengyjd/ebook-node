const mysql = require('mysql')
const dbConfig = require('../config')

function connectDB() {
  return mysql.createConnection({
    host: dbConfig.mysql.host,
    port: dbConfig.mysql.port,
    user: dbConfig.mysql.user,
    password: dbConfig.mysql.password,
    database: dbConfig.mysql.database
  })
}

module.exports = {
  connectDB
}
