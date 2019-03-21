const passport = require('passport')
const LocalStrategy = require('passport-local')
const UserModel = require('../../dbs/modules/user')

passport.use(new LocalStrategy(async function(username, password, done) {
  const where = {
    username
  }
  const result = await UserModel.findOne(where)

  if(result) {
    if(result.password === password) {
      return done(null, result, '登录成功')
    } else {
      return done(null, false, '密码错误')
    }
  } else {
    return done(null, false, '用户不存在')
  }
}))

passport.serializeUser(function (user, done) { //保存user对象
  done(null, user.username); //可以通过数据库方式操作
});

passport.deserializeUser(function (user, done) { //删除user对象
  done(null, user.username); //可以通过数据库方式操作
});

module.exports = passport
