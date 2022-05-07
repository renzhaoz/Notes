# Mongo操作手册

## 数据库管理

- ```db``` 查看当前数据库
- ```use dbName``` 切换当前数据库 没有也可以切换 当执行插入时会创建数据库
- ```db.dropDatabase()``` 删除数据库

## 集合管理

- ```show collections``` 查看当前数据库中的集合
- db.createCollection('name') 创建集合
- db.[name].drop(); 删除name集合



## 数据编辑

增删改查

### 新增

- ```db.collection.insertMany([{a:1,b:{b1:1},c:[1,2]},{a:2,b:{b1:2},c:[2,3]}])``` 插入多个数据 当db不存在时会创建数据库
- insert() 插入一个

### 更新

- update({query},{updateItem},addNew:Boolean,multi:Boolean,{writeContent}) 四个参数分别为过滤条件/更新的值/不存在时是否新建/是否只更新查找到的第一个/抛出异常的级别
- save(newItem,errorLv); 根据id替换数据

### 查询

- findOne(); 查询一个
- ```db.collection.find()``` 信息查询 当find的参数为{}时获取所有数据 返回结果有一些常用的回调用于返回格式化的数据例如.pretty(),.toArray()
- ```db.collection.find({"a":1})``` 按条件过滤 基本类型值
- ```db.collection.find({"b.b1":1})``` 按条件过滤 b.b1 = 1 值是对象
- ```db.collection.find({"b":{b1:2,b2:3}})``` 按条件过滤 多个value 值是对象 对象有多个值
- ```db.collection.find({"c":1})``` 按条件过滤 值是数组 数组其中一个值是1 如果是c的值是字符串则全等匹配
- ```db.collection.find({"c":[1,2]})``` 按条件过滤 值是数组[1,2] 数组长度 大小 顺序一致
- ```db.collection.find({},{a:1,b:1})``` 过滤返回0是不允许返回 1是允许返回 key是a 和 key是b的数据 默认返回_id 设置为{_id:0}则不返回

> 注意
> 查询结果有格式化方法和过滤方法
>
> 1. .sort({age:-1}) 按age排序倒叙
> 2. .toArray() 转为数组
> 3. .pretty() 美化(json)
> 4. .skip(10) 跳过前10条
> 5. .limit(10) 只获取10条
> 6. .skip().limit().sort() 可以链式使用
> 7. .count() 获取数据个数
> 8. .explain() 获取脚本执行时间

### 删除数据

- db.collection.remove({filleter},JustOne:number,errorLv); 删除符合条件的数据 和find类似 如果没条件就删除所有的 justOne若为1则只删除查找到的第一个数据


## 性能

### 建立索引

设置索引几乎是所有sql优化查询操作的性能优化操作(增加和修改时间会更耗时 但是查询的速度极优).

- db.use.ensureIndex({'uuid':1}) 创建集合索引

> 注意复合索引ensureIndex({'name':1,'age':1})
> 当如上使用复合索引时 通过name查询  name+age查询会命中索引 单独使用age查询并不会

- db.use.getIndexes() 获取集合索引
- db.use.dropIndex() 删除索引
- db.use.ensureIndex({'name':1},{'unique':true}) 设置唯一索引 被设置为主键的值不能重复


## 其他

- 条件或 > < >= <= !=
find({$or:[{age:{$gt:30}},{age:{$lt:20}}]}) 查询年龄大于30 或者 小于20的所有信息 >= <=使用$gte|$lte != 使用$ne

- 涵盖关系

find({name:/38/}) 包含
/^a/ a开头
/a$/ a结尾

- 条件类型过滤 $type:Number 值类型 2 - string
- $project只返回指定列

      db.use.aggregate([{$project:{age:1,name:1}}]) === db.use.find({},{age:1,name:1})

- $match 过滤
db.use.aggregate([{$project:{age:1,name:1}},{$match:{age:{$gte:18}}}]) 只返回age和name列且age >= 18

- $group 分组 $sum求和 $sort排序 $limit限制返回数量 $skip跳过几个

db.use.aggregate([{$group:{targetId:'$name',total:{$sum:'$age'}}}]); 按name进行分组  并对name相同的进行age求和 返回{targetId,total}

- $lookup 关联集合查询
表一 - user:{name,age,sex,shopId}; 
表二 - food:{price,num,age,shopId};

db.user.aggregate([{
  $lookup:{
    from:'food',
    localField:'shopId',
    foreignField:'shopId',
    as:'item' // 在user中新增列item 值为food匹配到的所有数据
  }
}]); // 从food和user中查询shopId相等的值 然后放置到user中并返回user:{name,age,sex,shopId,item:[{food:{price,num,age,shopId}}]} 

## 备份还原

带有密码的账户 -u -p指定用户及密码

- 备份 在cmd中执行以下命令

      mongodump -b dbHost:mongo的ip地址 -d dbName:库名 -o copyPath:要导出的路径

- 还原

      mongorestore -h dbhost -d dbName copyPath 
