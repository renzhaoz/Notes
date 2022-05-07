// 错误处理的中间件

const errorHandle = (req,res,next) => {
  res.errorHandle = (status,message) => {
    res.send({status:status || 503,message:message || 'unKnow Error!'});
  }

  next();
}

module.exports = errorHandle;