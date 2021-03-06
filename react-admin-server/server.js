/*
应用的启动模块
1. 通过express启动服务器
2. 通过mongoose连接数据库
  说明: 只有当连接上数据库后才去启动服务器
3. 使用中间件
 */
const mongoose = require('mongoose')
const express = require('express')
const app = express() // 产生应用对象
const path = require('path')
// 设置静态资源目录
app.use(express.static(path.resolve(__dirname, 'public')))
// 声明使用解析post请求的中间件
app.use(express.urlencoded({extended: true})) // 请求体参数是: name=tom&pwd=123
app.use(express.json()) // 请求体参数是json结构: {name: tom, pwd: 123}
// 声明使用解析cookie数据的中间件
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// 声明使用路由器中间件
const indexRouter = require('./routers')
app.use('/', indexRouter)  
// 通过mongoose连接数据库
mongoose.connect('mongodb://localhost/server_admin', {useNewUrlParser: true,useUnifiedTopology:true})
  .then(() => {
    console.log('database connected')
    // 只有当连接上数据库后才去启动服务器
    app.listen('5000', () => {
      console.log('server start! Please visit the website: http://localhost:5000')
    })
  })
  .catch(error => {
    console.error('database connect err', error)
  })
