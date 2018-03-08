
var goodsController = require('../publicController/goodsController')
var exec = require('child_process').exec;

module.exports = {

    _cmdBase:'/usr/bin/curl http://localhost:1338/',

    /**
     * 添加商品
     *
     *
     * @return { 返回结果集 }
     */
    goodsParameter: function (req, res) {
        return goodsController.goodsParameter(req, res);
    },


    /**
     * 添加规格
     *
     *
     * @return { 返回结果集 }
     */
    goodsNormsParameter: function (req, res) {
        return goodsController.goodsNormsParameter(req, res);
    },

    /**
     * 删除规格并删除规格属性
     *
     *
     * @return { 返回结果集 }
     */
    delNormsGroup: function (req, res) {
        return goodsController.delNormsGroup(req, res);
    },

    /**
     * 删除规格子项
     *
     *
     * @return { 返回结果集 }
     */
    delNormsValue: function (req, res) {
        return goodsController.delNormsValue(req, res);
    },

    /**
     * 修改规格子名称和新增规格属性
     *
     *
     * @return { 返回结果集 }
     */
    updateNormsGrop: function (req, res) {
        return goodsController.updateNormsGrop(req, res);
    },

    /**
     * 管理员添加商品类别
     *
     *
     * @return { 返回结果集 }
     */
    adminAddClassify: function (req, res) {
        return goodsController.adminAddClassify(req, res);
    },

    /**
     * 管理员添加商户类别
     *
     *
     * @return { 返回结果集 }
     */
    adminMerClassify: function (req, res) {
        return goodsController.adminMerClassify(req, res);
    },

    /**
     * 管理员删除商户类别
     *
     *
     * @return { 返回结果集 }
     */
    adminDelMerClassify: function (req, res) {
        return goodsController.adminDelMerClassify(req, res);
    },

    /**
     * 管理员筛选商户自定义的所有类别
     *
     *
     * @return { 返回结果集 }
     */
    adminScreenClassify: function (req, res) {
        return goodsController.adminScreenClassify(req, res);
    },

    /**
     * 管理员删除类别并删除关联商品
     *
     *
     * @return { 返回结果集 }
     */
    adminDelClassify: function (req, res) {
        return goodsController.adminDelClassify(req, res);
    },

    /**
     * 总后台审核商品
     *
     *
     * @return { 返回结果集 }
     */
    updateGoodsList: function (req, res) {
        return goodsController.updateGoodsList(req, res);
    },

    /**
     * 销毁商户商品
     *
     *
     * @return { 返回结果集 }
     */
    destoryGoodslist: function (req, res) {
        return goodsController.destoryGoodslist(req, res);
    },

    /**
     * 添加商户栏目
     *
     *
     * @return { 返回结果集 }
     */
    addMerSeries: function (req, res) {
        return goodsController.addMerSeries(req, res);
    },

    /**
     * 删除商城管理栏目
     *
     *
     * @return { 返回结果集 }
     */
    delMerSeries: function (req, res) {
        return goodsController.delMerSeries(req, res);
    },

    /**
     * 修改商户系列
     *
     *
     * @return { 返回结果集 }
     */
    updateMerSeries: function (req, res) {
        return goodsController.updateMerSeries(req, res);
    },

    /**
     * 修改商户异业联盟
     *
     *
     * @return { 返回结果集 }
     */
    updateGoodsHorizontalAlliances: function (req, res) {
        return goodsController.updateGoodsHorizontalAlliances(req, res);
    },


    /**
     * 运营商显示商品列表
     * @param req
     * @param res
     */
    mergoodslist: function (req, res) {
        return goodsController.mergoodslist(req, res);
    },

    /**
     * 添加首页推荐
     * ids 产品id组成的字符串 如 2,4,5
     *
     * @param req
     * @param res
     */
    addIndexRecommend: function (req, res) {
        return goodsController.addIndexRecommend(req, res);
    },
    /**
     * 获取首页推荐
     * num 每页显示多少个
     * offset 页码
     * tokenId 用户登录返回的tokenid
     * @param req
     * @param res
     */
    getIndexRecommend: function (req, res) {
        return goodsController.getIndexRecommend(req, res);
    },

    /**
     * 修改商品
     *
     *
     * @return { 返回结果集 }
     */
    editgoods: function (req, res) {
        return goodsController.editgoods(req, res);
    },

    /**
     * 修改产品状态
     * @param sku string sku码 必传
     * @param status int 状态【0 未审核   1 审核失败 2 未上架  3 正常】 必传
     * @param categoryId int 产品分类 必传
     * @param req
     * @param res
     */
    editGoodStatus: function (req, res) {
        return goodsController.editGoodStatus(req, res);
    },

    /**
     * 商城
     *
     *
     * @return { 返回结果集 }
     */
    gotoShoppingCenter: function (req, res) {
        return goodsController.gotoShoppingCenter(req, res);
    },

    /**
     * 商城商品列表
     *
     *
     * @return { 返回结果集 }
     */
    gotoShopsList: function (req, res) {
        return goodsController.gotoShopsList(req, res);
    },

    /**
     * 商城主页配置
     *
     *
     * @return { 返回结果集 }
     */
    shopsHomePageConfig: function (req, res) {
        return goodsController.shopsHomePageConfig(req, res);
    },



    /**
     * 商城主页存储
     *
     *
     * @return { 返回结果集 }
     */
    shopsHomePageSave: function (req, res) {
        return goodsController.shopsHomePageSave(req, res);
    },

    /**
     * 商城主页展示
     *
     *
     * @return { 返回结果集 }
     */
    gotoShopsHomePage: function (req, res) {
        return goodsController.gotoShopsHomePage(req, res);
    },

    /**
     * 商城专场
     *
     *
     * @return { 返回结果集 }
     */
    gotoShopsClassify: function (req, res) {
        return goodsController.gotoShopsClassify(req, res);
    },

    /**
     * 修改商品主页
     *
     *
     * @return { 返回结果集 }
     */
    updateShopsHomePage: function (req, res) {
        return goodsController.updateShopsHomePage(req, res);
    },

    /**
     * 秒杀商品系列
     *
     *
     * @return { 返回结果集 }
     */
    seckillingGoodsGroup:  function (req, res) {

        var allParams = req.allParams();

        var id = allParams.id;
        var mestoreid = allParams.storeid || 4;

        GoodSpecial.findOne({id:id}).exec(function (err, record) {
            if (err) return;
            console.log("cb_tag1: The result of this findOne is shown came out. check it out: ok");

            var whereIn = "",skuObj = "";
            record = record || {};
            record.products = record.products || "";
            products = record.products.split(',') || [];
            console.log("products.... ",products.length);

            var sortKeys = _.keys(products);
            var sortVals = _.values(products);

            var sortProducts = {};
            for(var i = 0; i<products.length; i++) {
                sortProducts[sortVals.shift()] = sortKeys.shift();
            }

            var cmdStr = '/usr/bin/curl http://localhost:1338/CmdGoods/cmdCurrentSeckillingGoods?storeid=' + mestoreid;
            console.log("cmdStr. ",cmdStr);
            exec(cmdStr, function(err,stdout,stderr) {

                console.log("err: ",err," \n ");

                if (!stdout) return;
                var seckillingdata = JSON.parse(stdout);
                var seckilingGoodsGroup = seckillingdata.seckilingGoodsGroup;
                var seckillingTimeGroup = seckillingdata.seckillingTimeGroup;
                var seckillingObj = { "seckilingGoodsGroup":{}, "seckillingTimeGroup": [] };

                var index = 0;
                var seckillingGroupIdArray = _.keys(seckillingTimeGroup);

                while(seckillingGroupIdArray.length) {
                    var isAddIndex = false;
                    var groupid = seckillingGroupIdArray.shift();
                    var goodsArr = seckilingGoodsGroup[groupid];

                    for(var j = 0; j<goodsArr.length; j++) {
                        goodsArr[j].iscancel = 0;
                        goodsArr[j].warnsid = 0;
                        goodsArr[j].num = 0;
                        if (products.indexOf(goodsArr[j].sku)>-1) {
                            goodsArr[j].sortid = sortProducts[goodsArr[j].sku];
                            seckillingObj.seckilingGoodsGroup[index] = seckillingObj.seckilingGoodsGroup[index] || [];
                            seckillingObj.seckillingTimeGroup[index] = seckillingTimeGroup[groupid];
                            seckillingObj.seckilingGoodsGroup[index].push(goodsArr[j]);
                            isAddIndex = true;
                        }
                    }

                    if (isAddIndex) {
                        seckillingObj.seckilingGoodsGroup[index] = _.sortBy(seckillingObj.seckilingGoodsGroup[index], 'sortid')
                        index++;
                    }
                }

                var userinfo = redis.getUserInfo();
                utils2.getWarnGroup(userinfo.id || userinfo.userId,function(err,mydata) {

                    mydata = mydata || [];
                    console.log("mydata. ",mydata.length);

                    var getSeckillingTimeGroup = function(firsttimestamp) {
                        return _.find(seckillingObj.seckillingTimeGroup, _.matchesProperty("firsttimestamp",firsttimestamp));
                    }

                    var getSeckillingGoodsGroup = function(goodslist,sku) {
                        return _.findIndex(goodslist, _.matchesProperty("sku",sku));
                    }

                    for(var n = 0; n<mydata.length; n++) {
                        var item = mydata[n] || {};
                        console.log("item. ",item);
                        var warns = item.warns || [];
                        var timeObj = getSeckillingTimeGroup(item.firsttimestamp);
                        var id = _.findIndex(seckillingObj.seckillingTimeGroup, timeObj);
                        var goodslist = seckillingObj.seckilingGoodsGroup[id] || [];

                        console.log("groupid. ",id," .goodslist. ",goodslist.length," the timeObj. ",timeObj);

                        for(var j = 0; j<warns.length; j++) {
                            var ele = warns[j];
                            var idx = getSeckillingGoodsGroup(goodslist,ele.sku);
                            console.log("element. ",ele.sku, "idx. ",idx);

                            if (idx > -1) {
                                seckillingObj.seckilingGoodsGroup[id][idx].iscancel = warns[j].iscancel;
                                seckillingObj.seckilingGoodsGroup[id][idx].warnsid = warns[j].id;
                                seckillingObj.seckilingGoodsGroup[id][idx].num = warns[j].num;
                            }
                        }
                    }

                    var groupidArray = _.keys(seckillingObj.seckillingTimeGroup);
                    console.log("获取到秒杀时间组: groupidArray.. ",groupidArray.length);

                    var goodsIdArray = _.keys(seckillingObj.seckilingGoodsGroup);
                    console.log("获取到秒杀商品组：goodsIdArray.. ",goodsIdArray.length);

                    while(groupidArray.length) {
                        var groupid = groupidArray.shift();
                        var goodsArr = seckillingObj.seckilingGoodsGroup[groupid];
                        console.log("时间组ID. ",groupid," 商品数量. ",goodsArr.length);
                    }

                    seckillingObj.specialName = record.name;
                    seckillingObj.mobiBanner = record.mobiBanner;
                    //console.log("seckillingobj. ",seckillingobj);
                    return res.json({
                        data:seckillingObj,
                        timestamp:(new Date()).getTime(),
                        code:200
                    });
                });

            });

        });
    },
};
