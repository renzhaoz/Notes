# 常用工具及模块



## 热加载 supervisor/nodemon

热加载nodejs脚本
      supervisor main.js


## 调试debug

- 命令行调试
      node debug main.js

- 远程调试

      // 开启远程调试
      node --debug[=port] main.js
      node --debug-brk[=port] main.js

      // 连接远程调试
      node debug ip:port

- 第三方工具
  node-inspector vscode

- http.ClientRequest
  由http.request或者http.get返回产生的对象.表示一个已经产生而且正在进行中的http请求.

- express 快速开始工具
大多数情况下都是不需要从0开始搭建express的,express也有自己的快速开始工具. express在初始化的时候需要指定模板引擎默认支持Jade和ejs. ejs相对比较简单.

## 日志/监控(express-winston/原生/connect.loggger/paperail)

express需要手动收集日志和错误信息.通过中间件的形式实现.

      // 入口文件
      var fs = require('fs');
      var accessLogFile = fs.createWriteStream('access.log',{flags:'a'});
      var errorLogFile = fs.createWriteStream('error.log',{flags:'a'});
      
      // app.configure
      // 访问信息收集
      app.use(express.logger({stream: accessLogfile}));

      // 错误信息通过error函数收集
      app.error(function(err,req,res,next){
        var mate = `${new Date()}-${req.url} \n`;
        errorLogFile.write(`${meta}-${err.stack} \n`);
        next();
      })

监控的信息来自process全局变量!

## 服务运行监控 确认你的程序在正常运行中

UptimeRobot/Pingdom/Site24x7/Sentry/Airbrake


## 压力测试

loadtest/NodeloadApacheBench(仅apache可用)


## 调试

node inspect path 在node程序中启用调试(timeout...)
node --inspect path 在chrome devtools中调试程序(打断点没用？)


## 内存管理垃圾回收

基于V8的内存分配是有限制的(分配越大的内存,垃圾回收时将会耗费更多的资源和耗时,对程序的正常运行会有很大的影响),这个限制是可以解开的

      node --max-old-space-size=1700 test.js // 单位为MB
      node --max-new-space-size=1024 test.js // 单位为KB

> 查看垃圾回收日志信息:
> node --trace_gc -e "var a = [];for (var i = 0; i < 1000000; i++) a.push(new Array(100));" > gc.log
> linux-tick-processor/windows-tick-processor.bat用于查看日志信息

- 内存泄漏排查

1. v8-profiler 获取v8堆内存快照
2. node-heapdump 获取v8堆内存快照
3. node-mtrace 使用了GCC的dtrace工具来分析内存泄漏
4. dtrace 在SmartOS系统上有完善的dtrace工具来分析内存泄漏
5. node-memwatch Mozilla贡献的模块

- 大文件/大内存应用操作
有些文件和模块本身的运行就超出了v8的内存限制.一般我们使用stream模块处理。

      var reader = fs.createReadStream('in.txt');
      var writer = fs.createWriteStream('out.txt');
        reader.on('data', function (chunk) {
        writer.write(chunk);
      });
      reader.on('end', function () {
        writer.end();
      });

      // 更简洁的写法
      var reader = fs.createReadStream('in.txt');
      var writer = fs.createWriteStream('out.txt');
      reader.pipe(writer);


## Buffer

- 乱码

Buffer对象的操作和编辑一定要设置编码.setEncoding()/string_decoder()否则可能造成文档乱码.

> 注意:
> 实际上setEncoding可以解决大部分乱码的情况但不是全部.所以要正确使用buffer还得要正确拼接Buffer.
> 要正确拼接Buffer最简单的+=方式肯定是不行的,正确的做法是用一个数组来存储接收到的所有buffer片段并记 录片段的总长度,然后调用Buffer.concat()方法生成一个合并的Buffer对象.如下示例

      var chunks = [];
      var size = 0;
      res.on('data', function (chunk) {
        chunks.push(chunk);
        size += chunk.length;
      });
      res.on('end', function () {
        var buf = Buffer.concat(chunks, size);
        var str = iconv.decode(buf, 'utf8');
        console.log(str);
      });


## 网络编程

node提供了net、dgram、http、https四个模块分别对应处理TCP/UDP/HTTP/HTTPS请求.



## mkdirp 目录管理 可以创建带有层级的目录



## OAuth 安全/授权/鉴权

passport/jwt/express-session




## 部署/维护/性能

Forever 程序崩溃之后自动重启
cluster2 集群管理 负载均衡基于cluster的二次封装
Nginx 负载均衡 端口调配
hook.io 分布式集群管理
PM2 提供健壮性的node服务类似Forever
Upstart 维护管理基于linux的程序
varnish 负载均衡 请求缓存


## 数据存储

redis 当使用node_redis时 选择hiredis会显著提升redis性能














