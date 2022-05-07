/**
 * @module 路由处理
 *  每个url对应一个独立的处理程序
 *  带有参数的req需要对每一项参数进行安全验证
 * */ 

var express = require('express');
// var router = express.Router();

exports.get = function(req, res,next) {
  res.successHandle(200,'user/info 获取成功！');
};

exports.login = (req,res,next)=>{
  res.successHandle(200,'用户登录！');
}

// post 
// delete 
// ...