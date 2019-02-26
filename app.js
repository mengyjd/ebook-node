const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const app = express()
const constant = require('./constant')

app.use(cors())

function connectDB() {
  return mysql.createConnection({
    host: constant.dbHost,
    port: constant.dbPort,
    user: constant.dbUser,
    password: constant.dbPassword,
    database: 'ebook'
  })
}


app.get('/book/home', (req, res) => {
  const conn = connectDB()
  conn.query(
    'select * from book where cover != \'\'',
    (err, result) => {
      const length = result.length
      const guessYouLike = createGuessYouLike(result, length)
      const banner = `${constant.resUrl}/home_banner.jpg`
      const recommend = createRecommend(result, length)
      const featured = createFeatured(result, length)
      const random = createRandom(result, length)
      const categoryList = createCategoryList(result)
      const categories = constant.categories

      res.json({
        error_code: 0,
        guessYouLike,
        banner,
        recommend,
        featured,
        random,
        categoryList,
        categories
      })
    }
  )
  conn.end()
})


app.get('/book/detail', (req, res) => {
  const conn = connectDB()
  const sql = `select * from book where fileName='${req.query.fileName}'`
  conn.query(sql, (err, result) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '获取电子书详情失败'
      })
    } else {
      if (result && result.length === 0) {
        res.json({
          error_code: 1,
          msg: '获取电子书详情失败'
        })
      } else {
        const book = handleData(result[0])
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: book
        })
      }
    }
  })
  conn.end()
})

app.get('/book/list', (req, res) => {
  const conn = connectDB()
  conn.query('select * from book where cover!=\'\'', (err, result) => {
    if(err) {
      res.json({
        error_code: 1,
        msg: '获取数据失败'
      })
    } else {
      result.map(book => handleData(book))
      const books = {}
      constant.category.forEach(categoryText => {
        books[categoryText] = result.filter(book => book.categoryText === categoryText)
      })
      res.json({
        error_code: 0,
        msg: '获取数据成功',
        data: books,
        total: result.length
      })
    }
  })
  conn.end()
})

app.get('/book/flat-list', (req, res) => {
  const conn = connectDB()
  conn.query('select * from book where cover!=\'\'', (err, result) => {
    if(err) {
      res.json({
        error_code: 1,
        msg: '获取数据失败'
      })
    } else {
      result.map(book => handleData(book))
      res.json({
        error_code: 0,
        msg: '获取数据成功',
        data: result,
        total: result.length
      })
    }
  })
  conn.end()
})

app.get('/book/shelf', (req, res) => {
  res.json({
    error_code: 0,
    bookList: []
  })
})

app.get('/book/hotSearch', (req, res) => {
  let hotSearchList = []
  const conn = connectDB()
  var length = 0
  conn.query('select * from book', (err, result) => {
    if (!err && result) {
      length = result.length
      const hotSearchBookIds = createRandomNumArray(5, length)
      hotSearchBookIds.forEach(id => {
        let hotSearchItem = {}
        hotSearchItem.text = result[id].title
        hotSearchItem.searchPeopleNum = createRandomNumArray(1, 20000)[0] + 8000
        hotSearchItem.type = 'book'
        hotSearchItem.fileName = result[id].fileName
        hotSearchItem.categoryText = result[id].categoryText
        hotSearchList.push(hotSearchItem)
      })
      res.json({
        hotSearchList
      })
    } else {
      res.json({
        error_code: 1,
        msg: '数据获取失败'
      })
    }
  })
  conn.end()
})

function createRandomNumArray(num, max) {
  let arr = []
  while (arr.length < num) {
    arr.push(Math.floor(Math.random() * max))
    arr = [...new Set(arr)]
  }
  return arr
}

function createData(res, key) {
  let book = res[key]
  book = handleData(book)
  return book
}

function handleData(book) {
  if (!book.cover.startsWith('http://')) {
    book.cover = `${constant.resUrl}/img${book.cover}`
    book.selected = false
    book.private = false
    book.cache = false
    book.haveRead = 0
  }
  return book
}


function createGuessYouLike(result, length) {
  let guessYouLike = []
  createRandomNumArray(9, length).forEach(key => {
    let book = createData(result, key)
    book.type = createRandomNumArray(1, 3)[0] + 1
    book.result = createRandomNumArray(1, 100000)[0] + 8000
    guessYouLike.push(book)
  })
  return guessYouLike
}

function createRecommend(result, length) {
  let recommend = []
  createRandomNumArray(3, length).forEach(key => {
    book = createData(result, key)
    book.readers = createRandomNumArray(1, 10000)[0] + 1000
    recommend.push(book)
  })
  return recommend
}

function createFeatured(result, length) {
  let featured = []
  createRandomNumArray(6, length).forEach(key => {
    const book = createData(result, key)
    featured.push(book)
  })
  return featured
}

function createRandom(result, length) {
  const randomNum = createRandomNumArray(1, length)[0]
  const book = createData(result, randomNum)
  return book
}

function createCategoryList(result) {
  let categoryList = []
  constant.categoryIds.forEach(id => {
    const listItem = createCategoryListItem(id, result)
    categoryList.push(listItem)
  })
  return categoryList
}

function createCategoryListItem(categoryId, result) {
  let categoryItem = {}
  let list = []
  list = result.filter(book => book.category === categoryId).slice(0, 4)
  list.map(book => {
    handleData(book)
  })
  categoryItem.category = categoryId
  categoryItem.list = list
  return categoryItem
}

const server = app.listen(4005, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('server is listening at http://%s:%s', host, port)
})
