var Passwords = require('machinepack-passwords');
var crypto = require('crypto');

module.exports = {

    /**
     * 搜索用户
     *
     *
     * @return { 返回结果集 }                   
     */
    serchUser: function (req, res) {

        console.log('serchUser: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var findCombineLike = {
            'usermobile':true,
        };

        var findCombineOffen = {
            'id':true,
            'operatorno':true,
            'statuscode':true,
        };

        
        var storeid = mine.storeid;

        allParams.id || delete allParams.id;
        allParams.statuscode || delete allParams.statuscode;
        allParams.operatorno || delete allParams.operatorno;
        allParams.usermobile || delete allParams.usermobile;
        allParams.createdAt1 || delete allParams.createdAt1;
        allParams.createdAt2 || delete allParams.createdAt2;

        //console.log('allParams. check it out. ',allParams);

        var gd = ["id","usermobile","operatorno","createdAt","statuscode","os","deviceToken"];

        var queryAccountSql = "select " + gd.join(",") + " from account";

        var zkey =  0;
        var keys = _.keys(allParams);
        //console.log('keys. check it out. ',keys);

        for(var key in allParams) {

            if (zkey === 0) {
                queryAccountSql += " where ";
            }

            var val = allParams[key];
            if (findCombineOffen[key]) {
                ++zkey;
                queryAccountSql += key + " = " + val;
                queryAccountSql += (zkey < keys.length) ? " and " : "";
            }

            if (findCombineLike[key]) {
                ++zkey;
                queryAccountSql += key + " like " + "\'%" + val + "%\'";
                queryAccountSql += (zkey < keys.length) ? " and " : "";
            }
        }

        //特殊处理
        if (allParams.createdAt1 && allParams.createdAt2) {
            queryAccountSql += " createdAt >= " + "\'" + allParams.createdAt1 + "\'" + " and ";
            queryAccountSql += " createdAt <= " + "\'" + allParams.createdAt2 + "\'";
        }

        console.log('queryAccountSql. check it out. ',queryAccountSql);
        Account.query(queryAccountSql,function (err, list) {
            if (err) return;
            console.log("cb_tag1: The result of this \' find \' is shown came out. check it out: ",list.length);
            return res.json({
                data: list,
                code: 200,
                msg: "",
            });
        });
    },

    /**
     * 搜索商户
     *
     *
     * @return { 返回结果集 }                   
     */
    serchMer: function (req, res) {

        console.log('serchMer: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var findCombineLike = {
            'realname':true,
            'industry':true,
        };

        var findCombineOffen = {
            'id':true,
            'statuscode':true,
            'operatorno':true,
        };

        if (parseInt(allParams.id) === -1) {
            allParams.id = null;
        }

        if (parseInt(allParams.industry) === -1) {
            allParams.industry = null;
        }

        if (parseInt(allParams.statuscode) === -1) {
            allParams.statuscode = null;
        }

        allParams.id || delete allParams.id;
        allParams.industry || delete allParams.industry;
        allParams.realname || delete allParams.realname;
        allParams.operatorno || delete allParams.operatorno;
        allParams.statuscode || delete allParams.statuscode;
        allParams.createdAt1 || delete allParams.createdAt1;
        allParams.createdAt2 || delete allParams.createdAt2;

        var gd = ["id","nickname","realname","createdAt","statuscode"];

        var zkey = zkey || 0;
        var keys = _.keys(allParams);

        var queryAccountSellerSql = "select " + gd.join(",") + " from accountseller ";
        for(var key in allParams) {
            
            if (zkey === 0) {
                queryAccountSellerSql += " where ";
            }

            var val = allParams[key];
            if (findCombineOffen[key]) {
                ++zkey;
                queryAccountSellerSql += key + " = " + val;
                queryAccountSellerSql += zkey<keys.length ? " and " : "";
            }

            if (findCombineLike[key]) {
                ++zkey;
                queryAccountSellerSql += key + " like " + "\'%" + val + "%\'";
                queryAccountSellerSql += zkey<keys.length ? " and " : "";
            }
        }

        //特殊处理
        if (allParams.createdAt1 && allParams.createdAt2) {
            queryAccountSellerSql += " createdAt >= " + "\'" + allParams.createdAt1 + "\'" + " and ";
            queryAccountSellerSql += " createdAt <= " + "\'" + allParams.createdAt2 + "\'";
        }

        console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
        Accountseller.query(queryAccountSellerSql, function (err, list) {
            if (err) return;
            console.log("cb_tag1: The result of this \' find \' is shown came out. check it out: ",list.length);
            return res.json({
                data: list,
                code: 200,
                msg: "",
            });
        });
    },


    /**
     * 商户上架商品验证规格类别，验证通过直接上架
     * 
     *
     * @return { 返回结果集 }                   
     */
    serchCategoryWithProval: function(req, res) {

        console.log('serchCategoryWithProval: This is the function entry.  check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var sku = allParams.sku;
        var storeid = mine.storeid;
        var status = allParams.status;
        var parentid = allParams.parentid;
        var isdetail = allParams.isdetail;
        var storecategoryid = allParams.storecategoryid;


        var skuObj = gcom.revertSku(sku);
        var errCategoryZero = '该商品没有类别';
        var errProValueZero = '该商品没有规格';
        var errProValueMore = '该商品规格不全';

        storeid = storeid || skuObj.storeid;

        var type = allParams.type;
        var status = allParams.status;

        //特殊处理
        initShopsPresale = function() {
            var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
            gcom.initShopsPresale(tb_M_Name);
            cmdGoods.gotoCmdReady(storeid,type);
        };

         async.auto({

            queryMGoods: function (callback) {
                try {

                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                    var queryMGoodsSql = 'select sku from ' + tb_M_Name + ' where ';
                    queryMGoodsSql += ' sku like \"' + sku +'%\"';

                    //数量验证
                    console.log('queryMGoodsSql: check it out: ', queryMGoodsSql);
                    Creator.query(queryMGoodsSql, function (err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ',list.length);

                        var listItem = list.slice(), provalArray = [];
                        if (list.length === 1) {
                            err = errProValueZero;
                        }else{
                            while(listItem.length > 0 ) {
                                var item = listItem.pop();
                                var skuObj = gcom.revertSku(item.sku);

                                if (skuObj.a_proid > 0 && !skuObj.b_proid) {
                                    if (provalArray.indexOf(skuObj.a_proid) === -1) {
                                        provalArray.push(skuObj.a_proid);
                                    }
                                }

                                if (skuObj.b_proid > 0 && skuObj.a_proid > 0) {
                                    if (provalArray.indexOf(skuObj.b_proid) === -1) {
                                        provalArray.push(skuObj.b_proid);
                                    }
                                    if (provalArray.indexOf(skuObj.a_proid) === -1) {
                                        provalArray.push(skuObj.a_proid);
                                    }
                                }
                            }
                        }
                        callback(err,provalArray);
                    });

                }catch (e) {
                    console.log('queryMGoods err: ', e);
                }
            },

            queryProVal: ['queryMGoods',function (callback, result) {
                try {


                    var provallist = result.queryMGoods || [];

                    if (provallist.length > 0) {
                        var queryProValSql = 'select id from propertyvalue where ';
                        for(var i = 0; i<provallist.length; i++) {
                            queryProValSql += ' id = ' + provallist[i];
                            if (i < provallist.length - 1) {
                                queryProValSql += ' or ';
                            }
                        }

                        //规格验证
                        console.log('queryProValSql. check it out. ',queryProValSql);
                        Propertyvalue.query(queryProValSql,function (err, list) {
                            if (err) return;
                            console.log("cb_tag2: The result of this create is shown came out. check it out: ",list.length);
                            if (list.length === 0) {
                                err = errProValueZero;
                            }
                            if (list.length < provallist.length) {
                                err = errProValueMore
                            }
                            callback(err,list);
                        });
                    }

                }catch (e) {
                    console.log('queryProVal err: ', e);
                }
            }],

            queryCategory: function (callback,result) {
                try {

                    //类别验证
                    var queryCategorySql = 'select id from goodscategory where isdelete = 0 and id = ' + storecategoryid;
                    console.log('queryCategorySql. check it out. ',queryCategorySql);
                    Goodscategory.query(queryCategorySql,function (err, list) {
                        if (err) return;
                        console.log("cb_tag3: The result of this create is shown came out. check it out: ",list.length);
                        if (list.length === 0) {
                            err = errCategoryZero;
                        }
                        callback(err,list);
                    });
                }catch (e) {
                    console.log('queryCategory err: ', e);
                }
            },

            setCGoods: ['queryCategory',function (callback,result) {
                try {
                    
                    if (isdetail == true) {
                        callback(null,null);
                    }else{
                        var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentid);
                        var setCGoodsSql = 'update ' + tb_C_Name;
                        setCGoodsSql += ' set status = ' + status;
                        setCGoodsSql += ' where sku like \'' + sku + '%\'';
                        console.log('setCGoodsSql: check it out: ', setCGoodsSql);

                        Creator.query(setCGoodsSql, function (err, recond) {
                            if (err) return;
                            console.log('cb_tag4: The result of this query is shown came out. check it out: ok');
                            callback(err,recond);
                        });  
                    }

                }catch (e) {
                    console.log('setCGoods err: ', e);
                }
            }],

            setMGoods: ['queryProVal', function (callback,result) {
                try {

                    if (isdetail == true) {
                        callback(null,null);
                    }else{
                        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                        var setMGoodsSql = 'update ' + tb_M_Name;
                        setMGoodsSql += ' set status = ' + status;
                        setMGoodsSql += ' where sku like \'' + sku + '%\'';
                        console.log('setMGoodsSql: check it out: ', setMGoodsSql);

                        Creator.query(setMGoodsSql, function (err, recond) {
                            if (err) return;
                            console.log('cb_tag5: The result of this query is shown came out. check it out: ok');
                            callback(err,recond);
                        });
                    }

                }catch (e) {
                    console.log('setMGoods err: ', e);
                }
            }],

        }, function (err, results) {
            console.log('err: ',err);
            var type = err || results;
            if (type == errCategoryZero) {
                return res.json({
                    data:[],
                    code: 201,
                    msg: errCategoryZero
                });
            }

            if (type == errProValueZero) {
                return res.json({
                    data:[],
                    code: 201,
                    msg: errProValueZero
                });
            }

            initShopsPresale();
            return res.json({
                data:[],
                code: 200,
                msg: "操作成功"
            });
        });

    },

     /**
     * 所有商户
     *
     *
     * @return { 返回结果集 }                   
     */
    serchAllMer: function (req, res) {

        console.log('serchAllMer: This is the function entry.  check it out: ', req.allParams());
        
        var mine = req.session.mine;
        var allParams = req.allParams();

        async.auto({
            querySeller: function (callback) {

                try {

                    var queryAccountSellerSql = "select id,nickname,shopsconcert from accountseller";
                    console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
                    Accountseller.query(queryAccountSellerSql,function (err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this \' query \' is shown came out. check it out: ',list.length);
                        seller.setStore(list);
                        callback(err,list);
                    });

                } catch (e) {
                    console.log('querySeller err: ', e);
                }
            },

            queryCCategory: function (callback) {

                try {

                    var gd = ["id","hid","storeid","parentid","categoryname","isdelete"];
                    var queryCCategorySql = "select " + gd.join(",") + " from goodscategory";
                    console.log('queryCCategorySql: check it out: ', queryCCategorySql);
                    Goodscategory.query(queryCCategorySql, function (err, list) {
                        if (err) return;
                        console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',list.length);
                        seller.setCCategory(list);
                        callback(err,list);
                    });
                    
                } catch (e) {
                    console.log('queryCCategory err: ', e);
                }
            },

            queryMcategory: function (callback) {

                try {

                    var queryMCategorySql = 'select categoryname,id from mercategory';
                    console.log('queryMCategorySql: check it out: ', queryMCategorySql);
                    Goodscategory.query(queryMCategorySql, function (err, list) {
                        if (err) return;
                        console.log('cb_tag3: The result of this \' query \' is shown came out. check it out: ',list.length);
                        seller.setMCategory(list);
                        callback(err,list);
                    });
                    
                } catch (e) {
                    console.log('queryMcategory err: ', e);
                }
            },

        }, function (err, results) {
            //console.log(seller.getStoreArray(),seller.getMCategory(),seller.getCCategoryArray())
            return res.json({
                data: {
                    sellerlist:seller.getStoreArray(), 
                    industrylist:seller.getMCategory(),
                    categorylist:seller.getSellerCCParentArray(),
                }, 
                code: 200
            });
        });
    },

    /**
     * 商户类别
     *
     *
     * @return { 返回结果集 }                   
     */
    serchStoreidCategory: function (req, res) {

        console.log('serchStoreidCategory: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        return res.json({
            data: seller.getSellerCCParentArray() ,
            code: 200,
            msg:"",
        });

        // var storeid = allParams.storeid;
        // var gd = ["id","categoryname"]
        // var queryCategorySql = "select " + gd.join(",") + " from goodscategory where parentid = 0 or storeid = " + storeid;
        // console.log('queryCategorySql. check it out. ',queryCategorySql);
        // Goodscategory.query(queryCategorySql,function (err, list) {
        //     if (err) return;
        //     console.log('cb_tag1: The result of this \' find \' is shown came out. check it out:  ', list.length);
        //     var storeCCategoryArray;
        //     for(var i = 0; i<list.length; i++) {
        //         var e = list[i];
        //         storeCCategoryArray = storeCCategoryArray || {};
        //         storeCCategoryArray[e.id] = e.categoryname;
        //     }
        //     return res.json({
        //         data: storeCCategoryArray,
        //         code: 200,
        //         msg:"",
        //     });
        // });
    },


    /**
     * 商户详情
     *
     *
     * @return { 返回结果集 }                   
     */
    serchMerDetal: function (req, res) {

        console.log('serchMerDetal: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var findCombineLike = {
        };

        var findCombineOffen = {
            'id':true,
            'usermobile':true,
            'operatorno':true,
        };
        
        var storeid = allParams.id || mine.storeid;

        allParams.id || delete allParams.id;
        allParams.usermobile || delete allParams.usermobile;
        allParams.operatorno || delete allParams.operatorno;

        var gd = ["id","nickname","realname","createdAt","statuscode","userbqlid",
        "usermobile","useremail","nickname","realname","userpic", "license_pic","straddress",
        "store_banner_pic","store_show_pic","sex","birthday","categorylist", "departmentid",
        "province","city", "area", "address","operatorno", "isopenship", "alipayaccount", 
        "weichataccount", "companyname","telephone","servicetelephone", "telephonefax", 
        "mainbusiness","contacts", "legalperson", "shiplist", "statuscode", "id_card","store_banner_pic_phone", 
        "industry","shipstatus", "shiprequest","shipupdate", "remark","topics","horizontalalliances",
        "shopsconcert", "shopsconfig", "invoicenotice","id","nickname","realname","createdAt","statuscode"];

        var queryAccountSellerSql = "select " + gd.join(",") + " from accountseller where ";

        var zkey =  0;
        var keys = _.keys(allParams);
        //console.log('keys. check it out. ',keys);

        for(key in allParams) {

            var val = allParams[key];
            if (findCombineOffen[key]) {
                ++zkey;
                queryAccountSellerSql += key + " = " + val;
                queryAccountSellerSql += (zkey < keys.length) ? " and " : "";
            }

            if (findCombineLike[key]) {
                ++zkey;
                queryAccountSellerSql += key + " like " + "\'%" + val + "%\'";
                queryAccountSellerSql += (zkey < keys.length) ? " and " : "";
            }
        }

        console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
        Accountseller.query(queryAccountSellerSql,function (err, list) {
            if (err) return;
            console.log("cb_tag1: The result of this \' find \' is shown came out. check it out: ",list.length);

            //构造消息
            var sellerObj = {};


            sellerObj.list = [];
            for(var i = 0; i<list.length; i++) {
                var e = list[i];
                var categorylist = e.categorylist || "";
                var categorylist = categorylist.split(":");

                var categoryArray = [];
                for (var j = 0; j < categorylist.length; j++) {
                    var categoryid = parseInt(categorylist[j]);
                    console.log('categoryid. check it out. ',categoryid);
                    categoryArray.push(seller.findCCategoryName(categoryid));
                }

                var newCategory = categoryArray.join("、");
                e.categorylist = newCategory;
                sellerObj.list.push(e);
            }

            var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
            var queryMGTotalSql = "select count(id) as total from " + tb_M_Name + " where goodsseries = 0";

            console.log('queryMGTotalSql. check it out. ',queryMGTotalSql);
            Creator.query(queryMGTotalSql, function (err, list) {
                if (err) return;
                console.log("cb_tag2: The result of this \' query \' is shown came out. check it out: ",list.length);
                sellerObj.total = list[0].total || 0;

                var queryMGPutwaySql = "select count(id) as putaway from " + tb_M_Name + " where goodsseries = 0 and status = 3";
                console.log('queryMGPutwaySql. check it out. ',queryMGPutwaySql);
                Creator.query(queryMGPutwaySql, function (err, list) {
                    if (err) return;

                    sellerObj.putaway = list[0].putaway || 0;
                    console.log("cb_tag3: The result of this \' find \' is shown came out. check it out: ",list.length);
                    return res.json({
                        data: sellerObj,
                        code: 200,
                        msg: "",
                    });
                });
            });
        });
    },

    /**
     * 用户详情
     *
     *
     * @return { 返回结果集 }                   
     */
    serchUserDetal: function (req, res) {

        console.log('serchUserDetal: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;

        var gd = ["a.userbqlid","a.usermobile","a.useralias","a.useremail","a.nickname","a.shop_name",
        "a.realname","a.userpic","a.sex","a.birthday","a.province","a.city","a.area","a.straddress",
           "a.address","a.consignee","a.operatorno","a.money","a.statuscode","a.id","a.createdAt"];

        var queryAccountSql = "select " + gd.join(",") + " from account a left join accountseller b on a.operatorno=b.id where a.id = " + id;
        console.log('queryAccountSql. check it out. ',queryAccountSql);
        Account.query(queryAccountSql, function (err, list) {
            if (err) return;
            return res.json({
                data: list,
                code: 200,
                msg:"",
            });
        });
    },

    /**
     * 添加用户
     *
     *
     * @return { 返回结果集 }                   
     */
    addUser: function (req, res) {

        console.log('addUser: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var money = allParams.money;
        var mestoreid = mine.storeid;
        var mobile = allParams.mobile;
        var shop_name = mine.shop_name;
        var storeid = allParams.storeid;
        
        if (!validator.isMobile(mobile)) {
            return res.json({
                "success": false,
                "msgCode": 408,
                "msg": "操作失败，无效的手机号码",
                "result": {}
            });
        }

        var mypassword = "123456";
        var md5 = crypto.createHash("md5");
        var password = md5.update(mypassword).digest("hex");

        Account.find().where({or: [{usermobile: mobile}, {useralias: mobile}]}).exec(function (err, list) {
            if (err) return res.negotiate(err);
            if (list.length > 0) {
                return res.json({
                    "success": false,
                    "msgCode": 413,
                    "msg": "用户已存在",
                    "result": {}
                });
            }

            Accountseller.findOne({id:mestoreid}).exec(function (err, record) {
                if (err) return;

                record = record || {};
                srcpassword = account.password1 || mypassword;

                Passwords.encryptPassword({
                    password: srcpassword,
                    difficulty: 10,
                }).exec({
                    error: function (err) {
                        return res.negotiate(err);
                    },
                    success: function (encryptpassword) {

                        //构造消息
                        var userObj = {};
                        userObj.money = money;
                        userObj.userbqlid =  0;
                        userObj.statuscode =  1;
                        userObj.usermobile = mobile;
                        userObj.shop_name =  shop_name;
                        userObj.useralias = mobile;
                        userObj.password1 =  encryptpassword;
                        userObj.password2 =  encryptpassword;
                        
                        Account.create(userObj).exec(function (err, u) {
                            if (err) return res.negotiate(err);

                            u = u || {};
                            return res.json({
                                "success": true,
                                "msgCode": 0,
                                "msg": "success",
                                "result": {
                                    "userId": u.id,
                                    "userMobile": u.usermobile,
                                    "userAlias": u.useralias
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    /**
     * 商品详情
     *
     *
     * @return { 返回结果集 }                   
     */
    serchGoodsDetails: function (req, res) {

        console.log('serchGoodsDetails: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var sku = allParams.sku;
        var type = allParams.type || 1;
        var gd = {},storecategoryid = -1;
        var skuObj = gcom.revertSku(sku);
        var platform = allParams.platform;
        
      
        switch(platform) {
            case OS_ADMIN:
            case OS_SELLER:
                gd = {
                    'id':true,'sku':true,'type':true,'name':true,'userid':true,
                    'stock':true,'storeid':true,'parentid':true,'reserve1':true,
                    'attachment':true,'detailbody':true,'imagedefault':true,'reserve5':true,
                    'storecategoryid':true,'propertyrelatedrelated':true,'propertyvaluelist':true,
                    'createdAt':true,'presaleendtime':true,'limited':true,'status':true,
                };

                //预售字段
                if (parseInt(type) == 2) {
                    gd.deposit = true;
                    gd.premoneey = true;
                    gd.presaleflow = true;
                    gd.presubtitle = true;
                    gd.presaleendtime = true;
                    gd.presaledescript = true; 
                    gd.presalestarttime = true;
                    gd.presaleflowdescript = true;
                }else {
                    gd.price = true;
                    gd.pricepoint = true;
                }

                //秒杀字段
                if (parseInt(type) == 3) {
                    gd.isseckilling = true;
                    gd.seckillingflow = true;
                    gd.seckillingsell = true;
                    gd.seckillingtime = true;
                    gd.seckillingprice = true;
                    gd.seckillingstock = true;
                    gd.seckillingexplain = true;
                    gd.homeseckillingprice = true;
                    gd.seckillingdescription = true;
                }

                break;
            case OS_MOBILE:
            case TYPE_PLATFORM_WINDOWS:
            case TYPE_PLATFORM_WEBCHAT:
            case TYPE_PLATFORM_IPHONE:
                gd = {
                    'name':true,'stock':true,'price':true,'reserve1':true,
                    'pricepoint':true,'detailbody':true,'attachment':true,'type':true,
                    'propertyvaluelist':true,'imagedefault':true,'servicetelephone':true,
                    'sku':true,'storeid':true,'status':true,'reserve10':true,'limited':true,
                };
                //预售字段
                if (parseInt(type) == 2) {
                    gd.deposit = true;
                    gd.premoneey = true;
                    gd.presubtitle = true; 
                    gd.presaleflow = true;
                    gd.presaleendtime = true;
                    gd.presaledescript = true; 
                    gd.presalestarttime = true;
                    gd.presaleflowdescript = true;
                    gd.precustomerserivice = true;
                }else {
                    gd.price = true;
                    gd.pricepoint = true;
                }

                //秒杀字段
                if (parseInt(type) == 3) {
                    gd.isseckilling = true;
                    gd.seckillingflow = true;
                    gd.seckillingsell = true;
                    gd.seckillingtime = true;
                    gd.seckillingprice = true;
                    gd.seckillingstock = true;
                    gd.seckillingexplain = true;
                    gd.homeseckillingprice = true;
                    gd.seckillingdescription = true;
                }
                break;
            default:
                console.log('err: platform ',platform,' type ',type);
        }

        console.log('platform is. ',platform,' parameters. ',Object.keys(gd));
        var goods = new Map(Object.entries(allParams));
        
        var sendGoodsDetails = function(goodstype,data,code) {
            const TYPE_GENERAL = 1;
            const TYPE_PRESALE = 2;
            var type = platform>OS_SELLER ? goodstype : 1;

            try {

                switch(type) {
                    case TYPE_GENERAL:
                         return res.json({ 
                            data: data,
                            code: code  
                         }); 
                    case TYPE_PRESALE:
                          // query condition
                          presellgoodsmsg.findOne({sku:sku},function (err, record) {
                                if (err)  return;
                                if (record) {
                                    data.sold = record.orderbeing>=0 ? record.orderbeing : data.sold;
                                }
                                console.log('cb_tag6: The result of this findOne is shown came out. check it out: ok');
                                return res.json({ 
                                    data: data,
                                    code: code  
                                });
                          });
                        break;
                    default:
                        console.log('err: type ',type);
                }
            } catch (e) {
                console.log('sendGoodsDetails err: ',e);
            }
         };

         async.auto({
            queryMGoods: function (callback, result) {

                try {
                    
                    var queryMGoodsSql = 'select * from mergoodsList' + skuObj.storeid;
                    queryMGoodsSql += ' where sku like \'' + skuObj.sku + '%\'';
                    console.log('queryMGoodsSql: check it out: ', queryMGoodsSql);

                    var seckillingleft = 0,seckillingsold = 0;
                    var sold = 0,left = 0,goods = {}, norms = [],timestamp = 0; 
                    Creator.query(queryMGoodsSql, function (err, list) {
                        if (err) return;

                        var listgoods = list.slice();
                        //var listAproid = [],listBproid = [];
                        while(list.length > 0) {
                            var iter = list.pop();

                            storecategoryid = iter.storecategoryid;
                            iter.seckillingtime = iter.seckillingtime || '0';
                            //console.log('item: check it out: ',iter);
                            if (!iter.goodsseries) {

                                //总共件数
                                left = iter.stock;
                                seckillingleft = iter.seckillingstock;

                                var goodsMap = new Map(Object.entries(iter));
                                var filtergoods = gcom.remainGoodsParam(gd);
                                var map = gcom.filterMap(filtergoods,goodsMap);
                                goodsMap.set('reserve1',parseInt(goodsMap.get('reserve1')) === 0 ? "" : goodsMap.get('reserve1'));
                                goodsMap.set('reserve5',parseInt(goodsMap.get('reserve5')) === 0 ? "" : goodsMap.get('reserve5'));
                                
                                //map.set('presalestarttime', (new Date()) );

                                if (iter.presalestarttime === '') {
                                    iter.presalestarttime = new Date();
                                }

                                var size = map.size,iterKey = map.keys(),iterVal = map.values();
                                while(size--) goods[iterKey.next().value] = iterVal.next().value;
                                if (iter.type === 3) timestamp = (new Date()).getTime();
                                if (iter.type === 2) timestamp = gcom.calcPretime(true,iter.presaleendtime);

                            } else {

                                //已售数量
                                var n = iter.reserve10 || 0,ele = {};
                                sold = sold + parseInt(n);

                                //已售数量
                                var s = iter.seckillingsell || 0,ele = {};
                                seckillingsold = seckillingsold + parseInt(s);

                                //商品规格
                                norms.push(iter.sku);
                            }
                        }


                        //剩余商品
                        left = left - sold;
                        seckillingleft = seckillingleft - seckillingsold;
                        callback(err,{sold,left,seckillingleft,seckillingsold,goods,timestamp,norms,listgoods});
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                  console.log('queryMGoods err: ',e);
                }
            },
            queryProperty:['queryMGoods', function (callback, result) {

                try {

                    var counter = [],cbArr = [];
                    var doneCounter = function (list) {

                        if (list.length) {
                             var listpro = list;
                             var sold = result.queryMGoods.sold || 0;
                             var left = result.queryMGoods.left || 0;
                             var goods = result.queryMGoods.goods || {};   
                             var gsnorms = result.queryMGoods.norms || [];
                             var listgoods = result.queryMGoods.listgoods || [];
                             var timestamp = result.queryMGoods.timestamp || 0;
                             var seckillingleft = result.queryMGoods.seckillingleft || 0;
                             var seckillingsold = result.queryMGoods.seckillingsold || 0;
                             callback(null, {sold,left,seckillingleft,seckillingsold,goods,gsnorms,listpro,timestamp});
                        }
                    };

                    var queryPropertySql = 'select * from goodsproperty where storeid = ' + skuObj.storeid;
                    queryPropertySql += skuObj.storeid > 0 ? ' or storeid = 0' : '';
                    console.log('queryPropertySql: check it out: ', queryPropertySql);
					
						
                    Goodsproperty.query(queryPropertySql, function (err, list) {
                        if (err) return;
                        while(list.length>0) counter.push(list.pop());
                        doneCounter(counter);
                        console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                  console.log('queryProperty err: ',e);
                }
            }],

            queryProVal:['queryProperty', function (callback, result) {

                try {
				
					//console.log(result);
                    //console.log('propertyrelatedObj: check it out: ',result.queryProperty.propertyrelatedObj)

                    var counter = [],cbArr = [];

                    //规格类型
                    var getPro = function(id,proArray){
                        for(var i = 0;i<proArray.length;i++) {
                            if (id == proArray[i].id) {
                                return proArray[i]; 
                            }
                        }
                    };

                    //规格属性
                    var getProVal = function(id,provalArray){

                        for(var i = 0;i<provalArray.length;i++) {
                            if (id == provalArray[i].id) {
                                return provalArray[i]; 
                            }
                        }
                        return null;
                    };

                    //商品信息
                    var getGoods = function(sku,goodsArray) {
                        var item,iter,index;
                        for(var i = 0;i<goodsArray.length; i++) {
                            if (sku === goodsArray[i].sku) {
                                //console.log('rst: ',goodsArray[i])
                                return goodsArray[i];
                            }
                        }
                    };

                    //第一规格
                    var getANorms = function(a_proid,normsArray){
                        for(var i = 0;i<normsArray.length;i++) {
                            var _skuObj = gcom.revertSku(normsArray[i]);
                            if (_skuObj.a_proid == a_proid) {
                                return normsArray[i];
                            }
                        }
                    };

                    //商品串码
                    var getBNorms = function(a_proid,b_proid,normsArray){
                        for(var i = 0;i<normsArray.length;i++) {
                            var _skuObj = gcom.revertSku(normsArray[i]);
                            if (_skuObj.a_proid===a_proid&&_skuObj.b_proid===b_proid) {
                                return normsArray[i];
                            }
                        }
                    };


                    var doneCounter = function (list) {

                        if (list.length) {
                             //queryProperty:{sold,left,goods,gsnorms,gsnorms,listpro}
                             //norms:{id,sku,price,stock,imgurl,pricepoint}; 
                             var sold = result.queryProperty.sold || 0;
                             var left = result.queryProperty.left || 0;
                             var goods = result.queryProperty.goods || {};
                             var listpro = result.queryProperty.listpro || [];
                             var gsnorms = result.queryProperty.gsnorms || [];
                             var listgoods = result.queryMGoods.listgoods || [];
                             var timestamp = result.queryProperty.timestamp || 0;
                             var seckillingleft = result.queryProperty.seckillingleft || 0;
                             var seckillingsold = result.queryProperty.seckillingsold || 0;
                             var propertyrelated = propertyrelated || [];

                             var listAproid = [],listBproid = [];

                             //特殊结构处理
                             var index = 0;
                             while(index < gsnorms.length) {
                                 var sku = gsnorms[index];
                                 var _skuObj = gcom.revertSku(sku);
                                 
                                 var a_proid = 0,b_proid = 0;
                                 if (_skuObj.a_proid>0 && !_skuObj.b_proid){
                                    a_proid = _skuObj.a_proid;
                                 }

                                 if (_skuObj.a_proid>0 && _skuObj.b_proid>0){
                                    b_proid = _skuObj.b_proid;
                                    a_proid = a_proid || _skuObj.a_proid;
                                 }

                                 if (listAproid.indexOf(a_proid)==-1 && a_proid>0) {
                                    listAproid.push(a_proid);
                                 }

                                 if (listBproid.indexOf(b_proid)==-1 && b_proid>0) {
                                    listBproid.push(b_proid);
                                 }
                                 index = index + 1;
                             }

                             //校验规格
                             for(var i = 0;i<listAproid.length; i++){
                                var proid = listAproid[i];
                                var pv = getProVal(proid,list);
                                if (!pv) {
                                    listAproid.remove(proid);
                                    if (listBproid.length == listAproid.length) {
                                        var _proid = listBproid[i];
                                        listBproid.remove(_proid); 
                                    }
                                }
                             }

                             //二次校验
                             for(var i = 0;i<listBproid.length; i++){
                                var proid = listBproid[i];
                                var pv = getProVal(proid,list);
                                if (!pv) {
                                    listBproid.remove(proid);
                                    if (listAproid.length == listBproid.length) {
                                        var _proid = listAproid[i];
                                        listAproid.remove(_proid); 
                                    }
                                }
                             }
                             //console.log('normsA: check it out: ',listAproid);
                             //console.log('normsB: check it out: ',listBproid);

                             //约定规格拼合
                             while(listAproid.length) {
                                var proid = listAproid.pop();
                                var sku = getANorms(proid,gsnorms);
                                var iter = getGoods(sku,listgoods);

                                var temp = {};
                                temp.id = proid;
                                temp.sku = iter.sku;
                                temp.goodsid = iter.id;
                                temp.price = iter.price;
                                temp.stock = iter.stock;
                                temp.deposit = iter.deposit;
                                temp.imgurl = iter.propertypic;
                                temp.premoneey = iter.premoneey;
                                temp.reserve10 = iter.reserve10;
                                temp.pricepoint = iter.pricepoint;
                                temp.seckillingsell = iter.seckillingsell;
                                temp.seckillingstock = iter.seckillingstock;
                                temp.seckillingprice = iter.seckillingprice;
                                temp.storecategoryid = iter.storecategoryid;


                                var pv = getProVal(proid,list);
                                var p = getPro(pv.propertyid,listpro);

                                //规格属性
                                temp.name = p.name;
                                temp.aliasname = p.aliasname;
                                temp.description = p.description;

                                //规格数值 
                                temp.propertyid = pv.propertyid;
                                temp.sortsorder = pv.sortsorder;
                                temp.propertyvalue = pv.propertyvalue;
                                if (listBproid.length>0) temp.children =  [];

                                var _skuObj = gcom.revertSku(sku);
                                for(var i = 0;i<listBproid.length;i++) {
                                    temp.children[i] = {};
                                    var j = _skuObj.a_proid;
                                    var jj = listBproid[i];
                                    var _proid = listBproid[i];
                                    var _sku = getBNorms(j,jj,gsnorms);
                                    var _iter = getGoods(_sku,listgoods)

                                    temp.children[i].id = _proid;
                                    temp.children[i].sku = _iter.sku;
                                    temp.children[i].goodsid = _iter.id;
                                    temp.children[i].price = _iter.price;
                                    temp.children[i].stock = _iter.stock;
                                    temp.children[i].deposit = _iter.deposit;
                                    temp.children[i].imgurl = _iter.propertypic;
                                    temp.children[i].reserve10 = _iter.reserve10;
                                    temp.children[i].premoneey = _iter.premoneey;
                                    temp.children[i].pricepoint = _iter.pricepoint;
                                    temp.children[i].seckillingsell = _iter.seckillingsell;
                                    temp.children[i].seckillingprice = _iter.seckillingprice;
                                    temp.children[i].seckillingstock = _iter.seckillingstock;
                                    temp.children[i].storecategoryid = _iter.storecategoryid;

                                    var _pv = getProVal(_proid,list);
                                    var _p = getPro(_pv.propertyid,listpro);

                                    //规格属性
                                    temp.children[i].name = _p.name;
                                    temp.children[i].aliasname = _p.aliasname;
                                    temp.children[i].description = _p.description;

                                    //规格数值
                                    temp.children[i].propertyid = _pv.propertyid;
                                    temp.children[i].sortsorder = _pv.sortsorder;
                                    temp.children[i].propertyvalue = _pv.propertyvalue;
                                }
                                //console.log('temp: check it out: ',temp);
                                //console.log('temp.children: check it out: ',temp.children);
                                propertyrelated.push(temp);
                             }
                             
                             //从规格排序
                             for(var i = 0; i<propertyrelated.length; i++) {
                                if (propertyrelated[i].children) {
                                    scom.sortPropertyrelated(propertyrelated[i].children)
                                }
                             }

                             //主规格排序
                             scom.sortPropertyrelated(propertyrelated)
                             callback(null, {sold,left,seckillingleft,seckillingsold,goods,propertyrelated,timestamp});
                        }
                    };

                    var listpro = result.queryProperty.listpro.slice() || [];
                    var queryProValSql = 'select propertyid,propertyvalue,id from propertyvalue where ';
                    while(listpro.length > 0) {
                        var p = listpro.pop();
                        queryProValSql += 'propertyid = ' + p.id;
                        if (listpro.length) queryProValSql += ' or ';
                    }

                    console.log('queryProValSql: check it out: ', queryProValSql);
                    Propertyvalue.query(queryProValSql, function (err, list) {
                        if (err) return;
                        while(list.length>0) counter.push(list.pop());
                        doneCounter(counter);
                        console.log('cb_tag3: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                  console.log('queryProVal err: ',e);
                }
            }],

            queryCategory:['queryProVal', function (callback, result) {

                try {

                    var getCategoryName = function(list,id) {
                        var index = 0;
                        while(index<list.length){
                            var e = list[index];
                            if (e.id == id) {
                                return e.categoryname;
                            }
                            index++;
                        }
                    };

                    console.log('storecategoryid: check it out. ',storecategoryid);
                    var sold = result.queryProVal.sold || 0;
                    var left = result.queryProVal.left || 0;
                    var goods = result.queryProVal.goods || {};
                    var listpro = result.queryProVal.listpro || [];
                    var gsnorms = result.queryProVal.gsnorms || [];
                    var timestamp = result.queryProVal.timestamp || 0;
                    var seckillingleft = result.queryProVal.seckillingleft || 0;
                    var seckillingsold = result.queryProVal.seckillingsold || 0; 
                    var propertyrelated = result.queryProVal.propertyrelated || [];
                    var queryCategorySql = 'select id,hid,categoryname from goodscategory where isdelete = 0';
                    console.log('queryCategorySql: check it out: ', queryCategorySql);

                    Goodscategory.query(queryCategorySql, function (err, list) {
                        if (err) return;

                        if (platform < OS_DESKTOP) {
                           for(var j=0; j<list.length; j++) {
                                var obj = list[j];
                                obj.hid = obj.hid || "";
                                if(obj.id == storecategoryid){
                                    goods.p1 = null;
                                    goods.p2 = null;
                                    goods.p3 = null;
                                    var len = 0;
                                    var hidarray = obj.hid.split(':');
                                    hidarray.remove("");
                                    while(len < hidarray.length) {
                                        if (len == 1) {
                                            goods.p1 = hidarray[len];
                                        }else
                                        if (len == 2) { 
                                            goods.p2 = hidarray[len];
                                        }else
                                        if (len == 3) { 
                                            goods.p3 = hidarray[len];
                                        }
                                        len++;
                                    }
                                    break;
                                }
                            }

                            var categoryname = categoryname || '';
                            if (goods.p1>0) {
                                categoryname += getCategoryName(list,goods.p1);
                            }

                            if (goods.p2>0) {
                                categoryname += '-' + getCategoryName(list,goods.p2);
                            }

                            if (goods.p3>0) {
                                categoryname += '-' + getCategoryName(list,goods.p3);
                            }

                            if (typeof(categoryname) === 'string') {
                                goods.categoryname = categoryname;
                            }   
                        }
                        
                        callback(null, {sold,left,seckillingleft,seckillingsold,goods,propertyrelated,timestamp});
                        console.log('cb_tag4: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                  console.log('queryCategory err: ',e);
                }
            }],

            querySeller:['queryCategory', function (callback, result) {

                try {

                    var sold = result.queryCategory.sold || 0;
                    var left = result.queryCategory.left || 0;
                    var goods = result.queryCategory.goods || {};
                    var listpro = result.queryCategory.listpro || [];
                    var gsnorms = result.queryCategory.gsnorms || [];
                    var timestamp = result.queryCategory.timestamp || 0;
                    var seckillingleft = result.queryCategory.seckillingleft || 0; 
                    var seckillingsold = result.queryCategory.seckillingsold || 0;
                    var propertyrelated = result.queryCategory.propertyrelated || [];

                    var queryAccountSellerSql = 'select id,nickname,servicetelephone from accountseller where id = ' + skuObj.storeid;
                    console.log('queryAccountSellerSql: check it out: ', queryAccountSellerSql);

                    Accountseller.query(queryAccountSellerSql, function (err, list) {
                        if (err) return;
                        if (platform>OS_SELLER) {
                            while(list.length>0){
                                var val = list.pop();
                                goods.nickname = val.nickname;
                                goods.servicetelephone = val.servicetelephone;
                            }
                        }
                        callback(null, {sold,left,goods,seckillingleft,seckillingsold,propertyrelated,timestamp});
                        console.log('cb_tag5: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                  console.log('querySeller err: ',e);
                }
            }],
        }, function(err, results) {

            //console.log('rst: is ok ',results.queryProVal.propertyrelated);
            //console.log('rst2: is ok ',results.queryProVal.propertyrelated);
            try {
                if (results) {

                    //校验结果
                    results = results || {};
                    results.querySeller = results.querySeller || {};
                    results.querySeller.sold = results.querySeller.sold || 0;
                    results.querySeller.left = results.querySeller.left || 0;
                    results.querySeller.goods = results.querySeller.goods || {};
                    results.querySeller.timestamp = results.querySeller.timestamp || 0;
                    results.querySeller.seckillingleft = results.querySeller.seckillingleft || 0;
                    results.querySeller.seckillingsold = results.querySeller.seckillingsold || 0;
                    results.querySeller.propertyrelated = results.querySeller.propertyrelated || [];
                    //for(var key in goods) if (gcom.isForbidden({key:goods[key]})) goods[key] = 0;
                        
                    //返回结果
                    var sold = results.querySeller.sold;  
                    var left = results.querySeller.left;
                    var goods = results.querySeller.goods;
                    var timestamp = results.querySeller.timestamp;
                    var seckillingleft = results.querySeller.seckillingleft; 
                    var seckillingsold = results.querySeller.seckillingsold;
                    var propertyrelated = results.querySeller.propertyrelated;
                    //console.log('data: ',{goods,sold,left,propertyrelated,timestamp});

                    //异常检测
                    var gdcount = 0,gscount = 0;
                    for(var k in gd) gdcount = gdcount + 1;
                    for(var kk in goods) gscount = gscount + 1;

                    //返回数据
                    var code = 200;
                    var data = { goods,sold,left,seckillingleft,seckillingsold,propertyrelated,timestamp};
                    if (gscount<gdcount) {
                        code = 201;
                        data = [];
                        console.log('code: check it out: ',code); 
                    }

                    //结果集 
                    sendGoodsDetails(parseInt(type),data,code);
                }
            } catch (e) {
              console.log('serchGoodsDetails err: ',e);
            }
        });
    },

    /**
     * 商户商品
     *
     *
     * @return { 返回结果集 }                   
     */
    serchStoreGoods: function (req, res) {

        console.log('serchStoreGoods: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid;

        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
        var queryMGoodsSql = 'select * from ' + tb_M_Name + ' where goodsseries = 0'

        console.log('queryMGoodsSql: check it out: ', queryMGoodsSql);
        Creator.query(queryMGoodsSql, function (err, list) {
            if (err) return;
            console.log('cb_tag2: The result of this \' query \' is shown came out. check it out:  ', list.length);
            return res.json({
                data: list,
                code: 200
            });
        });
    },

    /**
     * 规格和类别
     *
     *
     * @return { 返回结果集 }                   
     */
    serchNormsWithClassify: function (req, res) {

        console.log('serchNormsWithClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var self = this;
        var storeid = allParams.storeid || mine.storeid;
        var goods = new Map(Object.entries(allParams));
        

        var list = prolist = group = [];
        var queryPropertySql = 'select * from goodsproperty where storeid = 0 or storeid = ' + storeid;

        console.log('queryPropertySql: check it out: ', queryPropertySql);
        Goodsproperty.query(queryPropertySql, function (err, proArray) {
            if (err) return
            
            console.log('cb_tag1: The result of this \' find \' is shown came out. check it out:  ', proArray.length);

            prolist = proArray;
            Propertyvalue.find().exec(function (err, proValArray) {
                if (err) return;

                console.log('cb_tag2: The result of this \' find \' is shown came out. check it out: ', proValArray.length);
                vallist = proValArray;

                for (var i = 0; i < prolist.length; i++) {
                    var proObj = prolist[i];
                    var propertyValueArray = []
                    for (var j = 0; j < vallist.length; j++) {
                        if (proObj.id == vallist[j].propertyid) {
                            propertyValueArray.push(vallist[j]);
                        };
                    };

                    group.push({id: proObj.id, name: proObj.name, propertyValueArray});
                };

                var gd = ["id","hid","storeid","parentid","categoryname","isdelete"];
                var queryCCategorySql = "select " + gd.join(",") + " from goodscategory where isdelete = 0";

                console.log('queryCCategorySql: check it out: ', queryCCategorySql);
                Goodscategory.query(queryCCategorySql, function (err, list) {
                    if (err) return; 
                    console.log('cb_tag1: The result of this \' query \' is shown came out. check it out: ',list.length);
                    seller.setCCategory(list);  
                    return res.json({
                        data: {
                            detail:seller.getCCategory(),
                            group:group,
                        },
                        code: 200
                    });
                });
            });
        });
    },

    /**
     * 状态编辑
     *
     *
     * @return { 返回结果集 }                   
     */
    statusOperate: function (req, res) {
        var ids = req.param("ids");
        var status = req.param("status");
        var freeztime = req.param("freeztime", false);
        if (!ids || !status || (status == 3 && !freeztime)) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        if (status == 3) {
            var date = new Date();
            var time = date.valueOf() + 86400 * 1000 * freeztime;
            var dt = (new Date(time));
            date = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
            set = {unfreeztime: date, statuscode: 3};
        } else {
            set = {statuscode: 2};
        }


        var uids = ids.split(",");

        Account.update({id: uids}, set).exec(function (err, account) {
            if (err) return res.negotiate(err);
            if (account.length) {
                return res.json({
                    code: 200,
                    msg: '修改成功'
                });
            } else {
                return res.json({
                    code: 400,
                    msg: '修改失败'
                });
            }
        });
    },

    /**
     * 用户冻结
     * *ids string 用户id组成的字符串，用,分割
     * @return { 返回结果集 }
     */
    frozenUser: function (req, res) {
        var ids = req.param("ids");
        var freeztime = req.param("freeztime", false);
        var mine=req.session.mine;
        var _this=this;
        
        var date = new Date();
        var time = date.valueOf() + 86400 * 1000 * freeztime;
        var dt = (new Date(time));
        date = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
        set = {unfreeztime: date, statuscode: 3};

        var uids = ids.split(",");
        var condition={id: uids};
        if(mine.storeid){
            condition.operatorno=mine.storeid;
        }

        Account.update(condition, set).exec(function (err, account) {
            if (err) return res.negotiate(err);
            if (account.length){
                _this.operateUserRecord(mine,uids,2,2,null,date);
                return res.json({
                    code: 200,
                    msg: '修改成功'
                });
            }else {
                return res.json({
                    code: 400,
                    msg: '修改失败'
                });
            }
        });
    },
    /**
     * 解冻用户
     * *ids string 用户id组成的字符串，用,分割
     * @param req
     * @param res
     */
    thawUser:function(req,res) {
        var ids = req.param("ids");
        var mine=req.session.mine;
        var _this=this;
        
        var uids = ids.split(",");
        var condition={id: uids};
        if(mine.storeid){
            condition.operatorno=mine.storeid;
        }

        Account.update(condition, {statuscode: 1,unfreeztime:null}).exec(function (err, account) {
            if (err) return res.negotiate(err);
            if (account.length) {
                _this.operateUserRecord(mine,uids,4,2,(new Date()).Format("yyyy-MM-dd hh:mm:ss.S"),null);
                return res.json({
                    code: 200,
                    msg: '修改成功'
                });
            } else {
                return res.json({
                    code: 400,
                    msg: '修改失败'
                });
            }
        });
    },
    /**
     * 用户停用
     * ids string 用户id组成的字符串，用,分割
     * @param req
     * @param res
     */
    disableUser:function (req,res) {
        var ids = req.param("ids");
        var mine=req.session.mine;
        var _this=this;
       
        var uids = ids.split(",");
        var condition={id: uids};
        if(mine.storeid){
            condition.operatorno=mine.storeid;
        }

        Account.update(condition, {statuscode: 2}).exec(function (err, account) {
            if (err) return res.negotiate(err);
            if (account.length) {
                _this.operateUserRecord(mine,uids,1,1,null,(new Date()).Format("yyyy-MM-dd hh:mm:ss.S"));
                return res.json({
                    code: 200,
                    msg: '修改成功'
                });
            } else {
                return res.json({
                    code: 400,
                    msg: '修改失败'
                });
            }
        });
    },
    /**
     * 用户解除停用
     *  ids string 用户id组成的字符串，用,分割
     * @param req
     * @param res
     * @returns {*}
     */
    enableUser:function (req,res) {
        var ids = req.param("ids");
        var mine=req.session.mine;
        var _this=this;
        
        var uids = ids.split(",");
        var condition={id: uids};
        if(mine.storeid){
            condition.operatorno=mine.storeid;
        }

        Account.update(condition, {statuscode: 1}).exec(function (err, account) {
            if (err) return res.negotiate(err);
            if (account.length) {
                _this.operateUserRecord(mine,uids,3,1,(new Date()).Format("yyyy-MM-dd hh:mm:ss.S"),0);
                return res.json({
                    code: 200,
                    msg: '修改成功'
                });
            } else {
                return res.json({
                    code: 400,
                    msg: '修改失败'
                });
            }
        });
    },
    operateUserRecord:function (mine,uids,type,status,recv_time,end_time) {
        if(type==3||type==4){
            async.mapSeries(uids,function (item,cb) {
                LogOperateUser.findOne({uid:item,sort:"createdAt desc"}).exec(function (err,log) {
                    if(err){
                        cb(err,null);
                    }
                    console.log(log);
                    if(log){
                        LogOperateUser.update({id:log.id}).set({rec_time:recv_time,rec_name:mine.userAlias}).exec(cb);
                    }else{
                        cb(null,null);
                    }
                });
            },function (err,val) {
                console.log(err);
            });
        }else if(type==1||type==2) {
            async.mapSeries(uids,function (item,cb) {
                var log={
                    uid:item,
                    type:status,
                    opname:mine.userAlias,
                    end_time:end_time
                }
                LogOperateUser.create(log).exec(cb);
            },function (err,val) {

            });

        }

    },
    /**
     * 重置密码
     * @param req
     * @param res
     */
    resetPwd: function (req, res) {
        var mine = req.session.mine;
        
        var uid = req.param("uid", 0);
        var storeid = req.param("storeid", 0);
        var password = req.param("password", "123456");

        var condition = {};
        if (mine && mine.storeid == 0) {//后台管理员
            condition = {id: parseInt(uid)};
        } else {
            condition = {id: parseInt(uid), operatorno: parseInt(storeid)};
        }
        var md5 = crypto.createHash("md5");
        var password = md5.update(password).digest("hex");
        condition = {id: parseInt(uid), operatorno: parseInt(storeid)};
        console.log(condition);
        Accountseller.findOne({id: mine.storeid}).exec(function (err, account) {
            if(err) return res.negotiate(err);
            if(account&&account.password1){
                password =account.password1;
            }
            Passwords.encryptPassword({
                password: password,
                difficulty: 10,
            }).exec({
                error: function (err) {
                    console.log("err:  When this error is returned, the encryption operation fails.");
                    return res.negotiate(err);
                },
                success: function (encryptpassword) {
                    var set = {
                        password1: encryptpassword,
                        password2: encryptpassword,
                    };
                    Account.update(condition, set).exec(function (err, account) {
                        if (err) return res.negotiate(err);
                        console.log(account);
                        if (account.length) {
                            return res.json({
                                code: 200,
                                msg: '修改成功'
                            });
                        } else {
                            return res.json({
                                code: 400,
                                msg: '修改失败'
                            });
                        }
                    });
                }

            });
        });

    },

    /**
     * 搜索商品
     *
     *
     * @return { 返回结果集 }                
     */
    serchGoods: function (req, res) {

        console.log('serchGoods: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var platform = allParams.platform;

        delete allParams.platform;
       
        var ap = allParams;
        var goods = new Map(Object.entries(ap));
        goods = scom.analysisSerch(goods);
        console.log('goods: check it out: ',goods);

        //特殊处理
        var storeid = goods.get('id');
        var self = this;
        switch(platform) {
            case OS_ADMIN:
            case OS_SELLER:
                    return storeid>0 ? self.serchSellerGoods(goods,req, res) : self.serchGoodsParent(goods,req, res)
                break;
            case OS_MOBILE:
            case OS_DESKTOP:
            case TYPE_PLATFORM_WINDOWS:
            case TYPE_PLATFORM_WEBCHAT:
            case TYPE_PLATFORM_IPHONE:
                    return self.serchSellerGoods(goods,req, res)
                break;
            default:
                console.log('err: platform ',platform)
        }
    },

    serchGoodsParent: function(goods, req, res) {

        //特殊处理
        var toString = function(val) {
            var _val = -1;
            var fbsArr = ["\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|" ,"_"]
            while(fbsArr.length>0) {
                var fbs = fbsArr.pop();
                if(fbs === val){
                    _val = "\\" + val;
                }               
            } 

            return typeof(_val) == 'string'?_val:val
        };

        if (goods.get('name')) {
            var name = goods.get('name');
            goods.set('name',toString(name));
        }

        var findCombineLike = {
            'name':true,
            'sku':true,
        };

        var findCombineOffen = {
            'id':true,
            'parentid':true,'status':true,'type':true,
        };

        async.auto({

            queryCategory: function (callback) {

                try {

                    var queryCategorySql = 'select id,categoryname from goodscategory where parentid = 0 and isdelete = 0';
                    console.log('queryCategorySql: check it out: ',queryCategorySql);

                    Goodscategory.query(queryCategorySql, function query(err, list) {
                        if (err) return;
                        callback(err, list);
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                    console.log('queryCategory err: ', e);
                }
            },

            queryCGoods: ['queryCategory', function (callback, result) {

                try {

                    var listparent = result.queryCategory || [];

                    var getCategoryName = function(item) {
                        for(var i = 0;i<listparent.length;i++){
                            if (listparent[i].id == item.parentid) {
                                return listparent[i].categoryname;
                            }
                        }
                    };

                    var counter = [],listgoods = [];
                    var doneCounter = function (err,counter) {
                        if (counter.length == listparent.length) {
                            while(counter.length>0) {
                                var list = counter.pop();
                                while(list.length>0) {
                                    var item = list.pop()
                                    item.categoryname = getCategoryName(item)
                                    listgoods.push(item);
                                }
                            }
                            callback(err,listgoods);
                        }
                    };
                    
                    var listparent_length = 0;
                    while(listparent_length < listparent.length) {
                        var iterKey = goods.keys();
                        var iterVal = goods.values();
                        var parentObj = listparent[listparent_length];
                        var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentObj.id);
                        var gd = ['id','parentid','name','storeid','sku','status','createdAt','parentid','type','storecategoryid'];
                        var queryCGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_C_Name + ' where ';

                        var size = 0;
                        while(size < goods.size) {
                            var key = iterKey.next().value;
                            var val = iterVal.next().value;
                            
                            if (findCombineOffen[key]) queryCGoodsSql += key + ' = ' + val + ' and ';
                            if (findCombineLike[key]) queryCGoodsSql += key + ' like ' + '\'%' + val + '%\'' + ' and ';
                            size++;
                        }

                        //特殊处理
                        if (goods.get('createdAt1')&&goods.get('createdAt2')) {
                            queryCGoodsSql+= ' createdAt >= ' + '\'' + goods.get('createdAt1') + '\'' + ' and ';
                            queryCGoodsSql+= ' createdAt <= ' + '\'' + goods.get('createdAt2') + '\'' + ' and ';
                        }

                        queryCGoodsSql += ' goodsseries = 0 ';
                        console.log('queryCGoodsSql: check it out: ',queryCGoodsSql);

                        Creator.query(queryCGoodsSql, function query(err, list) {
                            if (err) return;
                            counter.push(list);
                            doneCounter(err,counter);
                            console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                        });
                        listparent_length++;
                    }
                } catch (e) {
                    console.log('queryCGoods err: ', e);
                }
            }],

        }, function (err, results) {
            //console.log('rst: ',results.queryCGoods)

            //校验结果
            results = results || {};
            results.queryCGoods = results.queryCGoods || [];

            var code = 200;
            var list = results.queryCGoods;
            if (results) {
                return res.json({
                    data: list,
                    code: code
                });
            }
        });
    },

    serchSellerGoods: function(goods, req, res) {

        //特殊处理
        var toString = function(val) {
            var _val = -1;
            var fbsArr = ["\\", "$", "(", ")", "*", "+", ".", "[", "]", "?", "^", "{", "}", "|" ,"_"]
            while(fbsArr.length>0) {
                var fbs = fbsArr.pop();
                if(fbs === val){
                    _val = "\\" + val;
                }               
            } 

            return typeof(_val) == 'string'?_val:val
        };

        var storeid = goods.get('id');
        if (storeid>0) {
            goods.delete('id');
        }

        if (goods.get('name')) {
            var name = goods.get('name');
            goods.set('name',toString(name));
        }

        var findCombineLike = {
            'name':true,
            'sku':true,
        };

        var findCombineOffen = {
            'id':true,
            'parentid':true,'status':true,'type':true,
        };

        async.auto({

            queryCategory: function (callback, result) {

                try {

                    var sellerlist = result.serchSeller || [];
                    var queryCategorySql = 'select id,categoryname from goodscategory where parentid = 0 and isdelete = 0';
                    console.log('queryCategorySql: check it out: ',queryCategorySql);

                    Goodscategory.query(queryCategorySql, function query(err, list) {
                        if (err) return;
                        callback(err, list);
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                    console.log('queryCategory err: ', e);
                }
            },

            queryMGoods: ['queryCategory', function (callback, result) {

                try {

                    var getCategoryName = function(item) {
                        for(var i = 0;i<listparent.length;i++){
                            if (listparent[i].id == item.parentid) {
                                return listparent[i].categoryname;
                            }
                        }
                    };

                    var counter = [],listgoods = [];
                    var doneCounter = function (err,counter) {
                        if (counter.length == listparent_length) {
                            while(counter.length>0) {
                                var list = counter.pop();
                                while(list.length>0) {
                                    var item = list.pop()
                                    item.categoryname = getCategoryName(item)
                                    listgoods.push(item);
                                }
                            }
                            callback(err,listgoods);
                        }
                    };
                    //console.log('result.queryCategory: check it out: ',result.queryCategory);
                    var listparent = result.queryCategory || [];

                    var listparent_length = 0;
                    while(listparent_length < 1) {
                        var iterKey = goods.keys();
                        var iterVal = goods.values();
                        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);

                        var gd = ['id','parentid','name','storeid','sku','status',
                        'createdAt','parentid','type','storecategoryid'];
                        var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where ';

                        var size = 0;
                        while(size < goods.size) {
                            var key = iterKey.next().value;
                            var val = iterVal.next().value;
                            
                            if (findCombineOffen[key]) queryMGoodsSql += key + ' = ' + val + ' and ';
                            if (findCombineLike[key]) queryMGoodsSql += key + ' like ' + '\'%' + val + '%\'' + ' and ';
                            size++;
                        }

                        //特殊处理
                        if (goods.get('createdAt1')&&goods.get('createdAt2')) {
                            queryMGoodsSql+= ' createdAt >= ' + '\'' + goods.get('createdAt1') + '\'' + ' and ';
                            queryMGoodsSql+= ' createdAt <= ' + '\'' + goods.get('createdAt2') + '\'' + ' and ';
                        }

                        queryMGoodsSql += ' goodsseries = 0';
                        console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);

                        Creator.query(queryMGoodsSql, function query(err, list) {
                            if (err) return;
                            counter.push(list);
                            doneCounter(err,counter);
                            console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                        });
                        listparent_length++;
                    }

                } catch (e) {
                    console.log('queryMGoods err: ', e);
                }
            }],

        }, function (err, results) {
            //console.log('rst: ',results.serchGoodsList)

            //校验结果
            results = results || {};
            results.queryMGoods = results.queryMGoods || [];

            var code = 200;
            var list = results.queryMGoods;
            if (results) {
                return res.json({
                    data: list,
                    code: code
                });
            }
        });
    },

    exportExcel: function (req, res) {
        var mems = req.param("members");
        if (!mems || mems.length <= 0) {
            return res.json({
                code: 400,
                msg: '参数不正确'
            });
        }
        Account.find({id: eval(mems)}).exec(function (err, records) {
            if (err)   return res.negotiate(err);
            var data = [];
            for (i = 0; i < records.length; i++) {
                data.push({
                    id: records[i].id,
                    mobile: records[i].usermobile,
                    statuscode: records[i].statuscode,
                    createdAt: records[i].createdAt

                });
            }
            utility.exportExcelList(req, res, data);
        });
    },

    /**
     * 商城管理
     *
     *
     * @return { 返回结果集 }                
     */
    serchGoodsClassify: function(req, res){
        
        console.log('serchGoodsClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid;

        async.auto({

            queryMGoods: function (callback) {

                try {

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
                        console.log('cb_tag1: The result of this \' query \' is shown came out. check it out: ',list.length);
                        callback(err,list);
                    });
                    
                }catch (e) {
                    console.log('queryMGoods err: ', e);
                }
            },

            queryShiplist: ['queryMGoods', function (callback, result) {

                try {   
                        //商品列表
                        var list = result.queryMGoods || [];

                        Accountseller.findOne({id:storeid}).exec(function (err, recond) {
                            if (err) return;
                            console.log('cb_tag2: The result of this \' findOne \' is shown came out. check it out:  ok')
                            recond = recond || {};

                            var newShopsconcert = "",isopenship = recond.isopenship;
                            var shiplist = sellerlist = shopsconcertlist = horizontalallianceslist = [];
                            var shopsconcert = horizontalalliances = arr_data = goodsserias = [];

                            //专场数据
                            recond.shopsconcert = recond.shopsconcert || "";
                            recond.shopsconcert = recond.shopsconcert.split(',');

                            shopsconcert = recond.shopsconcert || [];
                            shopsconcert.remove("");

                            arr_data = shopsconcert.slice();
                            for(var i = shopsconcert.length; i<1; i++) {

                                newShopsconcert = "";
                                newShopsconcert+= 1;
                                newShopsconcert+= "#";
                                newShopsconcert+= "全部商城";
                                newShopsconcert+= "#";

                                for(var j = 0; j<list.length; j++) {
                                    var Goods = {};
                                    var e = list[j];

                                    // newShopsconcert += e.id + '[.]';
                                    // newShopsconcert += e.storecategoryid + '[.]'
                                    newShopsconcert += e.sku + '[.]';
                                    newShopsconcert += j;

                                    if (j<list.length - 1) {
                                        newShopsconcert += '|';
                                    }
                                };


                                shopsconcertlist.push(newShopsconcert);
                                recond.shopsconcert = shopsconcertlist.toString();

                                //更新专场
                                recond.save(function (err) {
                                    if (err) return;
                                    console.log("save_tag1: This saved successfully. ",recond.shopsconcert);
                                    arr_data = recond.shopsconcert.split(',');
                                });
                            }

                            //异业联盟商家
                            recond.shiplist = recond.shiplist || "";
                            recond.shiplist = recond.shiplist.split(':');

                            shiplist = recond.shiplist || [];
                            shiplist.remove("");

                            //异业联盟列表
                            sellerlist = isopenship ? shiplist : [];

                            //异业联盟数据
                            recond.horizontalalliances = recond.horizontalalliances || "";
                            recond.horizontalalliances = recond.horizontalalliances.split(',');

                            horizontalallianceslist = recond.horizontalalliances || [];
                            horizontalallianceslist.remove("");

                            for(var i = 0; i<horizontalallianceslist.length; i++) {

                                var horizontalallianceslistArrObj = {};
                                var horizontalallianceslistArr = horizontalallianceslist[i].split('-');
                                
                                horizontalallianceslistArrObj.name = horizontalallianceslistArr[1];
                                horizontalallianceslistArrObj.storeid = horizontalallianceslistArr[0];
                                horizontalallianceslistArrObj.sortorder = horizontalallianceslistArr[2];
                                horizontalalliances.push(horizontalallianceslistArrObj);
                            }
                            
                            //系列商品
                            goodsserias = list;
                            callback(err,{arr_data,goodsserias,sellerlist,isopenship,horizontalalliances});
                        });

                } catch (e) {
                    console.log('queryShiplist err: ', e);
                }
            }],

            querySeller: ['queryShiplist', function (callback, result) {

                try {   
                        var isopenship = result.queryShiplist.isopenship || false;
                        var arr_data = result.queryShiplist.arr_data || [];
                        var sellerlist = result.queryShiplist.sellerlist || [];
                        var goodsserias = result.queryShiplist.goodsserias || [];
                        var horizontalalliances = result.queryShiplist.horizontalalliances || [];


                        var queryAccountSellerSql = 'select id,useralias from accountseller where '

                        for(var i = 0; i<sellerlist.length; i++) {
                            queryAccountSellerSql += ' id = ' + sellerlist[i];
                            if (i < sellerlist.length - 1) queryAccountSellerSql += ' or ';
                        }

                        //辅助查找
                        if (!sellerlist.length) {
                             queryAccountSellerSql += ' id = -1';
                        }

                        console.log('queryAccountSellerSql. check it out. ',queryAccountSellerSql);
                        Accountseller.query(queryAccountSellerSql, function (err, list) {
                            if (err) return;
                            console.log('cb_tag3: The result of this \' findOne \' is shown came out. check it out:  ',list.length)
                            sellerlist = list;
                            callback(err,{arr_data,goodsserias,sellerlist,isopenship,horizontalalliances});
                        });

                } catch (e) {
                    console.log('querySeller err: ', e);
                }
            }],
        }, function (err, results) {

            //校验结果
            results = results || {};
            results.querySeller = results.querySeller || {};
            results.querySeller.arr_data = results.querySeller.arr_data || [];
            results.querySeller.goodsserias = results.querySeller.goodsserias || [];
            results.querySeller.isopenship = results.querySeller.isopenship || false;
            results.querySeller.horizontalalliances = results.querySeller.horizontalalliances || [];

            //发送数据
            var isopenship = results.querySeller.isopenship || false;
            var arr_data = results.querySeller.arr_data || [];
            var sellerlist = results.querySeller.sellerlist || [];
            var goodsserias = results.querySeller.goodsserias || [];
            var horizontalallianceslist = results.querySeller.horizontalalliances || [];

            //console.log('send data. ',{arr_data,goodsserias,sellerlist,isopenship,horizontalallianceslist});
            return res.json({
                code: 200,
                data: {arr_data,goodsserias,sellerlist,isopenship,horizontalallianceslist}
            });
        });
    },

     /**
     * 搜索店铺内商品
     *
     *
     * @return { 返回结果集 }                
     */
    serchMeShops: function (req, res) {

        console.log('serchMeShops: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var TYPE_STORE_CATEGORY = 1,    //商户获取所有商品类别
            TYPE_ADMIN_CATEGORY = 2;    //管理员获取所有商品类别

        var self = this;
        var TYPE = allParams.tokenId ? TYPE_STORE_CATEGORY : TYPE_ADMIN_CATEGORY;
        return TYPE === TYPE_STORE_CATEGORY ? self.sellerSeeCategory(req,res) : self.amdinSeeCategory(req,res);
    },

    sellerSeeCategory: function (req, res) {

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();
      
        var self = this;
        var mId = allParams.mId;
        var name = allParams.name;
        var tokenId = allParams.tokenId;
        var hashvalue = mId + ":" + tokenId;
        var mestoreid = allParams.storeid || -1;
       

        var client=redis.client({db:2});
        client.get(hashvalue,function(err,value) {
            if (err) return;

            if (mestoreid>0) {
                var storeid = mestoreid;
            }else{
                userData = userData || utility.decodeToken(value);
                var storeid = userData.operatorno = userData.operatorno || 0;
            }
            
            var findCombineLike = {
                'name':true,
            };

            var findCombineOffen = {
            };

            async.auto({

                querySeller: function (callback) {

                    try {

                        var queryAccountSellerSql = 'select id,userpic,nickname from accountseller  WHERE nickname like ' + '\'%' + utils.escapeQuotes(name) + '%\'';
                        console.log('queryAccountSellerSql: check it out: ',queryAccountSellerSql);

                        Accountseller.query(queryAccountSellerSql, function query(err, list) {
                            if (err) return;
                            console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                            callback(err, list);
                        });

                    } catch (e) {
                        console.log('querySeller err: ', e);
                    }
                },

                queryCategory: function (callback, result) {

                    try {

                        var sellerlist = result.serchSeller || [];
                        var queryCategorySql = 'select id,categoryname from goodscategory where parentid = 0 and isdelete = 0';
                        console.log('queryCategorySql: check it out: ',queryCategorySql);

                        Goodscategory.query(queryCategorySql, function query(err, list) {
                            if (err) return;
                            callback(err, list);
                            console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                        });

                    } catch (e) {
                        console.log('queryCategory err: ', e);
                    }
                },

                queryMGoods: ['queryCategory', function (callback, result) {

                    try {

                        var listparent = result.queryCategory || [];

                        var getCategoryName = function(item) {
                            for(var i = 0;i<listparent.length;i++){
                                if (listparent[i].id == item.parentid) {
                                    return listparent[i].categoryname;
                                }
                            }
                        };

                        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                        var gd = ['seckillingtime','id','deposit','premoneey','homenormalprice','homeseckillingprice','seckillingprice','sku','type','name','price','stock','storeid','parentid','imagedefault','storecategoryid','createdAt','status'];
                        var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where ';

                        var zkey =  0;
                        var keys = _.keys(allParams);
                        //console.log('keys. check it out. ',keys);

                        for(key in allParams) {
                         
                            var val = allParams[key];
                            if (findCombineOffen[key]) {
                                ++zkey;
                                queryMGoodsSql += key + " = " + val;
                                queryMGoodsSql += (zkey < keys.length) ? " and " : "";
                            }

                            if (findCombineLike[key]) {
                                ++zkey;
                                queryMGoodsSql += key + " like " + "\'%" + utils.escapeQuotes(val) + "%\'";
                                queryMGoodsSql += (zkey < keys.length) ? " and " : "";
                            }
                        }

                        queryMGoodsSql += ' goodsseries = 0 and status = 3';
                        console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);
                        Creator.query(queryMGoodsSql, function query(err, list) {
                            if (err) return;
                            console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                            for(var i = 0; i < list.length; i++) {

                                var teimestamp = list[i].type || 1;
                                if (list[i].type == 2) {
                                    var time = list[i].presaleendtime;
                                    teimestamp = gcom.calcPretime(true,time);
                                }

                                list[i].categoryname = list[i].categoryname || "";
                                list[i].categoryname = getCategoryName(list[i]);
                            }

                            callback(err,list);
                        });

                    } catch (e) {
                        console.log('queryMGoods err: ', e);
                    }
                }],

            }, function (err, results) {

                //校验结果
                results = results || {};
                results.querySeller = results.querySeller || [];
                results.queryMGoods = results.queryMGoods || [];

                var code = 200;
                var store = results.querySeller;
                var list = results.queryMGoods;
                console.log('send data. check it out. ',list.length);
                if (results) {
                    var timestamp = (new Date()).getTime();
                    return res.json({
                        data: {list,store,timestamp},
                        code: code
                    });
                }
            });
        });

    },

    amdinSeeCategory: function (req, res) {

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();
        
        var self = this;
        var name = allParams.name;
        var storeid = allParams.storeid || -1;

        var findCombineLike = {
            'name':true,
        };

        var findCombineOffen = {
        };

        async.auto({

            querySeller: function (callback) {

                try {

                    var queryAccountSellerSql = 'select id,userpic,nickname from accountseller  WHERE nickname like ' + '\'%' + utils.escapeQuotes(name) + '%\'';
                    console.log('queryAccountSellerSql: check it out: ',queryAccountSellerSql);

                    Accountseller.query(queryAccountSellerSql, function query(err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                        callback(err, list);
                    });

                } catch (e) {
                    console.log('querySeller err: ', e);
                }
            },

            queryCategory: function (callback, result) {

                try {

                    var sellerlist = result.serchSeller || [];
                    var queryCategorySql = 'select id,categoryname from goodscategory where parentid = 0 and isdelete = 0';
                    console.log('queryCategorySql: check it out: ',queryCategorySql);

                    Goodscategory.query(queryCategorySql, function query(err, list) {
                        if (err) return;
                        callback(err, list);
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                    console.log('queryCategory err: ', e);
                }
            },

            queryMGoods: ['queryCategory', function (callback, result) {

                try {

                    var listparent = result.queryCategory || [];

                    var getCategoryName = function(item) {
                        for(var i = 0;i<listparent.length;i++){
                            if (listparent[i].id == item.parentid) {
                                return listparent[i].categoryname;
                            }
                        }
                    };

                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);

                    //var gd = ['id','sku','type','name','price','stock','storeid','parentid','imagedefault','storecategoryid','createdAt','status'];
                    var gd = ['id','deposit','premoneey','seckillingtime','homenormalprice','homeseckillingprice','seckillingprice','sku','type','name','price','stock','storeid','parentid','imagedefault','storecategoryid','createdAt','status'];
                    var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where ';

                    var zkey =  0;
                    var keys = _.keys(allParams);
                    //console.log('keys. check it out. ',keys);

                    for(key in allParams) {
                     
                        var val = allParams[key];
                        if (findCombineOffen[key]) {
                            ++zkey;
                            queryMGoodsSql += key + " = " + val;
                            queryMGoodsSql += (zkey < keys.length) ? " and " : "";
                        }

                        if (findCombineLike[key]) {
                            ++zkey;
                            queryMGoodsSql += key + " like " + "\'%" + utils.escapeQuotes(val) + "%\'";
                            queryMGoodsSql += (zkey < keys.length) ? " and " : "";
                        }
                    }

                    queryMGoodsSql += ' goodsseries = 0 and status = 3';
                    console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);
                    Creator.query(queryMGoodsSql, function query(err, list) {
                        if (err) return;
                        console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                        for(var i = 0; i < list.length; i++) {

                            var teimestamp = list[i].type || 1;
                            if (list[i].type == 2) {
                                var time = list[i].presaleendtime;
                                teimestamp = gcom.calcPretime(true,time);
                            }

                            list[i].categoryname = list[i].categoryname || "";
                            list[i].categoryname = getCategoryName(list[i]);
                        }

                        callback(err,list);
                    });

                } catch (e) {
                    console.log('queryMGoods err: ', e);
                }
            }],

        }, function (err, results) {

            //校验结果
            results = results || {};
            results.querySeller = results.querySeller || [];
            results.queryMGoods = results.queryMGoods || [];

            var code = 200;
            var store = results.querySeller;
            var list = results.queryMGoods;
            console.log('send data. check it out. ',list.length);
            if (results) {
                return res.json({
                    data: {list,store},
                    code: code
                });
            }
        });
    },  

     /**
     * 搜索店铺类别商品
     *
     *
     * @return { 返回结果集 }                
     */
    serchShopsClassify: function(req, res) {

        console.log('serchShopsClassify: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var mId = allParams.mId;
        var tokenId = allParams.tokenId;
        var listItem = allParams.idArray;
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

            userData = userData || utility.decodeToken(value); 
            var storeid = userData.operatorno = userData.operatorno || 0;

            var gd = ["name","storeid","sku","imagedefault","price","id","createdAt","type","deposit",
            "premoneey","presaleendtime","presaleflow","presaleflowdescript", "presaledescript",
            "precustomerserivice",'storecategoryid',"presubtitle","seckillingtime","seckillingprice",
            "seckillingstock","isseckilling","homenormalprice","homeseckillingprice","seckillingexplain",
            "seckillingdescription","seckillingflow","seckillingsell"];

            var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
            var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where ' + gcom.querySku(listItem);;
            
            // for(var i = 0; i<listItem.length; i++) {
            //     var item = listItem[i];
            //     queryMGoodsSql += ' id = ' + item.id;
            //     queryMGoodsSql += ' and ';
            //     queryMGoodsSql += ' storecategoryid = ' + item.storecategoryid;
            //     queryMGoodsSql +=  i < listItem.length-1 ? ' or ' : '';
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
                return res.json({
                    data: scom.selectionSort(newlist),
                    timestamp:(new Date()).getTime(),
                    code: 200
                });
            });
        })
    },

    /**
     * 搜索店铺内类别
     *
     *
     * @return { 返回结果集 }                
     */
    serchMeShopsClassify: function (req, res) {

        console.log('serchMeShopsClassify: This is the function entry. check it out: ', req.allParams());

        var self = this;
        //商户查看大类别所有商品
        var SELLER_SEE_GOODS = 1;
        //管理员查看大类别所有商品 
        var  ADMIN_SEE_GOODS = 2;
        //获取请求接口所带的所有参数    
        var allParams = req.allParams();
        //根据平台查询商品类别
        var platform = allParams.platform;
        
        
        switch(platform) {
            case OS_ADMIN:
                return self.adminSeeGoods(req,res);
            case OS_SELLER:
                return self.sellerSeeGoods(req,res);
            case OS_MOBILE:
            case TYPE_PLATFORM_WINDOWS:
            case TYPE_PLATFORM_WEBCHAT:
            case TYPE_PLATFORM_IPHONE:
                return self.userSeeGoods(req,res);
            default:
                console.log('err: platform ',platform)
        }
        // var TYPE = allParams.mId&&allParams.tokenId ? SELLER_SEE_GOODS : ADMIN_SEE_GOODS;
        // return TYPE === SELLER_SEE_GOODS ? self.sellerSeeGoods(req,res) : 
    },

    userSeeGoods: function(req, res) {

        console.log('userSeeGoods: This is the function entry.');

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var mId = allParams.mId;
        var page = allParams.page;
        var tokenId = allParams.tokenId;
        var platform = allParams.platform;
        var parentid = allParams.parentid;
        var classify = allParams.classify;
        var hashvalue = mId + ":" + tokenId;

        var client=redis.client({db:2});
        client.get(hashvalue,function(err,value) {
            if(err) return;

            userData = userData || utility.decodeToken(value); 
            var storeid = userData.operatorno = userData.operatorno || 0;

            async.auto({

                queryCategory: function (callback) {

                    try {

                        //var queryCategorySql = 'select id,categoryname from goodscategory where parentid = 0 and isdelete = 0';
                        var queryCategorySql = 'select id,categoryname,storeid,isdelete from goodscategory';
                        queryCategorySql += ' where (parentid = 0 and isdelete = 0 and storeid = 0)';
                        queryCategorySql += ' or (parentid = 0 and isdelete = 0 and storeid = ' + storeid + ' )';
                        console.log('queryCategorySql: check it out: ',queryCategorySql);

                        Goodscategory.query(queryCategorySql, function query(err, list) {
                            if (err) return;
                            callback(err, list);
                            console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                        });

                    } catch (e) {
                        console.log('queryCategory err: ', e);
                    }
                },

                serchMGoods:['queryCategory', function (callback, result) {

                    try {

                        var listparent = result.queryCategory || [];

                        var getCategoryName = function(item) {
                            for(var i = 0;i<listparent.length;i++){
                                if (listparent[i].id == item.parentid) {
                                    return listparent[i].categoryname;
                                }
                            }  
                        };

                        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);

                        var gd = ["id","sku","type","name","price","stock","storeid",
                        "parentid","imagedefault","seckillingtime","seckillingprice",
                        "seckillingstock","isseckilling","homenormalprice","homeseckillingprice",
                        "seckillingexplain","seckillingdescription","seckillingflow",
                        "seckillingsell","storecategoryid","createdAt","status"];

                        var queryMGoodsSql = "";
                        queryMGoodsSql += 'select ' + gd.join(',') + ' from ' + tb_M_Name;
                        queryMGoodsSql += ' where (type = 1 or type = 3) and goodsseries = 0 and';
                        queryMGoodsSql += ' status = 3 and parentid = ' + parentid;
                        console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);

                        Creator.query(queryMGoodsSql, function query(err, list) {
                            if (err) return;
                            console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                            for(var i = 0; i < list.length; i++) {

                                var teimestamp = list[i].type || 1;
                                if (list[i].type == 2) {
                                    var time = list[i].presaleendtime;
                                    teimestamp = gcom.calcPretime(true,time) || 1;
                                }
                                list[i].categoryname = list[i].categoryname || "";
                                list[i].categoryname = getCategoryName(list[i]);
                            }
                            callback(err,list);
                        });

                    } catch (e) {
                        console.log('serchMGoods err: ', e);
                    }
                }],

            }, function (err, results) {

                //校验结果
                results = results || {};
                results.serchMGoods = results.serchMGoods || [];

                var code = 200;
                var list = results.serchMGoods;

                var allpage = 1,templist = [];
                switch(platform) {
                    case OS_MOBILE:
                    case TYPE_PLATFORM_WEBCHAT:
                    case TYPE_PLATFORM_IPHONE:
                            gcom.setGoodsArray(classify,list);
                            allpage = gcom.calcPageCount(classify)
                            templist = gcom.getGoodsPage(classify,page)
                        break;
                    case OS_DESKTOP:
                            allpage = 1;
                            templist = list;
                        break;
                    default:
                        console.log('err: platform ',platform)
                }

                if (results) {
                    return res.json({
                        data: {
                            list:templist,
                            allpage: allpage,
                            timestamp:(new Date()).getTime(),
                        },
                        code: code,
                        msg: page ===0 ? "首页商品" : "当前页数",
                    });
                }
            });
        });
    },

    sellerSeeGoods: function(req, res) {

        console.log('sellerSeeGoods: This is the function entry.');

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var mId = allParams.mId;
        var storeid = mine.storeid;
        var tokenId = allParams.tokenId;
        var parentid = allParams.parentid;
        var hashvalue = mId + ":" + tokenId;

        async.auto({

            queryCategory: function (callback) {

                try {

                    var queryCategorySql = 'select id,categoryname from goodscategory where parentid = 0 and isdelete = 0';
                    console.log('queryCategorySql: check it out: ',queryCategorySql);

                    Goodscategory.query(queryCategorySql, function query(err, list) {
                        if (err) return;
                        callback(err, list);
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                    console.log('queryCategory err: ', e);
                }
            },

            serchMGoods:['queryCategory', function (callback, result) {

                try {

                    var listparent = result.queryCategory || [];

                    var getCategoryName = function(item) {
                        for(var i = 0;i<listparent.length;i++){
                            if (listparent[i].id == item.parentid) {
                                return listparent[i].categoryname;
                            }
                        }  
                    };

                    var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);

                    var gd = ["id","sku","type","name","price","stock","storeid",
                        "parentid","imagedefault","seckillingtime","seckillingprice",
                        "seckillingstock","isseckilling","homenormalprice","homeseckillingprice",
                        "seckillingexplain","seckillingdescription","seckillingflow",
                        "seckillingsell","storecategoryid","createdAt","status"];
                        
                    var queryMGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_M_Name + ' where  goodsseries = 0 and status = 3 and parentid = ' + parentid;
                    console.log('queryMGoodsSql: check it out: ',queryMGoodsSql);

                    Creator.query(queryMGoodsSql, function query(err, list) {
                        if (err) return;
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                        for(var i = 0; i < list.length; i++) {

                            var teimestamp = list[i].type || 1;
                            if (list[i].type == 2) {
                                var time = list[i].presaleendtime;
                                teimestamp = gcom.calcPretime(true,time) || 1;
                            }
                            list[i].categoryname = list[i].categoryname || "";
                            list[i].categoryname = getCategoryName(list[i]);
                        }
                        callback(err,list);
                    });

                } catch (e) {
                    console.log('serchMGoods err: ', e);
                }
            }],

        }, function (err, results) {

            //校验结果
            results = results || {};
            results.serchMGoods = results.serchMGoods || [];

            var code = 200;
            var list = results.serchMGoods;
            if (results) {
                return res.json({
                    data: list,
                    code: code,
                });
            }
        });
    },

    adminSeeGoods: function(req, res) {
        
        console.log('adminSeeGoods: This is the function entry.');

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        var mine = req.session.mine;
        var parentid = allParams.parentid;

        async.auto({

            queryCategory: function (callback) {

                try {

                    var queryCategorySql = 'select id,categoryname from goodscategory where parentid = 0 and isdelete = 0';
                    console.log('queryCategorySql: check it out: ',queryCategorySql);

                    Goodscategory.query(queryCategorySql, function query(err, list) {
                        if (err) return;
                        callback(err, list);
                        console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                    });

                } catch (e) {
                    console.log('queryCategory err: ', e);
                }
            },

            serchMGoods:['queryCategory', function (callback, result) {

                try {

                    var listparent = result.queryCategory || [];

                    var getCategoryName = function(item) {
                        for(var i = 0;i<listparent.length;i++){
                            if (listparent[i].id == item.parentid) {
                                return listparent[i].categoryname;
                            }
                        }
                        return "未知类别";  
                    };

                    var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentid);

                    var gd = ["id","sku","type","name","price","stock","storeid",
                        "parentid","imagedefault","seckillingtime","seckillingprice",
                        "seckillingstock","isseckilling","homenormalprice","homeseckillingprice",
                        "seckillingexplain","seckillingdescription","seckillingflow",
                        "seckillingsell","storecategoryid","createdAt","status"];
                    var queryCGoodsSql = 'select ' + gd.join(',') + ' from ' + tb_C_Name + ' where  goodsseries = 0 and status = 3';
                    console.log('queryCGoodsSql: check it out: ',queryCGoodsSql);

                    Creator.query(queryCGoodsSql, function query(err, list) {
                        if (err) return;
                        console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);
                        for(var i = 0; i < list.length; i++) {

                            var teimestamp = list[i].type || 1;
                            if (list[i].type == 2) {
                                var time = list[i].presaleendtime;
                                teimestamp = gcom.calcPretime(true,time) || 1;
                            }
                            list[i].categoryname = list[i].categoryname || "";
                            list[i].categoryname = getCategoryName(list[i]);
                        }
                        callback(err,list);
                    });

                } catch (e) {
                    console.log('serchMGoods err: ', e);
                }
            }],

        }, function (err, results) {

            //校验结果
            results = results || {};
            results.serchMGoods = results.serchMGoods || [];

            var code = 200;
            var list = results.serchMGoods;
            if (results) {
                return res.json({
                    data: list,
                    code: code
                });
            }
        });
    },

     /**
     * 搜索店铺内所有类别
     *
     *
     * @return { 返回结果集 }                
     */
    serchMeShopsCategory: function (req, res) {

        console.log('serchMeShopsCategory: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var userData = req.session.user;
        var allParams = req.allParams();

        //前端获取商户类别
        if (allParams.tokenId) {

            var category = {};
            var mId = allParams.mId;
            var tokenId = allParams.tokenId;
            var hashvalue = mId + ":" + tokenId;

            var client=redis.client({db:2});
            client.get(hashvalue,function(err,value) {
                if(err) return;

                userData = userData || utility.decodeToken(value);
                storeid = userData.operatorno || userData.operatorno || 0;

                var sqlGoodsCategory = "select id,categoryname,storeid from goodscategory where parentid = 0 and isdelete = 0 and storeid = 0";
                console.log('sqlGoodsCategory: check it out: ',sqlGoodsCategory);

                Goodscategory.query(sqlGoodsCategory, function query(err, list) {
                    if (err) return;
                    console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);
                    
                    async.times(list.length, function(n, next) {

                        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS,storeid);
                        var totalMCGoodsSeriesSql = "select count(goodsseries) as total from " + tb_M_Name + " where goodsseries = 0 and `status` = 3 and parentid = " + list[n].id;
                        console.log('totalMCGoodsSeriesSql. check it out. ',totalMCGoodsSeriesSql);
                        
                        Creator.query(totalMCGoodsSeriesSql, function (err, r) {
                            if (err) {
                                console.log("err_tag2: When this error is returned, the query fails.");
                                return res.negotiate(err);
                            }
                            console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ',r.length);
                            list[n]['total'] = r[r.length-1].total;
                            next(err,r);
                        });

                    }, function(err, users) {
                        console.log('list. check it out. ',list);
                        return res.json({
                            data: list,
                            code: 200
                        });
                    });
                    
                });
            }); 

        //商户和管理员获取类别   
        }else{

            var sqlGoodsCategory = "select id,categoryname,storeid from goodscategory where parentid = 0 and isdelete = 0 and storeid = 0";
            console.log('sqlGoodsCategory: check it out: ',sqlGoodsCategory);

            Goodscategory.query(sqlGoodsCategory, function query(err, list) {
                if (err) return;
                console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);

                return res.json({
                    data: list,
                    code: 200
                });
            });
        }

    },

    /**
     * 搜索规格主类关联商品数量
     *
     *
     * @return { 返回结果集 }                
     */
    serchNormsGoods: function (req, res) {

        console.log('serchNormsGoods: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var listitem = allParams.valArray || [];
        var self = this,loopcounter = 0,querycounter = 0;

        var listsku = [];
        var queueEvent = [];
        var goodsArray = [];
        var sellerArray = [];
        var eventArray = [];
        var categoryArray = [];
        
        //事件标记
        const TAG_QUERYSELLER = 1;
        const TAG_QUERYCATEGORY = 2;
        const TAG_QUERYCGOODS = 3;
        const TAG_TOTALGOODS = 4;
        const TAG_SEND_TOTAL = 5;

        //执行状态
        var i = 0,lock = false;
        var _TAG_QUERYSELLER,_TAG_QUERYCATEGORY;
        var _TAG_QUERYCGOODS,_TAG_TOTALGOODS;
        var TIME_ID_Q_END;

        //平铺模式
        queueEvent.push(TAG_QUERYSELLER);
        queueEvent.push(TAG_QUERYCATEGORY);
        queueEvent.push(TAG_QUERYCGOODS);
        queueEvent.push(TAG_TOTALGOODS);
        queueEvent.push(TAG_SEND_TOTAL);
        eventArray = queueEvent.slice();
        
        //商户查询
        querySeller = function() {

            try {

                //查询所有商户ID
                var querySellerSql = 'select id from accountseller';
                console.log('querySellerSql: check it  out.',querySellerSql);

                Accountseller.query(querySellerSql,function(err, list) {
                    if (err) return;
                    while(list.length > 0) {
                        var e = list.pop();
                        sellerArray.push(e.id);
                    }
                    console.log("cb_tag1: The result of this \' query \' is shown came out. check it out. ",list.length);
                    _TAG_QUERYSELLER = TAG_QUERYSELLER;
                });

            } catch (e) {
              console.log('err: querySeller',e);
            }
        };

        //类别查询
        queryCategory = function() {

            try {

                //查询所有最高级父类ID
                var queryCategorySql = 'select id from goodscategory where parentid = 0 and isdelete = 0';
                console.log('queryCategorySql: check it out: ',queryCategorySql);

                Goodscategory.query(queryCategorySql,function (err, list) {
                    if (err) return;
                    while(list.length > 0) {
                        var e = list.pop();
                        categoryArray.push(e.id);
                    }
                    console.log('cb_tag2: The result of this \' find \' is shown came out. check it out:  ', list.length);
                    _TAG_QUERYCATEGORY = TAG_QUERYCATEGORY;
                });

            } catch (e) {
              console.log('err: queryCategory',e);
            }
        };

        //商品查询
        queryCGoods = function() {

            try {
                sellerlist = sellerArray.slice();
                categorylist = categoryArray.slice();
                console.log('sellerlist: check it out. ',sellerlist.length);
                console.log('categorylist: check it out. ',categorylist.length);

                var subDoneCounter = function (err,list) {
                    
                    while (list.length > 0) {
                        var item = list.pop();
                        var sku = item.sku;
                        if (goodsArray.indexOf(sku)===-1) {
                            goodsArray.push(sku);
                        }
                    }

                    if (!categorylist.length) {
                        _TAG_QUERYCGOODS = TAG_QUERYCGOODS;
                    }  
                };

                while(categorylist.length > 0) {

                    var parentid = categorylist.pop();
                    var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentid);
                    var queryCGoodsSql = 'select sku from ' + tb_C_Name + ' where goodsseries = 0';

                    //查询所有商户同规格的商品
                    console.log('queryCGoodsSql: check it out. ',queryCGoodsSql);
                    Creator.query(queryCGoodsSql, function (err, list) {
                        if (err) return;
                        console.log("cb_tag4: The result of this \' query \' is shown came out. check it out. ",list.length);
                        subDoneCounter(err,list);
                    });
                }

            } catch (e) {
              console.log('err: queryCGoods',e);
            }
        };

        //统计数量
        totalCGoods = function() {
            try {

                   
                    goodslist = goodsArray.slice();
                    sellerlist = sellerArray.slice();
                    categorylist = categoryArray.slice();
                    console.log('goodslist: check it out.  ',goodslist.length);
                    console.log('sellerlist: check it out. ',sellerlist.length);
                    console.log('categorylist: check it out. ',categorylist.length);

                    var index = 0;
                    var subDoneCounter = function (err,list) {
                        
                        index = 0
                        querycounter = querycounter + 1;
                        
                        var isFind = false;
                        while (index<list.length) {

                            var item = list[index];
                            var skuObj = gcom.revertSku(item.sku);

                            if (skuObj.a_proid>0 && !skuObj.b_proid) {

                                 if (listitem.indexOf(skuObj.a_proid)>-1) {

                                    if (listsku.indexOf(skuObj.sku) === -1) {
                                        listsku.push(skuObj.sku);
                                    } 
                                }
                            }

                            if (skuObj.a_proid>0 && skuObj.b_proid>0) {

                                if (listitem.indexOf(skuObj.b_proid)>-1) {

                                    if (listsku.indexOf(skuObj.sku) === -1) {
                                        listsku.push(skuObj.sku);
                                    } 
                                }
                                
                            }

                            // var a_proid = skuObj.a_proid || 0;
                            // if (listitem.indexOf(a_proid)>-1) {
                            //     //console.log('a_proid. ',a_proid)
                            // }

                            // var b_proid = skuObj.b_proid || 0;
                            // if (listitem.indexOf(b_proid)>-1) {
                            //     //console.log('b_proid. ',b_proid)
                            // }

                            index = index + 1;
                        }

                        if (loopcounter===querycounter) {
                            _TAG_TOTALGOODS = TAG_TOTALGOODS;
                        }  
                    };
                    
                    while(categorylist.length > 0) {

                        var parentid = categorylist.pop();
                        var tb_C_Name =  gcom.getMysqlTable(TAB_C_GOODS,parentid);

                        index = 0;
                        loopcounter += goodslist.length;
                        while(index < goodslist.length) {

                            var sku = goodslist[index];
                            var queryCGoodsSql = 'select sku from ' + tb_C_Name + ' where sku like \'' + sku + '%\'';

                            //查询所有类别同规格的商品
                            //console.log('queryCGoodsSql: check it out. ',queryCGoodsSql);
                            Creator.query(queryCGoodsSql, function (err, list) {
                                if (err) return;
                                //console.log("cb_tag6: The result of this \' query \' is shown came out. check it out. ",list.length);
                                subDoneCounter(err,list);
                            });
                            index++;
                        }
                    };

            } catch (e) {
              console.log('err: totalCGoods',e);
            }
        };
        
        //设置事件
        setEevent = function(timeid) {
            
            if (lock) {
                console.log('lock',lock);
                return;
            }

            var e = eventArray;
            var index = e.indexOf(timeid);
            switch(eventArray[index]) {

                case TAG_QUERYSELLER:

                    lock = !lock;//lock;
                    //查询所有商户的ID
                    querySeller();
                    TIME_ID_Q_SLLER = setInterval(function() {
                        if (_TAG_QUERYSELLER === TAG_QUERYSELLER) {
                            clearInterval(TIME_ID_Q_SLLER);
                            queueEvent.remove(timeid);
                            lock = !lock;//unlock;
                        }
                    }, 1000);
                    break;

                case TAG_QUERYCATEGORY:

                    lock = !lock;//lock;
                    //查询所有最高级父类ID
                    queryCategory();
                    TIME_ID_Q_CATEGORY = setInterval(function() {
                        console.log('_TAG_QUERYCATEGORY',_TAG_QUERYCATEGORY);
                        if (_TAG_QUERYCATEGORY === TAG_QUERYCATEGORY) {
                            clearInterval(TIME_ID_Q_CATEGORY);
                            queueEvent.remove(timeid);
                            lock = !lock;//unlock;
                        }
                    }, 1000);
                    break;

                case TAG_QUERYCGOODS:

                    //查询所有商品
                    lock = !lock;//lock;
                    queryCGoods();
                    TIME_ID_Q_GOODS = setInterval(function() {
                        console.log('_TAG_QUERYCGOODS',_TAG_QUERYCGOODS);
                        if (_TAG_QUERYCGOODS === TAG_QUERYCGOODS) {
                            clearInterval(TIME_ID_Q_GOODS);
                            queueEvent.remove(timeid);
                            lock = !lock;//unlock;
                        }
                    }, 1000);
                    break;

                case TAG_TOTALGOODS:

                    //查询所有商品
                    lock = !lock;//lock;
                    totalCGoods();
                    TIME_ID_Q_TOTAL = setInterval(function() {
                        console.log('_TAG_TOTALGOODS',_TAG_TOTALGOODS);
                        if (_TAG_TOTALGOODS === TAG_TOTALGOODS) {
                            clearInterval(TIME_ID_Q_TOTAL);
                            queueEvent.remove(timeid);
                            lock = !lock;//unlock;
                        }
                    }, 1000);
                    break;
                case TAG_SEND_TOTAL:

                    //查询所有商品
                    lock = !lock;//lock;

                    getGoodsCount = function() {

                        //删除事件并解锁
                        queueEvent.remove(timeid);
                        lock = !lock;//unlock;

                        var c = listsku.length;
                        //var n = c === 1 ? 0 : c;
                        gcom.setCache(listsku);
                        return res.json({
                            data: c,
                            code: 200
                        });
                    };

                    //返回统计
                    return getGoodsCount();
                    break;
                default:
                    console.log('err: setEevent ', timeid);
                    if (!queueEvent.length) {
                        clearInterval(TIME_ID_Q_END);
                    }
                    return;
            }
        };

        var first = 0;
        //启动定时器事件
        TIME_ID_Q_END = setInterval(function() {
            if (!queueEvent.length) {
                clearInterval(TIME_ID_Q_END);
            }
            console.log('****************')
            var data = setEevent(queueEvent[first]) || -1;
            if(data !== -1) return data;
            console.log('****************')
        }, 3000);
    },

    /**
     * 搜索规格主类关联商品数量
     *
     *
     * @return { 返回结果集 }                
     */
    serchCategoryGoods: function (req, res) {

        console.log('serchCategoryGoods: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var total = 0;
        var parentid = allParams.parentid;
        
        subDoneCounter = function(err,list) {
            if (list.length) {
                var e = list.pop();
                //console.log('e.',e);
                total += e.total;
            }

            return res.json({
                data: total,
                code: 200
            });
        };

        var tb_C_Name = gcom.getMysqlTable(TAB_C_GOODS,parentid);
        var queryCGoodsSql = "select count(parentid) as total from " + tb_C_Name + " where goodsseries = 0";

        //查询所有同类别的商品
        console.log('queryCGoodsSql: check it out. ',queryCGoodsSql);
        Creator.query(queryCGoodsSql, function (err, list) {
            if (err) return;
            console.log("cb_tag1: The result of this \' query \' is shown came out. check it out. ",list.length);
            subDoneCounter(err,list);
        });
    },    
};