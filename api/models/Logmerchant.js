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
    storename: {type: 'string',size: 50,defaultsTo: ''},//商户店名
    permissiontype: {type: 'string',size: 50,defaultsTo: ''},//角色权限类型
    params:{type:"string",defaultsTo: ''},
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:false,
  createTable: function (tableName, next) {


    var _this = this;
    this.query("show TABLES like '"+tableName+"'",function (err,tb) {
        if(tb.length<1){
          var createSql = "create table " + tableName + " like struct_logmerchant";
          _this.query(createSql, function (err, val) {
            var showTable = "show create table logmerchant";
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
              var alterSql = "ALTER TABLE `logmerchant` ENGINE=MRG_MYISAM,UNION=(" + unionTb.join(",") + ");";
              _this.query(alterSql, next);
            });

          });
        }else{
          next(null,tableName);
        }


    });

  },
  createLog: function (msg, next) {
    var self = this;
    var tableName = "logmerchant_" + ((new Date()).Format("yyyyMM"));
    self.createTable(tableName,function (err, table) {
      var keys = _.keys(msg);
      var vals = _.values(msg);
      var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + vals.join(",") + ")";
      self.query(sql, next);
    });
  },
};
/*
    
*/