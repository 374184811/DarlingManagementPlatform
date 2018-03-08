/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    userid:{type:'integer',defaultsTo:0},//用户id
    username: {type: 'string',size: 50,defaultsTo: ''},//用户名
    ipaddress: {type: 'string',size: 32,defaultsTo: ''},//用户ip
    controller: {type: 'string',size: 50,defaultsTo: ''},//控制器名称
    action: {type: 'string',size: 50,defaultsTo: ''},//控制器方法名
    gname:{type:'integer',defaultsTo:0},//组id
    params:{type:"string",defaultsTo: ''}
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:false,
  createTable: function (tableName, next) {

    var createSql = "create table " + tableName + " like struct_logsystem";
    var _this = this;
    Logsystem.query(createSql, function (err, val) {
      var showTable = "show create table logsystem";
      _this.query(showTable, function (err, table) {
        var unionTb = [];
        if(table&&table.length>0){
          var createTableStr = table[0]["Create Table"];
          var unionTables = /.*UNION=\((.*)\).*/i.exec(createTableStr);

          if (unionTables&&unionTables[1] != undefined) {
            unionTb = unionTables[1].split(",");
          }
        }
        if (unionTb.indexOf("`" + tableName + "`") == -1) {
          unionTb.push(tableName);
        }
        var alterSql = "ALTER TABLE `logsystem` ENGINE=MRG_MYISAM,UNION=(" + unionTb.join(",") + ");";
        _this.query(alterSql, next);
      });

    });
  },
  createLog: function (msg, next) {
    var _this = this;
    var tableName = "logsystem_" + ((new Date()).Format("yyyyMM"));
    this.query("show TABLES like '"+tableName+"'",function (err,tb) {

      if(tb.length>0){
        console.log("不创建表");
        var keys = [], values = [];
        console.log("系统");
        for (var key in msg) {
          keys.push(key);
          values.push("'" + msg[key] + "'");
        }

        var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
        console.log(sql);
        _this.query(sql, next);

      }else{
        _this.createTable(tableName,function (err, table) {
          var keys = [], values = [];
          console.log("系统");
          for (var key in msg) {
            keys.push(key);
            values.push("'" + msg[key] + "'");
          }

          var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
          console.log(sql);
          _this.query(sql, next);
        });
      }
    });

  },
};
/*
    
*/