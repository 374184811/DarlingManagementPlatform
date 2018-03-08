/**
 * Loguserlogin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        userid: {type: 'integer', defaultsTo: 0},//用户id
        username: {type: 'string', size: 50, defaultsTo: ''},//用户名
        ipaddress: {type: 'string', size: 32, defaultsTo: ''},//用户ip
        islogin: {type: 'integer', defaultsTo: 0}//1:登录  2:登出  3:新增
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: false,
    createTable: function (tableName, next) {
        var _this = this;
        this.query("show TABLES like '"+tableName+"'",function (err,tb) {
            console.log("表",tb,tableName);
            if(tb.length<1){

                var createSql = "create table " + tableName + " like struct_loguserlogin";
                _this.query(createSql, function (err, val) {

                    var showTable = "show create table loguserlogin";
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
                        var alterSql = "ALTER TABLE `loguserlogin` ENGINE=MRG_MYISAM,UNION=(" + unionTb.join(",") + ");";
                        _this.query(alterSql, next);
                    });
                });
            }else{
                next(null,tb);
            }
        });

    },
    createLog: function (msg, next) {
        var _this = this;
        var tableName = "loguserlogin_" + ((new Date()).Format("yyyyMM"));
        this.createTable(tableName,function (err, table) {
            var keys = [], values = [];

            for (var key in msg) {
                keys.push(key);
                values.push("'" + msg[key] + "'");
            }

            var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
            _this.query(sql, next);
        });
    }
}

;
