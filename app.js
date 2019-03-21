const express = require('express')
const session = require('express-session')
const cookie = require('cookie-parser')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')
const router = require('./router/index')
const app = express()

app.use(cors())

app.use(express.static("public"))
app.use(cookie())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', router.account)
app.use('/', router.store)

// 连接MongoDB user数据库
mongoose.connect(dbConfig.user, {
  useNewUrlParser: true
})


const server = app.listen(4005, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('server is listening at http://%s:%s', host, port)
})
