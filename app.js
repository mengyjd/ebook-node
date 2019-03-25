const express = require('express')
// const session = require('express-session')
const cookie = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
const router = require('./router/index')
const utils = require('./router/utils/utils')
const app = express()

app.use(cors())

app.use(express.static("public"))
app.use(cookie())
app.set('trust proxy', 1) // trust first proxy
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(async (req, res, next) => {
  const url = req.originalUrl
  const patten = /\/user\/*/
  if (patten.test(url)) {
    const result = await utils.checkLogin(req)
    if (result.isAuthenticate) {
      // 用户为登录状态，允许路由通过
      next()
    } else {
      res.json({
        error_code: 401,
        msg: '登录已失效，无法同步数据'
      })
    }
  } else {
    next()
  }
})

app.use('/', router.account)
app.use('/', router.store)
app.use('/user', router.user)

// 连接MongoDB user数据库
mongoose.connect(dbConfig.ebookMongo, {
  useNewUrlParser: true
})


const server = app.listen(4005, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('server is listening at http://%s:%s', host, port)
})
