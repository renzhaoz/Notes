const user = require('../routes/users');

// 创建输入检测的中间件
const checkInput = (req,res,next) => {
  next();
}

const routers = (app)=>{
  // 处理所有user开头的
  app.use('/user/*',checkInput,user.get);
  app.use('/login/*',user.login);
  app.use('/data/',require('./data.js'));
}

module.exports = routers;
