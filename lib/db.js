const mysql = require('mysql2')
const config = require('../config/default')

const db = mysql.createConnection({
    host: config.database.HOST,
    user:config.database.USER,
    password:config.database.PASSWORD,
})

// 链接数据库
const pool = mysql.createPool({
    host: config.database.HOST,
    user:config.database.USER,
    password:config.database.PASSWORD,
    database:config.database.WALL,
})

// 直接使用 pool.query
let bdbs = (sql,values) => {
    return new Promise((resolve,reject) => {
        db.query(sql,values,(err,result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

// 通过 pool.getConnection 获取链接
let query = (sql,values) => {
    return new Promise((resolve,reject) => {
        pool.getConnection((err,connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql,values,(err,rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release();   // 释放链接
                })
            }
        })
    })
}

// 库操作

// 创建库
let WALL = `CREATE DATABASE IF NOT EXISTS WALL DEFAULT CHARSET utf8 COLLATE utf8_general_ci;`

let createDatabase = (db) => {
    return bdbs(db,[])
}

// 创建表
// 留言/照片
let walls = 
    `create table if not exists walls(
        id INT NOT NULL AUTO_INCREMENT,
        type INT NOT NULL COMMENT '类型0信息1图片',
        message VARCHAR(1000) COMMENT '留言',
        name VARCHAR(100) NOT NULL COMMENT '用户名',
        userID VARCHAR(100) NOT NULL COMMENT '创建者ID',
        moment VARCHAR(100) NOT NULL COMMENT '时间',
        label INT NOT NULL COMMENT '标签',
        color INT COMMENT '顔色',
        imgurl VARCHAR(100) COMMENT '图片路径',
        PRIMARY KEY (id)
);`

// 留言反馈
let feedbacks =
    `create table if not exists feedbacks(
        id INT NOT NULL AUTO_INCREMENT,
        wallID INT NOT NULL COMMENT '墙留言ID',
        userID VARCHAR(100) NOT NULL COMMENT '反馈者ID',
        type INT NOT NULL COMMENT '反馈类型0喜欢1举报2撤销',
        moment VARCHAR(100) NOT NULL COMMENT '时间',
        PRIMARY KEY (id)
);`

// 留言评论
let comments =
    `create table if not exists comments(
        id INT NOT NULL AUTO_INCREMENT,
        wallID INT NOT NULL COMMENT '墙留言ID',
        userID VARCHAR(100) NOT NULL COMMENT '评论者ID',
        imgurl VARCHAR(100) COMMENT '头像路径',
        comment VARCHAR(1000) COMMENT '评论内容',
        name VARCHAR(100) NOT NULL COMMENT '用户名',
        moment VARCHAR(100) NOT NULL COMMENT '时间',
        PRIMARY KEY (id)
);`

let createTable = (sql) => {
    return query(sql,[])
}

async function create(){
    await createDatabase(WALL);
    createTable(walls);
    createTable(feedbacks);
    createTable(comments);
}

create();

// 数据操作

// Insert
// 新增 walls
exports.inserWall = (value) => {
    let _sql = "INSERT INTO walls SET type=?,message=?,name=?,userID=?,moment=?,label=?,color=?,imgurl=?;"
    return query(_sql,value);
}
// 新增 feedbacks
exports.inserWall = (value) => {
    let _sql = "INSERT INTO feedbacks SET wallID=?,userID=?,type=?,moment=?;"
    return query(_sql,value);
}
// 新建 comments
exports.inserWall = (value) => {
    let _sql = "INSERT INTO walls SET wallID=?,userID=?,imgurl=?,comment=?,name=?,moment=?;"
    return query(_sql,value);
}

// Delete
// 删除 walls
exports.deleteWall = (id) => {
    let _sql = `DELETE a,b,c FROM walls a LEFT JOIN feedbacks b on a.id=b.wallID LEFT JOIN comments c ON a.id=c.wallID WHERE a.id"${id}";`
    return query(_sql);
}
// 删除 feedbacks
exports.deleteFeedbasck = (id) => {
    let _sql = `DELETE FROM feedbacks WHERE id="${id};`
    return query(_sql);
}
// 删除 comments
exports.deleteComment = (id) => {
    let _sql = `DELETE FROM comments WHERE id="${id};`
    return query(_sql);
}

// Select
// 查询(分页)
exports.selectWallPage = (page,pagesize,type,label) => {
    let _sql;
    if (label == -1) {
        // 未选择标签
        _sql = `SELECT * FROM walls WHERE type="${type}" ORDER BY id DESC LIMIT ${(page-1) * pagesize},${pagesize};`
    } else {
        // 当前已选择标签
        _sql = `SELECT * FROM walls WHERE type="${type}" AND label="${label}" ORDER BY id DESC LIMIT ${(page-1) * pagesize},${pagesize};`
    }
    return query(_sql);
}
// 查询(评论)
exports.selectCommentPage = (page,pagesize,id) => {
    let _sql = `SELECT * FROM comments WHERE wallID="${id}" ORDER BY id DESC LIMIT ${(page-1) * pagesize},${pagesize};`
    return query(_sql);
}
// 查询(反馈数据)
exports.selectfeedbackPage = (wallid,type) => {
    let _sql = `SELECT COUNT(*) AS COUNT FROM feedbacks WHERE wallID="${wallid}" AND type="${type}";`
    return query(_sql);
}
// 查询(评论总数)
exports.selectCommentCount = (wallid) => {
    let _sql = `SELECT COUNT(*) AS COUNT FROM feedbacks WHERE wallID="${wallid}";`
    return query(_sql);
}
// 查询(点赞)
exports.selectLoveCount = (wallid,userid) => {
    let _sql = `SELECT COUNT(*) AS COUNT FROM feedbacks WHERE wallID="${wallid}" AND userID="${userid}" AND type=0;`
    return query(_sql);
}