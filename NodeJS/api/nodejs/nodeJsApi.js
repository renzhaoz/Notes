/**
 * @file nodeJs的起步Api
 */

// #1 导入模块
    var http = require('http'); // 导入局部模块
    exports.localInfo = 'windows node env!'; // 导入全局变量

// #2 创建http服务
    const server = http.createServer((req,res)=>{
      res.writeHead(200,{'Content-Type':'text/plain'}); // 设置头部信息
      fetchRouter(req,res);
      // 设置返回内容 多次设置不会覆盖 会叠加
      res.write('hi1');
      // 返回请求 若有值则值为返回值 若有res.write则值是相加的 返回hi1hi2 
      res.end('hi2'); 
    });

    server.listen(8888,()=>{
      console.log('Server running at port 8888');
    })



// #3 node事件

    /**
     * @dis node事件
     * 几乎所有的nide异步io操作都是在完成时发送一个事件到事件队列.
     * 这些事件的对象都是events.EventEmitter的实例.可以通过events模块来实例化node event
     * event对象通过on监听事件,可以多次监听 通过emit来激活事件,emit也可以激活error事件event.emit('error')
     * 
    */

    const Emitter = require('events').EventEmitter;
    const event = new Emitter();
    event.on('some_event',()=>{
      console.log('get event');
    });

    setTimeout(()=>{
      event.emit('some_event');
    },3000);

    // http 的event实例
    server.on('connection',()=>{
      console.log('some one connect server!');
    });
    server.once('connection',()=>{
      console.log('some one is the first visited!');
    });

    setTimeout(()=>{
      // remove
      server.removeListener('connection',()=>{});
      // server.removeAllListeners() // remove all
    },10240);


// #4 路由

    /**
     * @dis 为不同的url提供不同的返回和处理结果即为路由
     * 
     */

    const url = require('url');// 解析前台返回的url
    fetchRouter = (req,res) => {
      console.log(url.format(req.url));
      const pathName = url.parse(req.url).pathname;
      console.log(pathName);
    }


// #5 nodeJs全局变量

/**
 * 这里的全局变量对应的是nodeJs的Global Object.它所有的属性都可以在所有node文件中访问
 * @param {process} 描述当前nodeJs进程的对象 提供了一个与操作系统的简单接口,下面是它一些属性
 *  - argv
 *  - sdout 标准输出流 通常使用的console.log向标准输出打印字符 而process.stdout.write()函数提供了更底层的接口
 *  - stdin 标准输入流 起始是暂停状态 想要从标准输入读取数据 必须回复流 并手动编写流的事件响应函数
 *  - nextTick(callback) 为事件循环新增一项任务 node会在下次事件循环调用时调用其callback seTimeout是低效的实现
 * 
 * @param {console} 用于提供控制台标准输出 其有以下属性
 *  - log() 输出字节
 *  - error() 输出错误
 *  - trace() 输出当前的调用栈
 */


// #6 nodeJs常用方法Util

/**
 * @dis Util也是node的一个核心库 是一个工具的集合 用于弥补核心的功能 有下面的常用属性
 * @param {method} inherits 继承
 *    inherits(constructor, superConstructor) 是一个实现对象间原型继承的函数
 * 
 * @param {method} inspect 将任意对象转换为字符串
 *    inspect(object,[showHidden],[depth],[colors]))
 *    object必填
 *    showHidden 值为true将会输出更多隐藏信息
 *    depth 表示最大递归的层数 如果对象很复杂 可以指定输出信息的多少 默认为2层 null则遍历所有
 *    color true值表示将会以ANSI颜色编码
 * @param {methods} isArray isRegExp isDate isError
 * 
*/


// #7 文件管理系统fs

/**
 * @fs nodeJs的文件系统封装在fs模块中 提供了文件的读取 写入 更名 删除 遍历目录 链接等POSIX文件系统操作
 *  与其他语言文件模块不同的是fs提供了同步和异步操作文件的的两个版本.比如读取文件的readFile fs.readFileSync
 * @param {method} readFile 异步读取文件
 *  readFile(fileName,[encoding],[callback(err,data)]) 如果不指定encoding则文件将会是Buffer形式的二进制数据
 *  
 * @param {method} readFileSync 同步读取文件 与readFile不同的是没有callback 捕获错误需要使用try...catch...
 * 
 * @param {methods} open 打开/创建/写入/读取文件 POSIX open函数的封装 与c语言标准库fopen类似
 *  open(path,flags,[mode],[callback(err,data)])
 *    flags是访问文件的权限: r读取 r+读写 w写入模式不存在就创建 w+读写模式不存在就创建 a追加模式不存在就创建 a+读取追加模式不存在就创建 默认为读写
 * 
 * @param {methods} read 读取文件 可设置文件指针位置和大小 若非必要不要使用这种方式读取文件 需要手动管理缓冲区和文件指针 如果不知道文件大小则会很麻烦
 *  read(fd,buffer,offset,length,position,[callback(err,bytesRead,buffer)])
 *    target 读取数据并写入buffer指定的缓冲区对象
 *    offset buffer的写入偏移量
 *    length 从文件中读取到的字节数
 *    position 读取文件的起始位置 如果为null则会从当前文件指针的位置读取
 *    callback bytesRead和Read分别表示读取的字节数和缓冲区对象
 */




// #7 请求GET/POST...

/**
 * @dis http请求处理机制
 *    @GET get请求一般在路径中通过获取客户端路径则可以获取完整信息由url模块解析
 *      util.inspect(url.parse(request.url,true))
 *    
 *    @POST post请求的内容都在请求体中  http.ServerRequest并咩有一个属性内容为请求体 因为等待请求体传输是一件耗时的工作。
 *    例如文件上传,我们在很多时候不是不用理会请求体的内容,恶意的POST请求会大大消耗服务器的资源,所以nodejs默认是不会解析请求体的.
 *    当你需要请求体的时候需要你手动通过中间件实现.
 *    const querystring = require('querystring');
 *    post = querystring.parse(post); // 返回解析后的请求体信息
 *    
 *   
 * 
 * */ 

