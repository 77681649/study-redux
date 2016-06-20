var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config')

var app = new (require('express'))()
var port = 3000

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.get("/list", function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.get("/detail/:id", function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.get("/demo/demo1", function (req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

app.get("/list/books", function (req, res) {
  setTimeout(() =>
    res.json({
      head: {
        errcode: 0,
        errmessage: ''
      },
      data: [
        { id: 1, name: 'React', description: 'React 基于VirtulDOM , 组件化的View层' },
        { id: 2, name: 'React-Redux', description: 'React-Redux 用于连接React和Redux' },
        { id: 3, name: 'React-Router', description: 'React-Router 用于处理SPA的路由' },
        { id: 4, name: 'Babel', description: 'Babel 编译ES6 , jsx' },
        { id: 5, name: 'Webpack', description: 'Webpack 任何资源模块化' },
        { id: 6, name: 'Redux', description: 'Redux 数据流控制架构' },
        { id: 7, name: 'Redux-Thunk', description: 'Redux-Thunk Redux异步中间件' }
      ]
    })
    , 3000)
})



app.get("/group/list/:date", function (req, res) {
  setTimeout(() =>
    res.json({
      head: {
        errcode: 0,
        errmessage: ''
      },
      data: [
        { id: 1, name: 'DH-123' },
        { id: 2, name: 'DH-124' }
      ]
    })
    , 3000)
})

app.get("/group/flight-list/:id", function (req, res) {

  setTimeout(() =>
    res.json({
      head: {
        errcode: 0,
        errmessage: ''
      },
      data: [
        { id: 1, name: 'HKG-TPE 10:20', groupId: 1, },
        { id: 2, name: 'HKG-TPE 13:40', groupId: 1, },
        { id: 3, name: '香港-台北 10:20', groupId: 2, },
        { id: 4, name: '香港-台北 13:40', groupId: 2, },
      ].filter(it => it.groupId == req.params.id)
    })
    , 1000)
})

app.get("/group/discount-list/:id", function (req, res) {
  setTimeout(() =>
    res.json({
      head: {
        errcode: 0,
        errmessage: ''
      },
      data: [
        { id: 1, name: '限额优惠 HKG200', groupId: 1 },
        { id: 2, name: '银行优惠 HGG100', groupId: 1 },
        { id: 3, name: '>>限额优惠 HKG1,200', groupId: 2 },
        { id: 4, name: '>>银行优惠 HGG1,100', groupId: 2 }
      ].filter(it => it.groupId == req.params.id)
    })
    , 5000)
})


app.listen(port, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
