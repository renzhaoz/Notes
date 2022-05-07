/**
 * @dis mongodb官方提供的基于nodejs的db操作插件 
 * 官网推荐尽量使用await的写法 .then写法返回结果有嵌套
 * 使用结论 - 不好用^__
 * mongoose是mongodb插件的再封装 建议在实际开发中使用mongoose
 * */ 

const MongoClient = require('mongodb').MongoClient;

class dbMgr{
  constructor({dbPath, dbName,tableName}){
    this.dbPath = dbPath;
    this.dbName = dbName;
    this.tableName = tableName;
  }

  async connectDB (){
    const DBClient = new MongoClient(this.dbPath); // 初始化DB管理实例
    const connectedDBClient = await DBClient.connect();
    const db = connectedDBClient.db(this.dbName); // 选择库
    const collection = db.collection(this.tableName); // 选择集合
    return collection;
  }

  async find (filter={},rule={}){
    const collection = await this.connectDB(); // 集合实例
    return collection.find(filter,rule).toArray();
  }
}

module.exports = dbMgr;