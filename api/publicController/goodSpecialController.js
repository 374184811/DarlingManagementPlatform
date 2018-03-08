/**
 * GoodspecialController
 *
 * @description :: Server-side logic for managing goodspecials
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var exec = require('child_process').exec;
module.exports = {

    _cmdBase:'/usr/bin/curl http://localhost:1338/',

    /**
     * 显示某个店铺所有专场和自定义内容
     *
     *num 每次显示的数量
     *offset 起始偏移量
     *name 自定义 内容或者专场的名称
     *status 状态 1为启用,1为不启用
     *type 0为自定义,1为专场
     * `GoodspecialController.index()`
     */
    index: function (req, res) {

        var msg = msg || {};
        console.log('index: This is the function entry.  check it out: ', msg);

        var mine = req.session.mine;
        var num = req.param("num", 0);
        var offset = req.param("offset", 1);
        var name = req.param("name", 0);
        var status = req.param("status", -1);
        var type = req.param("type", -1);

        var storeid = req.param("storeid", mine.storeid);
        condition = {};
        //超级管理员
        if (storeid) {
            condition = {storeid: storeid};
        }
        if (name) {
            condition.name = {like: "'"+name + "%'"};
        }
        if (status!=-1) {
            condition.status = status;
        }
        if (type==0||type==1 || type==3) {
            condition.type = type;
        }else{
            condition.type={">=":0,"<=":3};
        }

        if (num) {
            offset=(offset-1)*num;
            query = GoodSpecial.find(condition).limit(num).skip(offset);
        } else {
            query = GoodSpecial.find(condition);
        }
        query.exec(function (err, records) {
            if (err)  return res.negotiate(err);
            if (records && records.length > 0) {
                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "",
                    "data": records
                });
            } else {
                return res.json({
                    "success": false,
                    "code": 400,
                    "msg": "操作失败，没有数据",
                    "data": {}
                });
            }
        });

    },


    /**
     * 添加专场或者自定义内容
     *@param type 0为自定义,1为专场,2秒杀专场
     *@param mobiBanner 手机显示bnaner
     *@param name 名称
     *@param robotBanner 机器人显示的banner
     *@param targetUrl 跳转目标地址
     *@param products 产品 格式1,3,4,5
     *@param content  内容，当type=1时content为自定义内容
     *@param linktype int 0是外部链接，1是内部链接
     *@param status int 状态【0不开启,1开启】
     * `GoodspecialController.add()`
     */
    add: function (req, res) {
        var msg = msg || {};
        console.log('add: This is the function entry.  check it out: ', msg);

        var data = {};
        data.name = req.param("name", false);
        data.type = req.param("type", 0);
        data.status = req.param("status", 0);
        if (data.type == 1 || data.type == 3) {
            data.mobiBanner = req.param("mobiBanner", false);
            data.robotBanner = req.param("robotBanner", false);
            data.targetUrl = req.param("targetUrl", false);
            data.products = req.param("products", false);
            data.linktype = req.param("linktype", false);

        }
        else {
            data.content = req.param("content", false);
            var xss=require("xss");
            if(!xss.whiteList.div){
                xss.whiteList.div=[];
            }
            if(!xss.whiteList.strike){
                xss.whiteList.strike=[];
            }
            for(var key in xss.whiteList){
                xss.whiteList[key].push("style","class","text-align","height","width");
            }

            data.content=xss(data.content);

        }
        var mine = req.session.mine;
        data.storeid = req.param("storeid",0);
        if(!data.storeid){
            data.storeid=mine.storeid;
        }
        if (data.type == 0) {
            addCustomOrGoodSpecail();
        }else{
            GoodSpecial.findOne({name: data.name}).exec(function (err, special) {
                if (err)  return res.negotiate(err);
                if (!special) {
                    addCustomOrGoodSpecail();
                } else {
                    return res.json({
                        "success": false,
                        "code": 400,
                        "msg": "操作失败,已经有相同名称的专场",
                        "data": {}
                    });
                }

            });
        }
        function addCustomOrGoodSpecail() {
            var msg = msg || {};
            console.log('addCustomOrGoodSpecail: This is the function entry.  check it out: ', msg);
            GoodSpecial.create(data).exec(function (err, record) {
                if (record) {
                    return res.json({
                        "success": true,
                        "code": 200,
                        "msg": "",
                        "data": record
                    });
                } else {
                    return res.json({
                        "success": false,
                        "code": 400,
                        "msg": "操作失败",
                        "data": {}
                    });
                }
            });
        }



    },


    /**
     * id 专场或者自定义内容id
     * 查看专场自定义内容
     * `GoodspecialController.view()`
     */
    view: function (req, res) {

        console.log('view: This is the function entry.  check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var mestoreid = allParams.storeid || 4;
        //var mestoreid = mine.storeid;

        GoodSpecial.findOne({id:id}).exec(function (err, record) {
            if (err) return;
            console.log("cb_tag1: The result of this findOne is shown came out. check it out: ok");

            var whereIn = "",skuObj = "";
            record = record || {};
            record.products = record.products || "";
            products = record.products.split(',') || [];

            if (record.type == 1) {

                for(var i = 0; i<products.length; i++) {
                    whereIn += "'" + products[i] + "',";
                }

                skuObj = gcom.revertSku(products[0]);
                whereIn=whereIn.substring(0,whereIn.length-1);
                console.log('whereIn. check it out. ', whereIn);

                var gd = ["price","pricepoint","sku","parentid","storecategoryid","keywords","status",
                "storeid","brandid","name","attachment","type","premoneey","deposit","imagedefault"];

                var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,skuObj.storeid);
                var queryMGoodsSql = "select " + gd.join(',') + " from " + tb_M_Name + " where sku in(" + whereIn + ") AND goodsseries=0";

                console.log('queryMGoodsSql. check it out. ',queryMGoodsSql);
                Creator.query(queryMGoodsSql, function (err, r) {
                    if (err) r;
                    console.log("cb_tag2: The result of this findOne is shown came out. check it out: ok");

                    record.products = [];
                    for(var i = 0; i<products.length; i++) {
                        for(var j = 0; j<r.length; j++) {
                            if (_.isEqual(r[j].sku,products[i])) {
                                record.products.push(r[j]);
                                break;
                            }
                        }
                    }

                    return res.json({
                        code: 200,
                        msg: "",
                        data: record,
                    });
                });

            }else if (record.type == 3) {

                var cmdStr = '/usr/bin/curl http://localhost:1338/CmdGoods/cmdCurrentSeckillingGoods?storeid=' + mestoreid;
                exec(cmdStr, function(err,stdout,stderr) {

                    console.log("err: ",err," \n ");

                    if (!stdout) return;
                    var seckillingdata = JSON.parse(stdout);
                    var seckilingGoodGroup = seckillingdata.seckilingGoodGroup;
                    var seckillingTimeGroup = seckillingdata.seckillingTimeGroup;
                    var seckillingobj = { "seckilingGoodGroup":{}, "seckillingTimeGroup": {} };

                    var zindex = 0;
                    for(var i = 0; i<seckillingTimeGroup.length; i++) {

                        var isFind = false;
                        for(var j = 0; j<seckillingdata.length; j++) {
                            for(var k = 0; k<seckilingGoodGroup.length; k++) {
                               if (isFind = _.isEqual(seckillingdata[j].sku,seckilingGoodGroup[k].sku)) {
                                    seckillingobj.seckilingGoodGroup[m] = seckillingobj.seckilingGoodGroup[m] || [];
                                    seckillingobj.seckilingGoodGroup[m].push(seckilingGoodGroup[k]);
                                    seckillingobj.seckillingTimeGroup[m] = seckillingTimeGroup[i];
                                    isFind = true;
                               }

                               if (isFind) break;
                            }

                            if (isFind) break;
                        }

                        if (isFind) zindex+=1;
                    }

                    // for(var i = 0; i<seckillingdata.length; i++) {
                    //     for(var j = 0; j<seckillingTimeGroup.length; j++) {
                    //     }
                    // }
                    //console.log("stdout: ",stdout," \n ");
                    //console.log("stderr: ",stderr," \n ");
                    return res.json({
                        data:seckillingobj,
                        timestamp:(new Date()).getTime(),
                        code:200
                    });
                });
            }
            else{
                return res.json({
                    code: 200,
                    msg: "",
                    data: record,
                });
            }

        });

        // var id = allParams.id;
        // var mine = req.session.mine;
        // var condition = {id: parseInt(id)};
        // if (mine) {
        //     if (!mine.storeid) {
        //         condition = {id: id};
        //     } else {
        //         condition = {id: id, storeid: mine.storeid};
        //     }
        // }
        // console.log(condition);
        // GoodSpecial.findOne(condition).exec(function (err, special) {
        //     if (err)  return res.negotiate(err);

        //     if (!special) {
        //         return res.json({
        //             "success": false,
        //             "code": 400,
        //             "msg": "操作失败,没有数据",
        //             "data": {}
        //         });
        //     } else {
        //         if (special.type == 1) {//专场
        //             var skus = special.products.split(",");
        //             var sku=skus[0];
        //             if(skus&&skus.length>0){
        //                var skuArray=sku.split("-");
        //                  var whereIn="";
        //                  for(var i=0;i<skus.length;i++){
        //                      whereIn+="'"+skus[i]+"',";
        //                  }
        //                 whereIn=whereIn.substring(0,whereIn.length-1);
        //                 var sql = "select price,pricepoint,sku,parentid,storecategoryid,keywords,status,storeid,brandid,name,attachment,type,premoneey,deposit,imagedefault from mergoodsList"+skuArray[1]+"  where sku in(" + whereIn + ") AND goodsseries=0";
        //                 console.log(sql);
        //                 Goodscontent.query(sql, function (err, products) {

        //                     if (err)  return res.negotiate(err);

        //                     if (products.length > 0) {
        //                         special.products = products;
        //                     }else{
        //                         special.products='';
        //                     }

        //                     return res.json({
        //                         "success": true,
        //                         "code": 200,
        //                         "msg": "",
        //                         "data": special
        //                     });
        //                 });
        //             }else{
        //                 return res.json({
        //                     "success": true,
        //                     "code": 200,
        //                     "msg": "",
        //                     "data": special
        //                 });
        //             }

        //         } else {
        //             return res.json({
        //                 "success": true,
        //                 "code": 200,
        //                 "msg": "",
        //                 "data": special
        //             });
        //         }
        //     }
        // });
    },


    /**
     *
     * id  专场或者自定义编号 2,3,4组成的字符串
     * 删除专场或者自定义内容
     * `GoodspecialController.delete()`
     */
    delete: function (req, res) {
        var msg = msg || {};
        console.log('delete: This is the function entry.  check it out: ', msg);

        var id = req.param("id", 0);
        if (!id) {
            return res.json({
                "success": false,
                "code": 400,
                "msg": "操作失败,参数错误",
                "data": {}
            });
        }
        var ids = id.split(",");
        var mine = req.session.mine;
        if (!mine.storeid) {
            condition = {id: ids};
        } else {
            condition = {id: ids, storeid: mine.storeid};
        }
        GoodSpecial.destroy(condition).exec(function (err, special) {
            if (err)  return res.negotiate(err);
            if (!special || special.length <= 0) {
                return res.json({
                    "success": false,
                    "code": 400,
                    "msg": "操作失败,没有数据",
                    "data": {}
                });
            } else {
                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "操作成功",
                    "data": {}
                });
            }
        });
    },


    /**
     *@param  id 专场或者自定义id
     *@param   name 名称
     *@param   type 0为自定义,1为专场
     *@param   mobiBanner 手机显示bnaner
     *@param   robotBanner 机器人显示的banner
     *@param   targetUrl 跳转目标地址
     *@param   products 产品 格式1,3,4,5
     *@param   content  内容，当type=1时content为自定义内容
     *@param   status int 状态【0不开启,1开启】
     *@param   linktype int 0是外部链接，1是内部链接
     * `GoodspecialController.edit()`
     *
     */
    edit: function (req, res) {

        console.log('edit: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var content,xss;
        var id = allParams.id;
        var type = allParams.type;
        var storeid = mine.storeid;
        var status = allParams.status;

        if (allParams.type !== 1) {

            xss = require("xss");
            xss.whiteList.div = xss.whiteList.div || [];
            xss.whiteList.strike = xss.whiteList.strike || [];

            for(var key in xss.whiteList) {
                xss.whiteList[key].push("style","class","text-align","height","width");
            }

            content = xss(allParams.content);
        }

        var sKey = {};
        if (type === 1) {
            sKey.type = type;
            sKey.status = status;
            sKey.name = allParams.name;
            sKey.linktype = allParams.linktype;
            sKey.products = allParams.products;
            sKey.targetUrl = allParams.targetUrl;
            sKey.mobiBanner = allParams.mobiBanner;
        }else{
           sKey.content = content;
        }

        console.log('sKey. check it out. ',sKey);
        GoodSpecial.findOne({id: id, storeid: storeid}).exec(function (err, record) {
            if (err)  return;
            console.log("cb_tag1: The result of this findOne is shown came out. check it out: ok");

            GoodSpecial.update({id: id}, sKey).exec(function (err, r) {

                if (err) return;
                console.log("cb_tag2: The result of this update is shown came out. check it out: ok");

                return res.json({
                    code: 200,
                    msg: "",
                    data: r
                });
            })
        });


        // var msg = msg || {};
        // console.log('edit: This is the function entry.  check it out: ', msg);

        // var vset = {};
        // vset.type = req.param("type", 0);
        // vset.status = req.param("status", 0);
        // if (vset.type == 1) {
        //     vset.name = req.param("name", false);
        //     vset.mobiBanner = req.param("mobiBanner", false);
        //     vset.robotBanner = req.param("robotBanner", false);
        //     vset.targetUrl = req.param("targetUrl", false);
        //     vset.products = req.param("products", false);
        //     vset.linktype = req.param("linktype", false);
        // } else {
        //     vset.content = req.param("content", false);
        //     var xss=require("xss");
        //     if(!xss.whiteList.div){
        //         xss.whiteList.div=[];
        //     }
        //     if(!xss.whiteList.strike){
        //         xss.whiteList.strike=[];
        //     }
        //     for(var key in xss.whiteList){
        //         xss.whiteList[key].push("style","class","text-align","height","width");
        //     }

        //     vset.content=xss(vset.content);
        // }

        // var id = req.param("id", 0);
        // if (!id) {
        //     return res.json({
        //         "success": false,
        //         "code": 400,
        //         "msg": "操作失败,参数错误",
        //         "data": {}
        //     });
        // }
        // var mine = req.session.mine;

        // GoodSpecial.findOne({id: id, storeid: mine.storeid}).exec(function (err, special) {
        //     if (err)  return res.negotiate(err);
        //     if (special) {
        //         GoodSpecial.update({id: id}, vset).exec(function (err, record) {
        //             if (err)  return res.negotiate(err);
        //             if (record) {
        //                 return res.json({
        //                     "success": true,
        //                     "code": 200,
        //                     "msg": "",
        //                     "data": record
        //                 });
        //             } else {
        //                 return res.json({
        //                     "success": false,
        //                     "code": 400,
        //                     "msg": "操作失败",
        //                     "data": {}
        //                 });
        //             }
        //         });
        //     } else {
        //         return res.json({
        //             "success": false,
        //             "code": 400,
        //             "msg": "操作失败,已经有相同名称的专场",
        //             "data": {}
        //         });
        //     }

        // });
    },

    /**
     * 客户端传资源文件
     *
     * @param  file             //资源文件
     *
     * @return {}               //返回结果集
     */
    uploadImage: function (req, res) {
        var dir = req.param('dir')||"special";
        return upload.uploadFile(req,res,"pic",dir);
    },

    /**
     * 商户后台传资源文件
     *
     * @param  file             //资源文件
     *
     * @return {}               //返回结果集
     */
    uploadImageStore: function (req, res) {
        return upload.uploadFile(req,res,"pic","special");
    },

    /**
     * 管理后台传资源文件
     *
     * @param  file              //资源文件
     *
     * @return {}               //返回结果集
     */
    uploadImageAdmin:function (req, res) {
        return upload.uploadFile(req,res,"pic","special");
    },
};

