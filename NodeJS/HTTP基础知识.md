# HTTP基础知识

本文主要说明一些HTTP通信过程中必要理解和了解的知识.包括以下几方面:

- URL
- http(了解模块参数)
- request
- response
- cookie(用法详解)
- 静态资源处理(返回HTML/css/js文件等)
- 会话(原理功能)

## URL

URL由以下几部分组成：

- 协议 http/https/ftp/file
- 主机名
- 端口
- 路径
- 查询字符串
- 信息片段 hash

## http

Node中的http模块和express中的时不一样的.

### NodeJs

- http.server 一个事件触发器的集合 有以下事件被监测:
request/connection/close/checkContinue(100状态码时)/upgrade(当客户端发送http upgrade时触发 若没有监听该事件 那么发起upgrade的连接会被终止)
/clientError/

- http.createServer((req,res)=>{}) 返回一个server对象 该对象有以下事件:
  listen(port, [hostname], [callback])(在指定端口和主机名上接受连接。如果hostname没有指定，服务器将直接在此机器的所有IPV4地址上接受连接(INADDR_ANY)。)/listen(path, [callback])(建立一个UNIX套接字服务器并在指定path路径上监听。)/close()(关闭服务)

- http.request(options, callback(res)) 发起HTTP请求 返回一个response实例(该实例有一个response事件只触发一次)
options - {host,port,method,path,headers}

      var options = { host: 'www.google.com', port: 80, path: '/upload', method: 'POST' };
      var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      });
      // write data to request body
      req.write('data\n');
      req.write('data\n');
      req.end();

- http.get(options,callback) 由于大部分请求是不包含正文的GET请求，Node提供了这个方便的方法。与http.request()唯一的区别是此方法将请求方式设置为GET，并且自动调用req.end()。
- http.Agent(host,port) 
- http.getAgent(host,port) http.request()使用一个特别的Agent代理来管理到一个服务器的多个连接，通常Agent对象不应该暴露给用户。但在某些特定的情况下，检测代理的状态是非常有用的。http.getAgent()函数允许你访问代理对象(监测代理对象状态)
- https.Server 类似http
- https.createServer 类似http
- https.request 类似http
- https.get 类似http

>HTTP协议发展至今,大部分HTTP协议的网站都切换到了HTTPS.甚至有的浏览器会明显的提示你HTTP网址链接是不安全的。HTTPS能保证你和服务器之间的数据是私密的。
在HTTP会话中客户端和服务器端用未经加密的文本交换信息。是的HTTP通信很容易被窃听.
>
>安全的HTTPS协议提供了一种保证WEB会话私密性的方法.HTTPS将HTTP和TLS/SSL传输成结合到一起。用HTTPS发送的数据是经过加密的。
>
>如果想在NodeJs中使用HTTPS.第一件事就是需要取得一个私钥和一份证书.私钥本质上是一个秘钥,用于解析客户端发给服务器的数据。
>私钥保存在服务器的一个文件里。放在一个不可信用户的无法轻易访问到的地方。这里是一个简单生成自签发证书的
例子.这种SSL证书不能用在正式网站上.因为当用户访问带有不可信证书的页面时浏览器会显示警告信息.常用语开发和测试过程中的
通信验证。

### Express

express中是没有http对象的 高度集成到了express实例中 只能通过express对象实例的一些方法来设置http参数.以下是部分信息。

  const app = express();

- app.set('port', 3000) 设置程序信息 以下是参数
  env/etag/query parse/strict routing/views/
- app.use(middleware) 使用中间件
- app.listen(port,callback) 监听端口
- app.on(event) 监听事件
    error/listening/mount('子程序被挂载到父程序时')
- app.all('/',callback) 监听所有connection
- app.static(root,[options]) 管理托管静态资源
    root - 静态资源根目录
    options - lastModified/maxAge/setHeader...
- app.route(); 设置程序路由
- app.render() 渲染视图模板
- app.engine 注册模板引擎(现在使用set设置)
- app.locals 程序信息
- app.mountpath 子程序挂载路径模式
- app.delete(path,callback) 刪除某一路径
- app.disable(name)  设置布尔类型的值为false
- app.enable(name) 设置为true
- app.get(name) 获取使用app.get设置的值
- app.get(path,callback) 监听发送到该服务的HTTP get请求 支持的请求如下:
put/post/get/lock/head/delete/copy/move/search/unlock/trace.....
- app.param([name],callback); 当存在/user/:userId这中类型存在时 name就是userId 用于监听url传参的数据做不同处理 只响应一次
- app.path() 返回当前路由的path信息

## Request

Request对象常作为创建服务回调函数的第一个参数返回,包含客户端请求的所有信息.设置测在客户端,服务测只进行读取。以下是部分参数.

NodeJs/Express的API几乎一致

- data事件 当接收到信息正文中的一部分时触发
- end事件 每次完全接受完信息后触发一次
- request.method 返回用户请求的方法
- request.url 用户请求的路径 常用url依赖库的parse解析为{href,search,query,pathname}
- request.header 获取请求头
- request.trailers 获取http尾部消息 只有在end事件被触发后才会有值
- request.httpVersion 
- request.setEncoding(encoding=null/utf8...) 设置此请求正文的字符编码
- request.pause() 暂停此请求的事件触发 对于控制上传很有效
- request.resume() 恢复
- request.connection Https请求使用request.connection.verifyPeer()和request.connection.getPeerCertificate()来获得客户端的认证详情
- request.params 返回一个数组 req的所有参数
- request.query 返回一个对象 URL查询字符串的键值对
- request.body POST请求的参数主体
- request.route 当前匹配路由的信息
- request.cookie/singnedCookies 返回一个从客户端返回的cookies对象
- request.headers 返回请求报头
- request.accepts([types]) 用来确定客户端是否接收一个或一组指定的文件类型
- request.ip 客户端的IP
- request.path 路径
- request.host 主机
- request.xhr ajax请求则值为true
- request.protocol 用于标识请求的协议http/https
- request.secure https则值为true
- request.url/originUrl 返回URL路径和字符串
- req.acceptedLanguages 返回客户端语言

## Response 请求

response响应对象 服务端要发送到客户端的响应对象,以下是部分参数(express中也可以使用NodeJs的API):

Express

- status() 状态码
- set(name,value) 设置响应头 一般不需要手动设置
- cookie(name,value,[options]) 设置cookie  需要中间件
- clearCookie(name,[options]) 清除客户端cookie值
- redirect([status],url) 重定向浏览器 默认重定向代码是302.通常尽量减少重定向,除非永久移动一个页面,此时应该使用301(永久移动)
- send(body) send(status,body) 向客户端发送响应及可选的状态码.express的默认内容类型是text/html.如果你想改为text/plain.则需要使用set方法.如果body是一个对象或者数组,响应会以JSON发送,这时推荐使用json()
- json() json(status,json) 向客户端发送JSON及可选的状态码
- jsonp(json) jsonp(status,json) 向客户端发送jsonp及可选的状态码
- type(type) 用于设置Content-Type头信息.相当于set(name,value)
- format(object) 允许根据接收请求报头Content-Type不同值发送不同的内容.
- attachment([filename])/download(path,[filename],[callback]) 这两种方法会将相应报头Content-Disposition设为attachment.这样浏览器就会选择下载而不是展现内容.你可以指定filename给浏览器作为对用户的提示.download()可以指定要下载的文件,attachment()只是设置报头.另外你需要将内容发送到客户端.
- sendFile(path,[option],[callback]) 根据路径读取指定文件并将内容发送到客户端.使用静态中间件并将发送到客户端的文件放在公共目录下.也可以根据条件在相同的url下提供不同的资源.
- links(links) 设置链接响应报头.这是一个专用的报头.在大多数应用程序中几乎没有用处
- locals render(view,[locals],callback) locals属性值是一个对象,包含用于渲染视图的默认上下文.render()使用配置的模板引擎渲染视图.render()的默认响应代码为200.使用status可以指定一个不同的代码

NodeJs

- response.writeContinue() 发送HTTP/1.1 100 continue消息给客户端 通知客户端可以发送请求的正文
- response.writeHead(statusCode, [reasonPhrase], [headers]) 设置响应头部信息 在write/end之后调用

      var body = 'hello world'; response.writeHead(200, { 'Content-Length': body.length, 'Content-Type': 'text/plain' });

- response.statusCode 设置状态码
- response.setHeader(name, value) 设置响应头
- response.getHeader(name)
- response.removeHeader(name)
- response.write(chunk,encoding='utf8') 响应部分写入数据 可以多次调用 会自动拼接内容
- response.addTrailers(headers) 响应中添加HTTP尾部头信息 仅当响应报文使用chunked编码时，尾部信息才会发送；否则（例如请求的协议版本为HTTP/1.0）它们会被抛弃而没有提示。
- response.end([data],[encoding]) 这个方法通知服务器所有的响应头和响应正文都已经发出；服务器在此调用后认为这条信息已经发送完毕。在每个响应上都必须调用response.end()方法 如果指定了data参数，就相当先调用response.write(data, encoding)再调用response.end()。
- response

### 编辑请求头

NodeJs

- res.setHeader(key, value)  设置请求头
- res.getHeader(key) 获取请求头
- res.removeHeader(key) 删除请求头

Express

- res.set({ key : value});
- res.type(''); 设置Content-Type
- res.status(200) 设置状态码
- res.send(); 设置数据

> 注意
    请求头的编辑一定要在res.write() 及 res.end()之前.
    如果可以尽量设置Content-Length属性.Buffer.byteLength('').
    设定该属性后会隐含禁用Node的块编码.因为要传递的数据更少所以会提升性能.

## 静态资源

### POST 传递文件(img,zip,mp3等文件)

  在程序开发中文件上传也是一个非常常见，非常重要的功能.要处理上传的文件.需要把表单的enctype属性设置为multipart/form-data,这是一个适用于Blob(大型二进制文件)的MIME类型.
  以高效流畅的方式解析文件上传请求并不是一个简单的任务.在node社区中有比较优秀的插件.formidable就是其中之一(由FelixGeisendorfer为自己的创业公司Transloadit创建,用于媒体上传和转换,性能和可靠性都很关键).
  formidable也是使用流式解析器的,所以在接受 解析文件时不会造成内存膨胀.

> 注意:
  data事件默认会提供Buffer对象.但是对于文本数据来说并不需要Buffer.而是需要ascii或者utf-8.此时就需要req.setEncoding(type)方法.
  req.setEncoding('utf8');
  req.on('data',(chunk)=>{
    console.log(chunk); // utf8编码的字符串
    // chunk解析需要使用node插件querystring.
    const qs = require('querystring');
    const parsedResult = qs.parse(chunk);
    console.log(parsedResult); // 解析过后的utf8数据
  });

### 创建一个简单的静态文件服务器

      const http = require('http');
      const parse = require('url').parse;
      const join = require('path').join;
      const fs = require('fs');
      const root = __dirname;

      const server = http.createServer((req, res)=>{
        const url = parse(req.url);
        // 获取将要获取的文件路径。如果URL的path值是/index.html. root的值是/public.则path值就是/public/index.html
        const path = join(root,url.pathname);

        const stream = fs.createReadStream(path);
        stream.on('data',(chunk)=>{
          res.write(chunk);
        });

        stream.on('end', () => {
          res.end();
        });
      })
      server.listen(3000);

> 注意:
__dirname的值是该文件所在目录的路径.

### 用pipe()优化数据传输

STREAM.PIPE()优化数据传输.虽然fs.ReadStream的工作机制以及它那种事件方式的灵活性很重要.但是node还实现了更高级的实现机制.Stream.pipe().用这个方法可以极大简化服务器的代码.

- 使用管道将数据流到客户端

      const server = http.createServer((req,res) => {
        const url = parse(req.url);
        const path = join(root, url.pathname);
        // 检查文件是否存在 并确定Content-Length
        fs.stat(path, (err, stat) => {
          if(err){
            // 其他错误
            if('ENOENT' === err.code){
              res.statusCode = 404;
              res.end('Not Found!');
            }else{
              res.statusCode = 500;
              res.end('Internal Server Error!');
            }
          } else {
            res.setHeader('Content-Length', stat.size);
            const stream = fs.createReadStream(path);
            stream.pipe(res); // res.send()将会在stream.pipe()内部调用
            stream.on('error', (err)=>{
              res.statusCode = 500;
              res.end('Internal Server Error');
            });
          }
        });
      })

> 管道和水管:
    把Node中的管道想象成水管对理解管道这个概念很有帮助.比如让某个源头流出来的水流到一个目的地,可以在中间加一个管道把他们连接起来.这样整个过程就可以一次完成。
    Node中的管道也是这样工作的.其中流动的是来自源头(ReadableStream)的数据,管道可以让它们'流动'到某个目的地(即WritableStream).你可以使用pipe方法把管道连接起来:
      ReadableStream.pipe(WritableStream);
    读取一个文件(ReadableStream)并把其中的内容写到另一个文件中(WritableStream)用的就是管道:
      const readStream = fs.createReadStream('./origin.txt');
      const writeStream = fs.createWriteStream('./target.txt');
      readStream.pipe(writeStream);
    所有ReadableStream都能接入任何一个WritableStream.比如HTTP请求(req)对象就是ReadableStream.你可以让其中的内容流动到文件中.
    req.pipe(fs.createWriteStream('./req-body.txt'));

## Cookie

cookie是为了解决HTTP通信无状态而产生的,会话也是.
cookie 的想法很简单：服务器发送一点信息，浏览器在一段可配置的时期内保存它。发送
哪些信息确实是由服务器来决定：通常只是一个唯一ID 号，标识特定浏览器，从而维持
一个有状态的假象。

### cookie参数

- domain
控制跟cookie 关联的域名。这样你可以将cookie 分配给特定的子域名。注意，你不能
给cookie 设置跟服务器所用域名不同的域名，因为那样它什么也不会做。常用于在子域名或二级域名内分享cookie(aaa.ba.com/bbb.ba.com)

      '.baidu.com'

- path 控制应用这个cookie 的路径。注意，路径会隐含地通配其后的路径。如果你用的路径
是/ （默认值），它会应用到网站的所有页面上。如果你用的路径是/foo，它会应用到
/foo、/foo/bar 等路径上
- maxAge 指定客户端应该保存cookie 多长时间，单位是毫秒。如果你省略了这一选项，浏览器
关闭时cookie 就会被删掉。（你也可以用expiration 指定cookie 过期的日期，但语法
很麻烦。我建议用maxAge。）
- secure 指定该cookie 只通过安全（HTTPS）连接发送。
- httpOnly 将这个选项设为true 表明这个cookie 只能由服务器修改。也就是说客户端JavaScript
不能修改它。这有助于防范XSS 攻击
- signed 设为true 会对这个cookie 签名，这样就需要用res.signedCookies 而不是res.cookies
访问它。被篡改的签名cookie 会被服务器拒绝，并且cookie 值会重置为它的原始值。加密秘钥一般使用cookie-parse(secret)进行加密和解密

### cookie的特点(缺点)

- cookie对用户来说不是加密的
- 用户可以删除或禁用cookie
- 一般的cookie可以被篡改
- cookie可以用于攻击
- 如果你滥用cookie，用户会注意到
- 如果可以选择，会话要优于cookie

> 为了解决cookie的各种为题 推荐放弃 会话也许是一个更好的选择. 若继续使用则必须解决以上问题.
> 被禁用 -> 拼接到url中
> 明文 -> 加密(混淆或者外化第三方凭证)
> 可读 -> httpOnly字段(没啥用)
> 攻击 -> 不要信任客户端返回的任何字节

### express中的cookie

使用中间件(cookie-parse)处理cookie信息.

      // 设置cookie秘钥
      app.use(require('cookie-parser')(cookieSecret));
      res.cookie('monster', 'nom nom'); // 不加密
      res.cookie('signed_monster', 'nom nom', { signed: true }); // 加密的cookie
      
      // 获取cookie
      req.cookies.a // 获取非加密cookie
      req.signedCookies.b // 获取加密cookie
      
      // 清理cookie
      res.clearCookie('name')

> 能不用cookie就不要使用cookie

### 会话

会话实际上只是更方便的状态维护方法。要实现会话，必须在客户端存些东西，否则服
务器无法从一个请求到下一个请求中识别客户端。通常的做法是用一个包含唯一标识的
cookie，然后服务器用这个标识获取相应的会话信息。cookie 不是实现这个目的的唯一手
段，在“cookie 恐慌”的高峰时期（当时cookie 滥用的情况非常猖獗），很多用户直接关
掉了cookie，因此发明了其他维护状态的方法，比如在URL 中添加会话信息。这些技术
混乱、困难且效率低下，所以最好别用。HTML5 为会话提供了另一种选择，那就是本地
存储，但现在还没有令人叹服的理由去采用这种技术而放弃经过验证有效的cookie。
从广义上来说，有两种实现会话的方法：把所有东西都存在cookie 里，或者只在cookie 里
存一个唯一标识，其他东西都存在服务器上。前一种方式被称为“基于cookie 的会话”，
并且仅仅表示比使用cookie 便利。然而，它还意味着要把你添加到cookie 中的所有东西
都存在客户端浏览器中，所以我不推荐用这种方式。只有在你知道自己只存少量信息，并
且不介意用户能够访问这些信息，而它也不会随着时间的增长而失控时，你才可以用这
种方式。如果你想采取这种方式，请查阅中间件cookie-session。

所以要维持会话需要分别在客户端和服务端存储会话信息:
客户端:

  1. cookie
  2. localStore
  3. sessionStore

服务端:

  1. 文件(多人操作 文件锁)
  2. 数据库
  3. 内存存储(重启丢失,多服务器丢失)

### express-session

express-session 接受带有如下选项的配置对象：

- key 会话名称 默认为connect.sid
- store 会话存储的实例 默认为一个MemoryStore 的实例，可以满足我们当前的要求。第13
章将会介绍如何使用数据库存储。
- cookie 会话 cookie 的 cookie设置（ path、domain、secure 等）。适用于常规的 cookie默认值

### 使用会话

当express-session配置好后session就可以使用和编辑了.

- 访问
req.session.[sessionName]

- 刪除
delete req.session.[sessionName]

> 注意:
当你想跨页保存用户的偏好时，可以用会话。会话最常见的用法是提供用户验证信息，你
登录后就会创建一个会话。之后你就不用在每次重新加载页面时再登录一次。即便没有用
户账号，会话也有用。网站一般都要记住你喜欢如何排列东西，或者你喜欢哪种日期格
式，这些都不需要登录。
尽管我建议你优先选择会话而不是cookie，但理解cookie 的工作机制也很重要（特别是
因为有cookie 才能用会话）。它对于你在应用中诊断问题、理解安全性及隐私问题都有
帮助。