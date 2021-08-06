var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var storage = multer.diskStorage({
    // 定义存储路径
    destination: function (req, file, cb) {
        cb(null, './static/')
    },
    // 定义存储文件名
    filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now() + '.csv')
        console.log(file)
        cb(null, file.originalname + '.csv')
    }
})
//注册一个对象，dest里放的是上传的文件存储的位置，可以在当前目录下，建立一个static目录，上传的文件都放在这里
const upload = multer({
    // dest: './static/'
    storage
})

//使用中间件，没有挂载路径，应用的每个请求都会执行该中间件。any表示接受一切，具体参考文档。
app.use(upload.any())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
