/*
 Mailprototype.js
 个人邮件表模板
 Mail_id
 */
module.exports = {
    attributes: {

        content: {type: 'text', defaultsTo: ''},//邮件内容
        title: {type: 'string', defaultsTo: ''},//邮件内容
        //运营商商家商户 ID
        storeid: {type: 'integer', defaultsTo: 0},
        senderid: {type: 'integer', defaultsTo: 0},//发送者ID
        sendername: {type: 'string', size: 100, defaultsTo: ''},//发送者名称
        sendavatar: {type: 'string', size: 255, defaultsTo: ''},//发送者图像
        rid: {type: "integer", size: 11}, //接受者id
        receiver: {type: "string", size: 32},//接受者用户名
        isdelete: {type: 'integer', defaultsTo: 0},//是否删除。1：删除；0：无删除
        type: {type: 'integer', defaultsTo: 0},//邮件类型 0：普通邮件 1：系统邮件
        status: {type: "integer", defaultsTo: 0},//1已经读取,
        sign: {type: "string", size:20, unique:true},
    },
    autoPK: true,//id
    autoCreatedAt: true,//创建时间
    autoUpdatedAt: true,//更新时间
    createTable: function (tableName, next) {
        var createSql = "create table " + tableName + " like usermsg_1";
        var _this = this;
        this.query(createSql, function (err, val) {
            var showTable = "show create table usermsgprototype";
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
                var alterSql = "ALTER TABLE `usermsgprototype` ENGINE=MRG_MYISAM,UNION=(" + unionTb.join(",") + ");";
                console.log(alterSql);
                _this.query(alterSql, next);
            });

        });
    },
    createTableByUid: function (uid, next) {
        var tableName = "usermsg_" + (uid / 50);
        this.createTable(tableName, next);
    },
    /**
     * 发送消息
     */
    sendMsg: function (msg, next) {
        var tableName = "usermsg_" + (msg.rid % 50);
        var _this = this;
        this.query("show tables like '"+tableName+"'",function (err,tables) {
            if(err){
                next(err,{code:412,msg:"服务器错误"});
            }
            if(tables.length>0){
                insertData(msg,next);
            }else{
                _this.createTable(tableName, function (err, record) {
                    console.log(msg);
                    insertData(msg,next);
                })
            }

        });
        function insertData(msg,next){
            var keys = [], values = [];

            for (key in msg) {
                keys.push(key);
                values.push("'" + msg[key] + "'");
            }

            var sql = "insert into " + tableName + "(" + keys.join(",") + ") values(" + values.join(",") + ")";
            _this.query(sql, next);
        }
    }

};
