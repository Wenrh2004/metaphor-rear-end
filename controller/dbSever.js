const db = require('../lib/db')

// Insert
// 新建walls
exports.insertWall = async (req,res) => {
    let data = req.body;
    // console.log(data)
    await db.insertWall([data.type,data.massage,data.name,data.userID,data.moment,data.label,data.label,data.color,data.imgurl])
    .then(result => {
        res.send({
            code:200,
            massage:result,
        })
    })
}
// 新建反馈
exports.insertFeedback = async (req,res) => {
    let data = req.body;
    await db.insertFeedback([data.wallID,data.userID,data.type,data.moment])
    .then(result => {
        res.send({
            code:200,
            massage:result,
        })
    })
}
// 新建评论
exports.insertComment = async (req,res) => {
    let data = req.body;
    await db.insertComment([data.wallID,data.userID,data.imgurl,data.comments,data.name,data.moment])
    .then(result => {
        res.send({
            code:200,
            massage:result,
        })
    })
}

// Delete
// walls
exports.deleteWall = async (req,res) => {
    let data = req.body;
    if (data,imgurl) {
        // 如果 URL 存在,删除对应图片
        Mkdir.delFiles('data/' + data.imgurl)
    }
    await db.deleteWall(data.id).then((result) => {
        res.send({
            code:200,
            message:result,
        })
    })
}
// feedback
exports.deleteFeedback = async (req,res) => {
    let data = req.body;
    await db.deleteFeedbasck(data.id).then((result) => {
        res.send({
            code:200,
            message:result,
        })
    })
}
// comment
exports.deleteComment = async (req,res) => {
    let data = req.body;
    await db.deleteComment(data.id).then((result) => {
        res.send({
            code:200,
            massage:result,
        })
    })
}

// Select
// 分页
exports.selectWallPage = async (req,res) => {
    let data =req.body;
    await db.selectWallPage(data.page,data.pagesize,data.type,data.label).then(async result => {
        for (let i = 0; i < result.length; i++) {
            // 查找对应的 wall 属性(喜欢、举报、撤销)
            // 喜欢
            result[i].love = await db.selectfeedbackPage(result[i].id,0);
            // 举报
            result[i].report = await db.selectfeedbackPage(result[i].id,1);
            // 撤销
            result[i].revoke = await db.selectfeedbackPage(result[i].id,2);
            // 点赞
            result[i].islove = await db.selectLoveCount(result[i].id,data.userID);
            // 评论
            result[i].comment = await db.selectCommentCount(result[i].id)
        }
        res.send({
            code:200,
            message:result,
        })
    })
}
// 评论
exports.selectCommentPage = async (req,res) => {
    let data = req.body;
    await db.selectCommentPage(data.page,data.pagesize,data.id).then(result => {
        res.send({
            code:200,
            message:result,
        })
    })
}