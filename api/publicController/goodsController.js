var exec = require('child_process').exec;
var redis = require("redis"),
    g_client = redis.createClient();

g_client.auth('bqldaling890',function(){
    //console.log('redis auth pass.');
})
g_client.select(8, function() {
    //console.log('redis select pass.');
});

module.exports = {

    /**
     * 添加商品
     *
     *
     * @return { 返回结果集 }
     */
    goodsParameter: function (req, res) {

        console.log('goodsParameter: This is the function entry. check it out: ', req.allParams());
  
        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid,id = mine.id;
        var goods = new Map(Object.entries(allParams));   
        //console.log('copy goods: check it out: ', goods);

        goods.delete('id');
        goods.delete('vula1');

        goods.set('stock', 0);
        goods.set('status', 0);
        goods.set('userid', id);
        goods.set('reserve5',0);
        goods.set('reserve2', 0);
        goods.set('reserve3', 0);
        goods.set('reserve4', 0);
        goods.set('reserve6', 0);
        goods.set('reserve7', 0);
        goods.set('reserve8', 0);
        goods.set('reserve9', 0);
        goods.set('reserve10', 0);
        goods.set('goodsseries', 0);
        goods.set('storeid', storeid);
        goods.set('seckillingstock', 0);

        console.log('seckillingtime. ',goods.get('seckillingtime'));
        if (!goods.get('seckillingtime')) {
            goods.set('seckillingtime','0')
        }

        //goods = gcom.isResetKey('reserve1', goods);
        goods = gcom.isResetKey('propertypic', goods);
        goods.set('sku', this.generateSku(storeid));
        goods.set('createdAt', (new Date()).Format("yyyy-MM-dd hh:mm:ss.S"));
        goods.set('presaleendtime', (new Date(goods.get('presaleendtime'))).Format("yyyy-MM-dd hh:mm:ss.S"));

        var xss = require('xss');
        xss.whiteList.div = xss.whiteList.div || [];
        xss.whiteList.strike = xss.whiteList.strike || [];

        for (var key in xss.whiteList) {
            xss.whiteList[key].push("style", "class", "text-align", "height", "width");
        }

        goods.set('detailbody', xss(goods.get('detailbody')));
        console.log('goods map: check it out: ', goods);

        var goodsseries = gcom.analysisGoodsSeries(goods);

        var len = goodsseries.length - 1;
        goods = new Map(goodsseries[len]);
        goodsseries.splice(len, 1);

        for(var i = 0; i<goodsseries.length; i++) {

            console.log('del id: ',goodsseries[i].get('id'));
            console.log('del storecategoryid: ',goodsseries[i].get('storecategoryid'));

            var id = goodsseries[i].get('id');
            if (id >= -1 ) goodsseries[i].delete('id');
            
            var storecategoryid = goodsseries[i].get('storecategoryid');
            if (storecategoryid == -1) goodsseries[i].delete('storecategoryid');
        }
        console.log('goodsseries map: check it out: ', goodsseries.length);

        var self = this, type = parseInt(goods.get('type'));
        return self.generalGoods(req, res, goods, goodsseries);
        //return type==1 ? self.generalGoods(req, res,goods,goodsseries) : self.presaleGoods(req, res,goods,goodsseries);
    },

    generalGoods: function (req, res, goods, goodsseries) {

        console.log('generalGoods: This is the function entry. ');

        var allParams = req.allParams();
        var storeid = goods.get('storeid');
        var skuObj = gcom.revertSku(goods.get('sku'));

        var type = allParams.type;
        var status = allParams.status;
        var platform = allParams.platform;

        var hashMerchantGoods = gcom.hashMerchantGoods(goods);
        console.log('key. ',hashMerchantGoods.key,' val. ',hashMerchantGoods.val);
        g_client.hset(hashMerchantGoods.key, hashMerchantGoods.val,"merchant", redis.print);

        var hashCategoryGoods = gcom.hashCategoryGoods(goods);
        console.log('key. ',hashCategoryGoods.key,' val. ',hashCategoryGoods.val);
        g_client.hset(hashCategoryGoods.key, hashCategoryGoods.val,"category", redis.print);

        var merchantgoodslist = goodsseries.slice();
        var categorygoodslist = goodsseries.slice();

        while (merchantgoodslist.length) {
            var subgoods = new Map(merchantgoodslist.shift());
            var hashMerchantSubGoods = gcom.hashMerchantGoods(subgoods);
            g_client.hset(hashMerchantSubGoods.key, hashMerchantSubGoods.val,"merchant", redis.print);
        }

        while (categorygoodslist.length) {
            var subgoods = new Map(categorygoodslist.shift());
            var hashCategorySubGoods = gcom.hashCategoryGoods(subgoods);
            g_client.hset(hashCategorySubGoods.key, hashCategorySubGoods.val,"category", redis.print);
        }


        //特殊处理
        initShopsPresale = function() {
            if (type == 2&&status==3&&platform==OS_SELLER) {
                console.log('type: check it out: ',type);
                var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                gcom.initShopsPresale(tb_M_Name);
            }

            io.gotoQueryGoods(skuObj.sku);
            cmdGoods.gotoCmdReady(storeid,type);
        };

        async.auto({

            createCGoods: function (callback, result) {
                try {

                    var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS, goods.get('parentid'));
                    var insertCGoosSql = gcom.insertSql(goods, tb_C_Name);

                    Creator.query(insertCGoosSql, function create(err, newgoods) {
                        if (err) return;
                        callback(err, newgoods);
                        goods.set('id', newgoods.insertId);
                        console.log('cb_tag2: The result of this insert is shown came out. check it out: ok');
                    });

                } catch (e) {
                    console.log('createCGoods err: ', e);
                }

            },

            copyMGoods: ['createCGoods', function (callback, result) {

                try {

                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS, storeid>0 ? storeid : skuObj.storeid);
                    var insertMGoosSql = gcom.insertSql(goods, tb_M_Name);

                    Creator.query(insertMGoosSql, function create(err, newgoods) {
                        if (err) return;
                        callback(err, newgoods);
                        console.log('cb_tag3: The result of this insert is shown came out. check it out: ok');
                    });

                } catch (e) {
                    console.log('copyMGoods err: ', e);
                }
            }],

            createCGoodsSeries: ['createCGoods', function (callback, result) {

                try {
                    //console.log('rst: check it out: ',result.createCGoods);
                    var len = 0, counter = [];
                    var doneCounter = function (counter, ele) {

                        goodsseries[counter.length - 1].set('id', ele.insertId);
                        if (counter.length == goodsseries.length) {
                            callback(null, {});
                        }
                    };


                    while (len < goodsseries.length) {

                        var item = goodsseries[len];
                        item.set('goodsseries', goods.get('id'));
                        var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS, item.get('parentid'));
                        var insertCGoosSql = gcom.insertSql(item, tb_C_Name);


                        Creator.query(insertCGoosSql, function create(err, element) {
                            if (err) return;
                            counter.push(1);
                            doneCounter(counter, element);
                            console.log('cb_tag4: The result of this insert is shown came out. check it out: ok');
                        });

                        len++;
                    }

                } catch (e) {
                    console.log('createCGoodsSeries err: ', e);
                }
            }],

            copyMGoodsSeries: ['createCGoodsSeries', function (callback, result) {

                try {

                    var counter = [];
                    var doneCounter = function (counter) {

                        if (!goodsseries.length) {
                            callback(null, {});
                        }
                    };

                    while (goodsseries.length > 0) {

                        var item = goodsseries.pop();
                        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS, item.get('storeid'));
                        var insertMGoosSql = gcom.insertSql(item, tb_M_Name);

                        Creator.query(insertMGoosSql, function create(err, element) {
                            if (err) return;
                            counter.push(1);
                            doneCounter(counter);
                            console.log('cb_tag5: The result of this insert is shown came out. check it out: ok');
                        });
                    }

                } catch (e) {
                    console.log('copyMGoodsSeries err: ', e);
                }
            }],
        }, function (err, results) {
            //console.log('rst: is ok ',results);
            initShopsPresale();
            if (results) {
                return res.json({
                    data: [],
                    code: 200
                });
            }
        });
    },

    /**
     * 分类添加商品
     * (备用接口)
     *
     *
     * @return { 返回结果集 }
     */
    presaleGoods: function (req, res, goods, goodsseries) {
        return res.json({
            data: [],
            code: 200
        });
    },

    /**
     * 添加规格
     *
     *
     * @return { 返回结果集 }
     */
    goodsNormsParameter: function (req, res) {

        console.log('goodsNormsParameter: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        async.auto({
            createProperty: function (callback, result) {

                try {

                    //构造消息
                    var MsgObj = MsgObj || {};

                    MsgObj.status = 0;
                    MsgObj.sortorder = 0;
                    MsgObj.aliasname = 0;
                    MsgObj.isenable = 1;
                    MsgObj.valueoftype = 'text';     
                    MsgObj.name = allParams.name;
                    MsgObj.storeid = mine.storeid;         
                    MsgObj.description = allParams.name + '规格';
                    console.log('MsgObj: check it out: ', MsgObj);

                    Goodsproperty.create(MsgObj).exec(function (err, recond) {
                        if (err) return;
                        callback(err,recond)
                        console.log("cb_tag1: The result of this \' create \' is shown came out. check it out: ok");
                    });

                } catch (e) {
                  console.log('createProperty err: ',e);
                }
            },

            createProValue:['createProperty', function (callback, result) {

                try {

                    console.log('createProperty: check it out: ',result.createProperty);
                    var id = result.createProperty.id;
                    var listItem = allParams.namearr || [];


                    var counter = [],cbArr = [];
                    var doneCounter = function (err,list) {
                        if (!listItem.length) {
                            callback(err,list);
                        }
                    };

                    while(listItem.length >0) {
                        var proVal = listItem.pop();

                        //构造消息
                        var MsgProVal = {};
                        MsgProVal.status = 1;
                        MsgProVal.sortsorder = 1;
                        MsgProVal.propertyid = id;
                        MsgProVal.propertyimage = "";
                        MsgProVal.propertyvalue = proVal;

                        //创建规格属性
                        console.log('MsgProVal: check it out: ',MsgProVal);
                        Propertyvalue.create(MsgProVal).exec(function (err, recond) {
                            if (err) return;
                            counter.push(recond);
                            doneCounter(err,counter);
                            console.log("cb_tag2: The result of this create is shown came out. check it out: ok")
                        });
                    }

                } catch (e) {
                  console.log('createProValue err: ',e);
                }
            }],

        }, function(err, results) {
            return res.json({
                data: [],
                code: 200
            });
        });
    },

    /**
     * 删除规格并删除规格属性
     *
     *
     * @return { 返回结果集 }
     */
    delNormsGroup: function (req, res) {

        console.log('delNormsGroup: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var listVal = allParams.valArray || [];
        var listItem = allParams.proArray || [];
        
        //删除规格
        console.log('listItem: check it out. ',listItem.length);
        Goodsproperty.destroy({id: listItem}).exec(function (err) {
            if (err) return;
            console.log("cb_tag1: The result of this \' destroy \' is shown came out. check it out: ok");
        });

        var properid = listItem[0];
        var delProValSql = 'delete from propertyvalue where propertyid = ' + properid;

        //删除规格属性
        console.log('delProValSql: check it out: ',delProValSql);
        Propertyvalue.query(delProValSql, function (err, recond) {
            if (err) return
            console.log("cb_tag1: The result of this \' delete \' is shown came out. check it out: ok");
        });

        //删除对应规格的商品
        gcom.delGoodsNorms(gcom.getCache());

        return res.json({
            data: [],
            code: 200
        });
    },

    /**
     * 删除规格子项
     *
     *
     * @return { 返回结果集 }
     */
    delNormsValue: function (req, res) {

        console.log('delNormsValue: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var listItem = allParams.valArray || [];

        //删除规格属性
        Propertyvalue.destroy({id: listItem}).exec(function (err) {
            if (err) return;
            console.log("cb_tag1: The result of this \' destroy \' is shown came out. check it out: ok");
        });

        //删除规格属性商品
        gcom.delGoodsNorms(gcom.getCache());

        return res.json({
            data: [],
            code: 200
        });
    },

    /**
     * 修改规格子名称和新增规格属性
     *
     *
     * @return { 返回结果集 }
     */
    updateNormsGrop: function (req, res) {

        console.log('updateNormsGrop: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        //修改规格名称
        var id = allParams.id,name = allParams.name;
        Goodsproperty.update({id: id}).set({name: name}).exec(function (err, recond) {
            if(err) return;
            console.log("cb_tag1: The result of this \' update \' is shown came out. check it out: ok");
        });


        var listItem = allParams.namearr || [];

        while(listItem.length > 0) {
            var proVal = listItem.pop();

            //构造信息
            var MsgObj = {};
            MsgObj.status = 1;
            MsgObj.sortsorder = 0;                     
            MsgObj.propertyid = id;
            MsgObj.propertyimage = '';                        
            MsgObj.propertyvalue = proVal; 

            //新增规格属性
            console.log('MsgObj: check it out. ',MsgObj);
            Propertyvalue.create(MsgObj).exec(function (err, recond) {
                if(err) return;
                console.log("cb_tag2: The result of this \' create \' is shown came out. check it out: ok");
            });              
        }

        return res.json({
            data: [],
            code: 200
        })
    },

    /**
     * 管理员添加商品类别
     *
     *
     * @return { 返回结果集 }
     */
    adminAddClassify: function (req, res) {
        
        console.log('adminAddClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.id = allParams.id || 0;

        if (allParams.id === 0) {
            //管理员ID检查
            map.set('ADMINDID_CHECK',ADMINDID_CHECK);
        }

        var storeid = mine.storeid;
        var listItem = allParams.namearr || [];

        if (parseInt(allParams.id) === 0) {
            var isSame = false;
            for(var i = 0; i<listItem.length; i++) {
                var categoryname = listItem[i];
                if (seller.isCCategoryName(categoryname)) {
                    return res.json({
                        data: [],
                        code: 400,
                        msg:"一级类别不能有相同,请查证后继续添加,谢谢",
                    });
                }
            }
        }


        createCGoodsTable = function(parentid,categoryid) {

            if(parentid === 0&&categoryid>0) {

                /**
                * parent 如果为0，表示一种父类别商品，要重新创建
                * 一张父类商品类，用于商品存储新的商品类别。
                */

                var createCGoodsTabSql = 'create table goodsList' + categoryid + ' like goodscontent';

                console.log('createCGoodsTabSql: check it out. ',createCGoodsTabSql);
                Creator.query(createCGoodsTabSql, function (err, recond) {
                    if (err) return;
                    console.log("cb_tag1: The result of this \'query \' is shown came out. check it out: ok")
                });

            }
        };

        var listsql = [];
        var listobj = [];
        const CREATE_CATEGORY = 1;
        const ADDNEW_CATEGORY = 2;
        const type = (allParams.id === 0 ? 1 : 2);
        while(listItem.length > 0) {

            var categoryname = listItem.pop();

            //构造消息
            var MsgObj = {};

            MsgObj.hid = '';
            MsgObj.status = 0;
            MsgObj.sortorder = 0;
            MsgObj.ischannel = 0;
            MsgObj.storeid = storeid;
            MsgObj.categoryname = categoryname;
            MsgObj.description = categoryname + '类别';
            MsgObj.parentid = (type === 1 ? 0 : allParams.id);
            console.log('MsgObj: check it out. ',MsgObj);

            //保存构造
            listsql.push(MsgObj);
        }

        switch(type) {
            case CREATE_CATEGORY:

                 //新增商品父类别
                 for(var i = 0; i<listsql.length; i++) {
                     var ccategoryObj = listsql[i];
                     Goodscategory.create(ccategoryObj).exec(function (err, recond) {
                         if (err) return;

                         var list = [];
                         list.push(0);
                         list.push(recond.id);
                         recond.isdelete = recond.isdelete || 0;
                         recond.hid = gcom.hashToString(list);
                         console.log("cb_tag1: The result of this create is shown came out. check it out: ok");

                         recond.save(function (err) {
                             if (err) return;
                             seller.queryCCategory();
                             console.log("save_tag1: This saved successfully. ",recond.hid);
                             
                             //构造消息
                             var newccategoryObj = {};
                             newccategoryObj.id = recond.id;
                             newccategoryObj.hid = recond.hid;
                             newccategoryObj.storeid = recond.storeid;
                             newccategoryObj.parentid = recond.parentid;
                             newccategoryObj.categoryname = recond.categoryname;

                             listobj.push(newccategoryObj);
                             if (listobj.length === listsql.length) {
                                return res.json({
                                    data: listobj,
                                    code: 200,
                                    msg:"",
                                });
                             }
                         });

                         createCGoodsTable(recond.parentid,recond.id,allParams.id);
                     });
                 }
                 
                break;
            case ADDNEW_CATEGORY:

                 //新增商品子类别
                 var id = allParams.id,counter = 0;
                 Goodscategory.findOne({id: id}).exec(function (err, recond) {
                     if (err) return;
                     console.log("cb_tag2: The result of this \'query \' is shown came out. check it out: ok")

                     recond = recond || {}
                     var hidstring = recond.hid || "";
                     var hidArray = hidstring.split(':');
                     if (hidArray.length > 0) {
                        for(var i = 0; i<listsql.length; i++) {
                            var ccategoryObj = listsql[i];
                            Goodscategory.create(ccategoryObj).exec(function (err, recond) {
                                 if (err) return;

                                 var LEN_SECOND = 2;
                                 var LEN_THIRD = 3;
                                 var LEN_FOUTH = 4;
                                 switch(hidArray.length) {
                                     case LEN_SECOND:
                                        hidArray.push(recond.id);
                                        break;
                                     case LEN_THIRD:
                                         hidArray.splice(hidArray.length - 1,1,recond.id);
                                        break;
                                     case LEN_FOUTH:
                                         hidArray.splice(hidArray.length - 1,1,recond.id);
                                        break;
                                     default:
                                         console.log('err: ',hidArray.length);
                                 }
                                 
                                 recond.isdelete = recond.isdelete || 0;
                                 recond.hid =  gcom.hashToString(hidArray);
                                 console.log('recond.hid.',recond.hid);
                                 console.log("cb_tag1: The result of this create is shown came out. check it out: ok");

                                 recond.save(function (err) {
                                     if (err) return;
                                     seller.queryCCategory();
                                     console.log("save_tag1: This saved successfully. ",recond.hid);

                                     //构造消息
                                     var newccategoryObj = {};
                                     newccategoryObj.id = recond.id;
                                     newccategoryObj.hid = recond.hid;
                                     newccategoryObj.storeid = recond.storeid;
                                     newccategoryObj.parentid = recond.parentid;
                                     newccategoryObj.categoryname = recond.categoryname;

                                     listobj.push(newccategoryObj);
                                     if (listobj.length === listsql.length) {
                                        return res.json({
                                            data: listobj,
                                            code: 200,
                                            msg:"",
                                        });
                                     }
                                 });
                             });
                        };
                     }
                 });
                break;
            default:
                console.log('type: check it out. ',type);
        }
    },

    /**
     * 管理员添加商户类别
     *
     *
     * @return { 返回结果集 }
     */
    adminMerClassify: function (req, res) {

        console.log('adminMerClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();
        allParams.id = allParams.id || 0;

        var storeid = mine.storeid,id = allParams.id;
        var listItem = allParams.namearr || [];

        for(var i = 0; i<listItem.length; i++) {
            if (listItem[i] === "") {
                return res.json({
                    data: [],
                    code: 400,
                    msg:"参数错误",
                });
            }
        }

        var doneCounter = function (err,recond) {
            if (listItem.length == 0) {
                 var list_public = [],list_private = [];
                 Mercategory.find({}).exec(function (err, table) {
                    while(table.length > 0) {

                        var item = table.pop();
                        if (item.storeid === 0) {
                            list_public.push(item);
                        }else{

                            if (storeid === 0) {
                                list_private.push(item);
                            }else{
                                if (item.storeid === storeid) {
                                    list_private.push(item);
                                }
                            }
                        }
                    }
                    return res.json({
                        data: {list_public, list_private},
                        code: 200
                    });
                 });
                 
            }
        };

        if(listItem.length === 0) {
            return doneCounter(null,null);
        }

        while(listItem.length > 0) {

            var categoryname = listItem.pop();

            //构造消息
            var MsgObj = {};

            MsgObj.hid = '';
            MsgObj.status = 0;
            MsgObj.parentid = 0;
            MsgObj.sortorder = 0;
            MsgObj.ischannel = 0;
            MsgObj.categoryname = categoryname;
            MsgObj.description = categoryname + '类别';
            MsgObj.storeid = (id === 0 ? 0 : storeid);

            //创建商户类别
            console.log('MsgObj: check it out. ',MsgObj);
            Mercategory.create(MsgObj).exec(function (err, recond) {
                if (err) return;

                doneCounter(err,recond);
                recond.hid = gcom.hashToString([0, recond.id]);
                console.log("cb_tag1: The result of this create is shown came out. check it out. ok")

                recond.save(function (err) {
                    if (err) return;
                    console.log("save_tag1: This saved successfully.")
                });
            });
        }
    },

    /**
     * 管理员删除商户类别
     *
     *
     * @return { 返回结果集 }
     */
    adminDelMerClassify: function (req, res) {
        console.log('adminDelMerClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var storeid = mine.storeid;
        var industry = allParams.industry;

        var queryAccountSellerSql = "select industry from accountseller where industry like " + "\"%" + industry + "%\"";
        console.log('queryAccountSellerSql: check it out. ',queryAccountSellerSql); 
        Accountseller.query(queryAccountSellerSql, function (err, list) {
            if (err) return;

            console.log("cb_tag1: The result of this query is shown came out. check it out. ",list.length);

            if (!list.length) {
                var queryMerCategorySql = "delete from mercategory where id = " + id;
                console.log('queryMerCategorySql: check it out. ',queryMerCategorySql); 
                Mercategory.query(queryMerCategorySql, function (err, recond) {
                    if (err) return;
                    console.log("cb_tag2: The result of this delete is shown came out. check it out. ok");
                });
                return res.json({
                    data: list.length,
                    code: 200,
                    msg:"该类别无商户使用，删除成功。",
                }); 
            }else{
                return res.json({
                    data: list.length,
                    code: 400,
                    msg:"该类别有商户使用，建议不删除。",
                });
            }
        });

    },

    /**
     * 管理员筛选商户自定义的所有类别
     *
     *
     * @return { 返回结果集 }
     */
    adminScreenClassify: function (req, res) {

        console.log('adminScreenClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        //筛选商品类别
        var gd = ["id","hid","storeid","parentid","categoryname","isdelete"];
        var queryCCategorySql = "select " + gd.join(",") + " from goodscategory where isdelete = 0";

        console.log('queryCCategorySql: check it out: ', queryCCategorySql);
        Goodscategory.query(queryCCategorySql,function (err,  list) {
            if (err) return;
            seller.setCCategory(list);
            console.log("cb_tag1: The result of this create is shown came out. check it out. ",list.length);
            return res.json({
                data: list,
                code: 200,
                msg:"",
            });
        });
    },

    /**
     * 管理员删除类别并删除关联商品
     *
     *
     * @return { 返回结果集 }
     */
    adminDelClassify: function (req, res) {

        console.log('adminDelClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var isdelete = allParams.isdelete;
        if (isdelete==="true") isdelete = true;
        if (isdelete==="false") isdelete = false;

        var parentid = allParams.parentid;
        var ccategoryArray = allParams.idArray || [];

        var parentIdArray = seller.getSellerCCParentArray();
        var storeArray = seller.getStore();

        if (!ccategoryArray.length) {
            return res.json({
                data: [],
                code: 200,
                msg:"",
            });
        }

        if (isdelete) {

            var listsql = [];
            var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentid);
            var queryCGoodsSql = "update " + tb_C_Name + " set status = 2 where goodsseries = 0";

            listsql.push(queryCGoodsSql);
            for(var i = 0; i<storeArray.length; i++) {
                var storeObj = storeArray[i];
                var storeid = storeObj.id;
                if (storeid>0) {
                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                    for(var j = 0; j<ccategoryArray.length; j++) {
                        var categoryid = ccategoryArray[j];
                        var queryMGoodsSql = "update " + tb_M_Name + " set status = 2 where goodsseries = 0 and storecategoryid = " + categoryid;
                        listsql.push(queryMGoodsSql);
                    }
                }
            }

            for(var i = 0; i<listsql.length; i++) {
                var queryCWithMGoodsSql = listsql[i];
                //查询所有同类别的商品
                console.log('queryCWithMGoodsSql: check it out. ',queryCWithMGoodsSql);
                Creator.query(queryCWithMGoodsSql, function (err, list) {
                    if (err) return;
                    console.log("cb_tag1: The result of this \' query \' is shown came out. check it out. ok");
                }); 
            }

            var setCCategorySql = "update goodscategory set isdelete = 1 where id = " + parentid;
            console.log('setCCategorySql. check it out. ',setCCategorySql);
            Goodscategory.query(setCCategorySql,function (err) {
                if (err) return;
                seller.queryCCategory();
                return res.json({
                    data: [],
                    code: 200,
                    msg:"",
                });
                console.log("cb_tag2: The result of this \' destroy \' is shown came out. check it out: ok");
            });

        }else{

            var listsql = [];
            for(var key in parentIdArray ) {
                var parentid = key;
                var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentid);

                for(var i = 0; i<ccategoryArray.length; i++) {
                    var categoryid = ccategoryArray[i];
                    var queryCGoodsSql = "update " + tb_C_Name + " set status = 2 where goodsseries = 0 and storecategoryid = " + categoryid;

                    listsql.push(queryCGoodsSql);
                }
            }

            for(var i = 0; i<storeArray.length; i++) {
                var storeObj = storeArray[i];
                var storeid = storeObj.id;
                if (storeid>0) {
                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                    for(var j = 0; j<ccategoryArray.length; j++) {
                        var categoryid = ccategoryArray[j];
                        var queryMGoodsSql = "update " + tb_M_Name + " set status = 2 where goodsseries = 0 and storecategoryid = " + categoryid;
                        listsql.push(queryMGoodsSql);
                    };
                };
            };

            for(var i = 0; i<listsql.length; i++) {
                var queryCWithMGoodsSql =  listsql[i];
                //查询所有同类别的商品
                console.log('queryCWithMGoodsSql: check it out. ',queryCWithMGoodsSql);
                Creator.query(queryCWithMGoodsSql, function (err, list) {
                    if (err) return;
                    console.log("cb_tag3: The result of this \' query \' is shown came out. check it out. ok");
                }); 
            };

            var delCCategorySql = "delete from goodscategory ";
            for(var i = 0; i<ccategoryArray.length; i++) {
                var categoryid = ccategoryArray[i];
                if (i===0) {
                    delCCategorySql += " where ";
                }
                delCCategorySql += " id = " + categoryid;
                if (i<ccategoryArray.length-1) {
                    delCCategorySql += " or ";
                };
            };

            console.log('delCCategorySql. check it out. ',delCCategorySql);
            Goodscategory.query(delCCategorySql,function (err) {
                if (err) return;
                seller.queryCCategory();
                return res.json({
                    data: [],
                    code: 200,
                    msg:"",
                });
                console.log("cb_tag4: The result of this \' destroy \' is shown came out. check it out: ok");
            });
        };
    },

    /**
     * 总后台审核商品
     *
     *
     * @return { 返回结果集 }
     */
    updateGoodsList: function (req, res) {

        console.log('updateGoodsList: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var sku = allParams.sku;
        var status = allParams.status;
        var storeid = allParams.storeid;
        var parentid = allParams.parentid;

        var type = allParams.type || 1;
        var skuObj = gcom.revertSku(sku);
        var reserve5 = allParams.reserve5 || "";
        var starttime = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");

        m.notice.updateGoodsList(allParams);
        initShopsPresale = function() {
            if (type == 2) {
                console.log('type: check it out: ',type);
                var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                gcom.initShopsPresale(tb_M_Name);
            }
            io.gotoQueryGoods(skuObj.sku);
            cmdGoods.gotoCmdReady(storeid,type);
        };

        async.auto({

            setCGoods: function (callback) {
                try {
                    
                    var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentid);
                    var setCGoodsSql = 'update ' + tb_C_Name;
                    setCGoodsSql += ' set status = ' + status + ' , ';
                    setCGoodsSql += ' reserve5 = \'' + reserve5 + '\'';
                    setCGoodsSql += ', presalestarttime = \'' + starttime + '\'';
                    setCGoodsSql += ' where sku like \'' + sku + '%\'';
                    console.log('setCGoodsSql: check it out: ', setCGoodsSql);

                    Creator.query(setCGoodsSql, function (err, recond) {
                        if (err) return;
                        callback(err,recond);
                        console.log('cb_tag4: The result of this query is shown came out. check it out: ok');
                    });

                }catch (e) {
                    console.log('setCGoods err: ', e);
                }
            },

            setMGoods: function (callback) {
                try {

                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,skuObj.storeid);
                    var setMGoodsSql = 'update ' + tb_M_Name;
                    setMGoodsSql += ' set status = ' + status + ' , ';
                    setMGoodsSql += ' reserve5 = \'' + reserve5 + '\'';
                    setMGoodsSql += ', presalestarttime = \'' + starttime + '\'';
                    setMGoodsSql += ' where sku like \'' + sku + '%\'';
                    console.log('setMGoodsSql: check it out: ', setMGoodsSql);

                    Creator.query(setMGoodsSql, function (err, recond) {
                        if (err) return;
                        callback(err,recond);
                        console.log('cb_tag5: The result of this query is shown came out. check it out: ok');
                    });

                }catch (e) {
                    console.log('setMGoods err: ', e);
                }
            },

        }, function (err, results) {

            initShopsPresale();
            //console.log('results',results);
            return res.json({
                data:[],
                code: 200,
                msg: "操作成功"
            });
        });
    },

    /**
     * 销毁商户商品
     *
     *
     * @return { 返回结果集 }
     */
    destoryGoodslist: function (req, res) {

        console.log('destoryGoodslist: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var goods = new Map(Object.entries(allParams));
        var skuObj = gcom.revertSku(goods.get('sku'));
        var storeid = mine.storeid,id = mine.id,username = mine.userAlias;

        allParams.storeid = storeid;
        gcom.delPreGoods(skuObj.sku);
        m.notice.destoryGoodslist(allParams);

        async.auto({
            delCGoods: function (callback) {
                try {

                    var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,goods.get('parentid'));;
                    var delCGoodsSql = 'delete from ' + tb_C_Name;
                    delCGoodsSql += ' where sku like \'' + goods.get('sku') + '%\'';
                    console.log('delCGoodsSql: check it out: ', delCGoodsSql);

                    Creator.query(delCGoodsSql, function (err, list) {
                        if (err) return;
                        callback(err,list)
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ok');
                    });

                } catch (e) {
                    console.log('delCGoods err: ', e);
                }
            },
            delMGoods: function (callback) {
                try {

                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,goods.get('storeid'));
                    var delMGoodsSql = 'delete from ' + tb_M_Name;
                    delMGoodsSql += ' where sku like \'' + goods.get('sku') + '%\'';
                    console.log('delMGoodsSql: check it out: ', delMGoodsSql);

                    Creator.query(delMGoodsSql, function (err, list) {
                        if (err) return;
                        callback(err,list)
                        console.log('cb_tag2: The result of this query is shown came out. check it out: ok');
                    });

                }catch (e) {
                    console.log('delMGoods err: ', e);
                }
            },
        }, function (err, results) {
            return res.json({
                data:[],
                code: 200,
            });
        });
    },

    /**
     * 添加商户栏目
     *
     *
     * @return { 返回结果集 }
     */
    addMerSeries: function (req, res) {

        console.log('addMerSeries: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var name = allParams.name;
        var storeid = mine.storeid;
        var classify = allParams.classify;
        var iscreate = allParams.iscreate;
        var hashstring = gcom.hashSku(classify);

        var newShopsconcert = '';
        newShopsconcert += id + '#';
        newShopsconcert += name + '#';
        newShopsconcert += hashstring;
        console.log('newShopsconcert: check it out: ',newShopsconcert);

        if (iscreate) {
            //构造消息
            var MsgObj = {};

            MsgObj.icon = 0;
            MsgObj.link = 0;
            MsgObj.isedit = 1;
            MsgObj.status = 1;
            MsgObj.name = name;
            MsgObj.isdelete = 1;
            MsgObj.sortorder = 0;
            MsgObj.serverlink = 0;
            MsgObj.storeid = storeid;
            MsgObj.description = '商户' + storeid + '自定义的栏目';

            console.log('MsgObj: check it out. ',MsgObj);
            Navigationshopping.create(MsgObj).exec(function (err, recond) {
                 if (err) return;
                 console.log("cb_tag1: The result of this create is shown came out. check it out: ok");
            });
        }

        Accountseller.findOne({id:storeid}).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag2: The result of this findOne is shown came out. check it out:  ok');

            var shopsconcert = [];

            //专场数据
            recond = recond || {};
            recond.shopsconcert = recond.shopsconcert || "";
            recond.shopsconcert = recond.shopsconcert.split(',');

            shopsconcert = recond.shopsconcert || [];
            shopsconcert.remove("");

            if (iscreate) {
                shopsconcert.push(newShopsconcert);
                recond.shopsconcert = shopsconcert.toString();
            }else{
                for (var i = 0; i < shopsconcert.length; i++) {
                    var shopsconcertArr = shopsconcert[i].split('#');
                    if (parseInt(shopsconcertArr[0]) === parseInt(id)) {
                        shopsconcert.splice(i, 1, newShopsconcert);
                    }
                }
            }

            recond.save(function(err){
                if (err) return;
                seller.queryAccountSeller();
                console.log("save_tag1: This saved successfully. ",recond.shopsconcert);
            })
        });

        return res.json({
            data: [],
            code: 200
        });
    },

    /**
     * 删除商城管理栏目
     *
     *
     * @return { 返回结果集 }
     */
    delMerSeries: function (req, res) {

        console.log('delMerSeries: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var storeid = mine.storeid;

        Accountseller.findOne({id: storeid}).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this findOne is shown came out. check it out: ok');

            recond = recond || {};
            recond.shopsconcert = recond.shopsconcert || "";
            recond.shopsconcert = recond.shopsconcert.split(',');

            var shopsconcert = recond.shopsconcert || [];
            shopsconcert.remove("");

            for (var i = 0; i < shopsconcert.length; i++) {
                var shopsconcertArr = shopsconcert[i].split('#');

                var shopsconcertObj = {};
                shopsconcertObj.id = shopsconcertArr[0];
                shopsconcertObj.name = shopsconcertArr[1];

                if(_.isEqual(shopsconcertObj.id,id.toString())){
                    shopsconcert.remove(shopsconcert[i]);
                    break;
                }
            }

            recond.shopsconcert = shopsconcert.toString();
            recond.save(function(err){
                if (err) return;
                console.log("save_tag1: This saved successfully. ",recond.shopsconcert);
            })
        });

        return res.json({
            data: [],
            code: 200
        });       
    },

    /**
     * 修改商户系列
     *
     *
     * @return { 返回结果集 }
     */
    updateMerSeries: function (req, res) {

        console.log('updateMerSeries: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid;
        var listItem = allParams.editArray || [];

        Accountseller.findOne({id: storeid}).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this findOne is shown came out. check it out: ok');

            recond = recond || {};
            recond.shopsconcert = recond.shopsconcert || "";
            // recond.shopsconcert = recond.shopsconcert.split(',');

            // var shopsconcert = recond.shopsconcert || [];
            // shopsconcert.remove("");

            // for (var i = 0; i < shopsconcert.length; i++) {
            //     var shopsconcertArr = shopsconcert[i].split('-');

            //     var id = parseInt(shopsconcertArr[0])
            //     for (var j = 0; j < listItem.length; j++) {
            //         var _id = parseInt(listItem[j].series);
            //         if(_.isEqual(id,_id)) {

            //             var newShopsconcert = "";
            //             newShopsconcert += shopsconcertArr[0];
            //             newShopsconcert += "-";
            //             newShopsconcert += listItem[j].name;
            //             newShopsconcert += "-";
            //             newShopsconcert += shopsconcertArr[2];
            //             shopsconcert.splice(j, 1, newShopsconcert);
            //         }
            //     }
            // }

            // recond.shopsconcert = shopsconcert.toString();

            recond.shopsconcert = listItem.toString();
            recond.save(function(err){
                if (err) return;
                seller.queryAccountSeller();
                console.log("save_tag1: This saved successfully. ",recond.shopsconcert);
            })
        });

        return res.json({
            data: [],
            code: 200
        });
    },

    /**
     * 修改商户异业联盟
     *
     *
     * @return { 返回结果集 }
     */
    updateGoodsHorizontalAlliances: function (req, res) {

        console.log('updateGoodsHorizontalAlliances: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid;
        var listItem = allParams.storeidArray || [];

        Accountseller.findOne({id: storeid}).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this findOne is shown came out. check it out: ok');

            var horizontalalliances = horizontalallianceslist = [];

            recond = recond || {};
            recond.horizontalalliances = recond.horizontalalliances || "";
            recond.horizontalalliances = recond.horizontalalliances.split(',');

            horizontalalliances = recond.horizontalalliances || "";
            horizontalalliances.remove("");

            for (var i = 0; i < horizontalalliances.length; i++) {
                var horizontalalliancesObj = horizontalalliances[i].split('-');
                var id = horizontalalliancesObj.storeid,isFind = false;
                for (var j = 0; j < listItem.length; j++) {
                    var _id = parseInt(listItem[j].storeid);
                    if (isFind = _.isEqual(id,_id)) {
                        break;
                    }
                }
                if (isFind) {
                    listItem.push(horizontalalliancesObj);
                }
            }

            for (var i = 0; i < listItem.length; i++) {
                var item = listItem[i];
                var newHorizontalalliances = "";
                newHorizontalalliances += item.storeid;
                newHorizontalalliances += '-';
                newHorizontalalliances += item.name;
                newHorizontalalliances += '-';
                newHorizontalalliances += item.sortorder;
                horizontalallianceslist.push(newHorizontalalliances);
            }

            recond.horizontalalliances = horizontalallianceslist.toString();
            recond.save(function(err){
                if (err) return;
                console.log("save_tag1: This saved successfully. ",recond.horizontalalliances);
            })
        });

        return res.json({
            data: [],
            code: 200
        });
    },


    /**
     * 运营商显示商品列表
     * @param req
     * @param res
     */
    mergoodslist: function (req, res) {
        var where = {};
        where.id = req.param('no', false);

        where.storeid = req.param('storeid', false);
        where.parentid = req.param('category', false);
        where.status = req.param('status', false);
        var limit = req.param('limit', false);
        var offset = req.param('offset', 0);
        var mine = req.session.mine;
        if (!mine.storeid) {//达令总后台
            where.storeid = mine.storeid;
        }
        if (where.storeid) {

        }

        for (var key in where) {
            if (!where[key]) {
                delete where[key];
            }
        }
        var name = req.param('name', false);
        if (name) {
            where.name = {like: name + "%"};
        }
        var start = req.param('start', false);
        var end = req.param('end', false);
        if (start) {
            where.createdAt = {">=": start};
        }
        if (end) {
            if (!where.createdAt) {
                where.createdAt = {};
            }

            where.createdAt["<="] = end;
        }
        console.log(where);
        function prepareCondition(where, protype) {
            var condition = " ";
            for (var key in where) {
                if (where[key] instanceof Object) {
                    condition += prepareCondition(where[key], key);
                } else {
                    if (key.indexOf(">") != -1 || key.indexOf("<") != -1 || key.indexOf("in") != -1 || key == "like") {
                        condition += "a." + protype + key + where[key] + " and ";
                    } else {
                        condition += "a." + key + "=" + where[key] + " and ";
                    }
                }
            }
            return condition;
        }

        var condition = prepareCondition(where);
        condition = condition.substring(0, condition.length - 4);
        console.log(condition);
        if (!mine.storeid) {
            var sql = "select a.id,a.name,a.status,a.createdAt,b.categoryname from mergoodsList" + where.storeid +
                " a  inner join goodscategory b on a.parentid=b.id inner join accountseller c on c.id=a.storeid where a.goodsseries=0 and " + condition;
        } else {
            var sql = "select a.id,a.name,a.status,a.createdAt,b.categoryname from mergoodsList" + where.storeid +
                " a  inner join goodscategory b on a.parentid=b.id where a.goodsseries=0 and " + condition;
        }

        if (limit) {
            sql += " limit " + offset + "," + limit;
        }
        console.log(sql);
        Creator.query(sql, function (err, recond) {
            if (err) return res.negotiate(err);
            if (recond.length > 0) {
                return res.json({
                    code: 200,
                    data: recond
                });
            }
            return res.json({
                code: 400,
                msg: "没有数据",
                data: []
            });
        });


    },
   
    /**
     * 添加首页推荐
     * ids 产品id组成的字符串 如 2,4,5
     *
     * @param req
     * @param res
     */
    addIndexRecommend: function (req, res) {
        var ids = req.param("ids", false);
        var mine = req.session.mine;
        
        var storeid = mine.storeid;
        var dat = {};
        dat.type = 3;
        dat.status = 1;
        dat.products = ids;
        dat.storeid = storeid;
        GoodSpecial.findOne({storeid: storeid, type: 3}).exec(function (err, goods) {
            if (err) return res.negotiate(err);
            if (goods) {
                GoodSpecial.update({storeid: storeid, type: 3}, dat).exec(function (err, recond) {
                    if (err) return res.negotiate(err);
                    console.log(recond);
                    if (recond) {
                        return res.json({
                            code: 200,
                            msg: "操作成功",
                            data: {}
                        });
                    }
                    return res.json({
                        code: 400,
                        msg: "操作失败",
                        data: {}
                    });
                });
            } else {
                GoodSpecial.create(dat).exec(function (err, recond) {
                    if (err) return res.negotiate(err);
                    console.log(recond);
                    if (recond) {
                        return res.json({
                            code: 200,
                            msg: "操作成功",
                            data: {}
                        });
                    }
                    return res.json({
                        code: 400,
                        msg: "操作失败",
                        data: {}
                    });
                });
            }
        });

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
        var num = req.param("num", 0);
        var offset = req.param("offset", 1);
        var tokenId = req.param("tokenId", false);
        var isBack = req.param("backend", false);
        var storeid = req.param("storeid", false);
        var mId = req.param("mId", false);
        var os = req.param("os", false);
        if (isBack) {
            if (!storeid) {
                storeid = req.session.mine.storeid;
            }
            getGoods(storeid, num, offset);
        }
        if (os == 2) {
            getGoods(4, num, offset);
        } else if (tokenId) {
            var client = redis.client({db: 2});
            client.get(mId + ":" + tokenId, function (err, value) {
                if (err) return res.negotiate(err);
                if ((user = utility.decodeToken(value))) {
                    var storeid = user.operatorno;
                    getGoods(storeid, num, offset);
                } else {
                    return res.json({
                        code: 400,
                        msg: '没有数据'
                    });
                }

            });
        } else if (req.session.user) {
            var user = req.session.user;
            if (!user) {
                return res.json({
                    code: 400,
                    msg: "tokenId未传递",
                    data: {},
                });
            }
            var storeid = user.operatorno;
            getGoods(storeid, num, offset);
        }
        function getGoods(storeid, num, offset) {
            GoodSpecial.findOne({storeid: storeid, type: 3}).exec(function (err, goods) {
                if (err) return res.negotiate(err);

                if (goods) {
                    var productStr = goods.products;
                    if (productStr.length > 0) {
                        var productArray = productStr.split(",");
                        var aProductArray = productArray;
                        if (num) {
                            var seek = (offset - 1) * num;
                            var aProductArray = productArray.slice(seek, seek + num);
                        }
                        async.mapSeries(aProductArray, function (product, cb) {
                            var skuArray = product.split("-");
                            var storeid = skuArray[1];
                            console.log(skuArray);
                            var sql = "select id,storecategoryid,propertyvaluelist,brandid,storeid,name,keywords,sku,imagedefault,type," +
                                "attachment,price,pricepoint,pricepromotion,deposit,premoneey,isseckilling,seckillingflow,seckillingsell," +
                                "seckillingtime,seckillingprice,seckillingstock,seckillingexplain,homeseckillingprice,seckillingdescription from mergoodsList"
                                + storeid + " where goodsseries=0 AND sku='" + product + "' order by recommend asc,createdAt desc";
                            Creator.query(sql, function (err, goods) {
                                if (err) return res.negotiate(err);
                                if (goods) {
                                    if (goods.length > 0) {
                                        cb(null, goods[0]);
                                    } else {
                                        cb(null, null);
                                    }
                                }
                            });

                        }, function (err, result) {
                            if (err) return res.negotiate(err);

                            if (result.length > 0) {
                                var items = [];
                                result.forEach(function (item) {
                                    if (item != null) {
                                        items.push(item);
                                    }

                                });
                                return res.json({
                                    code: 200,
                                    data: items,
                                    count: productArray.length
                                });
                            }
                            return res.json({
                                code: 400,
                                msg: "没有数据"
                            });
                        });

                    } else {
                        return res.json({
                            code: 400,
                            msg: "没有数据"
                        });
                    }
                } else {
                    return res.json({
                        code: 400,
                        msg: "没有数据"
                    });
                }
            });
        }
    },

    /**
     * 修改商品
     *
     *
     * @return { 返回结果集 }
     */
    editgoods: function (req, res) {

        console.log('editgoods: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var isedit = allParams.isedit;
        var skuObj = gcom.revertSku(allParams.sku);
        var goods = new Map(Object.entries(allParams)),self = this;   
        var storeid = mine.storeid,sku = allParams.sku,id = mine.id;
        var platform = allParams.platform,oldcategory = allParams.oldcategory;

        //console.log('copy goods: check it out: ', goods);
        var type = allParams.type;
        var status = allParams.status;
        switch(platform) {
            case OS_ADMIN:
                    status = 3;
                break;
            case OS_SELLER:
                    status = isedit ? 0 : status;
                break;
            case OS_MOBILE:
            case TYPE_PLATFORM_WINDOWS:
            case TYPE_PLATFORM_WEBCHAT:
            case TYPE_PLATFORM_IPHONE:
                break;
            default:
                console.log('err: platform ',platform)
        }
        console.log('platform: ',platform);
       
        goods.delete('p1');
        goods.delete('p2');
        goods.delete('p3');
        goods.delete('id');
        goods.delete('isedit');
        goods.set('stock',0);
        goods.set('sku', sku);
        goods.delete('vula1');
        goods.set('reserve5',"");
        goods.delete('nickname');
        goods.delete('platform');
        goods.delete('categoryname');
        goods.set('goodsseries',0);
        goods.delete('oldcategory');
        goods.set('userid', id);
        goods.set('status', status);
        goods.set('seckillingstock', 0);

        //console.log('seckillingtime. ',goods.get('seckillingtime'));
        if (!goods.get('seckillingtime')) {
            goods.set('seckillingtime','0')
        }

        if (goods.get('type') === 3) {
            goods.set('isseckilling',1)
        }

        var seckillingtime = goods.get('seckillingtime');
        if (seckillingtime.length) {
            goods.set('seckillingtime',JSON.stringify(seckillingtime));
        }

        var nowtime = goods.get('presalestarttime') || 1;
        if (nowtime) {
            nowtime = nowtime == 1 ? (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") : (new Date(goods.get('presalestarttime'))).Format("yyyy-MM-dd hh:mm:ss.S");
            //console.log('nowtime check it out. ',String(nowtime));
            goods.set('presalestarttime',String(nowtime));
        }
        //goods.delete('presalestarttime');
        //goods.set('storeid', storeid);
        //goods = gcom.isResetKey('reserve1', goods);
        goods = gcom.isResetKey('propertypic', goods);
        //goods.set('createdAt', (new Date()).Format("yyyy-MM-dd hh:mm:ss.S"));
        goods.set('presaleendtime', (new Date(goods.get('presaleendtime'))).Format("yyyy-MM-dd hh:mm:ss.S"));

        var xss = require('xss');
        xss.whiteList.div = xss.whiteList.div || [];
        xss.whiteList.strike = xss.whiteList.strike || [];

        for (var key in xss.whiteList) {
            xss.whiteList[key].push("style", "class", "text-align", "height", "width");
        }

        goods.set('detailbody', xss(goods.get('detailbody')));
        console.log('goods map: check it out: ', goods);

        var goodsseries = gcom.analysisGoodsSeries(goods)

        var len = goodsseries.length - 1;
        goods = new Map(goodsseries[len]);
        goodsseries.splice(len, 1);
        console.log('goodsseries map: check it out: ', goodsseries);


        for(var i = 0;i<goodsseries.length;i++) {
                            
            console.log('del id: ',goodsseries[i].get('id'));
            console.log('del storecategoryid: ',goodsseries[i].get('storecategoryid'));

            var id = goodsseries[i].get('id');
            if (id >= -1 ) goodsseries[i].delete('id');
            
            var storecategoryid = goodsseries[i].get('storecategoryid')
            if (storecategoryid == -1) goodsseries[i].delete('storecategoryid');
        }

        var merchantOldObj = {},categoryOldObj = {};
        var tabMNameOld = gcom.getMysqlTable(TAB_M_GOODS, storeid);
        var tabCNameOld = gcom.getMysqlTable(TAB_C_GOODS, oldcategory);

        merchantOldObj.isdelete = 0;
        merchantOldObj.tablename = tabMNameOld;
        merchantOldObj.sku = skuObj.sku

        categoryOldObj.isdelete = 0;
        categoryOldObj.tablename = tabCNameOld;
        categoryOldObj.sku = skuObj.sku

        var queryMerchantGoodsOldSql = scom.queryMerchantGoods(merchantOldObj);
        console.log('queryMerchantGoodsOldSql..... ',queryMerchantGoodsOldSql);
        scom.delMerchantGoods(queryMerchantGoodsOldSql);

        var queryCategoryGoodsOldSql = scom.queryMerchantGoods(categoryOldObj);
        console.log('queryCategoryGoodsOldSql..... ',queryCategoryGoodsOldSql);
        scom.delCategoryGoods(queryCategoryGoodsOldSql);

        async.auto({

            delGoodsList: function (callback) {

                try {

                    var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS, oldcategory);
                    var delCGoodsSql = 'delete from ' + tb_C_Name + ' where ' + ' sku like \'' + sku + '%\'';
                    console.log('delCGoodsSql: check it out: ', delCGoodsSql);

                    Creator.query(delCGoodsSql, function query(err, list) {
                        if (err) return;
                        callback(err, list);
                        console.log('cb_Dtag2: The result of this query is shown came out. check it out: ok');
                    });

                } catch (e) {
                    console.log('delGoodsList err: ', e);
                }
            },
            
            delMerGoodsList: function (callback) {

                try {

                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS, storeid>0 ? storeid : skuObj.storeid);
                    var delMGoodsSql = 'delete from ' + tb_M_Name + ' where ' + ' sku like \'' + sku + '%\'';
                    console.log('delMGoodsSql: check it out: ', delMGoodsSql);

                    Creator.query(delMGoodsSql, function query(err, list) {
                        if (err) return;
                        callback(err, list);
                        console.log('cb_Dtag3: The result of this query is shown came out. check it out: ok');
                    });

                } catch (e) {
                    console.log('delMerGoodsList err: ', e);
                }
            },
        }, function (err, results) {
            if (results) {
                var type = parseInt(goods.get('type'));
                return self.generalGoods(req, res, goods, goodsseries);
            }
        });
    },

    /**
     * 随机商品码
     *
     *
     * @return { 返回结果集 }
     */
    generateSku: function (storeid) {
        return utility.generateMixed(4, false) + "-" + storeid + "-" + (new Date()).getTime();
    },

    /**
     * 产生商品码
     *
     *
     * @return { 返回结果集 }
     */
    getSku: function (req, res) {
        var code = "";
        storeid = 1;
        for (i = 20; i > 0; i--) {
            var temp = utility.generateMixed(4, false) + "-" + storeid + "-" + ((new Date()).getTime() - Math.ceil(Math.random() * 20 - 10)).toString();
            console.log(temp);
            code += "" + temp + " ";
        }
        return res.json({
            code: code
        });
    },
    uploadVideo: function (req, res) {
        upload.uploadFile(req, res, "video", "products");
    },
    uploadGoods: function (req, res) {
        upload.uploadFile(req, res, "pic[]", "products");
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

        console.log('editGoodStatus: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var goods = new Map(Object.entries(allParams));
        var sku = gcom.revertSku(goods.get('sku'));
        
        async.auto({
            setCGoods: function (callback) {
                try {

                    var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,goods.get('categoryid'));
                    var setCGoodsSql = 'update ' + tb_C_Name;
                    setCGoodsSql += ' set status = ' + goods.get('status');
                    setCGoodsSql += ' where sku like \'' + goods.get('sku') + '%\'';
                    console.log('setCGoodsSql: check it out: ', setCGoodsSql);

                    Creator.query(setCGoodsSql, function (err, list) {
                        if (err) return;
                        callback(err,list)
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                    });

                }catch (e) {
                    console.log('setCGoods err: ', e);
                }
            },
            setMGoods: function (callback) {
                try {

                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,sku.storeid);
                    var setMGoodsSql = 'update ' + tb_M_Name;
                    setMGoodsSql += ' set status = ' + goods.get('status');
                    setMGoodsSql += ' where sku like \'' + goods.get('sku') + '%\'';
                    console.log('setMGoodsSql: check it out: ', setMGoodsSql);

                    Creator.query(setMGoodsSql, function (err, list) {
                        if (err) return;
                        callback(err,list)
                        console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                    });

                }catch (e) {
                    console.log('setMGoods err: ', e);
                }
            },
        }, function (err, results) {
            return res.json({
                data:[],
                code: 200,
                msg: "操作成功"
            });
        });
    },

    /**
     * 商城
     *
     *
     * @return { 返回结果集 }
     */
    gotoShoppingCenter: function (req, res) {

        console.log('gotoShoppingCenter: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var mId = allParams.mId;
        var tokenId = allParams.tokenId;
        var hashvalue = mId + ":" + tokenId;

        var client = redis.client({db: 2});
        client.get(hashvalue, function (err, value) {
            if (err) return;

            var megoodslist = [];
            var classifylist = [];
            var isopenshop = false;
            var horizontalallianceslist = [];

            userData = userData || utility.decodeToken(value); 
            var storeid = userData.operatorno = userData.operatorno || 0;
            console.log('storeid check it out. ',storeid);

            async.auto({

                querySeller: function (callback) {

                    try {

                            Accountseller.findOne({id: storeid}).exec(function (err, recond) {
                                if (err) return;
                                console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ok');

                                recond = recond || {};

                                //专场数据
                                recond.shopsconcert = recond.shopsconcert || "";
                                recond.shopsconcert = recond.shopsconcert.split(',');

                                var shopsconcert = recond.shopsconcert || [];
                                shopsconcert.remove("");

                                //
                                //默认专场
                                if (shopsconcert.length>=0) {

                                    var sellerlist = seller.getStore();
                                    for(var i = 0; i<sellerlist.length; i++) {
                                        var storeid = parseInt(sellerlist[i].id);

                                         //打令数据
                                        if (storeid === 4) {

                                            recond.shopsconcert = sellerlist[i].shopsconcert;

                                            recond.shopsconcert = recond.shopsconcert || "";
                                            recond.shopsconcert = recond.shopsconcert.split(',');

                                            shopsconcert = recond.shopsconcert || [];
                                            shopsconcert.remove("");
                                        }
                                    }
                                }
                                
                                console.log('shopsconcert. ',shopsconcert.length);
                                for (var i = 0; i < shopsconcert.length; i++) {
                                    var shopsconcertArr = shopsconcert[i].split('#');

                                    var shopsconcertObj = {};
                                    shopsconcertObj.id = shopsconcertArr[0];
                                    shopsconcertObj.name = shopsconcertArr[1];

                                    var goodsseriesstring= shopsconcertArr[2];
                                    goodsseriesstring = goodsseriesstring || "";

                                    var goodsseriesArr = goodsseriesstring.split('|');
                                    goodsseriesArr.remove("");

                                    var goodsserieslist = [];
                                    for (var j = 0; j < goodsseriesArr.length; j++) {
                                        var subGoodsSeries = {};
                                        var goodsseriesObj = goodsseriesArr[j].split('[.]');
                                        
                                        //subGoodsSeries.id = goodsseriesObj[0];
                                        //subGoodsSeries.storecategoryid = goodsseriesObj[1];
                                        subGoodsSeries.sku = goodsseriesObj[0];
                                        subGoodsSeries.sortorder = goodsseriesObj[1];
                                        
                                        goodsserieslist.push(subGoodsSeries);
                                    }

                                    console.log('id. ',shopsconcertObj.id,' name. ',shopsconcertObj.name);
                                    classifylist.push({
                                        id: shopsconcertObj.id,
                                        name: shopsconcertObj.name,
                                        goodsseries: goodsserieslist
                                    });
                                };

                                //异业联盟
                                isopenshop = isopenshop || recond.isopenship;
                                recond.horizontalalliances = recond.horizontalalliances || "";
                                recond.horizontalalliances = recond.horizontalalliances.split(',');

                                horizontalalliances = recond.horizontalalliances || [];
                                horizontalalliances.remove("");

                                for (var i = 0; i < horizontalalliances.length; i++) {
                                    var horizontalalliancesObj = {};
                                    var horizontalalliancesArr = horizontalalliances[i].split('-');
                                    
                                    horizontalalliancesObj.name = horizontalalliancesArr[1];
                                    horizontalalliancesObj.storeid = horizontalalliancesArr[0];
                                    horizontalalliancesObj.sortorder = horizontalalliancesArr[2];
                                    horizontalallianceslist.push(horizontalalliancesObj);
                                };  
                                 
                                if (classifylist.length) {
                                    var meGoodsseriesArr = classifylist[0] || {};
                                    megoodslist = meGoodsseriesArr.goodsseries.slice() || [];
                                    classifylist.remove(classifylist[0]);
                                }

                                callback(err,{megoodslist, horizontalallianceslist, classifylist, isopenshop});
                            });

                    } catch (e) {
                        console.log('querySeller err: ', e);
                    }
                },

                queryMGoods: ['querySeller', function (callback, result) {

                    try {
                            var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);

                            var gd = ["name","storeid","sku","imagedefault","price","id","createdAt","type","deposit",
                            "premoneey","presaleendtime","presaleflow","presaleflowdescript", "presaledescript",
                            "precustomerserivice",'storecategoryid',"presubtitle","seckillingtime","seckillingprice",
                            "seckillingstock","isseckilling","homenormalprice","homeseckillingprice","seckillingexplain",
                            "seckillingdescription","seckillingflow","seckillingsell"];

                            var queryMGoodsSql = 'select ' + gd.toString() + ' from ' + tb_M_Name + ' where ';
                            queryMGoodsSql += ' goodsseries = 0 and status = 3';

                            //查询所商品
                            console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);
                            Creator.query(queryMGoodsSql, function query(err, list) {
                                if (err) return;
                                console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                                var _list = [];
                                for(var i = 0; i<megoodslist.length; i++) {
                                    for(var j = 0; j<list.length; j++) {

                                        var m = megoodslist[i];
                                        var e = list[j];

                                        var mObj = {};
                                        var eObj = {};

                                        // mObj.id = parseInt(m.id);
                                        // mObj.storecategoryid = parseInt(m.storecategoryid);

                                        // eObj.id = e.id;
                                        // eObj.storecategoryid = e.storecategoryid;
                                       
                                        if(_.isEqual(m.sku,e.sku)) {
                                            _list.push(e);
                                            break;
                                        }
                                    }
                                }

                                megoodslist = _list.length ? _list : list;
                                callback(err,{megoodslist, horizontalallianceslist, classifylist, isopenshop});
                            });

                    } catch (e) {
                        console.log('queryMGoods err: ', e);
                    }
                }],
            }, function (err, results) {
                var timestamp = (new Date()).getTime()
                return res.json({
                    code: 200,
                    data: {megoodslist, horizontalallianceslist, classifylist, isopenshop,timestamp}
                });
            });
        });
    },

    /**
     * 商城商品列表
     *
     *
     * @return { 返回结果集 }
     */
    gotoShopsList: function (req, res) {

        console.log('gotoShopsList: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var mId = allParams.mId;
        var tokenId = allParams.tokenId;
        var listItem = allParams.idArray;
        var hashvalue = mId + ":" + tokenId;

        if (!listItem.length) {
            return res.json({
                code: 200,
                data: []
            });
        }

        var client = redis.client({db: 2});
        client.get(hashvalue, function (err, value) {
            if (err) return;

            userData = userData || utility.decodeToken(value); 
            var storeid = userData.operatorno = userData.operatorno || 0;

            var index = listItem.length;
            var queryAccountSql = 'select id,store_show_pic,nickname from accountseller where ';
            while(listItem.length > 0) {
                var id = listItem.pop();
                queryAccountSql += ' id = ' + id;
                queryAccountSql += listItem.length-1 < 0 ? '' : ' or ';
            }

            //查询商户信息
            console.log('queryAccountSql: check it out. ',queryAccountSql);
            Accountseller.query(queryAccountSql, function (err, list) {
                if (err) return;
                console.log('cb_tag1: The result of this \' query \' is shown came out. check it out: ', list.length);
                return res.json({
                    code: 200,
                    data: list
                });
            });
        })
    },

    /**
     * 商城主页配置
     *
     *
     * @return { 返回结果集 }
     */
    shopsHomePageConfig: function (req, res) {

        console.log('shopsHomePageConfig: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var storeid = mine.storeid;
        Accountseller.findOne({id: storeid}).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ok');

            recond = recond || {};
            recond.shopsconfig = recond.shopsconfig || "";
            recond.shopsconfig = recond.shopsconfig.split(',');

            var shopsconfig = recond.shopsconfig || "";
            shopsconfig.remove("");

            var list = list || [];
            if (!shopsconfig.length) {

                var shopsconfigNew = shopsconfigNew || {};
                var shopsconfigSales = shopsconfigSales || {};

                shopsconfigNew.id = 1;
                shopsconfigNew.name = '新品';
                shopsconfigNew.sortorder = 1;
                shopsconfigNew.goodsseries = [];

                var hashNew = hashNew || "";
                hashNew += shopsconfigNew.id; 
                hashNew += '#';
                hashNew += shopsconfigNew.name;
                hashNew += '#';
                hashNew += shopsconfigNew.sortorder;
                hashNew += '#';
                hashNew += shopsconfigNew.goodsseries.toString();
                
                shopsconfigSales.id = 2;
                shopsconfigSales.name = '促销';
                shopsconfigSales.sortorder = 2;
                shopsconfigSales.goodsseries = [];

                var hashSales = hashSales || "";
                hashSales += shopsconfigSales.id; 
                hashSales += '#';
                hashSales += shopsconfigSales.name;
                hashSales += '#';
                hashSales += shopsconfigSales.sortorder;
                hashSales += '#';
                hashSales += shopsconfigSales.goodsseries.toString();

                list.push(shopsconfigNew);
                list.push(shopsconfigSales);

                recond.shopsconfig = [hashNew,hashSales].toString();
                recond.save(function(err){
                    if (err) return;
                    console.log("save_tag1: This saved successfully. ",recond.shopsconfig);
                });
            }else{

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
                    for (var j = 0; j < goodsseriesArr.length; j++) {
                        var goods = {};
                        var goodsseriesObj = goodsseriesArr[j].split('[.]');
                        
                        //goods.id = goodsseriesObj[0];
                        //goods.storecategoryid = goodsseriesObj[1];
                        console.log('sortorder. ',goodsseriesObj[1]);
                        goods.sku = goodsseriesObj[0];
                        goods.sortorder = goodsseriesObj[1];
                        
                        goodsserieslist.push(goods);
                    }

                    navigation.goodsseries = goodsserieslist;
                    var navigationid = parseInt(shopsconfigArr[0]);

                    if (navigationid === 1) {
                        list[0] = navigation;
                        console.log('goodsserieslist. ',goodsserieslist);
                    }else
                    if (navigationid === 2) {
                        list[1] = navigation;
                        console.log('goodsserieslist. ',goodsserieslist);
                    }
                };
            }

            return res.json({
                code: 200,
                data: list
            });

        });
    },


    
    /**
     * 商城主页存储
     *
     *
     * @return { 返回结果集 }
     */
    shopsHomePageSave: function (req, res) {

        console.log('shopsHomePageSave: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var name = allParams.name;
        var storeid = mine.storeid;
        var sortorder = allParams.sortorder;
        var goodsseries = allParams.goodsseries;

        Accountseller.findOne({id: storeid}).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ok');

            recond = recond || {};
            recond.shopsconfig = recond.shopsconfig || "";
            recond.shopsconfig = recond.shopsconfig.split(',');

            var shopsconfig = recond.shopsconfig || [];
            shopsconfig.remove("");

            var newShopsconfig = "",index = -1;
            for (var i = 0; i < shopsconfig.length; i++) {
                var shopsconfigArr = shopsconfig[i].split('#');

                var shopsconfigObj = {};
                if (id.toString() == shopsconfigArr[0]) {

                    shopsconfigObj.id = id;
                    shopsconfigObj.name = name;
                    shopsconfigObj.sortorder = sortorder;
                    shopsconfigObj.goodsseries = goodsseries;

                    index = i;
                    newShopsconfig += shopsconfigObj.id;
                    newShopsconfig += '#';
                    newShopsconfig += shopsconfigObj.name;
                    newShopsconfig += '#';
                    newShopsconfig += shopsconfigObj.sortorder;
                    newShopsconfig += '#';
                    newShopsconfig += gcom.hashSku(shopsconfigObj.goodsseries);
                }
            }

            if (index > -1) {
                shopsconfig.splice(index, 1, newShopsconfig);
                console.log('shopsconfig.  ',shopsconfig);
            }
           
            recond.shopsconfig = shopsconfig.toString();
            recond.save(function(err){
                if (err) return;
                console.log("save_tag1: This saved successfully. ",recond.shopsconfig);
            })
        });
        
        return res.json({
            code: 200,
            data: []
        });
    },

    /**
     * 商城主页展示
     *
     *
     * @return { 返回结果集 }
     */
    gotoShopsHomePage: function (req, res) {

        console.log('gotoShopsHomePage: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var mId = allParams.mId;
        var page = allParams.page;
        var tokenId = allParams.tokenId;
        var storeid = allParams.storeid;
        var listItem = allParams.idArray;
        var classify = allParams.classify;
        var platform = allParams.platform;
        var hashvalue = mId + ":" + tokenId;

        var CLASSIFY_ALLGOODS = 0;   //全部商品

        var client = redis.client({db: 2});
        client.get(hashvalue, function (err, value) {
            if (err) return;

            // userData = userData || utility.decodeToken(value); 
            // userData.operatorno = userData.operatorno || 0;
            // storeid = storeid || userData.operatorno;

            async.auto({

                querySeller: function (callback) {

                    try {

                        Accountseller.findOne({id: storeid},function (err, recond) {
                            if (err) return;
                            console.log('cb_tag1: The result of this \' findOne \' is shown came out. check it out: ok');

                            recond = recond || {};
                            recond.shopsconfig = recond.shopsconfig || "";
                            recond.shopsconfig = recond.shopsconfig.split(',');
                            recond.shopsconfig.remove("");

                            var list  = [],newlist = [],oldlist = [];
                            console.log('recond.shopsconfig.length. ',recond.shopsconfig.length);
                            for (var i = 0; i < recond.shopsconfig.length; i++) {

                                var shopsconfigObj = {};
                                var shopsconfigArr = recond.shopsconfig[i].split('#');
                                
                                shopsconfigObj.id = parseInt(shopsconfigArr[0]);
                                shopsconfigObj.name = String(shopsconfigArr[1]);
                                shopsconfigObj.sortorder = parseInt(shopsconfigArr[2]);
                                shopsconfigObj.goodsseries = [];

                                shopsconfigArr[3] = shopsconfigArr[3] || "";
                                var goodsseriesArr = shopsconfigArr[3].split('|');

                                goodsseriesArr.remove("");
                                for (var j = 0; j < goodsseriesArr.length; j++) {
                                    var goodsseries = goodsseriesArr[j].split('[.]');

                                    var Goods = {};
                                    //Goods.id = goodsseries[0];
                                    //Goods.storecategoryid = goodsseries[1];
                                    Goods.sku = goodsseries[0];
                                    Goods.sortorder = goodsseries[1];
                                    
                                    Goods.goodsseries =  [];

                                    //存入系列商品
                                    shopsconfigObj.goodsseries.push(Goods);
                                }

                                if (shopsconfigObj.id == 1) {
                                    newlist.push(shopsconfigObj);
                                }

                                if (shopsconfigObj.id == 2) {
                                    oldlist.push(shopsconfigObj);
                                }
                                
                            }

                            var userpic = recond.userpic
                            var nickname = recond.nickname;
                            var servicetelephone = recond.servicetelephone;
                            var store_banner_pic = recond.store_banner_pic;
                            var store_banner_pic_phone = recond.store_banner_pic_phone;
                            callback(err,{ list, newlist, oldlist, nickname, userpic, store_banner_pic, servicetelephone, store_banner_pic_phone });
                        });

                    }catch (e) {
                        console.log('querySeller err: ', e);
                    }
                },
                
                queryMGoods:['querySeller', function (callback, result) {

                    try {

                        var newlist = result.querySeller.newlist;
                        var oldlist = result.querySeller.oldlist;
                        var nickname = result.querySeller.nickname;
                        var userpic = result.querySeller.userpic;
                        var store_banner_pic = result.querySeller.store_banner_pic;
                        var store_banner_pic_phone = result.querySeller.store_banner_pic_phone;
                        var servicetelephone = result.querySeller.servicetelephone;

                        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                        var gd = ["name","storeid","sku","imagedefault","price","id","createdAt","type","deposit",
                                "premoneey","presaleendtime","presaleflow","presaleflowdescript", "presaledescript",
                                "precustomerserivice",'storecategoryid',"presubtitle","seckillingtime","seckillingprice",
                                "seckillingstock","isseckilling","homenormalprice","homeseckillingprice","seckillingexplain",
                                "seckillingdescription","seckillingflow","seckillingsell"];

                        //查询商品
                        var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where goodsseries = 0 and status = 3';
                        console.log('queryMGoodsSql: check it out. ',queryMGoodsSql);
                        Creator.query(queryMGoodsSql, function (err, list) {
                            if (err) return;
                            console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',list.length);

                            callback(err,{ list, newlist, oldlist, nickname, userpic, store_banner_pic, servicetelephone, store_banner_pic_phone });
                        });
                        
                    }catch (e) {
                        console.log('queryMGoods err: ', e);
                    }
                }],

            }, function (err, results) {

                //校验结果
                results = results || {};
                results.queryMGoods = results.queryMGoods || {};

                //校验数据
                var list = results.queryMGoods.list || [];
                var newlist = results.queryMGoods.newlist || [];
                var oldlist = results.queryMGoods.oldlist || [];
                var userpic = results.queryMGoods.userpic || "";
                var nickname = results.queryMGoods.nickname || "";
                var store_banner_pic = results.queryMGoods.store_banner_pic || "";
                var store_banner_pic_phone = results.queryMGoods.store_banner_pic_phone || "";
                var servicetelephone = results.queryMGoods.servicetelephone || "";


                var allpage = 1,templist = [];
                switch(platform) {
                    case OS_MOBILE:
                    case TYPE_PLATFORM_WEBCHAT:
                    case TYPE_PLATFORM_IPHONE:
                            gcom.setGoodsArray(CLASSIFY_ALLGOODS,list);
                            allpage = gcom.calcPageCount(CLASSIFY_ALLGOODS);
                            templist = gcom.getGoodsPage(CLASSIFY_ALLGOODS,page)
                        break;
                    case OS_DESKTOP:
                            allpage = 1;
                            templist = list;
                        break;
                    default:
                        console.log('err: platform ',platform)
                }
                
                console.log("allpage. ",allpage);

                if (templist.length) {

                    return res.json({
                        code: 200,
                        msg: page ===0 ? "首页商品" : "当前页数",
                        data: {
                            list:templist,
                            userpic:userpic,
                            newlist:newlist,
                            oldlist:oldlist,
                            allpage: allpage,
                            nickname:nickname,
                            timestamp:(new Date()).getTime(),
                            servicetelephone:servicetelephone,
                            store_banner_pic:store_banner_pic,
                            store_banner_pic_phone:store_banner_pic_phone,
                        }
                    });
                }else{
                    return res.json({
                        code: 400,
                        data: [],
                        msg: "数据为空",
                    })
                }
                
                // console.log('send data. ', {
                //         list,
                //         newlist,
                //         oldlist,
                //         nickname,
                //         userpic,
                //         store_banner_pic,
                //         servicetelephone
                //     });
                
                // return res.json({
                //     code: 200,
                //     data: {
                //         list,
                //         newlist,
                //         oldlist,
                //         nickname,
                //         userpic,
                //         store_banner_pic,
                //         store_banner_pic_phone,
                //         servicetelephone
                //     }
                // });
            });
        });
    },

    /**
     * 商城专场
     *
     *
     * @return { 返回结果集 }
     */
    gotoShopsClassify: function (req, res) {

        console.log('gotoShopsClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var mId = allParams.mId;
        var page = allParams.page;
        var tokenId = allParams.tokenId;
        var storeid = allParams.storeid;
        var listItem = allParams.idArray;
        var classify = allParams.classify;
        var platform = allParams.platform;
        var hashvalue = mId + ":" + tokenId;

        if (!listItem.length) {
            return res.json({
                data: [],
                code: 200
            });
        }

        var client = redis.client({db: 2});
        client.get(hashvalue, function (err, value) {
            if (err) return;

            //userData = userData || utility.decodeToken(value); 
            //var storeid = userData.operatorno = userData.operatorno || 0;

            var gd = ["name","storeid","sku","imagedefault","price","id","createdAt","type","deposit",
            "premoneey","presaleendtime","presaleflow","presaleflowdescript", "presaledescript",
            "precustomerserivice",'storecategoryid',"presubtitle","seckillingtime","seckillingprice",
            "seckillingstock","isseckilling","homenormalprice","homeseckillingprice","seckillingexplain",
            "seckillingdescription","seckillingflow","seckillingsell"];

            var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
            var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where ' + gcom.querySku(listItem);
            
            // var index = listItem.length;
            // for(var i = 0; i<listItem.length; i++) {
            //     var item = listItem[i];
            //     queryMGoodsSql += ' id = ' + item.id;
            //     queryMGoodsSql += ' and ';
            //     queryMGoodsSql += ' storecategoryid = ' + item.storecategoryid;
            //     queryMGoodsSql += i < listItem.length-1 ? ' or ' : '';
            // }

            console.log('queryMGoodsSql: check it out. ', queryMGoodsSql);
            Creator.query(queryMGoodsSql, function (err, list) {
                if (err) return;
                console.log('cb_tag1: The result of this query is shown came out. check it out:  ', list.length);

                var newlist = [];
                for(var i = 0;i<list.length;i++) {
                    var goods = list[i];
                    var newgoods = {};
                    newgoods.sku = goods.sku;
                    // newgoods.id = parseInt(goods.id);
                    // newgoods.storecategoryid = parseInt(goods.storecategoryid);
                    for(var j = 0; j<listItem.length; j++) {
                        var series = listItem[j];
                        var newseries = {};
                        newseries.sku = series.sku;
                        // newseries.id = parseInt(series.id);
                        // newseries.storecategoryid = parseInt(series.storecategoryid);
                        if (_.isEqual(newgoods,newseries)) {
                            goods.sortorder = series.sortorder;
                            newlist.push(goods)
                        }
                    }
                }

                var allpage = 1,templist = [];
                switch(platform) {
                    case OS_MOBILE:
                    case TYPE_PLATFORM_WEBCHAT:
                    case TYPE_PLATFORM_IPHONE:
                            gcom.setGoodsArray(classify,newlist);
                            allpage = gcom.calcPageCount(classify)
                            templist = gcom.getGoodsPage(classify,page)
                        break;
                    case OS_DESKTOP:
                            allpage = 1;
                            templist = newlist;
                        break;
                    default:
                        console.log('err: platform ',platform)
                }
                
                console.log('allpage. ',allpage);
                return res.json({
                    data: {
                        list: scom.selectionSort(templist),
                        allpage: allpage,
                    },
                    code: 200,
                    msg: page ===0 ? "首页商品" : "当前页数",
                });
            });
        })
    },

    /**
     * 修改商品主页
     *
     *
     * @return { 返回结果集 }
     */
    updateShopsHomePage: function (req, res) {

        console.log('updateShopsHomePage: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var name = allParams.name;      
        var storeid = mine.storeid;

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
                    var shopsconfigArr = shopsconfig[i].split('#');

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
                        
                        goods.sku = goodsseriesObj[0];
                        goods.sortorder = goodsseriesObj[1];
                        
                        goodsserieslist.push(goods);
                    }

                    id = parseInt(id);
                    navigation.id = parseInt(navigation.id);
                    if (_.isEqual(id,navigation.id)) {
                        navigation.name = name;
                    }

                    var newShopsconfig =  "";
                    newShopsconfig += navigation.id;
                    newShopsconfig += "#";
                    newShopsconfig += navigation.name;
                    newShopsconfig += "#";
                    newShopsconfig += navigation.sortorder;
                    newShopsconfig += "#";
                    newShopsconfig += gcom.hashSku(goodsserieslist);

                    //修改完成
                    shopsconfiglist.push(newShopsconfig);
                }

                recond.shopsconfig = shopsconfiglist.toString();
                recond.save(function (err) {
                    if (err) return;
                    console.log("save_tag1: This saved successfully. ",recond.shopsconfig);
                });
        });

        return res.json({
            code: 200,
            data: []
        });
    },

    getGoodsPageList:  function (req, res) {

        console.log('getGoodsPageList: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var pageSize = allParams.pageSize;  
        var currentPage = allParams.currentPage;
        
        var sendToHealth = {};
        sendToHealth.msgCode = 0;
        sendToHealth.success = true;
        sendToHealth.msg = "操作失败";

        sendToHealth.result = {};
        sendToHealth.result.rows = [];
        sendToHealth.result.total = 0;
        if (!typeof(pageSize) === "number") {
            return res.json(sendToHealth); 
        }

        if (!typeof(currentPage) === "number") {
            return res.json(sendToHealth); 
        }
        //image.darlinglive.com
        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,4);
        var gd = ['name','stock','price','reserve1',
        'pricepoint','detailbody','attachment','type',
        'propertyvaluelist','imagedefault','sku','storeid',
        'status','reserve10','limited',"deposit","price","pricepoint"]

        var queryMGoodsSql = 'select ' + gd.toString() + ' from ' + tb_M_Name + ' where ';
        queryMGoodsSql += ' goodsseries = 0 and status = 3 and type = 1 limit ' + currentPage + ',' + pageSize;

        if (pageSize>20) {
            sendToHealth.msg = "获取超限";
            return res.json(sendObj);
        }



        //查询所商品
        console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);
        Creator.query(queryMGoodsSql, function query(err, list) {
            if (err) return;
            console.log('cb_tag1: The result of this findOne is shown came out. check it out: ',list.length);

            for(var i = 0; i<list.length; i++) {
                var ele = {},item = list[i];

                ele.unit = io.getUnit();               //销售单位(可选)

                ele.webUrl = "";                        //点击推荐商品后，跳转到WEB路径(可选)
                ele.appUrl = io.getAppUrl() + item.sku; //点击推荐商品后，要跳转到APP路径
                ele.goodsPic = io.getDomain()+item.imagedefault;//商品图片 多张用|隔开最大5张(必填，至少一张图片，完整路径)
                ele.goodsCode = "";                     //商品编码(可选)
                ele.goodsSign = "";                     //商品标签(可选 比如:填写包邮/特价/新品等)
                ele.goodsName = item.name;              //商品名称(必填)
                ele.goodsDesc = "";                     //商品描述(可选)//item.detailbody
                ele.salePrice = item.price;             //销售价格(必填)
                ele.goodsSource = io.getGoodsSource();  //商品来自平台(可选)
                ele.marketPrice = item.price;           //市场价格(必填)
                ele.goodsFullName = item.name;          //商品全名(必填，没有就用goodsName填充)
                ele.goodsSourceId = item.sku;           //商品在对方唯一标识符(必填 平台之间同步数据根据这个字段进行识别)
                sendToHealth.result.rows.push(ele);
            }

            sendToHealth.msg = "商品系列";
            return res.json(sendToHealth);
        });
    },
};