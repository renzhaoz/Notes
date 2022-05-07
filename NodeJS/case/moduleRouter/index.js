const express = require('express');
const app = express();
const router = require('./router');

// 注册全局路由
app.use(router);
app.use('/other',router);

app.listen(3333,()=>{
  console.log('serve start on 3333');
})