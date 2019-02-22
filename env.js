let env = ''
console.log(process.env.NODE_ENV)

if (process.NODE_ENV === 'development') {
  env = 'development'
} else {
  env = 'production'
}



module.exports = env
