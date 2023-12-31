const express = require('express')
const path = require('path')

// 解析 HTML
var ejs = require('ejs')
var config = require('./config/default')

const app = express()

// 获取静态路径
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/data'))

// 配置跨域请求中间件(服务端允许跨域请求)
app.use((req, res, next)=> {
    res.header("Access-Control-Allow-Origin", req.headers.origin); // 设置允许来自哪里的跨域请求访问（值为*代表允许任何跨域请求，但是没有安全保证）
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"); // 设置允许接收的请求类型
    res.header("Access-Control-Allow-Headers", "Content-Type,request-origin"); // 设置请求头中允许携带的参数
    res.header("Access-Control-Allow-Credentials", "true"); // 允许客户端携带证书式访问。保持跨域请求中的Cookie。注意：此处设true时，Access-Control-Allow-Origin的值不能为 '*'
    res.header("Access-control-max-age", 1000); // 设置请求通过预检后多少时间内不再检验，减少预请求发送次数
    next();
})

// 设置HTML视图引擎
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// 设置视图文件路径
app.set('views', path.join(__dirname, 'views'));

// 解析前端数据
app.use(express.json())
app.use(express.urlencoded({ extended:true }))

// 引入路由
require('./routes/index')(app)
require('./routes/files')(app)

app.listen(config.port, () => {
    console.log(`http://127.0.0.1:${config.port}`);
})