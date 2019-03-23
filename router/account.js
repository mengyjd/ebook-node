const express = require('express')
const router = express.Router()
const UserModel = require('../dbs/modules/user')
const passport = require('./utils/passport')
const jwt = require('jsonwebtoken')

const secret = 'myjd123' // token密钥

// 用户登录，验证用户信息并返回token
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    // 密码错误或用户不存在
    if (!user) {
      return res.json({
        error_code: 1,
        msg: info
      })
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }

      // 登录成功
      const payload = {
        username: user.username
      }
      const options = {
        expiresIn: "30 days"
      }

      const token = jwt.sign(payload, secret, options)

      return res.json({
        error_code: 0,
        msg: info,
        token
      })
    })
  })(req, res, next)
})

// 检查用户登录状态
router.post('/check-login', async (req, res) => {

  if (req.headers['authentication-token']) {
    const token = req.headers['authentication-token'].split(' ')[1]

    try {
      const decoded = jwt.verify(token, secret) // 对token解密
      // 查询数据库中是否有该用户
      const result = await UserModel.find({
        username: decoded.username
      })

      if (result.length > 0) {
        res.json({
          error_code: 0,
          msg: '当前为登录状态',
          username: decoded.username
        })
      } else {
        res.json({
          error_code: 401,
          msg: '登录已失效，请重新登录'
        })
      }
    } catch (error) {
      res.json({
        error_code: 401,
        msg: '登录已失效，请重新登录'
      })
    }

  } else {
    res.json({
      error_code: 401,
      msg: '没有登录'
    })
  }
})

// 用户注册，将用户信息保存到Mongodb
router.post('/join', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  const where = {
    username
  }
  const result = await UserModel.findOne(where)
  if (!result) {
    const newUser = await UserModel.create({
      username,
      password
    })
    if (newUser) {
      res.json({
        error_code: 0,
        msg: '注册成功'
      })
    } else {
      res.json({
        error_code: 1,
        msg: '注册失败'
      })
    }
  } else {
    res.json({
      error_code: 1,
      msg: '用户名已注册'
    })
  }
})

module.exports = router
