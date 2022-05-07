/**
 * @dis POST 传递文件(img,zip,mp3等文件)
 * 在程序开发中文件上传也是一个非常常见，非常重要的功能.要处理上传的文件.需要把表单的enctype属性设置为multipart/form-data,这是一个适用于Blob(大型二进制文件)的MIME类型.
 * 以高效流畅的方式解析文件上传请求并不是一个简单的任务.在node社区中有比较优秀的插件.formidable就是其中之一(由FelixGeisendorfer为自己的创业公司Transloadit创建,用于媒体上传和转换,性能和可靠性都很关键).
 * formidable也是使用流式解析器的,所以在接受 解析文件时不会造成内存膨胀.
 */ 

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  switch(req.method){
    case "GET":
      showUploadPage(req, res);
      break;
    case "POST":
      handleUploadFile(req, res);
      break;
    default:
      // todo
  }
})  

showUploadPage = (req, res) => {
  const str = `
    <form method='post' action='/' enctype='multipart/form-data' >
      <p><input type='text' name='name' value='请输入文件名称' /></p>
      <p><input type='file' name='file' /></p>
      <p><input type='submit' name='submit' value='Upload' /></p>
    </form>
  `;

  res.setHeader('Content-Type','text/html;charset=utf8');
  res.setHeader('Content-Length',Buffer.byteLength(str));
  res.end(str);
}

handleUploadFile = (req, res) => {
  // 方法一
  res.setHeader('Content-Type','text/html;charset=utf8');
  req.pipe(fs.createWriteStream('./file'+req.url, {encoding:'utf8'}));
  res.end('上传成功!');

  // 方法二
  // console.log(req.file)
  // const data = [];
  // req.on('data',(chunk)=>{
  //   data.push(chunk);
  // });

  // req.on('end',()=>{
  //   const buffer = Buffer.concat(data);
  //   fs.writeFile('./a',buffer,(err)=>{
  //     if (err) {
  //       res.end('ok')
  //     }
  //   });
  // })
};

server.listen(3001, () => {
  console.log('Serve run on port 3001, upload can run!')
});
