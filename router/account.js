const express = require('express')
const router = express.Router()
const UserModel = require('../dbs/modules/user')
const passport = require('./utils/passport')

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.json({
        error_code: 1,
        msg: info
      })
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({
        error_code: 1,
        msg: info
      })
    })
  })(req, res, next)
})

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
        error_code: 0,
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
