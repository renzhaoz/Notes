/**
 * 一个完整和良好的项目应该是由模块构成的
 * 使用express构建项目首先应当使用中间件的方式模块化构建
 * 当前主要模块如下:
 *  @module 日志 日志的收集需要在程序开始和结尾 所以就写道app模块中
 *  @module 安全
 *  @module 路由
 *  @module 性能优化
 *  @module db
 *  @module 其他
*/

var express = require('express');
var path = require('path');

var app = express();

/**
 * @module 日志
 * @middleware morgan HTTP通信日志记录器(长时间未更新) dw2685112
 * @middleware express-winston HTTP通信日志记录(可以定制信息)  dw235310
 * */

//var morgan = require('morgan');
//var accessLogFile = fs.createWriteStream(path.join(__dirname, './logs/access.log'), { flags: 'a' });
//var errorLogFile = fs.createWriteStream(path.join(__dirname, './logs/error.log'), { flags: 'a' });
// 中间件 express默认的日志收集中间件
//app.use(morgan('combined', { stream: accessLogFile }));//成功日志处理

const winston = require('winston');
const expressWinston = require('express-winston');

app.use(expressWinston.logger({
  statusLevels: false, // default value
  level: function (req, res) {
    var level = "";
    if (res.statusCode >= 100) { level = "info"; }
    if (res.statusCode >= 400) { level = "warn"; }
    if (res.statusCode >= 500) { level = "error"; }
    // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
    if (res.statusCode == 401 || res.statusCode == 403) { level = "critical"; }
    // No one should be using the old path, so always warn for those
    if (req.path === "/v1" && level === "info") { level = "warn"; }
    return level;
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename:'./logs/access.log',
      colorize: 'true',
      timestamp: 'true',
      maxsize:1024000,
      maxFiles:10
    })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}))


/**
 * @module 安全
 */
require('./modules/safe')(app);



/**
 * @其他
 * */ 
// const history = require('connect-history-api-fallback'); // 解决客户端使用history路由模式时 改变url就会发起get请求 界面路由不会切换的问题
// app.use(history()); // 路由处理 需要出现在静态文件处理之前static
// var fallback = require('express-history-api-fallback');
// var root = __dirname + '/public';
// app.use(fallback('index.html', { root: root }));

// 解析req传递的body数据
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


/**
 * @性能优化
 * */
const compression = require('compression');
const responseTime = require('response-time');
const favicon = require('serve-favicon');

app.use(compression()); // 开启资源压缩
app.use(responseTime()); // 响应时间收集 甩锅必备
app.use(express.static(__dirname + path.join('/public'), {
  maxAge:'2h'
})); // 设置默认访问路径 当req路径为/时 则访问服务端路径public/index.html 若访问/a.css => public/a.css
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


/**
 * @module 路由管理
 * @middleware errorHandle
 * @middleware successHandle
 */
app.use(require('./modules/errorHandle'));
app.use(require('./modules/successHandle'));
require('./routes')(app);


// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename:'./logs/error.log',
      timestamp: true,
      maxsize:1024000,
      maxFiles:10
    })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  statusLevels:true
}));
// Optionally you can include your custom error handler after the logging.
// app.use(express.errorLogger({
//   dumpExceptions: true,
//   showStack: true
// }));


/**
 * @module db操作
 * @methods find示例
 * @methods save示例
 * */ 

const NewsModel = require('./modules/db/mongoose/newsModel');

NewsModel.get1647834782104((err,docs)=>{
  console.log('全局方法get1647834782104定义成功！',docs);
})

const newInt = new NewsModel({
  author:'123642151514',
  title:`${new Date()}`,
  time:Date.now(),
  message:`${Date.now()}}`,
  img:`${Date.now()}`,
});

newInt.save((err,data)=>{
  console.log(err,data);
})



// mongodb demo
const db = require('./modules/db/mongodb/index');
const dbMgr = new db({dbPath:'mongodb://127.0.0.1:27017',dbName:'lear',tableName:'user'});
dbMgr.find({age:3},{sex:1}).then(res=>{
  console.log('find success!');
});



//404
app.use(function(req, res, next) {
  throw new Error('404 Not Found!');
});

// error handler
app.use(function(err, req, res, next) {
  // handle error
  // errorLogFile.write(`${err.stack}-${err.message} \n`);
  // app error logs
  expressWinston.errorLogger({
    statusLevels: false, // default value
    level:'error',
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename:'./logs/error.log',
        colorize: 'true',
        timestamp: 'true',
        maxsize:1024000,
        maxFiles:10
      })
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )
  });
  res.errorHandle(err.status || 500,err.message);
});

module.exports = app;
