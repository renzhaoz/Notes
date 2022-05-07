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
      serveStaticFile(res, '/public/404.html', 'text/html');
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