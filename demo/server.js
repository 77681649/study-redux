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
    , 8000)

})

app.listen(port, function (error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
