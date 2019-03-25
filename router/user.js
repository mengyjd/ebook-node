const express = require('express')
const router = express.Router()
const UserModel = require('../dbs/modules/user')

// 同步书架数据，将用户上传的书架数据保存到数据库
// 包括书架图书列表，每本书的阅读信息(阅读时间，书签，阅读进度)
router.post('/shelf', async (req, res) => {
  updateMongo({
      username: req.body.username
    }, {
      shelfList: req.body.shelfList
    },
    res)
})

// 同步用户主题设置 (字体大小，字体类型，主题颜色)
router.post('/settings', async (req, res) => {
  updateMongo({
      username: req.body.username
    }, {
      settings: req.body.settings
    },
    res)
})

// 将用户的书架数据发送到客户端
router.get('/cloud_shelf', async (req, res) => {
  getUserDataFromMongo({
      username: req.query.username
    },
    'shelfList',
    res)
})

// 将用户主题设置发送到客户端
router.get('/cloud_settings', async (req, res) => {
  getUserDataFromMongo({
      username: req.query.username
    },
    'settings',
    res)
})

/**
 * 获取用户的数据
 * @param {Object} user 要获取数据的用户对象
 * @param {string} type 要获取的数据属性,同时作为返回数据的键值
 * @param {Object} res response
 */
async function getUserDataFromMongo(user, type, res) {
  const result = await UserModel.findOne(user)
  if (result) {
    res.json({
      error_code: 0,
      [type]: result[type]
    })
  } else {
    res.json({
      error_code: 1,
      msg: '数据查询失败'
    })
  }
}

/**
 * 更新用户的数据库
 * @param {Object} where 要更新数据的用户对象
 * @param {Object} updateDoc 准备更新的数据
 * @param {Object} res response
 */
async function updateMongo(where, updateDoc, res) {
  const findResult = await UserModel.findOne(where)

  if (findResult) {
    const updateResult = await UserModel.updateOne(where, updateDoc)
    if (updateResult) {
      res.json({
        error_code: 0,
        msg: '数据同步成功'
      })
    } else {
      res.json({
        error_code: 1,
        msg: '数据同步失败'
      })
    }
  } else {
    res.json({
      error_code: 1,
      msg: '数据同步失败,找不到该用户'
    })
  }
}

module.exports = router
