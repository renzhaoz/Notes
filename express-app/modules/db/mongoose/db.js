const mongoose = require('mongoose');

// 这里并没有在connect成功后再返回 mongoose. 因为mongoose会缓存用户操作 等到connect链接成功后再依次执行mongoose操作
// 若需要则使用await模式
mongoose.connect('mongodb://127.0.0.1:27017/test',{},(err)=>{
  if(err){
    console.log(err);
  } else {
    console.log('mongoose connect db success!');
  }
})

module.exports = mongoose;