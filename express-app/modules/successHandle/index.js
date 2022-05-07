// 错误处理的中间件

const successHandle = (req,res,next) => {
  res.successHandle = (status = 200,data='success') => {
    res.send({status, data});
  }

  next();
}

module.exports = successHandle;