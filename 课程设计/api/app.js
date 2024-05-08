const express = require('express')
const app = express()

// 导入cors允许跨域资源共享
const cors = require('cors')
app.use(cors())

// 解析 post 表单数据的中间件
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 调用 app.listen 方法，指定端口号并启动web服务器
const router = require('./router')
app.use(router)
app.listen(80, () => {
    console.log('running');
})