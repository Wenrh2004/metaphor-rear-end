const express = require('express')
const path = require('path')

// 解析 HTML
var ejs = require('ejs')
var config = require('./config/default')

const app = express()

// 获取静态路径
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/data'))

// 这只允许跨域访问该服务
app.all('*',function( req,res,next){
    //允许访问ip*为所有
    res. header ("Access-Control-Allow-Origin", "*"); 
    res.header ("Access-Confrol-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res .header ("Access-Control-Allow-Credentials", true);
    res .header ("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header ("X-Powered-By", ' 3.2.1')
    //这段仅仅为了方便返回json而已
    res.header ("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
    //让options请求快速返回
    res. sendStatus (200);
    } else {
    next ();
    }
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
// require('./routes/files')(app)

app.listen(config.port, () => {
    console.log(`http://127.0.0.1:${config.port}`);
})