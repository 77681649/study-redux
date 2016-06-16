
const express = require('express');
const app = express();

const path = require('path');
const serve = require('serve-static');

// 静态资源
app.use(serve(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});