module.exports={
attributes:{
  //充值的用户id
  userid: {type: 'integer',defaultsTo:0},
  //运营商 ID
  storeid: {type: 'integer',defaultsTo:0},
  // 操作员 id
  operatorid: {type: 'integer',defaultsTo:0},
  //充值用户名字
  username: {type: 'string',size: 100,defaultsTo: ''},
  //操作员名字
  operatorname: {type: 'string',size: 100,defaultsTo: ''},
  //充值前金额
  beforeprice: {type: 'float',size:'15,4',required: true},
  price: {type: 'float',size:'15,4',required: true},
  //充值金额
  //充值后金额
  afterprice: {type: 'float',size:'15,4',required: true}
  },
  autoPK: true,// ID
  autoCreatedAt:true,
  autoUpdatedAt:true,
  beforeCreate:function(values,cb){
    var _this = this;
    var tableName = "logaddmoney_" + ((new Date()).Format("yyyyMM"));
    this.query("show TABLES like '"+tableName+"'",function (err,tb) {
        if(tb.length>0){
          cb();
        }else{
          var createSql = "create table " + tableName + " like struct_logaddmoney";
          _this.query(createSql, function (err, val) {
            var showTable = "show create table logaddmoney";
            _this.query(showTable, function (err, table) {
              //console.log(table);
              var unionTb = [];
              if(table){
                var createTableStr = table[0]["Create Table"];
                var unionTables = /.*UNION=\((.*)\).*/i.exec(createTableStr);
                if (unionTables&&unionTables[1] != undefined) {
                  unionTb = unionTables[1].split(",");
                }
              }


              if (unionTb.indexOf("`" + tableName + "`") == -1) {
                unionTb.push(tableName);
              }
              var alterSql = "ALTER TABLE `logaddmoney` ENGINE=MRG_MYISAM,UNION=(" + unionTb.join(",") + ") INSERT_METHOD=LAST;";
              _this.query(alterSql, function (err,record) {
                cb();
              });
            });

          });
        }
    });




  }
};