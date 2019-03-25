const jwt = require('jsonwebtoken')
const UserModel = require('../../dbs/modules/user')
const secret = 'myjd123'

exports.secret = secret // token密钥

exports.checkLogin = async (req) => {
  if (req.headers['authentication-token']) {
    const token = req.headers['authentication-token'].split(' ')[1]

    try {
      const decoded = jwt.verify(token, secret) // 对token解密
      // 查询数据库中是否有该用户
      const result = await UserModel.find({
        username: decoded.username
      })

      if (result.length > 0) {
        return {
          isAuthenticate: true,
          username: decoded.username
        }
      }
    } catch (error) {
      console.log('catch:', error)
      return {
        isAuthenticate: false
      }
    }
  }
  return {
    isAuthenticate: false
  }
}
