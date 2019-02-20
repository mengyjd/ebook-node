app.get('/book/list', (req, res) => {
  const conn = connectDB()
  conn.query('select * from book', (err, result) => {
    if(err) {
      res.json({
        error_code: 1001,
        msg: '数据库连接失败'
      })
    } else {
      res.json({
        error_code: 0000,
        data: result
      })
    }
    conn.end()
  })
})
