var goodSpecialController = require('../publicController/goodSpecialController')
var exec = require('child_process').exec;
/**
 * GoodspecialController
 *
 * @description :: Server-side logic for managing goodspecials
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * 显示某个店铺所有专场和自定义内容
     *
     *num 每次显示的数量
     *offset 起始偏移量
     *name 自定义 内容或

     者专场的名称
     *status 状态 1为启用,1为不启用
     *type 0为自定义,1为专场
     * `GoodspecialController.index()`
     */
    index: function (req, res) {

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
            condition.name = {like: "%" + name + "%" };
        }
        if (status!=-1) {
            condition.status = status;
        }
        if (type==0||type==1 || type==3) {
            condition.type = type;
        }else{
            condition.type={">=":0,"<=":3};
        }

        console.log("condition. ",condition);
        if (num) {
            offset=(offset-1)*num;
            query = GoodSpecial.find(condition).limit(num).skip(offset);
        } else {
            query = GoodSpecial.find(condition);
        }
        query.exec(function (err, list) {
            if (err)  return res.negotiate(err);
            console.log("cb_tag1: The result of this findOne is shown came out. check it out: ",list.length);
            return res.json({
                "success": true,
                "code": 200,
                "msg": "",
                "data": list
            });
        });
    },


    /**
     * 添加专场或者自定义内容
     *@param type 0为自定义,1为专场
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
        return goodSpecialController.add(req, res);
    },


    /**
     * id 专场或者自定义内容id
     * 查看专场自定义内容
     * `GoodspecialController.view()`
     */
    view: function (req, res) {
        //return goodSpecialController.view(req, res);

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

            products.remove("");
            console.log("products. check it out.  ",products);

            if ((record.type == 1 || record.type == 3)&&products.length) {

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
                    console.log("cb_tag2: The result of this findOne is shown came out. check it out: ",r);

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

            }
            else{
                return res.json({
                    code: 200,
                    msg: "",
                    data: record,
                });
            }

        });
    },


    /**
     *
     * id  专场或者自定义编号 2,3,4组成的字符串
     * 删除专场或者自定义内容
     * `GoodspecialController.delete()`
     */
    delete: function (req, res) {
        return goodSpecialController.delete(req, res);
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
        //return goodSpecialController.edit(req, res);

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
        if (type === 1 || type === 3) {
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
    },

    /**
     * 客户端传资源文件
     *
     * @param  file             //资源文件
     *
     * @return {}               //返回结果集
     */
    uploadImage: function (req, res) {
        return goodSpecialController.uploadImage(req, res);
    },

    /**
     * 商户后台传资源文件
     *
     * @param  file             //资源文件
     *
     * @return {}               //返回结果集
     */
    uploadImageStore: function (req, res) {
        return goodSpecialController.uploadImage(req, res);
    },

    /**
     * 管理后台传资源文件
     *
     * @param  file              //资源文件
     *
     * @return {}               //返回结果集
     */
    uploadImageAdmin:function (req, res) {
        return goodSpecialController.uploadImage(req, res);
    },

    /**
     * 商户后台传视频资源文件
     *
     * @param  dir             //存储路径,vr视频:vrvideo,普通视频：video,不传也可以
     * @param  pic             //资源文件
     *
     * @return {}               //返回结果集
     */
    uploadVideoStore: function (req, res) {
        console.log(req.ip,req.path);
        var dir = req.param('dir')||"video";
        return upload.uploadVideoFile(req,res,"pic",dir);
    },
};

