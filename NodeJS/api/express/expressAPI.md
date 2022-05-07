# express

express主要包含以下内容:

- express属性方法
- 路由控制
- 模板解析支持
- 动态视图
- 用户会话
- CSRF保护
- 静态文件服务
- 错误控制器
- 访问日志
- 缓存
- 插件支持

## express实例属性

- express.set('port', 3000) 设置程序信息 以下是参数
  env/etag/query parse/strict routing/views/
- express.use(middleware) 使用中间件
- express.listen(port,callback) 监听端口
- express.on(event) 监听事件
    error/listening/mount('子程序被挂载到父程序时')
- express.all('/',callback) 监听所有connection
- express.static(root,[options]) 管理托管静态资源
    root - 静态资源根目录
    options - lastModified/maxAge/setHeader...
- express.route(); 设置程序路由
- express.render() 渲染视图模板
- express.engine 注册模板引擎(现在使用set设置)
- express.locals 程序信息
- express.mountpath 子程序挂载路径模式
- express.delete(path,callback) 刪除某一路径
- express.disable(name)  设置布尔类型的值为false
- express.enable(name) 设置为true
- express.get(name) 获取使用express.get设置的值
- express.get(path,callback) 监听发送到该服务的HTTP get请求 支持的请求如下:
put/post/get/lock/head/delete/copy/move/search/unlock/trace.....
- express.param([name],callback); 当存在/user/:userId这中类型存在时 name就是userId 用于监听url传参的数据做不同处理 只响应一次
- express.path() 返回当前路由的path信息

## 路由控制

### 起步API

express路由处理一般使用中间件的逻辑处理复杂路由.例下:

      // 添加对应路径的路由处理
      app.use('/', indexRouter);
      
      // indexRouter
      var express = require('express');
      var router = express.Router();
      router.get('/', function(req, res, next) {
        // 渲染服务端view视图ejs
        res.render('index', { title: 'Express' });
      });
      module.exports = router;

### REST处理

express支持同一路径绑定多个路由响应函数.但是需要调用中间件的next方法.否则只有第一个路由控制生效.

      app.all('/user',(req,res,next)=>{
        res.send('uesr');
        next();
      });
      app.get('user',(req,res)=>{
        res.send('user')
      });

- app.get(url,callback) 处理get请求
- app.post(url,callback) 处理post请求
- app.all(url,callback) 提取相似接口的共同处理逻辑,降低代码耦合度,如下逻辑可能需要使用:
  1. 检查会话信息
  2. 验证token
  3. 记录特殊用户


