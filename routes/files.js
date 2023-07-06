var multer = require('multer')

function random(min,max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const storage = multer.diskStorage({
    // 保存路径
    destination:function(req,file,cb) {
        // 文件路径
        cb(null,'./data/photo')
    },
    // 保存文件文件名
    filename:function(req,file,cb) {
        // 正则匹配后缀名
        let type = file.originalname.replace(/. + \./,".")
        cb(null,Date.now() + type)
    }
})

const upload = multer({storage:storage})

module.exports = function(app){

app.post('/profile',upload.single('file'),function(req,res,next){
    // req.file 文件信息
    // req.body 文本域数据
    let name = req.file.filename
    let imgurl = '/photo/'+ name
    res.send(imgurl)
})

}