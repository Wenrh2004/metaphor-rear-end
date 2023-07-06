const controller = require('../controller/dbSever')

module.exports =function (app) {
    // 定义路由
    app.get('/', (req, res) => {
        res.render('index'); // 渲染index.html视图
    });

    // Insert
    // 新建wall数据
    app.post('/insertwall',(req,res) => {
        controller.insertWall(req,res)
    })
    // 新建反馈
    app.post('/insertfeedback',(req,res) => {
        controller.insertFeedback(req,res)
    })
    // 新建评论
    app.post('/insertcomment',(req,res) => {
        controller.insertComment(req,res)
    })

    // Delete
    // 删除 wall
    app.post('/deletewall',(req,res) => {
        controller.deleteWall(req,res)
    })
    // 删除 feedbask
    app.post('/deletefeedbask',(req,res) => {
        controller.deleteFeedback(req,res)
    })
    // 删除 comment
    app.post('/deletecomment',(req,res) => {
        controller.deleteComment(req,res)
    })

    // Select
    // wall
    app.post('/selectwallpage',(req,res) => {
        controller.selectWallPage(req,res)
    })
    // comment
    app.post('/selectcomment',(req,res) => {
        controller.selectCommentPage(req,res)
    })

    // 获取用户IP
    app.post('/sign',(req,res) => {
        var ip = req.ip
        res.send({
            code:200,
            ip:ip
        })
    })
}