/**
* Loguser.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    userid:{type:'integer',defaultsTo:0},//用户id
    usermobile: {type: 'string',size: 11,defaultsTo: ''},//用户手机
    username: {type: 'string',size: 50,defaultsTo: ''},//用户手机
    ipaddress: {type: 'string',size: 32,defaultsTo: ''},//用户ip
    controller: {type: 'string',size: 50,defaultsTo: ''},//控制器名称
    action: {type: 'string',size: 50,defaultsTo: ''},//控制器方法名
    params:{type:"string",defaultsTo: ''}
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:false,
  createTable: function (tableName, next) {

    var createSql = "create table " + tableName + " like struct_loguser";
    var _this = this;
    this.query(createSql, function (err, val) {
      var showTable = "show create table loguser";
      _this.query(showTable, function (err, table) {
        var createTableStr = table[0]["Create Table"];
        var unionTables = /.*UNION=\((.*)\).*/i.exec(createTableStr);
        var unionTb = [];

        if (unionTables&&unionTables[1] != undefined) {
          unionTb = unionTables[1].split(",");
        }
        if (unionTb.indexOf("`" + tableName + "`") == -1) {
          unionTb.push(tableName);
        }
        var alterSql = "ALTER TABLE `loguser` ENGINE=MRG_MYISAM,UNION=(" + unionTb.join(",") + ");";
        _this.query(alterSql, next);
      });

    });
  },
  createLog: function (msg, next) {
    var _this = this;
    var tableName = "loguser_" + ((new Date()).Format("yyyyMM"));
    this.query("show TABLES like '"+tableName+"'",function (err,tb) {
      if(tb.length>0){
          insertData();
      }else{
        _this.createTable(tableName,function (err, table) {
          insertData();
        });
      }
    });
     function insertData(){
       var keys = [], values = [];

       for (var key in msg) {
         keys.push(key);
         values.push("'" + msg[key] + "'");
       }
       console.log(keys,values);
       var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
       console.log(sql);
       _this.query(sql, next);
     }
  }
};
/*
    
*/