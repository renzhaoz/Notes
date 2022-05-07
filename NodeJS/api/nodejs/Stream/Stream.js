/**
 * @file NodeJs核心概念 流
 *  流的处理逻辑相当于分片操作 将大型流程分为很小的步骤执行 在资源利用  性能优化等方面有很好的实践
 *  request就是流的一个实例 还有输出实例stdout.
 *  所有的Stream都是EventEmitter的实例.有以下事件:
 *    - data 有数据可读时触发
 *    - end 没有数据可读时触发
 *    - error 出错时触发
 *    - finish 所有数据已被写入到底层系统时触发
 *    
 *  流有以下类型:
 *    - Readable 可读操作
 *    - Writable 可写操作
 *    - Duplex 可读可写
 *    - Transform 操作被写入数据,然后读出结果
 */


// #1 读取数据
const fs = require('fs');

let data = '';
// 创建可读流
const readerStream = fs.createReadStream('./data.text');
//设置编码格式
readerStream.setEncoding('UTF8');

readerStream.on('data', (res) => {
  console.log(res, '________________________________________________');
  data += res;
});

readerStream.on('end', () => {
  console.log('end');
});

readerStream.on('error', (err) => {
  console.log(err, 'error');
});

console.log('end');


// #2 写入
const writeStream = fs.createWriteStream('./data.text');
writeStream.write('你好啊', 'UTF8'); // 该操作会清理原文件中的所有内容
writeStream.write('你好啊', 'UTF8'); // 拼接
// 标记文件末尾
writeStream.end();
writeStream.on('finish', () => {
  console.log('写入完成@')
});


// #3 管道流
/**
 * @dis 管道流提供了一个输出流到输入流的机制.通常用于从一个流中获取数据并将数据传递到另一个流中.常用于处理大文件操作
 */

const read = fs.createReadStream('./data.text'); // 读
const write = fs.createWriteStream('./target.txt'); // 流入对象
read.pipe(write); // 将从read中读取到的数据流入write中

// 流具有链式操作的特点如下:
// 1. fs.createReadStream('./data.text').pipe(fs.createWriteStream('./target.txt'));
// 2. fs.createReadStream('input.txt.gz').pipe(zlib.createGunzip()).pipe(fs.createWriteStream('input.txt'));// 解压操作





/**
 * @重点
 *  - 当内存中无法一次装下需要处理的数据时 推荐使用流(大文件的拷贝/移动/写入)
 *  - 当写入文件时 写入文件速度小于读取速度 缓存爆仓(例1处理) pipe内部也实现了如例子的实现
 * 
 */

// 大型文件读取速度大于写入速度
var rs = fs.createReadStream(src);
var ws = fs.createWriteStream(dst);
rs.on('data', function (chunk) {
  if (ws.write(chunk) === false) {
    rs.pause();
  }
});
rs.on('end', function () {
  ws.end();
});
ws.on('drain', function () {
  rs.resume();
});