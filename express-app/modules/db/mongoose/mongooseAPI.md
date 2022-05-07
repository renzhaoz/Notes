# mongoose使用

## 快速起步

      // db.js
      const mongoose = require('mongoose');

      mongoose.connect('mongodb://127.0.0.1:27017/test',{},(err)=>{
        if(err){
          console.log(err);
        } else {
          console.log('mongoose connect db success!');
        }
      })

      module.exports = mongoose;

      const mongoose = require('./db');

      // 这里对存储数据的类型做静态检查 如果不符合是不能存储的
      const UserSchema = mongoose.Schema({
        title:String,
        time:Number,
        message:String,
        img:String,
        status:{
          type:Number,
          default:1,
          index:true, // 设置索引
          unique: true, // 设置唯一索引
        },
        url:{
          type:String,
          // set(value){
          //   // 这里可以对url进行格式化处理
          // }
          // trim:true
        }

      });

      const UserModel = mongoose.model('News',UserSchema,'news');

      module.exports = UserModel;

      // find
      const UserModel = require('./modules/db/mongoose/user');
      UserModel.find({},(err,data)=>{
        if(err){
          console.log(err);
          return;
        }
        // console.log(data)
      });

      // save
      const users = new UserModel({
        name:'String',
        time:123123,
        message:'String',
        img:'String',
      });
      users.save((err)=>{
        if(err){
          console.log('add news failed！',err);
        }
      })

## API

### mongoose.Schema的实例示例

### 静态检测

常见的静态类型检测:
type|default|index|match|require|max|min|enum|maxlength|minlength|validate

      const Comment = new Schema({
        name: { type: String, default: 'hahaha' },
        age: { type: Number, min: 18, index: true },
        bio: { type: String, match: /[a-z]/ }, // match正则匹配
        date: { type: Date, default: Date.now,trim:true },
        type:{
          type:String,
          enum:['x1','x2','g2']
        },// 枚举
        buff: Buffer,
        game:{
          type:String,
          validate:function(val){
            //自定义检测器
            return val.includes('_game');
          }
        }
      });

      // a setter 定义实例的set方法
      Comment.path('name').set(function (v) {
        return capitalize(v);
      });

      // middleware 定义中间件
      Comment.pre('save', function (next) {
        notify(this.get('email'));
        next();
      });

      // 定义全局属性 可以在model实例中调用
      Comment.statics.findName = ()=>{}

### model实例的方法和参数

      // model调用find方法 其他的方法如下展示
      mongoose.model('News',UserSchema,'news').find({},()=>{})

type MongooseDocumentMiddleware = 'validate' | 'save' | 'remove' | 'updateOne' | 'deleteOne' | 'init';

type MongooseQueryMiddleware = 'count' | 'deleteMany' | 'deleteOne' | 'distinct' | 'find' | 'findOne' | 'findOneAndDelete' | 'findOneAndRemove' | 'findOneAndUpdate' | 'remove' | 'update' | 'updateOne' | 'updateMany';

## mongoose中使用管道

管道的使用基本和mingodb的命令行操作一致.

### 两个表之间的关联查询

      const model = mongoose.model('Collection',UserSchema,'collection1'); // 实例名称 映射集合 表名
      model.aggregate([
        {
          $lookup:{
            from:'collection2',
            localField:'collection1KeyName',
            foreignField:'collection2KeyName',
            as:'item' // 在user中新增列item 值为food匹配到的所有数据
          }
        } 
        //从collection1和collection2中查询localField和foreignField相等的数据集合 然后给collection1匹配到相等的数据新建属性item 值是collection2匹配到相等的整条数据
      ],()=>{}); //这里的用法和mongodb命令行一致


### 多个表之间的关联查询

      model.aggregate([
        {
          $lookup:{
            from:'collection2',
            localField:'collection1KeyName',
            foreignField:'collection2KeyName',
            as:'item' // 在collection1中新增列item 值为匹配到的collection2整条数据
          }
        },
        {
          $lookup:{
            from:'collection3',
            localField:'collection1KeyName',
            foreignField:'collection3KeyName',
            as:'newItem'
          }
        }
      ]
    )