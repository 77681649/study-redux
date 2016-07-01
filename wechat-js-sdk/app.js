'use strict'

var express = require('express')
var app = express()

var fetch = require('isomorphic-fetch')
var crypto = require('crypto')
var sha1 = crypto.createHash('sha1')


app.use(express.static('public'))

function addSeconds(date, sec) {
  return date.valueOf() + sec
}

var cache = {
  _caches: {},

  get: function (key) {
    if (timeout <= (new Date()).valueOf()) {
      return (this._caches[key] = null)
    }

    return this._caches[key]
  },

  set: function (key, data, lifetime) {
    var timeout = addSeconds(new Date(), lifetime * 1000)

    this._caches[key] = { data: data, timeout: timeout }
  }
}

var app_id = ''
var app_secrect = ''

function fetchAccessToken(app_id, app_secrect, client_credential, callback) {
  var api = `https://api.weixin.qq.com/cgi-bin/token?grant_type=${client_credential}&appid=${app_id}&secret=${app_secrect}`

  // access_token  token 
  // expires_in 有效期 单位秒
  // errcode

  console.log('fetch', api)

  fetch(api)
    .then((res) => res.json)
    .then((data) => {
      cache.set('access_token', data.access_token, data.expires_in)

      return Promise.resolve(data.access_token)
    })
    .throw((ex) => {
      throw ex;
    })
}

function fetchTicket(access_token, callback) {
  var api = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`;

  // "ticket":"bxLdikRXVbTPdHSM05e5u5sUoXNKd8-41ZO3MhKoyN5OfkWITDGgnr2fwJ0m9E8NYzWKVZvdVtaUgWvsdshFKA"
  // "expires_in":7200

  console.log('fetch', api)

  fetch(api)
    .then((res) => res.json)
    .then((data) => {
      cache.set('ticket', data.ticket, data.expires_in)

      return Promise.resolve(data.ticket)
    })
    .throw((ex) => {
      throw ex;
    })
}

/**
 * 签名
 * @param {String} noncestr 随机字符串
 * @param {String} jsapi_ticket wechat ticket
 * @param {String} timestamp 时间戳
 * @param {String} url 当前网页的URL , 不包含#及其后面部分
 * 
 * SHA1 算法
 * 签名字段按ASCII从小到大排序 , 再以key=value&..形式连接
 * 
 * 1. 签名用的noncestr和timestamp必须与wx.config中的nonceStr和timestamp相同
 * 2. 签名用的url必须是调用JS接口页面的完整URL
 * 3. 出于安全考虑，开发者必须在服务器端实现签名的逻辑
 * 
 * @returns {String}
 */
function sign(noncestr, jsapi_ticket, timestamp, url) {
  var str =
    `jsapi_ticket=${jsapi_ticket}&` +
    `noncestr=${noncestr}&` +
    `timestamp=${timestamp}&` +
    `url=${url}&`;

  console.log('sign source string:')
  console.log(str)

  return sha1.update(str).digest('hex')
}

app.get('/api/sign', function (req, res) {
  var param = {
    noncestr: req.query.noncestr,
    timestamp: req.query.timestamp,
    url: req.query.url,
    client_credential: req.query.client_credential
  }
})

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})