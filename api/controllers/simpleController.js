var tasks = require('../lib/tasks');
// var session = require('express-session');
// var RedisStore = require('connect-redis')(session);

 //var io = require('socket.io')();
 // io.of('/simple').in('ontest_2').clients(function(error, clients){
 //    if (error) throw error;
 //    console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
 //  });
var exec = require('child_process').exec;
// var myredis = require("redis");
// var client = myredis.createClient();
/**
* 检测sku数据
*
*/
module.exports = {

      _cmdBase:'/usr/bin/curl ',
     //_cmdBase:'/usr/bin/curl http://localhost:1338/',

    updateDepartment:function(req, res) {
        console.log('updateDepartment: This is the function entry. check it out: ', req.allParams());

        var sqlQueryDepartmentGroup = "select id,permission from departmentgroup where storeid >0 and permission!='*' "
        Departmentgroup.query(sqlQueryDepartmentGroup,function (err, list) {
            if (err) return;

            console.log("cb_tag1: The result of this \' query \' is shown came out. check it out: ",list.length);

            for(var i = 0; i<list.length; i++) {
                var item = list[i];
                item.permission = item.permission || "";
                item.permissionarray = item.permission.split(":");

                item.permissionarray.remove("");
                item.permissionarray.remove("241");
                item.permissionarray.remove("242");

                if (item.permissionarray.indexOf("99")>-1) {
                    item.permissionarray.push("160");
                    item.permission = item.permissionarray.join(":")
                }

                if (item.permissionarray.indexOf("19")>-1) {
                    item.permissionarray.push("241");
                    item.permissionarray.push("245");
                    item.permissionarray.push("20");
                    item.permission = item.permissionarray.join(":")
                }

                if (item.permissionarray.indexOf("77")>-1) {
                    item.permissionarray.push("242");
                    item.permissionarray.push("243");
                    item.permission = item.permissionarray.join(":")
                }

                if (item.permissionarray.indexOf("196")>-1) {
                    item.permissionarray.push("244");
                    item.permissionarray.push("246");
                    item.permission = item.permissionarray.join(":")
                }

                var sqlUpdateDepartmentGroup = "update departmentgroup set permission = \'" + item.permission + "\' where id = " + item.id;
                console.log('sqlUpdateDepartmentGroup. check it out. ',sqlUpdateDepartmentGroup);
                Departmentgroup.query(sqlUpdateDepartmentGroup,function (err, recond) {
                    if (err) return;
                    console.log("cb_tag2: The result of this update is shown came out. check it out: ok");
                });
            }
        });

        return res.json({
            code:200,
            data:[],
            mesg:"",
        });
        
    },

    updateSystemSetting: function(req, res) {

        var val = "";
        val += "1:2:3:4:5:6:7:8:9:10:11:12:13:14:15:16";
        val += ":17:18:19:21:24:25:26:27:28:29:32:33:34";
        val += ":35:36:37:38:39:40:41:42:43:46:48:49:50";
        val += ":51:52:53:54:63:64:65:66:67:68:69:70:71:72";
        val += ":74:75:77:78:79:80:81:82:84:85:86:87:88:89:90";
        val += ":97:99:101:104:105:106:107:108:109:110:112:119";
        val += ":127:129:130:131:132:133:134:135:136:137:138:139";
        val += ":140:141:142:144:145:146:147:148:149:150:151:152:153";
        val += ":154:155:157:158:159:160:161:162:163:164:165:170:171:172";
        val += ":173:174:175:182:184:186:187:188:189:190:192:193:194:195:196";
        val += ":199:203:204:206:207:212:213:214:215:220:222:226:227:228:229";
        val += ":230:231:232:233:234:235:236:237:238:239:240:241:242:243:244:245";
        val += ":246";
        SystemSetting.update({ key: "merchantDefaultPermission" }, {value: val}).exec(function (err, record) {
            if (err)  return res.negotiate(err);
            return res.json({
                code: 200,
                data:record,
                mesg: "设置成功",
            });
        });
    },

    createPermission:function(req, res) {
        //19      商品校验        serch   serchCategoryWithProval     241 2017-10-18 15:23:25 2017-10-18 15:23:30 1

        //构造消息
        var MsgObj0 = {},list = [];
        var createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");


        // MsgObj0.parentid = 77;
        // MsgObj0.hid = "";
        // MsgObj0.sortorder = 0;
        // MsgObj0.is_store = 1;
        // MsgObj0.description = "";
        // MsgObj0.controller = "serch";
        // MsgObj0.name = "搜索店铺内类别";
        // MsgObj0.action = "serchMeShopsCategory";
        // MsgObj0.createdAt = createdAt;
        // MsgObj0.updatedAt = createdAt;

        // list.push(MsgObj0);
        // console.log('MsgObj: check it out: ', MsgObj0);

        //var MsgObj1 = {}
        // MsgObj1.parentid = 19;
        // MsgObj1.hid = "";
        // MsgObj1.sortorder = 0;
        // MsgObj1.is_store = 1;
        // MsgObj1.description = "";
        // MsgObj1.controller = "serch";
        // MsgObj1.name = "商品校验";
        // MsgObj1.action = "serchCategoryWithProval";
        // MsgObj1.createdAt = createdAt;
        // MsgObj1.updatedAt = createdAt;

        // list.push(MsgObj1);
        // console.log('MsgObj: check it out: ', MsgObj1);

        // var MsgObj2 = {};
        // MsgObj2.parentid = 77;
        // MsgObj2.hid = "";
        // MsgObj2.sortorder = 0;
        // MsgObj2.is_store = 1;
        // MsgObj2.description = "";
        // MsgObj2.controller = "serch";
        // MsgObj2.name = "搜索店铺分类";
        // MsgObj2.action = "serchMeShopsClassify";
        // MsgObj2.createdAt = createdAt;
        // MsgObj2.updatedAt = createdAt;

        // list.push(MsgObj2);
        // console.log('MsgObj: check it out: ', MsgObj2);


        // var MsgObj3 = {};
        // MsgObj3.parentid = 196;
        // MsgObj3.hid = "";
        // MsgObj3.sortorder = 0;
        // MsgObj3.is_store = 1;
        // MsgObj3.description = "";
        // MsgObj3.controller = "presale";
        // MsgObj3.name = "预售商品新增";
        // MsgObj3.action = "goods";
        // MsgObj3.createdAt = createdAt;
        // MsgObj3.updatedAt = createdAt;

        // list.push(MsgObj3);
        // console.log('MsgObj: check it out: ', MsgObj3);


        // var MsgObj4 = {};
        // MsgObj4.parentid = 30;
        // MsgObj4.hid = "";
        // MsgObj4.sortorder = 0;
        // MsgObj4.is_store = 1;
        // MsgObj4.description = "";
        // MsgObj4.controller = "serch";
        // MsgObj4.name = "搜索商户类别";
        // MsgObj4.action = "serchStoreidCategory";
        // MsgObj4.createdAt = createdAt;
        // MsgObj4.updatedAt = createdAt;

        // list.push(MsgObj4);
        // console.log('MsgObj: check it out: ', MsgObj4);

        // var MsgObj5 = {};
        // MsgObj5.parentid = 196;
        // MsgObj5.hid = "";
        // MsgObj5.sortorder = 0;
        // MsgObj5.is_store = 1;
        // MsgObj5.description = "";
        // MsgObj5.controller = "presale";
        // MsgObj5.name = "预售视图";
        // MsgObj5.action = "view";
        // MsgObj5.createdAt = createdAt;
        // MsgObj5.updatedAt = createdAt;

        //list.push(MsgObj5);
        console.log('MsgObj: check it out: ', MsgObj5);

        while(list.length) {
            Permission.create(list.pop()).exec(function (err, record) {
                console.log("cb_tag1: The result of this create is shown came out. check it out: ok");
                return res.json({
                    code:200,
                    err:err,
                    data:record,
                    mesg:"",
                });
            });  
        }
        
    },

    //更新Controller
    updateController: function(req, res) {
        console.log('updateController: This is the function entry. check it out: ', req.allParams());

        // var mine = req.session.mine;
        // var allParams = req.allParams();
        // allParams.name = allParams.name || 'fuck';
        // if (allParams.name !== 'xian') {
            // return res.json({
            //     code:200,
            //     data:[],
            //     msg:'fuck you!!!!!!'
            // });
        // }

        // //var conllerArray = ["permission"] = "permissionstore";
        var gd = ["id","usermobile","operatorno","createdAt","statuscode"];
        var queryAccountSql = "select " + gd.join(",") + " from account";

        fn1 = function(cb) {
            Account.query(queryAccountSql,function (err, list) {
                if (err) return;
                cb(null, list);
            });
        };

        fn2 = function(cb, result) {
            console.log('result. ',result.a.length)
            Account.query(queryAccountSql,function (err, list) {
                if (err) return;
                 cb(null, list);
            });
        };

        callback = function(err, reuslts){
            if(err){
                console.log(err);;
            }else{
                return res.json({
                    code:200,
                    data:{a:reuslts.a.length,b:reuslts.b.length}
                });
            }
        };

        tasks.series({
            a:fn1,
            b:fn2
        }, callback);
    },


    /**
    *查询sku对应数据
    *@param sku 
    *@param  
    */
    findSku: function(req, res) {
        return;
        var allParams = req.allParams();
        console.log('allParams: check it out: ', allParams);

        if(typeof(allParams.sku) !== 'string'){
            return res.json({
                code: 400,
                msg: 'sku未传值'
            });
        }

        async.auto({
            queryParent: function(callback, result){

                var sqlQueryParent = 'SELECT id FROM goodscategory WHERE parentid = 0 ';
                console.log('sqlQueryParent: check it out: ',sqlQueryParent);

                Goodscategory.query(sqlQueryParent, function(err,list) {
                    if (err) {
                        console.log("err_tag1: check it out: ", err);
                        return;
                    }

                    console.log("cb_tag1: The result of this \' query \' is shown came out. check it out: ",list.length);
                    var listparent = [];
                    while(list.length>0){
                        var item = list.pop();
                        listparent.push(item.id);
                    }
                    callback(err, listparent);
                });
            },

            queryGoodsList: ['queryParent', function(callback, result){

                var listparent = result.queryParent || [];

                var goodslist = [];
                var doneCounter = function (err, list) {
                    while(list.length>0){
                        var item = list.pop();
                        goodslist.push(item);
                    }

                    if (listparent.length == 0) {
                        callback(err, goodslist);
                    }
                };

                
                while(listparent.length>0){

                    var parent = listparent.pop();
                    var sqlGoodsList = 'SELECT * FROM goodsList'+ parent +' WHERE sku=\''+ allParams.sku +'\'' + 'and goodsseries = 0';
                    console.log('sqlGoodsList: check it out:　',sqlGoodsList);

                    Creator.query(sqlGoodsList, function(err,list) {
                        if (err) {
                            console.log("err_tag2: check it out: ", err);
                            return;
                        }
                        console.log("cb_tag2: The result of this \' query \' is shown came out. check it out: ",list.length);
                        doneCounter(err,list);
                    });
                }
            }],

            queryMerGoodsList: ['queryGoodsList',function(callback,result) {
                // 取出storeId的值
                var skuArr = allParams.sku.split('-');
                var storeId = skuArr[1];
                console.log('storeid: check it out: ',storeId);

                //console.log('goodslist: check it out: ',result.queryGoodsList.length);

                var goodslist = result.queryGoodsList || [];
                console.log('goodslist: check it out: ',goodslist.length);

                var sqlMerGoodsList = 'SELECT * FROM mergoodsList'+ storeId +' WHERE sku=\''+ allParams.sku +'\'';
                console.log("sqlMerGoodsList: check it out: ",sqlMerGoodsList);

                Creator.query(sqlMerGoodsList, function(err,list) {
                    if (err) {
                        console.log("wcy ==> err3:",err);
                        return;
                    }

                    console.log("cb_tag3: The result of this \' query \' is shown came out. check it out: ",list.length);
                    while(list.length>0){
                        item = list.pop();
                        goodslist.push(item);
                    }
                    console.log('goodslist: ',goodslist.length);
                    callback(err, goodslist);
                });
            }],
        }, function(err, results){
            if (err) {
                console.log("wcy ==> err4:", err);
                return;
            }

            var goodslist = [];
            console.log('rst: check it out ',results);

            var list = results.queryGoodsList || [];
            while(list.length>0) {
                goodslist.push(list.pop())
            }

            var _list = results.queryMerGoodsList || [];
            while(_list.length>0) goodslist.push(_list.pop())
            
            //console.log("wcy==>listparent:" + JSON.stringify(results));
            //data.tableNames = tableNames.substr(0,tableNames.length-1);
            return res.json({
                code: 200,
                data: goodslist
            });
        });
    },

    hashMap: function(req, res) {
        var map = new HashMap();
        map.set('id',1);

        return res.json({
            code: 200,
            data: map
        });
    },

    // updateCGoods: function(req,res) {

    //     console.log('updateCGoods: This is the function entry. check it out: ', req.allParams());

    //     var mine = req.session.mine;
    //     var allParams = req.allParams();
    //     allParams.name = allParams.name || 'fuck';
    //     if (allParams.name !== 'xian') {
    //         return res.json({
    //             code:200,
    //             data:[],
    //             msg:'fuck you!!!!!!'
    //         });
    //     }

    //     var starttime = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S"));
    //     var sqlQueryParent = 'select id from goodscategory where parentid = 0 ';
    //     console.log('sqlQueryParent: check it out: ',sqlQueryParent);

    //     Goodscategory.query(sqlQueryParent, function(err,list) {
    //         if (err) {
    //             console.log("err_tag1: check it out: ", err);
    //             return;
    //         }

    //         console.log("cb_tag1: The result of this \' query \' is shown came out. check it out: ",list.length);
    //         var listparent = [];
    //         while(list.length>0){
    //             var item = list.pop();
    //             listparent.push(item.id);
    //         }
    //         setCGoods(listparent)
    //     });

    //     setCGoods = function (listparent) {
    //         try {
    //             while(listparent.length>0) {

    //                 var parentid = listparent.pop();
    //                 var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentid);
    //                 var setCGoodsSql = 'update ' + tb_C_Name;
    //                 setCGoodsSql += ' set presalestarttime = \'' + starttime + '\'';
    //                 setCGoodsSql += ' where sku like \'' + sku + '%\'';
    //                 console.log('setCGoodsSql: check it out: ', setCGoodsSql);

    //                 Creator.query(setCGoodsSql, function (err, list) {
    //                     if (err) return;
    //                     callback(err,list);
    //                     console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
    //                 });

    //             }
    //         }catch (e) {
    //             console.log('setCGoods err: ', e);
    //         }
    //     };

    //     setMGoods = function (liststoreid) {
    //         try {

    //             while(liststoreid.length>0) {

    //                 var storeid = liststoreid.pop();
    //                 var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
    //                 var setMGoodsSql = 'update ' + tb_M_Name;
    //                  setCGoodsSql += ' set presalestarttime = \'' + starttime + '\'';
    //                 setMGoodsSql += ' where sku like \'' + sku + '%\'';
    //                 console.log('setMGoodsSql: check it out: ', setMGoodsSql);

    //                 Creator.query(setMGoodsSql, function (err, list) {
    //                     if (err) return;
    //                     callback(err,list);
    //                     console.log('cb_tag2: The result of this query is shown came out. check it out: ', list);
    //                 });
    //             }

    //         }catch (e) {
    //             console.log('setMGoods err: ', e);
    //         }
    //     };
    // },

    migrateHorizontalAlliances: function(req,res) {
        return;
        console.log('migrateHorizontalAlliances: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }

        queryMGoods = function(liststrs) {
            while(liststrs.length>0) {
                var tb_M_Name = liststrs.pop();
                var queryMGoodsSql = 'select reserve3,storeid from ' + tb_M_Name + ' where reserve3!= "" and reserve3!=0';
                console.log('queryMGoodsSql: check it out. ',queryMGoodsSql);
                Creator.query(queryMGoodsSql, function (err, list) {
                    if (err) return;
                    console.log('cb_tag2: The result of this query is shown came out. check it out. ',list.length);
                    if(list.length>0){
                        var item = list.pop();
                        var storeid = item.storeid;
                        setAccountSellerSql = 'update accountseller set horizontalalliances  = \"' + item.reserve3 + '\" where id = ' + storeid;
                        console.log('setAccountSellerSql: check it out. ',setAccountSellerSql);
                        Accountseller.query(setAccountSellerSql, function (err, record) {
                            if (err) return;
                            console.log('cb_tag3: The result of this query is shown came out. check it out. ok');
                        });
                    }
                }); 
            }
        };

        var quertAccountSql = 'select id from accountseller'
        console.log('quertAccountSql. check it out. ',quertAccountSql);
        Accountseller.query(quertAccountSql, function (err, list) {
            if (err) return;
            liststrs = [];
            while(list.length>0) {
                var item = list.pop();
                var storeid = item.id;
                var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                liststrs.push(tb_M_Name);
            }
            queryMGoods(liststrs);
            console.log('cb_tag1: The result of this \' select \' is shown came out. check it out: ', list);
        });

        return res.json({
            code:200,
            data:[]
        });
    },

    migrateShopsConcert: function(req,res) {
        return;
        console.log('migrateShopsConcert: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }

        queryMGoods = function(liststrs) {
            while(liststrs.length>0) {
                var tb_M_Name = liststrs.pop();
                var queryMGoodsSql = 'select reserve6,storeid from ' + tb_M_Name + ' where reserve6!= "" and reserve6!=0';
                console.log('queryMGoodsSql: check it out. ',queryMGoodsSql);
                Creator.query(queryMGoodsSql, function (err, list) {
                    if (err) return;
                    console.log('cb_tag2: The result of this query is shown came out. check it out. ',list.length);
                    if(list.length>0){
                        var item = list.pop();
                        var storeid = item.storeid;
                        setAccountSellerSql = 'update accountseller set shopsconcert  = \"' + item.reserve6 + '\" where id = ' + storeid;
                        console.log('setAccountSellerSql: check it out. ',setAccountSellerSql);
                        Accountseller.query(setAccountSellerSql, function (err, record) {
                            if (err) return;
                            console.log('cb_tag3: The result of this query is shown came out. check it out. ok');
                        });
                    }
                }); 
            }
        };

        var quertAccountSql = 'select id from accountseller'
        console.log('quertAccountSql. check it out. ',quertAccountSql);
        Accountseller.query(quertAccountSql, function (err, list) {
            if (err) return;
            liststrs = [];
            while(list.length>0) {
                var item = list.pop();
                var storeid = item.id;
                var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                liststrs.push(tb_M_Name);
            }
            queryMGoods(liststrs);
            console.log('cb_tag1: The result of this \' select \' is shown came out. check it out: ', list);
        });

        return res.json({
            code:200,
            data:[]
        });
    },

    migrateShopsConfig: function(req,res) {
        return;
        console.log('migrateShopsConfig: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }


        queryMGoods = function(liststrs) {
            while(liststrs.length>0) {
                var tb_M_Name = liststrs.pop();
                var queryMGoodsSql = 'select reserve7,storeid from ' + tb_M_Name + ' where reserve7!= "" and reserve7!=0';
                console.log('queryMGoodsSql: check it out. ',queryMGoodsSql);
                Creator.query(queryMGoodsSql, function (err, list) {
                    if (err) return;
                    console.log('cb_tag2: The result of this query is shown came out. check it out. ',list.length);
                    if(list.length>0){
                        var item = list.pop();
                        var storeid = item.storeid;
                        setAccountSellerSql = 'update accountseller set shopsconfig  = \"' + item.reserve7 + '\" where id = ' + storeid;
                        console.log('setAccountSellerSql: check it out. ',setAccountSellerSql);
                        Accountseller.query(setAccountSellerSql, function (err, record) {
                            if (err) return;
                            console.log('cb_tag3: The result of this query is shown came out. check it out. ok');
                        });
                    }
                }); 
            }
        };

        var quertAccountSql = 'select id from accountseller'
        console.log('quertAccountSql. check it out. ',quertAccountSql);
        Accountseller.query(quertAccountSql, function (err, list) {
            if (err) return;    
            liststrs = [];
            while(list.length>0) {
                var item = list.pop();
                var storeid = item.id;
                var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                liststrs.push(tb_M_Name);
            }
            queryMGoods(liststrs);
            console.log('cb_tag1: The result of this \' select \' is shown came out. check it out: ', list);
        });

        return res.json({
            code:200,
            data:[]
        });
    },

    setReserve7: function (req, res) {
        return;
        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }

        var storeid = allParams.storeid;
        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
        var queryMGoodsSql = 'select reserve7 from ' + tb_M_Name + ' where reserve7!="" and reserve7!=0';

        console.log('queryMGoodsSql: check it out. ',queryMGoodsSql);
        Creator.query(queryMGoodsSql, function (err, list) {
            if (err) return;
            console.log('cbq_tag1: The result of this delete is shown came out. check it out. ',list.length);

            if (list.length) {
                var item = list.pop();
                var reserve7 = item.reserve7;

                var setMGoodsSql = 'update ' + tb_M_Name + ' set reserve7 = "' + reserve7 + '"';
                console.log('setMGoodsSql: check it out. ',setMGoodsSql);
                Creator.query(setMGoodsSql, function (err, recond) {
                    if (err) return;
                    console.log('cbq_tag2: The result of this delete is shown came out. check it out. ',list.length);
                    return res.json({
                        code:200,
                        data:'刷新'
                    });
                });

            }else{
                var reserve7 = '1-新品-1-,2-促销1123-2-'
                var setMGoodsSql = 'update ' + tb_M_Name + ' set reserve7 = "' + reserve7 + '"';
                console.log('setMGoodsSql: check it out. ',setMGoodsSql);
                Creator.query(setMGoodsSql, function (err, recond) {
                    if (err) return;
                    console.log('cbq_tag2: The result of this delete is shown came out. check it out. ',list.length);
                    return res.json({
                        code:200,
                        data:'重置'
                    });
                });
            }
            
        });
    },

    setReserve3: function (req, res) {
        return;
        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }

        var storeid = allParams.storeid;
        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
        var queryMGoodsSql = 'select reserve3 from ' + tb_M_Name + ' where reserve3!="" and reserve3!=0';

        console.log('queryMGoodsSql: check it out. ',queryMGoodsSql);
        Creator.query(queryMGoodsSql, function (err, list) {
            if (err) return;
            console.log('cbq_tag1: The result of this delete is shown came out. check it out. ',list.length);

            if (list.length) {
                var item = list.pop();
                var reserve3 = item.reserve3;

                var setMGoodsSql = 'update ' + tb_M_Name + ' set reserve3 = "' + reserve3 + '"';
                console.log('setMGoodsSql: check it out. ',setMGoodsSql);
                Creator.query(setMGoodsSql, function (err, recond) {
                    if (err) return;
                    console.log('cbq_tag2: The result of this delete is shown came out. check it out. ',list.length);
                    return res.json({
                        code:200,
                        data:'刷新'
                    });
                });

            }else{
                var reserve3 = '66-szhuasheng-0,5-szxyyd-1,67-szytl-2,71-shangliuchin-3'
                var setMGoodsSql = 'update ' + tb_M_Name + ' set reserve3 = "' + reserve3 + '"';
                console.log('setMGoodsSql: check it out. ',setMGoodsSql);
                Creator.query(setMGoodsSql, function (err, recond) {
                    if (err) return;
                    console.log('cbq_tag2: The result of this delete is shown came out. check it out. ',list.length);
                    return res.json({
                        code:200,
                        data:'重置'
                    });
                });
            }
            
        });
    },

    setCategoryStoreid: function(req,res) {
        return;
        console.log('setCategoryStoreid: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }

        var queryCCategorySql = 'update goodscategory set storeid = 0 where  (parentid = 0 and isdelete = 0 and storeid = 0) or (parentid = 0 and storeid > 0 and isdelete = 0)';
        console.log('queryCCategorySql: check it out: ', queryCCategorySql);
        Goodscategory.query(queryCCategorySql,function (err,  list) {
            if (err) return;
            seller.setCCategory(list);
            console.log("cb_tag1: The result of this create is shown came out. check it out. ",list.length);
            return res.json({
                code:200,
                data:'重置'
            });
        });

        // return res.json({
        //     code:200,
        //     data:'重置'
        // });
    },

    setStatucode: function(req,res) {
        return;
        console.log('setStatucode: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }


        var queryAccountSql = 'update account set statuscode = 1 where statuscode = 0';
        console.log('queryAccountSql: check it out: ', queryAccountSql);
        Account.query(queryAccountSql,function (err,  list) {
            if (err) return;
            console.log("cb_tag1: The result of this create is shown came out. check it out. ",list.length);
            return res.json({
                code:200,
                data:'重置'
            });
        });
    },

    updateMe: function(req,res) {
        return;
        console.log('updateMe: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }

        seller.queryAccountSeller();
        return res.json({
            code:200,
            data:'更新完成',
        });
    },

    updateShopsconcertNavigation: function(req,res) {
        return;
        console.log('updateShopsconcertNavigation: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }

        var temp = seller.getStore();
        var list = temp.slice();
        for(var i = 0; i<list.length; i++) {
            var storeid = list[i].id;
            Accountseller.findOne({id: storeid}).exec(function (err, recond) {
                    if (err) return;
                    console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ok');

                    recond = recond || {};

                    //专场数据 
                    recond.shopsconcert = recond.shopsconcert || "";
                    recond.shopsconcert = recond.shopsconcert.split(',');

                    var shopsconcert = recond.shopsconcert || [];
                    shopsconcert.remove("");

                    var shopsconcertlist = shopsconcertlist || [];
                    for (var i = 0; i < shopsconcert.length; i++) {

                        var navigation = {};
                        var shopsconcertArr = shopsconcert[i].split('-');

                        navigation.id = shopsconcertArr[0];
                        navigation.name = shopsconcertArr[1];
                        //navigation.sortorder = shopsconcertArr[2];
                        navigation.goodsseries = [];

                        var goodsseriesstring= shopsconcertArr[2];
                        goodsseriesstring = goodsseriesstring || "";

                        var goodsseriesArr = goodsseriesstring.split('|');
                        goodsseriesArr.remove("");

                        var goodsserieslist = [];
                        for (var j = 0; j < goodsseriesArr.length; j++) {
                            var goods = {};
                            var goodsseriesObj = goodsseriesArr[j].split('[.]');
                            
                            goods.id = goodsseriesObj[0];
                            goods.sortorder = goodsseriesObj[2];
                            goods.storecategoryid = goodsseriesObj[1];
                            
                            goodsserieslist.push(goods);
                        }

                        var newShopsconcert =  "";
                        newShopsconcert += navigation.id;
                        newShopsconcert += "#";
                        newShopsconcert += navigation.name;
                        newShopsconcert += "#";
                        // newShopsconcert += navigation.sortorder;
                        // newShopsconcert += "#";
                        newShopsconcert += gcom.hashClassify(goodsserieslist);

                        //修改完成
                        shopsconcertlist.push(newShopsconcert);
                    }

                    console.log('shopsconcertlist. ',shopsconcertlist.toString());
                    recond.shopsconcert = shopsconcertlist.toString();
                    recond.save(function (err) {
                        if (err) return;
                        console.log("save_tag1: This saved successfully. ",recond.shopsconcert);
                    });
            }); 
        }
        
        return res.json({
            code: 200,
            data: []
        });
    },

    updateShopsconcert: function(req,res) {
        return;
        console.log('updateShopsConfig: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }

        var temp = seller.getStore(),id = allParams.id;

        var obj = {},zIndex = 0,counter = 0,list = utils.clone(temp);
        function test_update(idx,goodsseries,storeid,navigationid) {
            var gd = ["name","storeid","sku","imagedefault","price","id","createdAt",
                        "type","deposit","premoneey","presaleendtime","presaleflow","presaleflowdescript",
                        "presaledescript","precustomerserivice","presubtitle","storecategoryid"];

            var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
            var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where ';
            
            for(var n = 0; n<goodsseries.length; n++) {
                var item = goodsseries[n];
                queryMGoodsSql += ' id = ' + item.id;
                queryMGoodsSql += ' and ';
                queryMGoodsSql += ' storecategoryid = ' + item.storecategoryid;
                queryMGoodsSql += n < goodsseries.length-1 ? ' or ' : '';
            }

            obj[idx] = obj[idx] || {};
            obj[idx].storeid = storeid;
            obj[idx].shopsconcert = "";
            obj[idx].goodsseries = goodsseries;
            obj[idx].navigationid = navigationid;
           
            
            //console.log('zIndex. ',idx)
            console.log('queryMGoodsSql: check it out. ', queryMGoodsSql);
            Creator.query(queryMGoodsSql, function (err, ret) {
                if (err) return;
                
                console.log('cb_tag2: The result of this query is shown came out. check it out:  ', ret.length);
                var newlist = [];
                for(var m = 0; m<ret.length; m++) {
                    var goods = ret[m];
                    var newgoods = {};
                    //console.log('_goodsserieslist. ',obj[zIndex]);
                    var _goodsserieslist = obj[zIndex].goodsseries;
                    newgoods.id = parseInt(goods.id);
                    newgoods.storecategoryid = parseInt(goods.storecategoryid);
                    for(var n = 0; n< _goodsserieslist.length; n++) {
                        var series = _goodsserieslist[n];
                        var newseries = {};
                        newseries.id = parseInt(series.id);
                        newseries.storecategoryid = parseInt(series.storecategoryid);
                        if (_.isEqual(newgoods,newseries)) {
                            goods.sortorder = series.sortorder;
                            newlist.push(goods)
                        }
                    }
                }

                var shopsconcertNew = "";
                newlist = scom.selectionSort(newlist);
                for(var z = 0; z<newlist.length; z++) {
                    shopsconcertNew += newlist[z].sku;
                    shopsconcertNew += "[.]";
                    shopsconcertNew += newlist[z].sortorder;
                    shopsconcertNew += z < newlist.length-1 ? '|' : '';
                }
                obj[zIndex].shopsconcert = shopsconcertNew;
                console.log("shopsconcertNew. check it out. ",shopsconcertNew);


                zIndex = zIndex + 1;
                if (zIndex === counter) {

                    var storeidArray = [];

                    for(key in obj) {
                        if (storeidArray.indexOf(obj[key].storeid) === -1) {
                            storeidArray.push(obj[key].storeid);
                        }
                    }
                    console.log('storeid. check it out. ',storeidArray);

                    var kkCount = 0,cbCount = 0;
                    var keys = _.keys(obj); 
                    for(var kc = 0; kc < storeidArray.length; kc++) {

                        kkCount++;
                        var storeid = storeidArray[kc];
                        console.log('storeid. check it out. ',storeid);

                        Accountseller.findOne({id: storeid}).exec(function (err, recond) {
                                if (err) return;
                                console.log('cb_tag3: The result of this \' findOne \' is shown came out. check it out: ok');

                                recond = recond || {};

                                //专场数据 
                                recond.shopsconcert = recond.shopsconcert || "";
                                recond.shopsconcert = recond.shopsconcert.split(',');

                                var _shopsconcert = recond.shopsconcert || [];
                                _shopsconcert.remove("");

                                var shopsconcertlist = [];
                                for (var i = 0; i < _shopsconcert.length; i++) {

                                    var navigation = {};
                                    var newShopsconcert =  "";
                                    var shopsconcertArr = _shopsconcert[i].split('#');

                                    navigation.id = shopsconcertArr[0];
                                    navigation.name = shopsconcertArr[1];
                                    ///navigation.sortorder = shopsconcertArr[2];
                                    navigation.goodsseries = [];

                                    var goodsseriesstring= shopsconcertArr[2];
                                    goodsseriesstring = goodsseriesstring || "";

                                    var kIndex = 0;
                                    for(var k in obj) {
                                        
                                        var r_storeid = parseInt(recond.id);
                                        var o_storeid = parseInt(obj[k].storeid);
                                        
                                        if (_.isEqual(o_storeid,r_storeid)) {

                                            var a_id = parseInt(navigation.id);
                                            var b_id = parseInt(obj[k].navigationid)
                                            if (a_id === b_id) {
                                                newShopsconcert += navigation.id;
                                                newShopsconcert += "#";
                                                newShopsconcert += navigation.name;
                                                newShopsconcert += "#";
                                                // newShopsconcert += navigation.sortorder;
                                                // newShopsconcert += "#";
                                                newShopsconcert += obj[k].shopsconcert;
                                                console.log('newShopsconcert. ',newShopsconcert);

                                                //修改完成
                                                shopsconcertlist.push(newShopsconcert);
                                            }
                                            
                                        }
                                        
                                    }
                                }
                                
                                recond.shopsconcert = shopsconcertlist.toString();
                                recond.save(function (err) {
                                    if (err) return;
                                    console.log("save_tag1: This saved successfully. ",recond.shopsconcert);
                                });

                                cbCount++;
                                if (kkCount === cbCount) {
                                    return res.json({
                                        data: obj,
                                        code: 200,
                                        msg: "首页"
                                    });
                                }
                        });
                    }
                }
            });

        }


        // var queryAccountSellerSql = "select shopsconfig,id from accountseller";
        // console.log('queryAccountSellerSql: check it out: ', queryAccountSellerSql);
        // Accountseller.query(queryAccountSellerSql,function (err,  list) {
        //     if (err) return;
        //     console.log("cb_tag1: The result of this create is shown came out. check it out. ",list.length);

            list = [];
            for(var i = 0; i<temp.length; i++) {
                if (temp[i].id == id) {
                    list.push(temp[i]);
                }
            }

            console.log("cb_tag1: The result of this create is shown came out. check it out. ",list.length);
            for (var j = 0; j < list.length; j++) {
                list[j].shopsconcert = list[j].shopsconcert || "";
                list[j].shopsconcert = list[j].shopsconcert.split(',');

                //console.log('shopsconcert. ',list[j].shopsconcert);
                var shopsconcert = list[j].shopsconcert || "";
                shopsconcert.remove("");

                var a = [],b = [];
                for (var i = 0; i < shopsconcert.length; i++) {
                    var shopsconcertArr = shopsconcert[i].split('#');

                    var navigation = {};
                    navigation.id = shopsconcertArr[0];
                    navigation.name = shopsconcertArr[1];
                    //navigation.sortorder = shopsconcertArr[2];

                    goodsseriesstring = shopsconcertArr[2] || "";
                    goodsseriesstring = goodsseriesstring || "";

                    var goodsseriesArr = goodsseriesstring.split('|');
                    goodsseriesArr.remove("");

                    var goodsserieslist = [];
                    for (var k = 0; k < goodsseriesArr.length; k++) {
                        var goods = {};
                        var goodsseriesObj = goodsseriesArr[k].split('[.]');
                        
                        goods.id = goodsseriesObj[0];
                        goods.sortorder = goodsseriesObj[2];
                        goods.storecategoryid = goodsseriesObj[1];
                        goodsserieslist.push(goods);
                    }

                    console.log('goodsserieslist. ',goodsserieslist.length);
                    navigation.goodsseries = goodsserieslist;
                    var navigationid = parseInt(shopsconcertArr[0]);
                    if (goodsserieslist.length) {
                        test_update(counter++,goodsserieslist,list[j].id,navigationid);
                    }
                    

                    // if (navigationid === 1) {
                    //     test_update(counter++,goodsserieslist,list[j].id,navigationid);
                    //     //a = goodsserieslist.slice();
                    // }else
                    // if (navigationid === 2) {
                    //     test_update(counter++,goodsserieslist,list[j].id,navigationid);
                    //     //b = goodsserieslist.slice();
                    // }
                    //console.log('a. ',a.length," b. ",b.length);
                }

                // var temp = {};
                // temp.a = a.slice();
                // temp.b = b.slice();
                // a.concat(b);
                // console.log('a. mix. ',a.length);
                // if (a.length) {
                //     test_update(counter++,a,list[j].id,temp);
                // }
                
            }
        //});
    },

    updateShopsConfigNavigation: function(req,res) {
        return;
        console.log('updateShopsConfigNavigation: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }


        var temp = seller.getStore();
        var list = temp.slice();
        for(var i = 0; i<list.length; i++) {
            var storeid = list[i].id;
            Accountseller.findOne({id: storeid}).exec(function (err, recond) {
                    if (err) return;
                    console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ok');

                    recond = recond || {};

                    //专场数据 
                    recond.shopsconfig = recond.shopsconfig || "";
                    recond.shopsconfig = recond.shopsconfig.split(',');

                    var shopsconfig = recond.shopsconfig || [];
                    shopsconfig.remove("");

                    var shopsconfiglist = shopsconfiglist || [];
                    for (var i = 0; i < shopsconfig.length; i++) {

                        var navigation = {};
                        var shopsconfigArr = shopsconfig[i].split('-');

                        navigation.id = shopsconfigArr[0];
                        navigation.name = shopsconfigArr[1];
                        navigation.sortorder = shopsconfigArr[2];
                        navigation.goodsseries = [];

                        var goodsseriesstring= shopsconfigArr[3];
                        goodsseriesstring = goodsseriesstring || "";

                        var goodsseriesArr = goodsseriesstring.split('|');
                        goodsseriesArr.remove("");

                        var goodsserieslist = [];
                        for (var j = 0; j < goodsseriesArr.length; j++) {
                            var goods = {};
                            var goodsseriesObj = goodsseriesArr[j].split('[.]');
                            
                            goods.id = goodsseriesObj[0];
                            goods.sortorder = goodsseriesObj[2];
                            goods.storecategoryid = goodsseriesObj[1];
                            
                            goodsserieslist.push(goods);
                        }

                        var newShopsconfig =  "";
                        newShopsconfig += navigation.id;
                        newShopsconfig += "#";
                        newShopsconfig += navigation.name;
                        newShopsconfig += "#";
                        newShopsconfig += navigation.sortorder;
                        newShopsconfig += "#";
                        newShopsconfig += gcom.hashClassify(goodsserieslist);

                        //修改完成
                        shopsconfiglist.push(newShopsconfig);
                    }

                    recond.shopsconfig = shopsconfiglist.toString();
                    recond.save(function (err) {
                        if (err) return;
                        console.log("save_tag1: This saved successfully. ",recond.shopsconfig);
                    });
            }); 
        }
        
        return res.json({
            code: 200,
            data: []
        });
    },

    updateShopsConfig: function(req,res) {
        return;
        console.log('updateShopsConfig: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.name = allParams.name || 'fuck';
        if (allParams.name !== 'xian') {
            return res.json({
                code:200,
                data:[],
                msg:'fuck you!!!!!!'
            });
        }


        var temp = seller.getStore();
        var obj = {},zIndex = 0,counter = 0,list = temp.slice();
        function test_update(idx,goodsseries,storeid,navigationid) {
            var gd = ["name","storeid","sku","imagedefault","price","id","createdAt",
                        "type","deposit","premoneey","presaleendtime","presaleflow","presaleflowdescript",
                        "presaledescript","precustomerserivice","presubtitle","storecategoryid"];

            var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
            var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where ';
            
            for(var n = 0; n<goodsseries.length; n++) {
                var item = goodsseries[n];
                queryMGoodsSql += ' id = ' + item.id;
                queryMGoodsSql += ' and ';
                queryMGoodsSql += ' storecategoryid = ' + item.storecategoryid;
                queryMGoodsSql += n < goodsseries.length-1 ? ' or ' : '';
            }

            obj[idx] = obj[idx] || {};
            obj[idx].storeid = storeid;
            obj[idx].shopsconfig = "";
            obj[idx].goodsseries = goodsseries;
            obj[idx].navigationid = navigationid;
           
            
            //console.log('zIndex. ',idx)
            console.log('queryMGoodsSql: check it out. ', queryMGoodsSql);
            Creator.query(queryMGoodsSql, function (err, ret) {
                if (err) return;
                
                console.log('cb_tag2: The result of this query is shown came out. check it out:  ', ret.length);
                var newlist = [];
                for(var m = 0; m<ret.length; m++) {
                    var goods = ret[m];
                    var newgoods = {};
                    //console.log('_goodsserieslist. ',obj[zIndex]);
                    var _goodsserieslist = obj[zIndex].goodsseries;
                    newgoods.id = parseInt(goods.id);
                    newgoods.storecategoryid = parseInt(goods.storecategoryid);
                    for(var n = 0; n< _goodsserieslist.length; n++) {
                        var series = _goodsserieslist[n];
                        var newseries = {};
                        newseries.id = parseInt(series.id);
                        newseries.storecategoryid = parseInt(series.storecategoryid);
                        if (_.isEqual(newgoods,newseries)) {
                            goods.sortorder = series.sortorder;
                            newlist.push(goods)
                        }
                    }
                }

                var shopsconfigNew = "";
                newlist = scom.selectionSort(newlist);
                for(var z = 0; z<newlist.length; z++) {
                    shopsconfigNew += newlist[z].sku;
                    shopsconfigNew += "[.]";
                    shopsconfigNew += newlist[z].sortorder;
                    shopsconfigNew += z < newlist.length-1 ? '|' : '';
                }
                obj[zIndex].shopsconfig = shopsconfigNew;
                console.log("shopsconfigNew. check it out. ",shopsconfigNew);


                zIndex = zIndex + 1;
                if (zIndex === counter) {

                    var storeidArray = [];

                    for(key in obj) {
                        if (storeidArray.indexOf(obj[key].storeid) === -1) {
                            storeidArray.push(obj[key].storeid);
                        }
                    }
                    console.log('storeid. check it out. ',storeidArray);

                    var kkCount = 0,cbCount = 0;
                    var keys = _.keys(obj); 
                    for(var kc = 0; kc < storeidArray.length; kc++) {

                        kkCount++;
                        var storeid = storeidArray[kc];
                        console.log('storeid. check it out. ',storeid);

                        Accountseller.findOne({id: storeid}).exec(function (err, recond) {
                                if (err) return;
                                console.log('cb_tag3: The result of this \' findOne \' is shown came out. check it out: ok');

                                recond = recond || {};

                                //专场数据 
                                recond.shopsconfig = recond.shopsconfig || "";
                                recond.shopsconfig = recond.shopsconfig.split(',');

                                var _shopsconfig = recond.shopsconfig || [];
                                _shopsconfig.remove("");

                                var shopsconfiglist = [];
                                for (var i = 0; i < _shopsconfig.length; i++) {

                                    var navigation = {};
                                    var newShopsconfig =  "";
                                    var shopsconfigArr = _shopsconfig[i].split('#');

                                    navigation.id = shopsconfigArr[0];
                                    navigation.name = shopsconfigArr[1];
                                    navigation.sortorder = shopsconfigArr[2];
                                    navigation.goodsseries = [];

                                    var goodsseriesstring= shopsconfigArr[3];
                                    goodsseriesstring = goodsseriesstring || "";

                                    var kIndex = 0;
                                    for(var k in obj) {
                                        
                                        var r_storeid = parseInt(recond.id);
                                        var o_storeid = parseInt(obj[k].storeid);
                                        
                                        if (_.isEqual(o_storeid,r_storeid)) {

                                            var a_id = parseInt(navigation.id);
                                            var b_id = parseInt(obj[k].navigationid)
                                            if (a_id === b_id) {
                                                newShopsconfig += navigation.id;
                                                newShopsconfig += "#";
                                                newShopsconfig += navigation.name;
                                                newShopsconfig += "#";
                                                newShopsconfig += navigation.sortorder;
                                                newShopsconfig += "#";
                                                newShopsconfig += obj[k].shopsconfig;
                                                console.log('newShopsconfig. ',newShopsconfig);

                                                //修改完成
                                                shopsconfiglist.push(newShopsconfig);
                                            }
                                            
                                        }
                                        
                                    }
                                }
                                
                                recond.shopsconfig = shopsconfiglist.toString();
                                recond.save(function (err) {
                                    if (err) return;
                                    console.log("save_tag1: This saved successfully. ",recond.shopsconfig);
                                });

                                cbCount++;
                                if (kkCount === cbCount) {
                                    return res.json({
                                        data: obj,
                                        code: 200,
                                        msg: "首页"
                                    });
                                }
                        });
                    }
                }
            });

        }


        // var queryAccountSellerSql = "select shopsconfig,id from accountseller";
        // console.log('queryAccountSellerSql: check it out: ', queryAccountSellerSql);
        // Accountseller.query(queryAccountSellerSql,function (err,  list) {
        //     if (err) return;
        //     console.log("cb_tag1: The result of this create is shown came out. check it out. ",list.length);

            console.log("cb_tag1: The result of this create is shown came out. check it out. ",list.length);
            for (var j = 0; j < list.length; j++) {
                list[j].shopsconfig = list[j].shopsconfig || "";
                list[j].shopsconfig = list[j].shopsconfig.split(',');

                //console.log('shopsconfig. ',list[j].shopsconfig);
                var shopsconfig = list[j].shopsconfig || "";
                shopsconfig.remove("");

                var a = [],b = [];
                for (var i = 0; i < shopsconfig.length; i++) {
                    var shopsconfigArr = shopsconfig[i].split('#');

                    var navigation = {};
                    navigation.id = shopsconfigArr[0];
                    navigation.name = shopsconfigArr[1];
                    navigation.sortorder = shopsconfigArr[2];

                    goodsseriesstring = shopsconfigArr[3] || "";
                    goodsseriesstring = goodsseriesstring || "";

                    var goodsseriesArr = goodsseriesstring.split('|');
                    goodsseriesArr.remove("");

                    var goodsserieslist = [];
                    for (var k = 0; k < goodsseriesArr.length; k++) {
                        var goods = {};
                        var goodsseriesObj = goodsseriesArr[k].split('[.]');
                        
                        goods.id = goodsseriesObj[0];
                        goods.sortorder = goodsseriesObj[2];
                        goods.storecategoryid = goodsseriesObj[1];
                        goodsserieslist.push(goods);
                    }

                    navigation.goodsseries = goodsserieslist;
                    var navigationid = parseInt(shopsconfigArr[0]);

                    if (navigationid === 1&&goodsserieslist.length) {
                        test_update(counter++,goodsserieslist,list[j].id,navigationid);
                        //a = goodsserieslist.slice();
                    }else
                    if (navigationid === 2&&goodsserieslist.length) {
                        test_update(counter++,goodsserieslist,list[j].id,navigationid);
                        //b = goodsserieslist.slice();
                    }
                    //console.log('a. ',a.length," b. ",b.length);
                }

                // var temp = {};
                // temp.a = a.slice();
                // temp.b = b.slice();
                // a.concat(b);
                // console.log('a. mix. ',a.length);
                // if (a.length) {
                //     test_update(counter++,a,list[j].id,temp);
                // }
                
            }
        //});
    },

    ontest_1: function (req, res) {
         return res.json({
            data: seller.getStore(),
            code: 200,
            msg: "首页"
        });
    },

    ontest_2: function (req, res) {
        console.log('ontest_2: This is the function entry. ');
        if (req.isSocket){
          // You're a socket.  Do cool socket stuff.
            return res.json({
                data: [],
                code: 200,
                msg: "socket"
            });
        }
        else {
          // Just another HTTP request.
          return res.json({
                data: [],
                code: 200,
                msg: "http"
            });
        }
         
    },

    myNormalGoods: function(req, res) {

        var cmdStr = this._cmdBase + 'http://localhost:1338/cmdGoods/cmdNormalGoods?storeid='+req.param('storeid');
        exec(cmdStr, function(err,stdout,stderr) {

            console.log("err: ",err," \n ");

            //stdout = stdout || '[]';
            //var normal = JSON.parse(stdout);
            console.log("stdout: ",stdout," \n ");

            console.log("stderr: ",stderr," \n ");

            return res.json({
                data:JSON.parse(stdout),
                code:200
            });
        });
    },

    myPresaleGoods: function(req, res) {
        var cmdStr = this._cmdBase + 'cmdGoods/cmdPresalGoods?storeid='+req.param('storeid');
        exec(cmdStr, function(err,stdout,stderr) {

            console.log("err: ",err," \n ");


            //console.log("stdout: ",stdout," \n ");

            console.log("stderr: ",stderr," \n ");

            return res.json({
                data:JSON.parse(stdout),
                code:200
            });
        });
    },

    mySeckillingGoods: function(req, res) {
        var cmdStr = this._cmdBase + 'http://localhost:1338/cmdGoods/cmdSeckillingGoods?storeid='+req.param('storeid');
        exec(cmdStr, function(err,stdout,stderr) {

            console.log("err: ",err," \n ");

            //console.log("stdout: ",stdout," \n ");

            console.log("stderr: ",stderr," \n ");

            return res.json({
                data:JSON.parse(stdout),
                code:200
            });
        });
    },

    onfocus: function (req, res,next) {

        console.log('onFocus: This is the function entry. check it out: ', req.allParams());

        var redis = require("redis"),
            client = redis.createClient();

        client.auth('bqldaling890',function(){
            console.log('redis auth pass.');
        });

        client.select(8, function() {
            console.log('redis select pass.');
        });


        // var src = 'isdelete,0(@)tablename,mergoodsList4(@)parentid,52(@)storecategoryid,(@)goodsseries,575(@)status,3(@)userid,5(@)storeid,4(@)name,ZIMMUR2016一粒扣中长款绣花毛呢外套RH961638(@)type,1(@)sku,73BA-4-1482479590193-159-371(@)updatedAt,1516255829171(@)createdAt,1482479590000';
        // var desc = 'isdelete,1(@)tablename,mergoodsList4(@)parentid,52(@)storecategoryid,(@)goodsseries,575(@)status,3(@)userid,5(@)storeid,4(@)name,ZIMMUR2016一粒扣中长款绣花毛呢外套RH961638(@)type,1(@)sku,73BA-4-1482479590193-159-371(@)updatedAt,1516255829171(@)createdAt,1482479590000';
         
        // client.RENAME([src,desc], 'ok');

        // var merchantObj = {},categoryObj = {};
        // var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS, 4);

        // merchantObj.isdelete = 1;
        // merchantObj.tablename = tb_M_Name;
        // merchantObj.sku = '73BA-4-1482479590193';
        // var queryMerchantGoodsSql = scom.queryMerchantGoods(merchantObj);

        // console.log('queryMerchantGoodsSql. ',queryMerchantGoodsSql);
        // client.keys(queryMerchantGoodsSql, function (err, keys) {
        //     keys.forEach(function (key, pos) {

        //         console.log(pos,'key. ',key);
        //         var revertHashKey = gcom.revertHashKey(key);
        //         revertHashKey.isdelete = 0;

        //         var keysArray = _.toPairs(revertHashKey);

        //         var hashGoods = {};
        //         hashGoods.key = keysArray.join('(@)');
        //         console.log('hashkey. ',hashGoods.key);

        //         client.RENAME([key,hashGoods.key]);
        //     })
        // });

        // var args = [ 'myzset', 1, 'one'];
        // client.zadd(args, function (err, response) {
        //     if (err) throw err;
        //     console.log('added '+response+' items.');

        //     // -Infinity and +Infinity also work
        //     // var args1 = [ 'myzset', '+inf', '-inf' ];
        //     // client.zrevrangebyscore(args1, function (err, response) {
        //     //     if (err) throw err;
        //     //     console.log('example1', response);
        //     //     // write your code here
        //     // });

        //     // var max = 3, min = 1, offset = 1, count = 2;
        //     // var args2 = [ 'myzset', max, min, 'WITHSCORES', 'LIMIT', offset, count ];
        //     // client.zrevrangebyscore(args2, function (err, response) {
        //     //     if (err) throw err;
        //     //     console.log('example2', response);
        //     //     // write your code here
        //     // });
        // });

        //var key = '{"tablename":"mergoodsList4","parentid":50,"storecategoryid":114,"goodsseries":550,"status":3,"userid":5,"storeid":4,"name":"丑丑婴幼男童加绒长裤秋冬新款宝男宝时尚休闲长裤男童裤子","type":1,"sku":"ZVHS-4-1484295511755-155-260","updatedAt":1515397646673,"createdAt":1484295512000}';

        //client.set("string key", "string val", redis.print);
        // client.hset("hash key", "hashtest 1", "some value", redis.print);
        // client.hset(["hash key", "hashtest 2", "some other value"], redis.print);

        // client.hgetall("keys *", function (err, obj) {
        //     console.dir(obj);
        // });
        
        // var list = [];
        // client.keys('*"mergoodsList76"*', function (err, keys) {

        //     keys.forEach(function (key, pos) {
        //         console.log(pos,') pos');
        //         var objKey = JSON.parse(key);
        //         client.hkeys(key, function (err, val) {
        //             var objVal = JSON.parse(val);


        //             var item = {};

        //             // if (pos === (keys.length - 1)) {
        //             //     return res.json({
        //             //         data: list,
        //             //         code: 200
        //             //     });
        //             // }
        //         })
        //     })
        //     //console.log(keys.length);
        //     // replies.forEach(function (reply, i) {
        //     //     console.log("    " + i + ": " + reply);
        //     // });
        //     // client.quit();
        // });

        //_.invokeMap(c, String.prototype.split, ',');

        /*const querystring = require("querystring");
        var storeidArray = seller.getStoreIdArray();

        var tablist = [];
        for(var i = 0; i<storeidArray.length; i++) {
            var storeid = storeidArray[i];
            var tableName = gcom.getMysqlTable(TAB_M_GOODS,storeid);
            var queryMGoods = 'select * from ' + tableName;
            tablist.push(queryMGoods);
        }

        var datalist = [],idx = 0;
        while(tablist.length) {

            var item = tablist.pop();
            console.log("item. ",item);
            Creator.query(item, function (err, list) {
                console.log('list. ',list.length);
                datalist = datalist.concat(list);
                if (++idx === storeidArray.length) {
                    console.log('datalist',datalist.length);
                    while(datalist.length) {
                        var ele = datalist.pop();
                        var keyItem = {};
                        var valItem = {};
                        keyItem.isdelete = 0;
                        keyItem.tablename = gcom.getMysqlTable(TAB_M_GOODS,ele.storeid);
                        keyItem.parentid = ele.parentid;
                        keyItem.storecategoryid = ele.storecategoryid;
                        keyItem.goodsseries = ele.goodsseries;
                        keyItem.status = ele.status;
                        keyItem.userid = ele.userid;
                        keyItem.storeid = ele.storeid;
                        keyItem.name = ele.name;
                        keyItem.type = ele.type;
                        keyItem.sku = ele.sku;
                        keyItem.updatedAt = new Date().getTime();
                        keyItem.createdAt = new Date(ele.createdAt).getTime();

                        valItem.weight = 0;
                        valItem.reserve1 = 0;
                        valItem.reserve2 = 0;
                        valItem.reserve3 = 0;
                        valItem.reserve4 = 0;
                        valItem.reserve5 = 0;
                        valItem.reserve6 = 0;
                        valItem.reserve7 = 0;
                        valItem.reserve8 = 0;
                        valItem.reserve9 = 0;
                        valItem.brandid  = 0;

                        valItem.price = ele.price;
                        valItem.deposit = ele.deposit;
                        valItem.limited = ele.limited;
                        valItem.premoneey = ele.premoneey;
                        valItem.detailbody = ele.detailbody;
                        valItem.pricepoint = ele.pricepoint;
                        valItem.attachment = ele.attachment;
                        valItem.propertypic = ele.propertypic;
                        valItem.isseckilling = ele.isseckilling;
                        valItem.imagedefault = ele.imagedefault;
                        valItem.seckillingsell = ele.seckillingsell;
                        valItem.seckillingtime = ele.seckillingtime;
                        valItem.pricepromotion = ele.pricepromotion;
                        valItem.seckillingstock = ele.seckillingstock;
                        valItem.propertyrelated = ele.propertyrelated;
                        valItem.homenormalprice = ele.homenormalprice;
                        valItem.seckillingprice = ele.seckillingprice;
                        valItem.propertyvaluelist = ele.propertyvaluelist;
                        valItem.homeseckillingprice = ele.homeseckillingprice;

                        valItem.keywords = "";
                        valItem.imgfocus = "";
                        valItem.recommend = "";
                        valItem.reserve10 = ele.reserve10 || "";
                        valItem.presubtitle = ele.presubtitle || "";
                        valItem.presaleflow = ele.presaleflow || "";
                        valItem.seckillingflow = ele.seckillingflow || "";
                        valItem.presaledescript = ele.presaledescript || "";
                        valItem.seckillingexplain = ele.seckillingexplain || "";
                        valItem.presaleflowdescript = ele.presaleflowdescript || "";
                        valItem.precustomerserivice = ele.precustomerseivice || "";
                        valItem.seckillingdescription = ele.seckillingdescription || "";

                        if (_.isUndefined(valItem.presaleendtime)) {
                            valItem.presaleendtime = new Date().getTime();
                        }else{
                            valItem.presaleendtime = new Date(ele.presaleendtime).getTime();
                        }

                        if (_.isUndefined(valItem.presalestarttime)) {
                            valItem.presaleendtime = new Date().getTime();
                        }else{
                            valItem.presalestarttime = new Date(ele.prespresalestarttimealeendtime).getTime();
                        }

                        //var rediskey = JSON.stringify(keyItem);
                        //var redisval = JSON.stringify(valItem);

                        var keysArray = _.toPairs(keyItem);
                        var valsArray = _.toPairs(valItem);
                        client.hset(keysArray.join('(@)'), valsArray.join('(@)'),"xian", redis.print);
                    }
                }
            });
        }*/


        /*var parentIdArray = seller.getCParentIdArray();

        var tablist = [];
        for(var i = 0; i<parentIdArray.length; i++) {
            var  categoryid = parentIdArray[i];
            var tableName = gcom.getMysqlTable(TAB_C_GOODS,categoryid);
            var queryCGoods = 'select * from ' + tableName;
            tablist.push(queryCGoods);
        }

        var datalist = [],idx = 0;
        while(tablist.length) {

            var item = tablist.pop();
            console.log("item. ",item);
            Creator.query(item, function (err, list) {
                console.log('list. ',list.length);
                datalist = datalist.concat(list);
                if (++idx === parentIdArray.length) {
                    console.log('datalist',datalist.length);
                    while(datalist.length) {
                        var ele = datalist.pop();
                        var keyItem = {};
                        var valItem = {};
                        keyItem.isdelete = 0;
                        keyItem.tablename = gcom.getMysqlTable(TAB_C_GOODS,ele.parentid);
                        keyItem.parentid = ele.parentid;
                        keyItem.storecategoryid = ele.storecategoryid;
                        keyItem.goodsseries = ele.goodsseries;
                        keyItem.status = ele.status;
                        keyItem.userid = ele.userid;
                        keyItem.storeid = ele.storeid;
                        keyItem.name = ele.name;
                        keyItem.type = ele.type;
                        keyItem.sku = ele.sku;
                        keyItem.updatedAt = new Date().getTime();
                        keyItem.createdAt = new Date(ele.createdAt).getTime();

                        valItem.weight = 0;
                        valItem.reserve1 = 0;
                        valItem.reserve2 = 0;
                        valItem.reserve3 = 0;
                        valItem.reserve4 = 0;
                        valItem.reserve5 = 0;
                        valItem.reserve6 = 0;
                        valItem.reserve7 = 0;
                        valItem.reserve8 = 0;
                        valItem.reserve9 = 0;
                        valItem.brandid  = 0;

                        valItem.price = ele.price;
                        valItem.deposit = ele.deposit;
                        valItem.limited = ele.limited;
                        valItem.premoneey = ele.premoneey;
                        valItem.detailbody = ele.detailbody;
                        valItem.pricepoint = ele.pricepoint;
                        valItem.attachment = ele.attachment;
                        valItem.propertypic = ele.propertypic;
                        valItem.isseckilling = ele.isseckilling;
                        valItem.imagedefault = ele.imagedefault;
                        valItem.seckillingsell = ele.seckillingsell;
                        valItem.seckillingtime = ele.seckillingtime;
                        valItem.pricepromotion = ele.pricepromotion;
                        valItem.seckillingstock = ele.seckillingstock;
                        valItem.propertyrelated = ele.propertyrelated;
                        valItem.homenormalprice = ele.homenormalprice;
                        valItem.seckillingprice = ele.seckillingprice;
                        valItem.propertyvaluelist = ele.propertyvaluelist;
                        valItem.homeseckillingprice = ele.homeseckillingprice;

                        valItem.keywords = "";
                        valItem.imgfocus = "";
                        valItem.recommend = "";
                        valItem.reserve10 = ele.reserve10 || "";
                        valItem.presubtitle = ele.presubtitle || "";
                        valItem.presaleflow = ele.presaleflow || "";
                        valItem.seckillingflow = ele.seckillingflow || "";
                        valItem.presaledescript = ele.presaledescript || "";
                        valItem.seckillingexplain = ele.seckillingexplain || "";
                        valItem.presaleflowdescript = ele.presaleflowdescript || "";
                        valItem.precustomerserivice = ele.precustomerseivice || "";
                        valItem.seckillingdescription = ele.seckillingdescription || "";

                        if (_.isUndefined(valItem.presaleendtime)) {
                            valItem.presaleendtime = new Date().getTime();
                        }else{
                            valItem.presaleendtime = new Date(ele.presaleendtime).getTime();
                        }

                        if (_.isUndefined(valItem.presalestarttime)) {
                            valItem.presaleendtime = new Date().getTime();
                        }else{
                            valItem.presalestarttime = new Date(ele.prespresalestarttimealeendtime).getTime();
                        }

                        //var rediskey = JSON.stringify(keyItem);
                        //var redisval = JSON.stringify(valItem);

                        var keysArray = _.toPairs(keyItem);
                        var valsArray = _.toPairs(valItem);
                        client.hset(keysArray.join('(@)'), valsArray.join('(@)'),"xian", redis.print);
                    }
                }
            });
        }*/


        // var list = [];
        // var ccparentArray = seller.getSellerCCParentArray();

        // var keys = _.keys(ccparentArray);
        // var vals = _.values(ccparentArray);
        // //list.push(ccparentArray);
        // //list.push(ccparentArray);
        
        // while(keys.length) {
        //     list.push(keys.pop());
        //     list.push(vals.pop());
        // }
    
        // client.hmset("tab/1/4",list);
        // var keys = _.keys(ccparentArray);
        // var vals = _.values(ccparentArray);
        // while(keys.length) {
        //     list.push(keys.pop());
        //     list.push(vals.pop());
        // }
        // client.hset(list, redis.print);
        // client.set("xian key", "xian val", redis.print);
        // client.hset("xian key1", "hashtest 1", "some value", redis.print);
        // client.hset(["xian key2", "hashtest 1", "some other value"], redis.print);

        // console.log(sails.config);
        return res.json({
            data: [],
            msg:"xian",
            code: 200
        });

        // io.testMyCB("a","b",function(d) {
        //     console.log("d",d);
        // });
        //io.test(a,b,d) console.log("d",d); 

        // var cmdStr = this._cmdBase + 'api.wandoujia.com/v1/apps?phone_imei=861374037347422\'&\'tag=%u5B9D%u77F3%u6D88%u9664\'&\'start=0\'&\'type=weekly\'&\'max=40\'&\'id=baoqianli\'&\'token=b5f9592bbd8beca17a0915d989ed9b9d\'&\'timestamp=1513153952126';
        // console.log("cmdStr. check it out. ",cmdStr);
        // exec(cmdStr, function(err,stdout,stderr) {

        //     console.log("err: ",err," \n ");
        //     console.log("stdout: ",stdout," \n ");
        //     console.log("stderr: ",stderr," \n ");
        //     //return res.json(JSON.parse(stdout));
        // });

        // var allParams = req.allParams();
        // var skuObj = gcom.revertSku(allParams.sku); 
        // var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,skuObj.storeid);

        // var setMGoodsSql = 'update ' + tb_M_Name + ' set type = 1 where sku like \'' + skuObj.sku + '%\'';
        // console.log('setMGoodsSql: check it out: ', setMGoodsSql);

        // Creator.query(setMGoodsSql, function (err, recond) {
        //     if (err) return;
        //     console.log('cb_tag1: The result of this query is shown came out. check it out: ',recond);
        // });

        //获取商户服务中心实例
        // var cmdStr = this._cmdBase + 'CmdGoods/cmdServiceCenter?storeid=4';
        // console.log("cmdStr. ",cmdStr);
        // exec(cmdStr, function(err,stdout,stderr) {

        //     console.log("err: ",err," \n ");
        //     if (!stdout) return;

        //     //实例数据
        //     var instance = JSON.parse(stdout);
        //     //商品时间组
        //     instance.seckillinggroup = instance.seckillinggroup;
        //     //常规商品
        //     instance.gormalgoodsdata = instance.gormalgoodsdata;
        //     //预售商品
        //     instance.presalegoodsdata = instance.presalegoodsdata;
        //     //秒杀商品
        //     instance.seckillinggoodsdata = instance.seckillinggoodsdata;
        //     //秒杀商品序列化
        //     instance.seckillinggoodsseries = instance.seckillinggoodsseries;

        //     //校验SKU秒杀 
        //     //参数:
        //     //  skuArray,
        //     //  seckillingGoodsseries


        //     //seller.isSeckillingSku(skuArray,seckillinggoodsseries);
        //     /*
        //      *  校验SKU,如果有一个SKU不符合秒杀条件,都不能秒杀,程序默认
        //      *  跳出所有检查
        //      */
        //     return res.json({
        //         data: JSON.parse(stdout),
        //         code: 200
        //     });
        // });


        //var allParams = req.allParams();

        

        // var allParams
        // var host = "http://robottest.bqlcloud.com";
        // var path = "/pub/pubController/syncHeathGoods";
        // io.connect(host,path,req,allParams,function(err,list){

        // });

        //console.log('app. ',app);
        // var sqlGoodsCategory = "select id,categoryname,storeid from goodscategory where parentid = 0 and isdelete = 0 and storeid = 0";
        // console.log('sqlGoodsCategory: check it out: ',sqlGoodsCategory);

        // Goodscategory.query(sqlGoodsCategory, function query(err, list) {
        //     if (err) return;
        //     console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
            
        //     async.times(list.length, function(n, next) {

        //         var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,4);
        //         var totalMCGoodsSeriesSql = "select count(goodsseries) as total from " + tb_M_Name + " where goodsseries = 0 and `status` = 3 and parentid = " + list[n].id;
        //         console.log('totalMCGoodsSeriesSql. check it out. ',totalMCGoodsSeriesSql);
                
        //         Creator.query(totalMCGoodsSeriesSql, function (err, r) {
        //             if (err) {
        //                 console.log("err_tag2: When this error is returned, the query fails.");
        //                 return res.negotiate(err);
        //             }
        //             console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',r.length);
        //             list[n]['total'] = r[r.length-1].total;
        //             next(err,r);
        //         });

        //     }, function(err, users) {
        //         console.log('list. check it out. ',list);
        //         return res.json({
        //             data: list,
        //             code: 200
        //         });
        //     });
            
        // });

        // Accountseller.update({usermobile:'15626453533'}).set({useralias:'test',nickname:'修改完成'}).exec(function (err, recond) {
        //     if (err) return;
        //     console.log('cb_tag2: The result of this \' update \' is shown came out. check it out: ok');

        //     recond = recond || {};
        //     for(var i = 0; i<recond.length; i++) {
        //         delete recond[i].userbqlid;
        //         delete recond[i].password1;
        //         delete recond[i].password2;
        //         delete recond[i].createdAt;
        //         delete recond[i].updatedAt;
        //         delete recond[i].sex;
        //         delete recond[i].birthday;
        //         delete recond[i].departmentid;
        //         delete recond[i].unfreeztime;
        //         delete recond[i].isopenship;
        //         delete recond[i].alipayaccount;
        //         delete recond[i].weichataccount;
        //         delete recond[i].contacts;
        //         delete recond[i].shiplist;
        //     }
               
        //     return res.json({
        //         data: recond,
        //         code: 200
        //     });
        // });

        //console.log('self. ',this);
        // var obj = mapToObject(map);

        // var sign = utility.generateMixed(3, false);
        // sign += Math.ceil((new Date()).getTime() / 1000);

        // var extra={
        //     sign:sign,
        //     sender:4,
        //     sendavatar:0
        // };
        
        // PusherService.sendAliasCast(function (err, ret) {
        //     if (err) {
        //         console.log(' 尾款通知失败 ','xian');
        //     }else{
        //         console.log(' 尾款通知成功 ','xian2');
        //         console.log(' 尾款通知成功2 ',ret);
        //     }
        // }, 4, '尾款',"darling_msg",[5], extra, {"production_mode":false});

        // return res.json({
        //     data: [],
        //     code: 200,
        //     msg: "首页"
        // });
        // var val = "1:2:3:4:5:6:7:8:9:10:11:12:13:14:15:16:17:18:19:21:24:25:26:27:28:29:32:33:34:35:36:37:38:39:40:41:42:43:46:48:49:50:51:52:53:54:63:64:65:66:67:68:69:70:71:72:74:75:77:78:79:80:81:82:84:85:86:87:88:89:90:97:99:101:104:105:106:107:108:109:110:112:119:127:129:130:131:132:133:134:135:136:137:138:139:140:141:142:144:145:146:147:148:149:150:151:152:153:154:155:157:158:159:160:161:162:163:164:165:170:171:172:173:174:175:182:184:186:187:188:189:190:192:193:194:195:196:199:203:204:206:207:212:213:214:215:220:222:226:227:228:229:230:231:232:233:234:235:236:237:238:239:240"
        // SystemSetting.update({ key: "merchantDefaultPermission" }, {value: val}).exec(function (err, record) {
        //     if (err)  return res.negotiate(err);
            // return res.json({
            //     code: 200,
            //     msg: "设置成功",
            //     data:record,
            // });
        // });

        // var hid = allParams.hid || -1;
        // var storeid = allParams.storeid || -1; 
        // MsgObj.hid = 0;
        // MsgObj.storeid = 5;
        // MsgObj.addid = {">=": allParams.storeid };
        
        // //console.log('MsgObj. check it out. ',MsgObj);
        // Departmentgroup.find().exec(function (err, list) {
        //     if (err) return;
        //     console.log("cb_tag1: The result of this create is shown came out. check it out: ",list.length);
        //     return res.json({
        //         code: 200,
        //         data: list
        //     });
        // });

        // async.parallel([
        //     function(cb) { cb(null,1) },
        //     function(cb) { cb(null,2) },
        //     function(cb) { cb(null,2) }
        // ], function (err, results) {
        //     log('1.1 err: ', err); // -> undefined
        //     log('1.1 results: ', results); // ->[ 'a400', 'a200', 'a300' ]
        // });

        // if (gcom.againstInjecting(allParams.name)) {
        //     console.log("err");
        // }

        //teset
        
        //过滤URL非法SQL字符
        // var sUrl = allParams.name;
        // var sQuery=sUrl.substring(sUrl.indexOf("=")+1);
        // re=/select|update|delete|truncate|join|union|exec|insert|drop|count|’|"|;|>|<|%/i;
        // if(re.test(sQuery)){
        //     console.log("err");
        // }

        //         againstInjecting = function(serch) {
            
        //     //过滤URL非法SQL字符
        //     var sUrl = serch;
        //     var sQuery=sUrl.substring(sUrl.indexOf("=")+1);
        //     re=/select|update|delete|truncate|join|union|exec|insert|drop|count|’|"|;|>|<|%/i;
        //     if(re.test(sQuery)){
        //         return false;
        //     }
        //     return true;
        // };

        // async.parallel({
        //     a: function(cb) { 
        //         var arr = [];
        //         async.times(arr.length, function(n, next) {
        //             console.log('n1 => ',n);
                   
        //             var queryAccountSellerSql = "select id,nickname from accountseller";
        //             console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
         
        //             Accountseller.query(queryAccountSellerSql,function (err, list) {
        //                 if (err) {
        //                     console.log("err_tag1: When this error is returned, the query fails.");
        //                     return res.negotiate(err);
        //                 } 
        //                 console.log('cb_tag1: The result of this \' query \' is shown came out. check it out: ',list.length);
        //                 next(err,list);
        //             });

        //         }, function(err, users) {
        //             console.log('err. ',err, '\n','users. ',users)
        //             cb(err,1);
        //         });
        //     },
        //     b: function(cb) {
        //         var arr = [1,2];
        //         async.times(arr.length, function(n, next) {
        //             console.log('n2 => ',n);
                   
        //             var queryAccountSellerSql = "select id,nickname from accountseller";
        //             console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
         
        //             Accountseller.query(queryAccountSellerSql,function (err, list) {
        //                 if (err) {
        //                     console.log("err_tag2: When this error is returned, the query fails.");
        //                     return res.negotiate(err);
        //                 } 
        //                 console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',list.length);
        //                 next(err,list);
        //             });

        //         }, function(err, users) {
        //             console.log('err. ',err, '\n','users. ',users)
        //             cb(err,2);
        //         });
        //     },
        //     c: function(cb) {
        //         var arr = [1,2,3];
        //         async.times(arr.length, function(n, next) {
        //             console.log('n3 => ',n);
                   
        //             var queryAccountSellerSql = "select id,nickname from accountseller";
        //             console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
         
        //             Accountseller.query(queryAccountSellerSql,function (err, list) {
        //                 if (err) {
        //                     console.log("err_tag3: When this error is returned, the query fails.");
        //                     return res.negotiate(err);
        //                 } 
        //                 console.log('cb_tag3: The result of this \' query \' is shown came out. check it out: ',list.length);
        //                 next(err,list);
        //             });

        //         }, function(err, users) {
        //             console.log('err. ',err, '\n','users. ',users)
        //             cb(err,3);
        //         });
        //     }
        // }, function (err, results) {
        //     console.log(results.b===2)
        //     console.log('1.1 err: ', err); // -> undefined
        //     console.log('1.1 results: ', results); // ->[ 'a400', 'a200', 'a300' ]
        // });

        //          myData = JSON.parse(text, function (key, value) {
        //              var a;
        //              if (typeof value === "string") {
        //                  a =
        //   /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
        //                  if (a) {
        //                      return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
        //                          +a[5], +a[6]));
        //                  }
        //              }
        //              return value;
        //          });

        //          myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
        //              var d;
        //              if (typeof value === "string" &&
        //                      value.slice(0, 5) === "Date(" &&
        //                      value.slice(-1) === ")") {
        //                  d = new Date(value.slice(5, -1));
        //                  if (d) {
        //                      return d;
        //                  }
        //              }
        //              return value;
        //          });
        
        // delete allParams.name;

        //  function doRegister(msg) {
        //     Accountseller.create(msg).exec(function userRegister(err, recond) {
        //         console.log("err. ",err);
        //         if (err) return;
        //         console.log('cb_tag1: The result of this \' create \' is shown came out. check it out: ok');

        //         recond.save(function (err) {
        //             if (err) return;
        //             return res.json({
        //                 code: 200,
        //                 data: recond.useralias,
        //                 msg: "注册成功"
        //             }); 
        //             console.log("save_tag2: This saved successfully. ",recond.useralias)
        //         });
        //     });
        //  }


        // allParams.shiplist = 0;
        // allParams.isopenship = 0;
        // allParams.shipstatus = 0;
        // allParams.statuscode = 2;
        // allParams.shiprequest = 0;

        // allParams.sex = allParams.sex || 0;
        // allParams.city = allParams.city || "";
        // allParams.area = allParams.area || "";

        // allParams.address = allParams.address || "";
        // allParams.userpic = allParams.userpic || "";

        // allParams.nickname = allParams.nickname || "test";
        // allParams.realname = allParams.realname || "";
        // allParams.province = allParams.province || "";
        // allParams.contacts = allParams.contacts || "";

        // allParams.userbqlid = allParams.userbqlid || 0;
        // allParams.telephone = allParams.telephone || "";
        // allParams.useralias = allParams.useralias || "xian";
        // allParams.useremail = allParams.useremail || "";
        // allParams.password1 = allParams.password1 || "";
        // allParams.password2 = allParams.password2 || "";

        // allParams.usermobile = allParams.usermobile || "123456789000";
        // allParams.straddress = allParams.straddress || "";
        // allParams.operatorno = allParams.operatorno || "";

        // allParams.legalperson = allParams.legalperson || "";
        // allParams.license_pic = allParams.license_pic || "";
        // allParams.companyname = allParams.companyname || "";
        // allParams.mobileCode = allParams.mobileCode || false;

        // allParams.mainbusiness = allParams.mainbusiness || "";
        // allParams.telephonefax = allParams.telephonefax || "";
        // allParams.departmentid = allParams.departmentid || "";

        // allParams.birthday = allParams.birthday || "2016-09-08"
        // allParams.alipayaccount = allParams.alipayaccount || "";
        // allParams.weichataccount = allParams.weichataccount || "";
        // allParams.categorylist = allParams.categorylist || "其它";
        // allParams.servicetelephone = allParams.servicetelephone || "";
        // allParams.store_banner_pic = allParams.store_banner_pic || "";
        // allParams.store_banner_pic_phone = allParams.store_banner_pic_phone || "";


        // doRegister(allParams);






        // var s = "66:4:5:4:66";
        // var arr = s.split(":");

        // var storeid = 4;
        // var temp = arr.indexOf(storeid.toString());
        // console.log('test. ',temp);








        // accountseller.query("SELECT email FROM user WHERE  = ?", [ email ]))
        // .then(function(err, rows) {
        //   console.log(rows);
        // })


        // var findCombineLike = {
        //     'usermobile':true,
        // };

        // var findCombineOffen = {
        //     'id':true,
        //     'operatorno':true,
        //     'statuscode':true,
        // };

        
        // var storeid = 4;

        // allParams.id || delete allParams.id;
        // allParams.statuscode || delete allParams.statuscode;
        // allParams.operatorno || delete allParams.operatorno;
        // allParams.usermobile || delete allParams.usermobile;
        // allParams.createdAt1 || delete allParams.createdAt1;
        // allParams.createdAt2 || delete allParams.createdAt2;

        // //console.log('allParams. check it out. ',allParams);

        // var gd = ["id","usermobile","operatorno","createdAt","statuscode"];

        // var queryAccountSql = "select " + gd.join(",") + " from account";

        // var zkey =  0;
        // var keys = _.keys(allParams);
        // //console.log('keys. check it out. ',keys);

        // for(var key in allParams) {

        //     if (zkey === 0) {
        //         queryAccountSql += " where ";
        //     }

        //     var val = allParams[key];
        //     if (findCombineOffen[key]) {
        //         ++zkey;
        //         queryAccountSql += key + " = " + val;
        //         queryAccountSql += (zkey < keys.length) ? " and " : "";
        //     }

        //     if (findCombineLike[key]) {
        //         ++zkey;
        //         queryAccountSql += key + " like " + "\'%" + val + "%\'";
        //         queryAccountSql += (zkey < keys.length) ? " and " : "";
        //     }
        // }

        // //特殊处理
        // if (allParams.createdAt1 && allParams.createdAt2) {
        //     queryAccountSql += " createdAt >= " + "\'" + allParams.createdAt1 + "\'" + " and ";
        //     queryAccountSql += " createdAt <= " + "\'" + allParams.createdAt2 + "\'";
        // }

        // console.log('queryAccountSql. check it out. ',queryAccountSql);
        // Account.query(queryAccountSql,function (err, list) {
        //     if (err) return;
        //     console.log("cb_tag1: The result of this \' find \' is shown came out. check it out: ",list.length);
        //     return res.json({
        //         data: list,
        //         code: 200,
        //         msg: "",
        //     });
        // });















        // var arr = ["xian","wei","jian"];
        // var name = allParams.name || "xian";


        // async.series([
        //     function(cb) {
        //             console.log("-----------------------------------");
        //             var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,4);
        //             var queryMGoodsSql = 'select reserve3,reserve6,reserve7 from ' + tb_M_Name;
        //             queryMGoodsSql += ' WHERE (reserve3!=0 and reserve3!="")';
        //             queryMGoodsSql += ' and (reserve6!=0 and reserve6!="") and ';
        //             queryMGoodsSql += '(reserve7!=0 and reserve7!="") ';
        //             console.log('queryMGoodsSql: check it out: ', queryMGoodsSql);

        //             Creator.query(queryMGoodsSql, function query(err, list) {
        //                 if (err) return;
        //                 t.inc(list.length, cb);
        //                 console.log("-----------------------------------"); 
        //                 console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
        //             }); 
        //     },
        //     function(cb) { t.inc(8, cb); },
        //     function(cb) { t.inc(2, cb); }
        // ], function(err, results) {
        //     console.log('1.1 err: ', err); // -> undefined
        //     console.log('1.1 results: ', results); // -> [ 4, 9, 3 ]
        // });

        //
        // var fn = async.memoize(t.slow_fn);

        // fn('a','b', function(err, result) {
        //     console.log(result);
        // });

        // // 直接得到之前计算好的值
        // fn('a','b', function(err, result) {
        //     console.log(result);
        // });

        // async.parallel({
        //     one: function(callback) {
        //         dt.initSkuArray(0,39667);
        //     },
        //     two: function(callback) {
        //         for(var i = 0;i<10000000;i++){
        //             if (i==10000000 - 1) {
        //                 callback(null, i+1)
        //             }
        //         }
        //     }
        // }, function(err, results) {
        //      console.log('err. ',err, '\n','results. ',results)
        // });

        // var category = {};
        // var arr = [1,2,3,4];
        // async.times(arr.length, function(n, next) {
        //     console.log('n => ',n);
        //     next(null,n);
        //     // createUser(n, function(err, user) {
        //     //     next(err, user);
        //     // });
        //     // var queryAccountSellerSql = "select id,nickname from accountseller";
        //     // console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
 
        //     // Accountseller.query(queryAccountSellerSql,function (err, list) {
        //     //     if (err) {
        //     //         console.log("err_tag2: When this error is returned, the query fails.");
        //     //         return res.negotiate(err);
        //     //     } 
        //     //     console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',list.length);
        //     //     next(err,list);
        //     // });

        // }, function(err, users) {
        //     console.log('err. ',err, '\n','users. ',users)
        //     // we should now have 5 users
        // });


        // var id = allParams.id || 1;
        // var sqlQueryTest = "select id,nickname from accountseller" + " where id = ? " + [id];
        // console.log("sqlQueryTest. check it out. ",sqlQueryTest);
        // Accountseller.query(sqlQueryTest,function (err, list) {
        //     if (err) return;
        //     console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ok');
        //     return res.json({
        //         data: list,
        //         code: 200,
        //         msg: "首页"
        //     });
        // });

        

        // var sku = 43201;
        // var isuse = 0;
        // var insertSKUSql = 'insert into stockkeepingunit(sku, isuse)';
        // insertSKUSql += 'select \''+ sku +'\', \'' + isuse+ '\' from dual where ';
        // insertSKUSql += '\''+ sku +'\' not in(select sku from stockkeepingunit);'

        // console.log('insertSKUSql. check it out. ',insertSKUSql); 
        // StockKeepingUnit.query(insertSKUSql,function (err, list) {
        //     if (err) return;
        //     console.log("cb_tag1: The result of this \' create \' is shown came out. check it out: ",list);
        // });

        // var lastIdx = 0;
        // var prevIdx = 10;
        // //初始化数据
        // dt.initialize();
        // //建立排列库存
        // dt.initArrange();
        // //初始化SKU数组
        // dt.initSkuArray(0,376992);
        // var chars1 = ['0','1','2','3','4','5','6','7','8','9'];
        // var chars2 = ['A','B','C','D','E','F','G','H','I','J','K','L','M',
        //     'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

        // var result = [];
        // for(var i = 0;i<chars2.length;i++) {
        //     for(var j = 0; j<chars1.length;j++){

        //     }
        // }

        // var keys = ['0','1','2','3','4','5','6','7','8','9',
        //     'A','B','C','D','E','F','G','H','I','J','K','L','M',
        //     'N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        // var len = keys.length;
        // var arrange = new Array();
        // for(var i=0;i<len-4;i++){
        //     for(var j=i+1;j<len-3;j++){
        //         for(var k=j+1;k<len-2;k++){
        //             for(var l=k+1;l<len - 1;l++){
        //                 for(var m=l+1;m<len;m++){
        //                     arrange.push(keys[i]+keys[j]+keys[k]+keys[l]+keys[m]);
        //                 }
        //             }
        //         }
        //     }
        // }

        // var str = ['a',1,2,3,4],list = [];
        // function arrange(s){            
        //     for(var i=0,length=str.length; i<length; i++) {
        //         if(s.length == length - 1) {
        //             if(s.indexOf(str[i]) < 0) {
        //                 list.push(s + str[i]) 
        //             }
        //             continue;
        //         }
        //         if(s.indexOf(str[i]) < 0) {
        //             arrange(s+str[i]);
        //         }               
        //     }
        // }
        // arrangeSku('');

        // var index = 1;
        // var sellerlist = sellerlist || [];
        // for(var i = 1;i<10000;i++) {
        //     var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS, i);
        //     var queryMGoodsSql = 'select * from ' + tb_M_Name + ' where ' +'goodsseries = 0';
        //     Creator.query(queryMGoodsSql, function query(err, list) {
        //         index = index + 1;
        //         console.log('cb_tag1: The result of this query is shown came out. check it out: ', index);
        //     });
        // }
        




















        //return res.send({list:[1,2,3],user:'xian',me:{ test:"xian"}});
        // var list = [];
        // var sInx = 0;
        // var eInx = 100;

        // var page = allParams.page;
        // var classify = allParams.classify;

        // if (page>0) {
        //     return res.json({
        //         data: gcom.getGoodsPage(classify,page),
        //         code: 200,
        //         msg: "当前页"
        //     });
        // }

        
        // while(sInx<eInx){ 
        //     list.push({me:sInx});
        //     sInx++;
        // }

        // gcom.setGoodsArray(classify,list);
        
        // return res.json({
        //     data: gcom.getNowPage(classify,page),
        //     page: gcom.calcPageCount(classify),
        //     code: 200,
        //     msg: "首页"
        // });

        // var storeid = 4;
        // var CLASSIFY_ALLGOODS = 0;   //全部商品

        // if (page>0&&classify===CLASSIFY_ALLGOODS) {
        //     var cache =  gcom.getCache();
        //     return res.json({
        //         code: 200,
        //         msg: "当前页商品",
        //         data: {
        //             newlist: cache.newlist,
        //             oldlist: cache.oldlist,
        //             userpic: cache.userpic,
        //             nickname: cache.nickname,
        //             servicetelephone: cache.servicetelephone,
        //             store_banner_pic: cache.store_banner_pic,
        //             list:gcom.getGoodsPage(CLASSIFY_ALLGOODS,page),
        //             store_banner_pic_phone: cache.store_banner_pic_phone,
        //         },
        //     });
        // }

        // async.auto({

        //     querySeller: function (callback) {

        //         try {

        //             Accountseller.findOne({id: storeid},function (err, recond) {
        //                 if (err) return;
        //                 console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ok');

        //                 recond = recond || {};
        //                 recond.shopsconfig = recond.shopsconfig || "";
        //                 recond.shopsconfig = recond.shopsconfig.split(',');
        //                 recond.shopsconfig.remove("");

        //                 var list  = [],newlist = [],oldlist = [];
        //                 console.log('recond.shopsconfig.length. ',recond.shopsconfig.length);
        //                 for (var i = 0; i < recond.shopsconfig.length; i++) {

        //                     var shopsconfigObj = {};
        //                     var shopsconfigArr = recond.shopsconfig[i].split('-');
                            
        //                     shopsconfigObj.id = parseInt(shopsconfigArr[0]);
        //                     shopsconfigObj.name = String(shopsconfigArr[1]);
        //                     shopsconfigObj.sortorder = parseInt(shopsconfigArr[2]);
        //                     shopsconfigObj.goodsseries = [];

        //                     shopsconfigArr[3] = shopsconfigArr[3] || "";
        //                     var goodsseriesArr = shopsconfigArr[3].split('|');

        //                     goodsseriesArr.remove("");
        //                     for (var j = 0; j < goodsseriesArr.length; j++) {
        //                         var goodsseries = goodsseriesArr[j].split('[.]');

        //                         var Goods = {};
        //                         Goods.id = goodsseries[0];
        //                         Goods.sortorder = goodsseries[2];
        //                         Goods.storecategoryid = goodsseries[1];
        //                         Goods.goodsseries =  [];

        //                         //存入系列商品
        //                         shopsconfigObj.goodsseries.push(Goods);
        //                     }

        //                     if (shopsconfigObj.id == 1) {
        //                         newlist.push(shopsconfigObj);
        //                     }

        //                     if (shopsconfigObj.id == 2) {
        //                         oldlist.push(shopsconfigObj);
        //                     }
                            
        //                 }

        //                 var userpic = recond.userpic
        //                 var nickname = recond.nickname;
        //                 var servicetelephone = recond.servicetelephone;
        //                 var store_banner_pic = recond.store_banner_pic;
        //                 var store_banner_pic_phone = recond.store_banner_pic_phone;
        //                 callback(err,{ list, newlist, oldlist, nickname, userpic, store_banner_pic, servicetelephone, store_banner_pic_phone });
        //             });

        //         }catch (e) {
        //             console.log('querySeller err: ', e);
        //         }
        //     },
            
        //     queryMGoods:['querySeller', function (callback, result) {

        //         try {

        //             var newlist = result.querySeller.newlist;
        //             var oldlist = result.querySeller.oldlist;
        //             var nickname = result.querySeller.nickname;
        //             var userpic = result.querySeller.userpic;
        //             var store_banner_pic = result.querySeller.store_banner_pic;
        //             var store_banner_pic_phone = result.querySeller.store_banner_pic_phone;
        //             var servicetelephone = result.querySeller.servicetelephone;

        //             var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
        //             var gd = ["name","storeid","sku","imagedefault","price","id","createdAt",
        //                 "type","deposit","premoneey","presaleendtime","presaleflow","presaleflowdescript",
        //                 "presaledescript","precustomerserivice","presubtitle","storecategoryid"];

        //             //查询商品
        //             var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where goodsseries = 0 and status = 3';
        //             console.log('queryMGoodsSql: check it out. ',queryMGoodsSql);
        //             Creator.query(queryMGoodsSql, function (err, list) {
        //                 if (err) return;
        //                 console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',list.length);

        //                 callback(err,{ list, newlist, oldlist, nickname, userpic, store_banner_pic, servicetelephone, store_banner_pic_phone });
        //             });
                    
        //         }catch (e) {
        //             console.log('queryMGoods err: ', e);
        //         }
        //     }],

        // }, function (err, results) {

        //     //校验结果
        //     results = results || {};
        //     results.queryMGoods = results.queryMGoods || {};

        //     //校验数据
        //     var list = results.queryMGoods.list || [];
        //     var newlist = results.queryMGoods.newlist || [];
        //     var oldlist = results.queryMGoods.oldlist || [];
        //     var userpic = results.queryMGoods.userpic || "";
        //     var nickname = results.queryMGoods.nickname || "";
        //     var store_banner_pic = results.queryMGoods.store_banner_pic || "";
        //     var store_banner_pic_phone = results.queryMGoods.store_banner_pic_phone || "";
        //     var servicetelephone = results.queryMGoods.servicetelephone || "";

        //     gcom.setCache({
        //         newlist:newlist,
        //         oldlist:oldlist,
        //         userpic:userpic,
        //         nickname:nickname,
        //         servicetelephone:servicetelephone,
        //         store_banner_pic:store_banner_pic,
        //         store_banner_pic_phone:store_banner_pic_phone,
        //         list:gcom.getNowPage(CLASSIFY_ALLGOODS,page,list),
        //     })
        //     gcom.setGoodsArray(CLASSIFY_ALLGOODS,list);

        //     return res.json({
        //         code: 200,
        //         msg : "首页商品",
        //         data: {
        //             newlist:newlist,
        //             oldlist:oldlist,
        //             userpic:userpic,
        //             nickname:nickname,
        //             servicetelephone:servicetelephone,
        //             store_banner_pic:store_banner_pic,
        //             store_banner_pic_phone:store_banner_pic_phone,
        //             list:gcom.getNowPage(CLASSIFY_ALLGOODS,page,list),
        //         }
        //     });

        // var useralias = allParams.useralias;
        // var usermobile = allParams.usermobile;
        // var queryAccountsellerSql = { or: [{'usermobile': usermobile}, {'useralias': useralias}] };
        // Accountseller.find(queryAccountsellerSql).exec(function (err, list) {
        //     if (err) return;
        //     console.log('list: check it out. ',list);
        //     if (list.length) {

        //         for(var i = 0;i<list.length;i++) {
        //             if (list[i].useralias === useralias) {
        //                 return res.json({
        //                     data: [],
        //                     code: 400,
        //                     msg: "该商户名称已经注册过了"
        //                 });     
        //             }
        //             if (list[i].usermobile === usermobile) {
        //                 return res.json({
        //                     data: [],
        //                     code: 400,
        //                     msg: "该商户号码已经注册过了"
        //                 });     
        //             }
        //         }
        //     } else {
        //         return res.json({
        //             data: [],
        //             code: 200,
        //             msg: "注册成功"
        //         });
        //     }
        // });
        
        // describe('User', function() {
        //   describe('#save()', function() {
        //     it('should save without error', function(done) {
        //       var user = new User('Luna');
        //       user.save(function(err) {
        //         if (err) done(err);
        //         else done();
        //       });
        //     });
        //   });
        // });



        // var a = [1,2,3];

        // return res.json({
        //     code:200,
        //     data:a.includes(1),
        // })

        // var categorylvobj = {};
        // var lvFirstArray = [];
        // var lvTwoArray = [];
        // var lvThreeArray = []; 
        // var ccategorylist = seller.getCCategory();
        // for(var i = 0; i<ccategorylist.length; i++) {
        //     var ccategoryObj = ccategorylist[i];
        //     var hidArray = ccategoryObj.hid.split(":");
            
        //     var LEN_SECOND = 2;
        //     var LEN_THIRD = 3;
        //     var LEN_FOUTH = 4;
        //     switch(hidArray.length) {
        //         case LEN_SECOND:
        //             lvFirstArray.push(ccategoryObj);
        //             break;
        //         case LEN_THIRD:
        //             lvTwoArray.push(ccategoryObj);
        //             break;
        //         case LEN_FOUTH:
        //             lvThreeArray.push(ccategoryObj);
        //             break;
        //         default:
        //             console.log('err: ',hidArray.length);
        //     }
        // }

        // var lvFirstMap = {};
        // var lvTwoMap = {};
        // var lvThreeMap = {};

        // for(var i = 0; i<lvFirstArray.length; i++) {
        //     var lvFirstObj = lvFirstArray[i];
        //     lvFirstMap[lvFirstObj.id] = lvFirstObj.categoryname;
        // }
        // //console.log(lvFirstMap)
        // for(var key in lvFirstMap) {
        //     for(var i = 0; i<lvTwoArray.length; i++) {
        //         var lvTwoObj = lvTwoArray[i];
        //         var hidArray = lvTwoObj.hid.split(":");
        //         if (hidArray.includes(key)) {
        //             var id = hidArray[2];
        //             var name = seller.findCCategoryName(id);
        //             lvTwoMap[key] = lvTwoMap[key] || {};
        //             lvTwoMap[key][id] = name;
        //         }
        //     }
        // }

        // for(var k in lvFirstMap) {
        //     categorylvobj[k] = lvFirstMap[k];
        //     for(var kk in lvTwoMap) {
        //         categorylvobj[k] = categorylvobj[k] || {};
        //         categorylvobj[k][kk] = lvTwoMap[kk];
        //     }
        // }
        // //console.log(lvTwoMap)
        // console.log(categorylvobj)


        // for(var key in lvTwoMap) {
        //     var lvTwoObj = lvTwoMap[key];
        //     console.log('lvTwoObj',lvTwoObj);
        //     for(var i = 0; i<lvThreeArray.length; i++) {
        //         var lvThreeObj = lvThreeArray[i];
        //         var hidArray = lvThreeObj.hid.split(":");
        //         if (hidArray.includes(key)) {
        //             var id = hidArray[2];
        //             var name = seller.findCCategoryName(id);
        //             lvTwoMap[key] = lvTwoMap[key] || {};
        //             lvTwoMap[key][id] = name;
        //         }
        //     }
        // }
        

        // return res.json({
        //     code:200,
        //     data:seller.getCategory(),
        // })
        // console.log(seller.queryCCategory());
        // return res.json({
        //     code:200,
        //     data:200,
        // })
        


        //var shops = "1-全部商城-670[.]207[.]0,3-商城，,，，，-670[.]207[.]0";
        // var list = ["1-全部商城-670[.]207[.]0","3-商城，,，，，-670[.]207[.]0"];
        // var newlist = [];

        //  //特殊处理
        // var toString = function(val) {
        //     var _val = -1;
        //     var fbsArr = [",","，"]
        //     while(fbsArr.length>0) {
        //         var fbs = fbsArr.pop();
        //         if(fbs === val){
        //             _val = "\\'" + val + "\\'";
        //         }               
        //     } 

        //     return typeof(_val) == 'string'?_val:val
        // };

       
        // for(var i = 0; i<list.length; i ++) {
        //     var e = list[i]
        //     var newstring ="";
        //     for(var j = 0;j<e.length;j++){
        //         newstring += toString(e[j])
        //     }
        //     newlist.push(newstring);
        // }
        
        // var liststr = newlist.toString();
        // var oldlist = liststr.split(',');

        // return res.json({
        //     code:200,
        //     data:{
        //         newlist:liststr,
        //         oldlist:oldlist,
        //     },
        // })


        // var client=redis.client({db:2});
        // client.del("xian", function (err, reply) {
        //     if (err) {
        //         console.log("xian",err);
        //         return;
        //     };
        //     console.log(reply);     // 删除成功，返回1，否则返回0(对于不存在的键进行删除操作，同样返回0)
        // });

        // return res.json({
        //     code:200,
        //     data:[],
        // })

        // client.hmset("xian",seller.getSellerCCParentArray());

        // client.hgetall("xian",function(err,value) {
        //     if (err) {
        //         console.log("xian",err);
        //         return;
        //     };
        //     return res.json({
        //         code:200,
        //         data:value,
        //     })
        // })
        // return res.json({
        //     code:200,
        //     data:seller.getAdminCCParentArray(),
        // });

        // describe('test my chamo', function () {
        // }

        // var start = (new Date()).valueOf();

        // var cbCount = 0;
        // var arr = [],listItem = [];
        // for(var i = 0; i<10000000; i++) {
        //     listItem.push({id:i});
        // }



        // Accountseller.find({or:listItem}).exec(function (err, list) {
        //     if (err) return;
        //     var end = (new Date()).valueOf();
        //     return res.json({
        //         code:200,
        //         dt:end - start,
        //         data:list,
        //         list:listItem,
        //     });
        // });
        // while(listItem.length) {
        //     next(listItem.pop());
        // }
        // function next(id) {
        //     console.log(id);
        //     Accountseller.findOne({id: id}).exec(function (err, recond) {
        //         if (err) return;

        //         cbCount = cbCount + 1;
        //         console.log('recond: ',recond);
        //         if (cbCount === 4) {
        //             return res.json({
        //                 code:200,
        //                 data:recond
        //             });
        //         }
        //         // recond.shopsconfig = recond.shopsconfig || ""
        //         // recond.shopsconfig = "xianweijian"

        //         // recond.save(function (err) {
        //         //      if (err) return;
        //         //      console.log("save_tag1: This saved successfully.")
        //         //  })
        //     });
        // };



        //gcom.setCache('xian');
        // var obj = {};
        // var keys = _.isObject(ojb);
        // console.log('keys is ',keys);
        // async.auto({
        //     queryCategory: function (callback) {
        //         try {
        //             //'ERR_CATEGORY_NULL'
        //             callback(null,0);

        //         }catch (e) {
        //             console.log('queryCategory err: ', e);
        //         }
        //     },
        //     queryProval: function (callback) {
        //         try {

        //            callback('ERR_PROPERTYVALUE_NULL',0);

        //         }catch (e) {
        //             console.log('queryProval err: ', e);
        //         }
        //     },
        // }, function (err, results) {

        //     //console.log('results',results);
        //     return res.json({
        //         data:results,
        //         err:err,
        //         code: 200,
        //         msg: "操作成功"
        //     });
        // });

        // var m = new Map();
        // m.set('id',undefined);
        // scom.isEmpty('id',m);

        //utils.fn();



        //var g = require('../node_modules/goods/gg.js');
        //g.initialize();


        // queryMGoods = function(liststrs) {
        //     while(liststrs.length>0) {
        //         var tb_M_Name = liststrs.pop();
        //         var queryMGoodsSql = 'select reserve3,storeid from ' + tb_M_Name + ' where reserve3!= "" and reserve3!=0';
        //         console.log('queryMGoodsSql: check it out. ',queryMGoodsSql);
        //         Creator.query(queryMGoodsSql, function (err, list) {
        //             if (err) return;
        //             console.log('cb_tag2: The result of this query is shown came out. check it out. ',list.length);
        //             if(list.length>0){
        //                 var item = list.pop();
        //                 var storeid = item.storeid;
        //                 setAccountSellerSql = 'update accountseller set horizontalalliances  = \"' + item.reserve3 + '\" where id = ' + storeid;
        //                 console.log('setAccountSellerSql: check it out. ',setAccountSellerSql);
        //                 Accountseller.query(setAccountSellerSql, function (err, record) {
        //                     if (err) return;
        //                     console.log('cb_tag3: The result of this query is shown came out. check it out. ok');
        //                 });
        //             }
        //         }); 
        //     }
        // };

        // var m = _.min(5,6) || 50;
        // console.log('min: ',m);
        // //String('2000/\1ddsdfsdfsafadfas')
        // var quertAccountSql = 'select id, from accountseller'
        // console.log('quertAccountSql. check it out. ',quertAccountSql);
        // Accountseller.query(quertAccountSql, function (err, list) {
        //     if (err) return;
        //     queryMGoods(liststrs);
        //     console.log('cb_tag1: The result of this \' select \' is shown came out. check it out: ', list);
        // });

        // return res.json({
        //     code:200,
        //     data:[]
        // });
        // //var mine = req.session.mine;
        // var allParams = req.allParams();
        // var skuObj = gcom.revertSku(allParams.sku);
        // var sku = skuObj.sku,storeid = skuObj.storeid;

        // var tbMerName = gcom.getMysqlTable(TAB_M_GOODS,storeid);
        // var selectmergoodslistSql = 'select sku,goodsseries from ' + tbMerName + ' where sku like \'' + sku+ '%\' and status = 3';
        // console.log('selectmergoodslistSql: check it out. ', selectmergoodslistSql);

        // Creator.query(selectmergoodslistSql, function (err, list) {
        //     if (err) return;
        //     //setGoods(list.length === 1 ? LEN : SET,parentid,storeid,list.length === 1 ? skuObj.sku : skuObj.sku + "-" + skuObj.a_proid);
        //     console.log('cbq_tag1: The result of this delete is shown came out. check it out. ',list.length);
        //     return res.json({
        //         code:200,
        //         data:list
        //     });
        // });

        //var name = allParams.name;
        //var description = allParams.name + '规格';


         // var norms = new Map;
         // norms.set('status',0);
         // norms.set('name',allParams.name);
         // norms.set('storeid',mine.storeid);
         // norms.set('sortorder',0);
         // norms.set('aliasname',0);
        
        // console.log('----------LIST-------------');
        // var List = require("../collections/list");
        // console.log('----------LIST-------------');

        // var i = 0;
        // var list = new List();
        // list.add({'xian':100});
        // list.add(i++);
        // list.add(i++);
        // list.add(i++);
        // list.add(i++);
        // list.add(i++);
        // list.add(i++);

        // list.unshift(9, 10);
        // var arr = list.toArray();
        // var obj = list.toObject();

        // console.log('one: ',list.one());
        // console.log('poke: ',list.poke(2))
        // console.log('peek: ',list.peek())
        // console.log('shift: ',list.unshift());
        // console.log('shift: ',list.shift());

        //  console.log('----------Map-------------');
        //  Map = require("../collections/map");
        //  console.log('----------Map-------------');

        // var map = new Map({a: 1, b: 2});
        // map.set("c", 3);

        //create table goodsList' + categoryid + ' like goodscontent
        
        // gotoCreate = function(sql) {
        //     Creator.query(sql, function (err, record) {
        //         if (err) {
        //             console.log("err: check it out. ",err);
        //             return;
        //         }
        //         console.log('cb_tag1: The result of this \' create \' is shown came out. check it out: ', record.length);
        //     });
        // };

        // var querytext = "SELECT table_name FROM information_schema.TABLES WHERE table_name ='mergoodsList190'";
        // Creator.query(querytext, function (err, record) {
        //     if (err) {
        //         console.log("err: check it out. ",err);
        //         return;
        //     }

        //     console.log('cb_tag1: The result of this \' create \' is shown came out. check it out: ', record.length);
        //     if (record.length === 0) {
        //        console.log('createdAt ok');
        //     }
        // });
         // var dataQueue = []; 
         // var TYPE_SELLER = 1,TYPE_CATEGORY = 2;

         // //集中处理商户数据
         // dealwithCenter = function(tyep) {

         // };

         // //集中处理回调数据
         // callBackCenter = function(err,list) {
         //    while(list.length>0) {
         //        var item = list.pop();
         //        dataQueue
         //    }
         // };

         // //集中处理更新信息
         // gotoUpdateSeller = function(sql) {
         //    Accountseller.query(sql, function (err, record) {
         //        if (err) return;
         //        console.log('cb_tag1: The result of this \' update \' is shown came out. check it out: ', record);
         //     });
         // };

         // //集中处理筛选信息
         // gotoQuerySeller = function(sql) {
         //    Creator.query(sql, function (err, list) {
         //        if (err) return;
         //         callBackCenter(err,list)
         //        for(var i=list.length - 1 > 0 ? list.length - 1 : 0; i<list.length; i++) {
         //            var item
         //        }
         //         console.log('cb_tag1: The result of this \' select \' is shown came out. check it out: ', record.length);
         //    });
         // };

         // Accountseller.find({id:{'>':0}}).exec(function (err, list) {
         //    if (err) return;

         //    while(list.length > 0) {
         //        var item = list.pop();
         //        var storeid = item.id;
         //        console.log('storeid: check it out. ',storeid);

         //        var selectSql = "select reserve1,reserve2,reserve3,reserve4,reserve5,reserve6,reserve7,reserve8,reserve9";
         //        var selectSql = " from " + gcom.getMysqlTable(TAB_M_GOODS,storeid);

         //        console.log('selectSql: check it out. ',selectSql);
         //        gotoQuerySeller(selectSql);
         //    }

         //    console.log('cb_tag1: The result of this \' create \' is shown came out. check it out: ', list.length);
         // });

        //gcom.focus();
        // return res.json({
        //     code:200,
        //     data:[]
        // });
        // console.log('_MINE_CHECK: ', MINE_CHECK);
        // console.log('_PASS_CHECK: ', PASS_CHECK);
        // console.log('_VALID_CHECK: ', VALID_CHECK);
        // console.log('_ADMIND_CHECK: ', ADMIND_CHECK);
        // console.log('_ADMINDID_CHECK: ', ADMINDID_CHECK);
        // console.log('_DIR_UPLOAD_PATH: ', DIR_UPLOAD_PATH);

        // MINE_CHECK = 1000;
        // PASS_CHECK = 1000;
        // VALID_CHECK = 1000;
        // ADMIND_CHECK = 1000;
        // ADMINDID_CHECK = 1000;
        // //DIR_UPLOAD_PATH = "c://";
        // return res.json({
        //     _MINE_CHECK: MINE_CHECK,
        //     _PASS_CHECK: PASS_CHECK,
        //     _VALID_CHECK: VALID_CHECK,
        //     _ADMIND_CHECK: ADMIND_CHECK,
        //     _ADMINDID_CHECK: ADMINDID_CHECK,
        //     _DIR_UPLOAD_PATH:DIR_UPLOAD_PATH,
        //     code: 200
        // });
        // console.log('TYPE_PLATFORM_ADMIN ',TYPE_PLATFORM_ADMIN);
        // console.log('TYPE_PLATFORM_SELLER ',TYPE_PLATFORM_SELLER);
        // console.log('TYPE_PLATFORM_ANDROID ',TYPE_PLATFORM_ANDROID);
        // console.log('TYPE_PLATFORM_IPHONE ',TYPE_PLATFORM_IPHONE);
        // console.log('TYPE_PLATFORM_WINDOWS ',TYPE_PLATFORM_WINDOWS);
        // console.log('TYPE_PLATFORM_WEBCHAT ',TYPE_PLATFORM_WEBCHAT);


        // map.set('MINE_CHECK',MINE_CHECK); 
        // map.set('PASS_CHECK',PASS_CHECK); 
        // map.set('VALID_CHECK',VALID_CHECK); 
        // map.set('ADMIND_CHECK',ADMIND_CHECK); 
      
        // var allParams = req.allParams();

        

        // var count = 0;
        // async.whilst(
        //     function() {
        //         console.log('r: check it out',count) 
        //         return count<5; 
        //     },
        //     function(callback) {
        //         count++;
        //         console.log('n: check it out',count)
        //         callback(null, count);
        //     },
        //     function (err, n) {
        //         // 5 seconds have passed, n = 5
        //        return res.json({
        //             data: {err, n},
        //             code: 200
        //         });
        //     }
        // );

        // 1.1
        // async.series([
        //     function(cb) { t.inc(3, cb); },
        //     function(cb) { t.inc(8, cb); },
        //     function(cb) { t.inc(2, cb); }
        // ], function(err, results) {
        //     log('1.1 err: ', err);
        //     log('1.1 results: ', results);
        // });

        // // 1.2
        // async.series([
        //     function(cb) { t.inc(3, cb); },
        //     function(cb) { t.err('test_err', cb); },
        //     function(cb) { t.inc(8, cb); }
        // ], function (err, results) {
        //     log('1.2 err: ', err);
        //     log('1.2 results: ', results);
        // });

        // // 1.3
        // async.series([
        //     function(cb) { t.fire(3, cb);},
        //     function(cb) { t.fire(undefined, cb); },
        //     function(cb) { t.fire(null, cb); },
        //     function(cb) { t.fire({}, cb); },
        //     function(cb) { t.fire([], cb); },
        //     function(cb) { t.fire('abc', cb) }
        // ], function(err, results) {
        //     log('1.3 err: ', err);
        //     log('1.3 results: ', results);
        // });

        // // 1.4
        // async.series({
        //     a: function(cb) { t.inc(3, cb); },
        //     b: function(cb) { t.fire(undefined, cb); },
        //     c: function (cb) { t.err('myerr', cb); },
        //     d: function (cb) { t.inc(8, cb); }
        // }, function (err, results) {
        //     log('1.4 err: ', err);
        //     log('1.4 results: ', results);
        // });

        

        // var sku = req.param("sku", false);
        // if (!sku) {
        //     return res.json({
        //         code: 400,
        //         msg: "sku码没有传递"
        //     });
        // }
        // var skuArray = sku.split("-");
        // var storeid = skuArray[1];
        // if (skuArray[2] == undefined) {
        //     return res.json({
        //         code: 400,
        //         msg: "sku不符合规范"
        //     });
        // }

        // console.log('serchGoodsDetails: This is the function entry.  check it out: ', sku);

        // sku = skuArray[0] + "-" + skuArray[1] + "-" + skuArray[2];
        // var querytext = "select a.id,a.storecategoryid,a.parentid,a.propertyvaluelist,a.reserve1 as video," +
        //     "a.goodsseries,a.detailbody,a.brandid,a.status,a.userid,a.storeid,a.name," +
        //     "a.reserve1,a.reserve2,a.reserve3,a.reserve4,a.reserve5,a.reserve6,a.reserve7,a.reserve8,a.reserve9,a.reserve10,"+
        //     "a.keywords,a.sku,a.imagedefault,a.propertyrelated,a.propertypic,a.attachment," +
        //     "a.stock,a.price,a.pricepoint,a.pricepromotion,a.weight,a.createdAt,b.useralias,b.id as storeid,b.servicetelephone," +
        //     "c.categoryname as parentcategory,d.categoryname as childcategory" +
        //     " from mergoodsList" + storeid + " a left join accountseller b on a.storeid=b.id " +
        //     "left join  goodscategory c on a.parentid=c.id left join goodscategory d on d.id=a.storecategoryid " +
        //     " where a.sku like '" + sku + "%'";

        // var prolist = prolist || [], group = group || [], detail = detail || {};
        // var querynormsSql = 'SELECT * FROM goodsproperty WHERE ';
        // var tbName = 'goodsproperty.'

        // if (storeid > 0) {
        //     querynormsSql += tbName + 'storeid = 0';
        //     querynormsSql += ' or '
        // }

        // querynormsSql += tbName + 'storeid' + ' = ' + storeid;
        // console.log('querynormsSql: check it out: ', querynormsSql);
        // Goodsproperty.query(querynormsSql, function afterFind(err, propertylist) {

        //     if (err) {
        //         console.log("err_tag2: When this error is returned, the query fails.");
        //         return res.negotiate(err);
        //     }

        //     prolist = propertylist;
        //     console.log('cb_tag2: The result of this \' find \' is shown came out. check it out:  ', propertylist.length);

        //     Propertyvalue.find().exec(function afterFind(err, provaluelist) {

        //         if (err) {
        //             console.log("err_tag3: When this error is returned, the query fails.");
        //             return res.negotiate(err);
        //         }
        //         console.log('cb_tag3: The result of this \' find \' is shown came out. check it out: ', provaluelist.length);

        //         vallist = provaluelist;

        //         for (var i = 0; i < prolist.length; i++) {
        //             var obj = prolist[i];
        //             var tempArray = []
        //             for (var j = 0; j < vallist.length; j++) {
        //                 if (obj.id == vallist[j].propertyid) {
        //                     tempArray.push(vallist[j]);
        //                 }
        //             }

        //             group.push({id: obj.id, name: obj.name, tempArray})
        //         }
        //     });

        //     Creator.query(querytext, function (err, goodslist) {
        //         if (err) {
        //             return res.negotiate(err);
        //         }
        //         if (goodslist.length <= 0) {
        //             return res.json({
        //                 code: 400,
        //                 msg: "没有该商品"
        //             });
        //         }
        //         var propertyrelatedArray = {};
        //         var tempArray = [];

        //         var productItem = {};
        //         var sum=0;
        //         for (i = 0; i < goodslist.length; i++) {
        //             if (goodslist[i].goodsseries == 0) {
        //                 productItem = goodslist[i];
        //             }
        //             sum+=parseInt(goodslist[i].reserve10);
        //             var aSku = goodslist[i].sku.split("-");
        //             console.log("--------------");
        //             console.log(aSku);
        //             console.log("--------------");
        //             if (aSku[3] != undefined) {
        //                 if (tempArray.indexOf(aSku[3]) == -1) {
        //                     tempArray.push(aSku[3]);
        //                 }
        //                 if (propertyrelatedArray[aSku[3]] == undefined) {
        //                     propertyrelatedArray[aSku[3]] = [];
        //                 }
        //                 if (aSku[4] == undefined) {
        //                     propertyrelatedArray[aSku[3]] = {
        //                         id: aSku[3],
        //                         sku:goodslist[i].sku,
        //                         stock: goodslist[i].stock,
        //                         price: goodslist[i].price,
        //                         imgurl: goodslist[i].propertypic,
        //                         pricepoint:goodslist[i].pricepoint,

        //                     };
        //                 }
        //                 if (aSku[4] != undefined && propertyrelatedArray[aSku[3]].indexOf(aSku[4]) == -1) {
        //                     if (propertyrelatedArray[aSku[3]].children == undefined) {
        //                         propertyrelatedArray[aSku[3]].children = [];
        //                     }

        //                     propertyrelatedArray[aSku[3]].children.push({
        //                         sku: goodslist[i].sku,
        //                         id: aSku[4],
        //                         stock: goodslist[i].stock,
        //                         price: goodslist[i].price,
        //                         imgurl: goodslist[i].propertypic,
        //                         pricepoint:goodslist[i].pricepoint,
        //                     });
        //                 }

        //             }
        //         }
        //         console.log(propertyrelatedArray);
        //         if (propertyrelatedArray) {
        //             var property = [];
        //             for (key in propertyrelatedArray) {
        //                 property.push({
        //                     propertyid: key,
        //                     stock: propertyrelatedArray[key].stock,
        //                     price: propertyrelatedArray[key].price,
        //                     pricepoint: propertyrelatedArray[key].pricepoint,
        //                     imgurl: propertyrelatedArray[key].imgurl,
        //                     sku:propertyrelatedArray[key].sku,
        //                     product: propertyrelatedArray[key].children
        //                 });
        //             }
        //             // return res.json(property);
        //             async.mapSeries(property, function (item, callback) {

        //                 var sql = "select a.name,a.aliasname,a.description,b.id,b.propertyid,b.propertyvalue," +
        //                     "b.sortsorder from goodsproperty a right join propertyvalue b on a.id=b.propertyid " +
        //                     "where  b.id =" + item.propertyid;
        //                 console.log(sql);
        //                 Creator.query(sql, function (err, record) {
        //                     if (err)  return res.negotiate(err);
        //                     if (record != undefined && record != null) {

        //                         if (item.product == null || item.product == undefined || item.product.length <= 0) {
        //                             console.log(item.product);
        //                             var prov = record[0] || {};
        //                             prov.stock = item.stock;
        //                             prov.price = item.price;
        //                             prov.imgurl = item.imgurl;
        //                             prov.sku = item.sku;
        //                             prov.pricepoint = item.pricepoint;
        //                             console.log("============");
        //                             console.log(record);
        //                             callback(null, prov);
        //                         } else {
        //                             async.mapSeries(item.product, function (child, next) {
        //                                 var sql = "select a.name,a.aliasname,a.description,b.id,b.propertyid,b.propertyvalue," +
        //                                     "b.sortsorder from goodsproperty a left join propertyvalue b on a.id=b.propertyid " +
        //                                     "where  b.id =" + child.id;
        //                                 Creator.query(sql, function (err, itemChild) {
        //                                     if (err)  return res.negotiate(err);
        //                                     if (itemChild != undefined && itemChild != null) {
        //                                         var aProperty = itemChild[0]||{};
        //                                         aProperty.stock = child.stock;
        //                                         aProperty.price = child.price;
        //                                         aProperty.imgurl = child.imgurl;
        //                                         aProperty.sku = child.sku;
        //                                         aProperty.pricepoint = child.pricepoint;
        //                                         next(null, aProperty);
        //                                     }
        //                                 });
        //                             }, function (err, result) {
        //                                 if (err)  return res.negotiate(err);
        //                                 var prov = record[0];
        //                                 prov = prov || {};
        //                                 if (result.length > 0) {
        //                                     prov["Children"] = result;
        //                                 }
        //                                 return callback(null, prov);
        //                             });
        //                         }
        //                     }
        //                 });
        //             }, function (err, records) {
        //                 if (err)  return res.negotiate(err);

        //                 var category = null;
        //                 for (var i = 0; i < detail.length; i++) {
        //                     if (detail[i].id == productItem.storecategoryid) {
        //                         category = detail[i];
        //                         break;
        //                     }
        //                 }

        //                 productItem['p1'] = productItem.parentid;
        //                 if (category) {
        //                     if (productItem.parentid != category.parentid) {
        //                         productItem['p2'] = category.parentid;
        //                         productItem['p3'] = category.id;
        //                     } else {
        //                         productItem['p2'] = category.id;
        //                         productItem['p3'] = null;
        //                     }

        //                 }

        //                 return res.json({
        //                     code: 200,
        //                     msg: "",
        //                     data: {
        //                         goods: productItem,
        //                         propertyrelated: records,
        //                         detail: detail,
        //                         group: group,
        //                         sale_count:sum
        //                     }
        //                 });
        //             });
        //         } else {

        //             // var category = null;
        //             // for(var i = 0; i <detail.length; i++){
        //             //     if (detail[i].id == goods.storecategoryid)  {
        //             //         category = detail[i];
        //             //         break;
        //             //     }
        //             // }

        //             // goodslist['p1'] = goods.parentid;
        //             // if (category) {
        //             //     goodslist['p2'] = category.parentid;
        //             //     goodslist['p3'] = category.id;
        //             // }

        //             return res.json({
        //                 code: 200,
        //                 msg: "",
        //                 data: {
        //                     goods: goodslist,
        //                     propertyrelated: [],
        //                     detail,
        //                     group,
        //                     sale_count:sum
        //                 }
        //             });
        //         }

        //     });
        // });


        // console.log('test: This is the function entry. check it out: ', req.allParams());

        // var allParams = req.allParams();
        // var isParameter = utility.isForbidden(allParams);

        // var mine = req.session.mine;
        // var obj = obj || {},isForbidden = false;

        // if (isParameter) {
        //      obj.data = [];
        //      obj.code = 200;
        //      obj.msg = '参数错误';
        //      isForbidden = true;
        // }

        // isParameter = (!mine?true:false);
        // if (isParameter) {
        //      obj.data = [];
        //      obj.code = 400;
        //      obj.msg = '用户未登录';
        //      isForbidden = true;
        // }

        // if (isForbidden) {
        //      return res.json({
        //         data: obj.data,
        //         code: obj.code,
        //         msg:  obj.msg
        //      }) 
        // }

        // var goods = new Map();
        // for( var key in allParams ) {
        //     goods.set(key,allParams[key])
        // }

        // goods.set('stock',0);
        // goods.set('reserve1',0);
        // goods.set('reserve2',0);
        // goods.set('reserve3',0);
        // goods.set('reserve4',0);
        // goods.set('reserve5',0);
        // goods.set('reserve6',0);
        // goods.set('reserve7',0);
        // goods.set('reserve8',0);
        // goods.set('reserve9',0);
        // goods.set('reserve10',0);
        // goods.set('goodsseries',0);
        // goods.set('userid',mine.id);
        // goods.set('storeid',mine.storeid);
        // goods.set('sku',this.generateSku(mine.storeid));

        // var xss = require('xss');
        // xss.whiteList.div = xss.whiteList.div || [];
        // xss.whiteList.strike = xss.whiteList.strike || [];

        // for(var key in xss.whiteList){
        //     xss.whiteList[key].push("style","class","text-align","height","width");
        // }

        // goods.set('detailbody',xss(goods.get('detailbody')));
        // console.log('goods parameter, check it out: ', goods);


        // //console.log('msg: check it out: ', msg);
        // var counter = 0, isChildren = false;
        // var addCount = [], goodsseries = [], strHid = '';

        // function analysisSeries(propertyrelated) {
        //     console.log('propertyrelated: check it out: ', propertyrelated.length)
        //     for (var i = 0; i < propertyrelated.length; i++) {
        //         var obj = propertyrelated[i];
        //         //console.log('obj: check it out: ', obj)

        //         var temp = [];

        //         //规格类型
        //         temp.push(obj.propertyid)
        //         temp.push(obj.id)

        //         if (obj.Children.length) {

        //             for (var j = 0; j < obj.Children.length; j++) {
        //                 var childObj = obj.Children[j];

        //                 temp = [];
        //                 //规格类型
        //                 temp.push(obj.propertyid)
        //                 temp.push(obj.id)

        //                 //规格属性
        //                 temp.push(childObj.propertyid)
        //                 temp.push(childObj.id)

        //                 if (childObj.Price == null) {
        //                     childObj.Price = 0;
        //                 }

        //                 if (childObj.Stock == null) {
        //                     childObj.Stock = 0;
        //                 }

        //                 //参数克隆
        //                 var goods = {}
        //                 for (var k in msg) {
        //                     goods[k] = msg[k];
        //                 }

        //                 goods.sku += '-'
        //                 goods.sku += obj.id

        //                 goods.sku += '-'
        //                 goods.sku += childObj.id

        //                 goods.status = 0;
        //                 goods.stock = childObj.Stock;
        //                 goods.price = childObj.Price;
        //                 goods.propertypic = childObj.imgurl;
        //                 goods.name = msg.name;
        //                 goods.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
        //                 goods.goodsseries = (j == 0) ? 0 : 1;

        //                 msg.stock = msg.stock + parseInt(goods.stock);
        //                 goods.propertyrelated = utility.hashHidValue(temp);
        //                 goodsseries.push(goods)
        //                 console.log('sku: check it out: ', goods.sku);
        //                 console.log('stock: check it out: ',msg.stock);
        //             }

        //         } else {

        //             //参数克隆
        //             var goods = {}
        //             for (var k in msg) {
        //                 goods[k] = msg[k];
        //             }

        //             if (obj.Price == null) {
        //                 obj.Price = 0;
        //             }

        //             if (obj.Stock == null) {
        //                 obj.Stock = 0;
        //             }

        //             goods.sku += '-'
        //             goods.sku += obj.id

        //             console.log('sku: check it out: ', goods.sku)

        //             goods.status = 0;
        //             goods.stock = obj.Stock;
        //             goods.price = obj.Price;
        //             goods.name = msg.name;
        //             goods.propertypic = obj.imgurl;
        //             goods.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
        //             goods.goodsseries = 0;

        //             msg.stock = msg.stock + parseInt(goods.stock);
        //             goods.propertyrelated = utility.hashHidValue(temp);
        //             goodsseries.push(goods)
        //             console.log('stock: check it out: ',msg.stock);
        //         }

        //     }

        //     //addCount.pop();
        //     return goodsseries;
        // };


        // var parent_series = -1;
        // var tbName = 'goodsList' + msg.parentid;
        // msg.status = 0;
        // var element = analysisSeries(msg.propertyrelated);
        // console.log('series: check it out: ', element);


        // //console.log('addCount: check it out: ',addCount);
        // //console.log('goodsseries: check it out: ', goodsseries);

        // var done = function (insertId) {

        //     var list = [];
        //     for (var i = 0; i < goodsseries.length; i++) {
        //         console.log('at: ', i);
        //         list.push(i);
        //     }
        //     var mapCount = 0;
        //     async.mapSeries(list, function (i, callback) {
        //         (function () {
        //             var element1 = goodsseries[i];
        //             console.log('element: check it out: i = ', i, ' \n', element1);
        //             element1.goodsseries = insertId;
        //             element1.reserve3 =  msg.reserve3;
        //             element1.reserve6 =  msg.reserve6;
        //             element1.reserve7 =  msg.reserve7;
        //             var tbName4 = 'goodsList' + msg.parentid;
        //             var querytext = utility.insertDataToTable(element1, tbName4);
        //             Creator.query(querytext, function pushGoods(err, newGoos) {

        //                 if (err) {
        //                     //console.log("err_tag3: information to add merchandise module;");
        //                     return res.negotiate(err);
        //                 }
        //                 //console.log('cb_tag3: The result of this insert is shown came out. check it out: ', newGoos);

        //                 if (newGoos) {

        //                     element1.id = newGoos.insertId;
        //                     element1.goodsseries = insertId;
        //                     var tbName3 = 'mergoodsList' + msg.storeid;
        //                     var querytext2 = utility.insertDataToTable(element1, tbName3);

        //                     Creator.query(querytext2, function pushMerchGoods(err, merchandise) {

        //                         if (err) {
        //                             //console.log("err_tag4: information to add merchandise module;");
        //                             return res.negotiate(err);
        //                         }

        //                         //console.log('cb_tag4: The result of this insert is shown came out. check it out:  ', merchandise);
        //                     });
        //                 }

        //             });
        //             mapCount = mapCount + 1;
        //             //if (mapCount<list.length) {
        //                 callback(null, i);
        //             //}

        //         }());
        //     }, function (err, results) {
        //         if (results) {
        //             return res.json({
        //                 data: [],
        //                 code: 200
        //             });
        //         }
        //     });
        // }

        // utility.emitter.once('event1', done);

        // msg.propertyrelated = 0
        // msg.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");

        // var querytext5 = 'select reserve3,reserve6,reserve7 from mergoodsList'+ msg.storeid + ' WHERE (reserve3!=0 and reserve3 is not null) and (reserve6!=0 and reserve6 is not null) and (reserve7!=0 and reserve7 is not null) ';
        // console.log('querytext5: check it out: ',querytext5);
        // Creator.query(querytext5, function pushGoods(err, meshops) {
        //     console.log('arr: check it out: ',meshops.length);
        //     if (meshops.length) {
        //         var obj_meshops = meshops[0];
        //         msg.reserve3 = meshops[0].reserve3;
        //         msg.reserve6 = meshops[0].reserve6;
        //         msg.reserve7 = meshops[0].reserve7;
        //     }

        //     var querytext = utility.insertDataToTable(msg, tbName);
        //     Creator.query(querytext, function pushGoods(err, newGoos) {

        //         if (err) {
        //             //console.log("err_tag1: information to add merchandise module;");
        //             return res.negotiate(err);
        //         }
        //         //console.log('cb_tag1: The result of this insert is shown came out. check it out: ', newGoos);

        //         if (newGoos) {

        //             msg.goodsseries = 0;
        //             msg.id = newGoos.insertId;
        //             var tbName2 = 'mergoodsList' + msg.storeid;
        //             var querytext2 = utility.insertDataToTable(msg, tbName2);

        //             Creator.query(querytext2, function pushMerchGoods(err, merchandise) {

        //                 if (err) {
        //                     console.log("err_tag2: information to add merchandise module;");
        //                     return res.negotiate(err);
        //                 }

        //                 utility.emitter.emit('event1', newGoos.insertId);
        //                 //console.log('cb_tag2: The result of this insert is shown came out. check it out:  ', merchandise);
        //             });
        //         }
        //     });
        // })
    },


};