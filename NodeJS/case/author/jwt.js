const express = require('express');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bodyParse = require('body-parser');
const cors = require('cors');

// 定义秘钥
const secret = 'this is a secret';

const app = express();
app.use(cors());
app.use(bodyParse.urlencoded({ extended: false }));

// 信息解密 使用该中间件后可以通过req.user信息访问解析后的jwt信息 客户端传递过来的token需要在token前拼接bearer
app.use(expressJwt({
  secret,
  algorithms: ['HS256'],
}).unless({ path: [/^\/user\//] })); // unless中配置的都是不需要访问权限的


// 信息加密 密码不要放到jwt中
app.post('/user/login', (req, res) => {
  if (req.user) {
    console.log(req);
    res.send({
      status: 200,
      message: '用户已经登录'
    });
  } else {
    console.log(req.body);
    res.send({
      status: 200,
      message: "login success",
      token: jwt.sign({ userName: 'xxx' }, secret, { expiresIn: 60 * 60 }) // 30秒内有效
    });
  }
});

app.all('/',(req,res)=>{
  console.log(req.user);
  res.send({status:200,message:'用户已经登录！'})
})


app.use((err, req, res, next) => {
  if (err) {
    res.send({ code: 503, message: '服务端错误,详细信息:' + err + '请求信息' + req.url });
  }

  next();
})


app.listen('6666', () => {
  console.log('serve is start on port 6666;');
})
