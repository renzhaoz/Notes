const mongoose = require('./db');

const Schema = mongoose.Schema;

// 这里对存储数据的类型做静态检查 如果不符合是不能存储的
const NewsSchema = Schema({
  author:Schema.ObjectId, // ObjectIds是一个无序的24个16进制的字符串 或者任意12个字节的字符串也是合适的
  title:String,
  time:Number,
  message:String,
  img:String,
  status:{
    type:Number,
    default:1
  },
  url:{
    type:String,
    set(value){
      // 这里可以对url进行格式化处理
    },
    trim:true,
    match:/[a-zA-z]/
  }
});

// 定义全局变量方法
NewsSchema.statics.get1647834782104 = function(callback){
  this.find({time:1647834782104},(err,docs)=>{
    callback(err,docs);
  })
}

module.exports = NewsSchema;