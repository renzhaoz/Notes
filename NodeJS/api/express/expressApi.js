/**
 * @file express基础起步api
 * @dis express主要功能
 *  - 路由控制
 *  - 模板解析支持
 *  - 动态视图
 *  - 用户会话
 *  - CSRF保护
 *  - 静态文件服务
 *  - 错误控制器
 *  - 访问日志
 *  - 缓存
 *  - 插件支持(中间件)
 */

const express = require('express');
const fs = require('fs');
// 解析body的中间件
const bodyParser = require('body-parser')

/**
 * @dis 全局变量
 * node中的全局变量是挂载到exports对象上的.
 * exports.globalNum = 1;
 */ 

var app = express();
app.set('port', process.env.PORT || 1234);

/** 
  *  @dis 中间件 提供解析请求 安全攻击 cookie等一系列的中间件
  * compress解析gzip 
  * cookie-parser解析cookie 
  * cookie-session提供cookie存储的绘画支持
  * express-session 提供会话ID的支持
  * csurf防范跨域请求伪造攻击CSRF
  * directory提供静态文件的目录清单支持
  * static-favicon提供浏览器title中的小图标可提升性能
  * morgan 自动记录会话日志
  * query解析查询字符串
  * response-time添加X-Response-Time头
  * static提供对静态(public)文件的支持
  * vhost虚拟主机
  * 
  */


// 解析type = application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// 解析application/json
app.use(bodyParser.json());
// 直接处理静态资源
app.use(express.static(__dirname+'/public'));



/**
 *  @dis request 从客户端到服务端的消息对象,在nodeJs中来自http.IncomingMessage.一下都是request的属性
 *    @param header header信息
 *    @param params 数组 包含命名过的路由参数
 *    @param param(name) 返回命名的路由参数
 *    @param query  对象 包含以键值对存放的查询字符串参数 通常为GET请求
 *    @param body 对象 包含POST请求参数 需要使用中间件解析
 *    @param route 关于当前匹配路由的信息
 *    @param cookie/singnedCookie 对象 获取接受到的cookie信息
 *    @param headers 对象 请求报头
 *    @param accepts([types]) 用于确定客户端是否接受一个或一组指定的类型(可选类型可以是单个的MEIME类型，如application/json,一个逗号分割集合或者是一个数组)
 *    @param ip 客户端ip
 *    @param path 请求路径 不包含协议 主机 端口或查询字符串
 *    @param host 一个简便的方法 用来返回客户端所报告的主机名(可以伪造)
 *    @param xhr 如果请求由ajax发起将返回true
 *    @param protocol 用于标识请求的协议 http/https
 *    @param secure https时返回true
 *    @param url/originalUrl 返回路径和查询字符串(不包含协议 主机 端口).url属性若是出于内部路由目的,则可以重写,但是originalUrl时为了保留原始请求和查询字符串
 *    @acceptedLanguages 获取客户端语言类型,这些信息是从请求报头中解析而来的
 * 
*/


/**
 * @dis response响应对象 服务端要发送到客户端的响应对象,一下是其部分参数
 *    @param status 状态码
 *    @param set(name,value) 设置响应头 一般不需要手动设置
 *    @param cookie(name,value,[options]) 设置cookie  需要中间件
 *    @param clearCookie(name,[options]) 清除客户端cookie值
 *    @param redirect([status],url) 重定向浏览器 默认重定向代码是302.通常尽量减少重定向,除非永久移动一个页面,此时应该使用301(永久移动)
 *    @param send(body) send(status,body) 向客户端发送响应及可选的状态码.express的默认内容类型是text/html.如果你想改为text/plain.则需要使用set方法.如果body是一个对象或者数组,响应会以JSON发送,这时推荐使用json()
 *    @param json() json(status,json) 向客户端发送JSON及可选的状态码
 *    @param jsonp(json) jsonp(status,json) 向客户端发送jsonp及可选的状态码
 *    @param type(type) 用于设置Content-Type头信息.相当于set(name,value)
 *    @param format(object) 允许根据接收请求报头Content-Type不同值发送不同的内容.
 *    @param attachment([filename]) download(path,[filename],[callback]) 这两种方法会将相应报头Content-Disposition设为attachment.这样浏览器就会
 *      选择下载而不是展现内容.你可以指定filename给浏览器作为对用户的提示.download()可以指定要下载的文件,attachment()只是设置报头.另外你需要将内容发送到客户端.
 *    @param sendFile(path,[option],[callback]) 根据路径读取指定文件并将内容发送到客户端.使用静态中间件并将发送到客户端的文件放在公共目录下.也可以根据条件在相同的url下提供不同的资源.
 *    @param links(links) 设置链接响应报头.这是一个专用的报头.在大多数应用程序中几乎没有用处
 *    @param locals render(view,[locals],callback) locals属性值是一个对象,包含用于渲染视图的默认上下文.render()使用配置的模板引擎渲染视图.render()的默认响应代码为200.使用status可以指定一个不同的代码
 * */ 





/**
 * @Cookie
 *    @param Set-Cookie 期望从客户端得到cookie返回时一般设置这个response头属性
 *    @param cookie-parser 中间件 可用于解析 设置 签名(加密)cookie
 *      var credentials = require('./credentials.js'); credentials是一个凭证文件(存放秘钥的地方).内容可能如下:
 *        module.exports = {
 *          cookieSecret: ' 把你的 cookie 秘钥放在这里 ',
 *        };
 *      app.use(require('cookie-parser')(credentials.cookieSecret)); // 用秘钥加密cookie
 *      res.cookie(key,value) 设置
 *      res.cookie(key,value,{signed: true}) 设置cookie并签名
 *    
 *    @dis 设置cookie时可以使用如下选项
 *      @param domain 控制跟cookie关联的域名.这样你可以将cookie分配给特定的子域名.注意不能设置跟服务器不同的域名/
 *      @param path 控制应用这个cookie的路径.注意路径会隐含地通配其后的路径.如果你的路径是/(默认值)它将会应用到所有网站的所有页面上.如果你使用的是/foo,则该cookie将会被应用到/foo /foo/fo上
 *      @param manAge 指定客户端应该保存cookie多长时间.单位是毫秒.如果省略则浏览器关闭时cookie会被清理.也可以使用expiration指定cookie的
 *      过期日期.
 *      @param secure 指定cookie只能通过Https发送
 *      @param httpOnly 指定cookie只能由服务器修改.可防范XSS攻击
 *      @param signed 设置为true会对这个cookie签名.这样就需要用res.signedCookies而不是res.cookies.被篡改的签名cookie会被服务器拒绝,并且cookie值会重置为它的原始值.
 * 
 */

/**
 * @dis 会话
 *    @param express-session 中间件
 *       app.use(require('cookie-parser')(credentials.cookieSecret))
 *       app.use(require('express-session')())
 *          
 *       express-session参数列表
 *         key - 存放唯一会话标识的cookie.默认为connect.sid
 *         store - 会话存储的实例.默认为一个MemoryStore的实例.可以满足我们当前的要求.
 *         cookie - 会话cookie的cookie设置(path domain secure)等.
 *   @dis 使用会话
 *      req.session.userName = 'Anonymous';
 *      var colorScheme = req.session.colorScheme || 'dark';
 *      
 *      移除:
 *          req.session.useName = null;
 *          delete req.session.colorScheme;
 * 
 * 
 * */ 


// 路由
app.get('/',(req,res) => {
  res.type('text/plain');
  res.send('根目录');
})

app.get('/about', (req, res) => {
  res.type('text/plain');
  // res.send('About');
  serveStaticFile(res, '/public/about.html', 'text/html');
  // res.set({key,value}) 可以设置请求头信息
})

app.post('/about/ff', (req, res) => {
  res.type('text/plain');
  console.log('post请求',req.body,req.params,req.body,req.session);
  res.send('请求ff成功');
})

// 404页面
app.use((req, res) => {
  res.type('text/plain');
  res.status(404);
  // res.send('./public/404.html')
  serveStaticFile(res, '/public/404.html', 'text/html');
});

// 500
app.use((err, req, res, next) => {
  console.log(err);
  res.type('text/plain');
  res.status(500);
  res.send('500')
});

app.listen(app.get('port'), () => {
  console.log('express start on 1234!');
});




// 处理请求的方法
const serveStaticFile = (res, path, contentType, responseCode) => {
  if (!responseCode) responseCode = 200;
  fs.readFile(__dirname + path, (err, data) => {
    if (err) {
      res.set({ 
        "Content-Type": "text/plain",
        "Connection":'close'
      });
      res.send('500 - Internal Error!');
    } else {
      res.set({ 
        'Content-Type': contentType,
        "Connection":'close'
      });
      res.send(data);
    }
  })
}