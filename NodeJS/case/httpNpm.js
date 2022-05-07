/**
 * @file 转发重定向npm请求路径
 */ 

const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  // 原生路由
  var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
  switch (path) {
    case '':
      serveStaticFile(res, '/public/home.html', 'text/html');
      break;
    case '/about':
      serveStaticFile(res, '/public/about.html', 'text/html');
      break;
    case '/img/logo.jpg':
      // 文件重定向 前端访问的其实是img/logo.jpg
      serveStaticFile(res, '/public/resource/Paper_Architecture_by_Dmitri_Popov.jpg', 'image/jpeg')
      break;
    default:
      getNpm(res, req.url, 'application/x-tgz');
      break;
  }
}).listen(1234);

console.log('serve start on 1234');

const serveStaticFile = (res, path, contentType, responseCode) => {
  if (!responseCode) responseCode = 200;
  fs.readFile(__dirname + path, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end('500 - Internal Error!');
    } else {
      res.writeHead(responseCode, { 'Content-Type': contentType });
      res.end(data);
    }
  })
}

const getNpm = (res, path, fileType) => {
  // res.end('ffff');
  let newPath = path;
  if (path.includes('onetime')) {
    newPath = path.replace('onetime', 'onetime/-/onetime-5.1.0.tgz');
  }

  console.log(path);
  if (path.includes('tslib')) {

    newPath = path.replace('tslib', 'tslib/-/tslib-1.9.0.tgz');

    console.log(newPath);
  }

  if (path.includes('whatwg-fetch')) {

    newPath = path.replace('whatwg-fetch', 'whatwg-fetch/-/whatwg-fetch-2.0.3.tgz');

    console.log(newPath);
  }
  http.get(`http://192.168.11.11/repository/npm/${newPath}`, (rq, rs) => {
    res.setHeader('Content-Disposition', 'attachment;filename="aa.tgz"')
    res.setHeader('Connection', 'close');
    res.setHeader('Content-Type', fileType);
    res.setHeader('Content-Security-Policy', 'sandbox allow-forms allow-modals allow-popups allow-presentation allow-scripts allow-top-navigation')
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    rq.on('data', (data) => {
      console.log('文件下载中');
      res.write(data);
    })
    rq.on('end', () => {
      res.end();
      console.log('文件下载完毕！')
    })
  })
}