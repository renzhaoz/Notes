/**
 * @发起HTTP请求
 * 当nodejs作为客户端与远程服务通信时则需要发起http请求
 */

// 方法一
var options = {
  hostname: 'www.example.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

var request = http.request(options, function (response) { });
request.write('Hello World');
request.end();

// 方法二
http.get('http://www.example.com/', function (response) {
  var body = [];
  console.log(response.statusCode);
  console.log(response.headers);
  response.on('data', function (chunk) {
    body.push(chunk);
  });
  response.on('end', function () {
    body = Buffer.concat(body);
    console.log(body.toString());
  });
});