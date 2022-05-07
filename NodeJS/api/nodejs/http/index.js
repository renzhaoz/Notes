/**
 * @http模块
 * 请先查阅HTTP基础知识然后了解nodeJs的http就更简单了
 * node的http服务一般由http模块负责 创建http/https方法createServer
 * 其他:
 *    - url模块
 *    - zlib模块(开启gzip)
 *    - Net(创建socket服务)
 */

/**
 * @http请求
 */

http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  request.on('data', function (chunk) {
    response.write(chunk);
  });
  request.on('end', function () {
    response.end();
  });
}).listen(80);

/**
 * @https请求
 * https请求需要证书 nodejs可以根据域名不同添加多个证书
 */

var options = {
  key: fs.readFileSync('./ssl/default.key'),
  cert: fs.readFileSync('./ssl/default.cer'),
  rejectUnauthorized: false // 当页面出现证书安全问题时开启该选项则会屏蔽证书有效性的检查
};
var server = https.createServer(options, function (request, response) {
  // ...
});

server.addContext('foo.com', {
  key: fs.readFileSync('./ssl/foo.com.key'),
  cert: fs.readFileSync('./ssl/foo.com.cer')
});
server.addContext('bar.com', {
  key: fs.readFileSync('./ssl/bar.com.key'),
  cert: fs.readFileSync('./ssl/bar.com.cer')
});


/**
 * @URL 服务端获取的客户端发起请求的路径的对象
 *  URL对象属性：
 *  - 协议 http/https/ftp/file
 *  - 主机名
 *  - 端口
 *  - 路径
 *  - 查询字符串
 *  - 信息片段 hash
 * 
 * 从客户端发起的请求中获取的url是一个字符串 要转化为URL对象 需要使用url.parse(url)方法一
 * 从URL转为url则使用url.format(URL)方法
 * 拼接URL可以使用url.resolve(url,newPathName) 只拼接pathName
 * querystring.parse(url) 用于将url拼接的参数转为obj对象
 */

url.parse('http://user:pass@host.com:8080/p/a/t/h?query=string#hash');
/* =>
{ protocol: 'http:',
auth: 'user:pass',
host: 'host.com:8080',
port: '8080',
hostname: 'host.com',
hash: '#hash',
search: '?query=string',
query: 'query=string',
pathname: '/p/a/t/h',
path: '/p/a/t/h?query=string',
href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash' }
*/

/**
 * @zlib 开启gzip优化
 */

// 压缩
http.createServer(function (request, response) {
  var i = 1024,
    data = '';
  while (i--) {
    data += '.';
  }
  if ((request.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
    zlib.gzip(data, function (err, data) {
      response.writeHead(200, {
        'Content-Type': 'text/plain',
        'Content-Encoding': 'gzip'
      });
      response.end(data);
    });
  } else {
    response.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    response.end(data);
  }
}).listen(80);


// 解压
var options = {
  hostname: 'www.example.com',
  port: 80,
  path: '/',
  method: 'GET',
  headers: {
    'Accept-Encoding': 'gzip, deflate'
  }
};
http.request(options, function (response) {
  var body = [];
  response.on('data', function (chunk) {
    body.push(chunk);
  });
  response.on('end', function () {
    body = Buffer.concat(body);
    if (response.headers['content-encoding'] === 'gzip') {
      zlib.gunzip(body, function (err, data) {
        console.log(data.toString());
      });
    } else {
      console.log(data.toString());
    }
  });
}).end();

/**
 * @Net Socket
 * node默认并发Socket最大为5个 超过时就会报错socket hang up
 * 可以通过该数据设置最大并发数http.globalAgent.maxSockets
 */

var options = {
  port: 80,
  host: 'www.example.com'
};
var client = net.connect(options, function () {
  client.write([
    'GET / HTTP/1.1',
    'User-Agent: curl/7.26.0',
    'Host: www.baidu.com',
    'Accept: */*',
    '',
    ''
  ].join('\n'));
});
client.on('data', function (data) {
  console.log(data.toString());
  client.end();
});