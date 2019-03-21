const db = require('../dbs/utils/conn')
const constant = require('../constant')
const express = require('express');
const router = express.Router();

router.get('/book/home', (req, res) => {
  const conn = db.connectDB()
  conn.query(
    'select * from book where cover != \'\'',
    (err, result) => {
      if (!err && result) {
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
      } else {
        res.json({
          error_code: 1,
          msg: '数据获取失败'
        })
      }

    }
  )
  conn.end()
})

router.get('/book/detail', (req, res) => {
  const conn = db.connectDB()
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

router.get('/book/list', (req, res) => {
  // 判断前端请求的数据类型
  switch (req.query.type) {
    case 'categoryRecommend':
      categoryRecommend(req, res)
      break
    case 'categoryBooks':
      // 返回当前查询分类下的所有图书
      categoryBooks(req, res)
      break
    case 'allCategoryBooks':
      // 返回所有图书
      allCategory(req, res)
      break
    case 'keywords':
      // 根据前端的关键词从数据库中返回书名包含关键词的图书
      searchBooksFromKeywords(req, res)
      break
  }
})

router.get('/book/flat-list', (req, res) => {
  const conn = db.connectDB()
  conn.query('select * from book where cover!=\'\'', (err, result) => {
    if (err) {
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

router.get('/book/shelf', (req, res) => {
  res.json({
    error_code: 0,
    bookList: []
  })
})

router.get('/book/hotSearch', (req, res) => {
  let hotSearchList = []
  const conn = db.connectDB()
  var length = 0
  conn.query('select * from book', (err, result) => {
    if (!err && result) {
      length = result.length
      const hotSearchBookIds = createRandomNumArray(5, 0, length)
      hotSearchBookIds.forEach(id => {
        let hotSearchItem = {}
        hotSearchItem.text = result[id].title
        hotSearchItem.searchPeopleNum = createRandomNumArray(1, 8000, 20000)[0]
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

router.get('/book/guessYouLikeList', (req, res) => {
  const conn = db.connectDB()
  conn.query('select * from book', (err, result) => {
    const guessYouLikeList = createGuessYouLike(result, result.length)
    if (!err && result) {
      res.json({
        error_code: 0,
        msg: '获取数据成功',
        guessYouLikeList
      })
    } else {
      res.json({
        error_code: 1,
        msg: '获取数据失败'
      })
    }
  })
  conn.end()
})

/**
 * 返回一个包含指定个数的随机数数组(数组内随机数不重复)
 * @param {number} num 数组中随机数的个数
 * @param {number} min 随机数的最小值
 * @param {number} max 随机数的最大值
 */
function createRandomNumArray(num, min, max) {
  let arr = []
  while (arr.length < num) {
    arr.push(Math.floor(Math.random() * max) + min)
    arr = [...new Set(arr)]
  }
  return arr
}

// 创建一个book对象
function createData(res, key) {
  let book = res[key]
  book = handleData(book)
  return book
}

// 为book对象添加属性
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
  createRandomNumArray(3, 0, length).forEach(key => {
    let book = createData(result, key)
    book.type = createRandomNumArray(1, 1, 3)[0]
    book.result = createRandomNumArray(1, 8000, 100000)[0]
    guessYouLike.push(book)
  })
  return guessYouLike
}

function createRecommend(result, length) {
  let recommend = []
  createRandomNumArray(3, 0, length).forEach(key => {
    book = createData(result, key)
    book.readers = createRandomNumArray(1, 1000, 10000)[0] + 1000
    recommend.push(book)
  })
  return recommend
}

function createFeatured(result, length) {
  let featured = []
  createRandomNumArray(6, 0, length).forEach(key => {
    const book = createData(result, key)
    featured.push(book)
  })
  return featured
}

function createRandom(result, length) {
  const randomNum = createRandomNumArray(1, 0, length)[0]
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

// 返回所有热门推荐或者所有精选的数据
function categoryRecommend(req, res) {
  const conn = db.connectDB()
  conn.query('select * from book', (err, result) => {
    if (!err && result) {
      let books = []
      if (req.query.value === 'allHotRecommend') {
        // 如果是查看所有的热门推荐
        // 则随机随机从数据库中返回30本书
        books = createBooks(result, 30)
      } else if (req.query.value === 'allFeatured') {
        // 如果是查看所有的精选图书
        // 则随机随机从数据库中返回30本书
        books = createBooks(result, 30)
      }
      res.json({
        books,
        total: books.length,
        error_code: 0,
        msg: '数据获取成功'
      })
    } else {
      res.json({
        error_code: 1,
        msg: '获取数据失败'
      })
    }
  })
  conn.end()
}

// 按照分类返回图书
function categoryBooks(req, res) {
  const conn = db.connectDB()
  conn.query(`select * from book where categoryText='${req.query.value}'`,
    (err, result) => {
      const books = result.map(book => {
        return handleData(book)
      })
      if (!err && result) {
        res.json({
          books,
          total: books.length,
          error_code: 0,
          msg: '数据获取成功'
        })
      } else {
        res.json({
          error_code: 1,
          msg: '数据获取失败'
        })
      }
    })
  conn.end()
}

function allCategory(req, res) {
  const conn = db.connectDB()
  conn.query('select * from book', (err, result) => {
    if (!err && result) {
      const books = result.map(book => {
        return handleData(book)
      })

      res.json({
        books,
        total: books.length,
        error_code: 0,
        msg: '数据获取成功'
      })
    } else {
      res.json({
        error_code: 1,
        msg: '数据获取失败'
      })
    }
  })
  conn.end()
}

function searchBooksFromKeywords(req, res) {
  const conn = db.connectDB()
  conn.query(`select * from book where fileName like "%${req.query.value}%";`,
    (err, result) => {
      if (!err && result) {
        const books = result.map(book => {
          return handleData(book)
        })
        res.json({
          books,
          error_code: 0,
          msg: '数据获取成功'
        })
      } else {
        res.json({
          error_code: 1,
          msg: '数据获取失败'
        })
      }
    })
  conn.end()
}

/**
 * 从数组中返回指定数量的图书
 * @param {Array} books 图书数组
 * @param {number} num 要返回图书的数量
 */
function createBooks(books, num) {
  let bookArray = []
  createRandomNumArray(num, 0, books.length).forEach(key => {
    bookArray.push(createData(books, key))
  })
  return bookArray
}

module.exports = router
