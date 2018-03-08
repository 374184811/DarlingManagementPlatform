var Passwords = require('machinepack-passwords');
var crypto = require('crypto');
module.exports = {


    /**
     * 产生验证码
     *
     * @param  usermobile           //手机
     *
     * @return randkey              //返回随机码
     */
    generateMixed: function (req, res) {

        console.log('generateMixed: This is the function entry. check it out: ', req.allParams());

        var allParams = req.allParams();
        var usermobile = allParams.usermobile;

        if (utils.isMobile(usermobile)) {
            return res.json({
                err: '非运营商段号码',
                code: 400
            });
        }

        Account.findOne({usermobile: usermobile}).exec(function (err, recond) {
            if (err) return;
            console.log("cb_tag1: The result of this \'findOne \' is shown came out. check it out: ok");

            if (_.isObject(recond)) {
                return res.json({
                    err: '该号码已经注册过了',
                    code: 400
                });
            } else {
                return res.json({
                    code: utility.generateMixed(4, true)
                });
            }
        });
    },

    /**
     * 校验商户
     *
     * @param  usermobile           //手机
     *
     * @return randkey              //返回随机码
     */
    verifySellerName: function (req, res) {

        console.log('verifySellerName: This is the function entry. check it out: ', req.allParams());

        var allParams = req.allParams();

        var useralias = allParams.useralias;
        useralias = seller.hashUseralias(useralias);
        
        console.log('useralias. check it out. ',useralias);
        Adminuser.findOne({username: useralias}).exec(function (err, recond) {
            if (err) return;
            console.log("cb_tag1: The result of this \'findOne \' is shown came out. check it out: ok");

            if (_.isObject(recond)) {
                return res.json({
                    msg: '该商户名称已经注册过了.',
                    code: 400
                });
            } else {
                return res.json({
                    code: 200
                });
            }
        });
    },


    /**
     * 商户注册
     *
     *
     * @return { 返回结果集 }
     */
    merchantsRegistered: function (req, res) {

        console.log('merchantsRegistered: This is the function entry. check it out: ', req.allParams());

        var allParams = req.allParams();

        var self = this;
        allParams.shiplist = 0;
        allParams.isopenship = 0;
        allParams.shipstatus = 0;
        allParams.statuscode = 2;
        allParams.shiprequest = 0;

        allParams.sex = allParams.sex || 0;
        allParams.city = allParams.city || "";
        allParams.area = allParams.area || "";

        allParams.address = allParams.address || "";
        allParams.userpic = allParams.userpic || "";

        allParams.nickname = allParams.nickname || "";
        allParams.realname = allParams.realname || "";
        allParams.province = allParams.province || "";
        allParams.contacts = allParams.contacts || "";

        allParams.userbqlid = allParams.userbqlid || 0;
        allParams.telephone = allParams.telephone || "";
        allParams.useralias = allParams.useralias || "";
        allParams.useremail = allParams.useremail || "";
        allParams.password1 = allParams.password1 || "";
        allParams.password2 = allParams.password2 || "";

        allParams.usermobile = allParams.usermobile || "";
        allParams.straddress = allParams.straddress || "";
        allParams.operatorno = allParams.operatorno || "";

        allParams.legalperson = allParams.legalperson || "";
        allParams.license_pic = allParams.license_pic || "";
        allParams.companyname = allParams.companyname || "";
        allParams.mobileCode = allParams.mobileCode || false;

        allParams.mainbusiness = allParams.mainbusiness || "";
        allParams.telephonefax = allParams.telephonefax || "";
        allParams.departmentid = allParams.departmentid || "";

        allParams.alipayaccount = allParams.alipayaccount || "";
        allParams.weichataccount = allParams.weichataccount || "";
        allParams.categorylist = allParams.categorylist || "其它";
        allParams.servicetelephone = allParams.servicetelephone || "";
        allParams.store_banner_pic = allParams.store_banner_pic || "";
        allParams.store_banner_pic_phone = allParams.store_banner_pic_phone || "";

        var newPassword = allParams.password1;
        var verPassword = allParams.password2;
        if (!_.isEqual(newPassword,verPassword)) {
            return res.json({
                data: [],
                code: 400,
                msg:"两次密码输入不一样,请重新输入."
            });
        }

        var useralias = allParams.useralias;
        var usermobile = allParams.usermobile;
        var mobileCode =  allParams.mobileCode;

        this.validSeverSmsCode(req, res,usermobile, mobileCode, function (msgData) {
            if (msgData.code === 0) {
                doRegister(allParams);
            } else {
                return res.json(msgData);
            }
        });

        function doRegister(msg) {
            var queryAccountsellerSql = { or: [{'usermobile': usermobile}, {'useralias': useralias}] };
            Accountseller.find(queryAccountsellerSql).exec(function (err, list) {
                if (err) return;
                if (list.length) {
                    for(var i = 0;i<list.length;i++) {
                        if (list[i].useralias === useralias) {
                            return res.json({
                                data: [],
                                code: 400,
                                msg: "该商户名称已经注册过了"
                            });
                        }
                        if (list[i].usermobile === usermobile) {
                            return res.json({
                                data: [],
                                code: 400,
                                msg: "该商户号码已经注册过了"
                            });
                        }
                    }
                } else {

                    msg.password1 = "e10adc3949ba59abbe56e057f20f883e";
                    msg.password2 = "e10adc3949ba59abbe56e057f20f883e";
                    Accountseller.create(msg).exec(function userRegister(err, recond) {
                        if (err) return;
                        console.log('cb_tag1: The result of this \' create \' is shown came out. check it out: ok');

                        recond = recond || {};
                        var storeid = recond.id;
                        utility.mSellerlist[storeid] = allParams.nickname;

                        var tb_M_Name = gcom.getMysqlTable(TAB_M_GOODS, storeid);

                        //创建表格
                        var createMGoodsSql = 'create table ' + tb_M_Name + ' like mergoodsprototype';
                        console.log('createMGoodsSql. check it out: ', createMGoodsSql);
                        Creator.query(createMGoodsSql, function (err, r) {
                            if (err) return;
                            console.log('cb_tag2: The result of this \' query \' is shown came out. check it out: ok');
                        });

                        //创建表格
                        var createMMailSql = 'create table mail' + storeid + ' like mailprototype';
                        console.log('createMMailSql. check it out: ', createMMailSql);
                        Mailprototype.query(createMMailSql, function (err, r) {
                            if (err) return;
                            console.log('cb_tag3: The result of this \' query \' is shown came out. check it out: ok');
                        });

                        //创建表格
                        var createMMerrateorderSql = 'create table merrateorder' + storeid + ' like rateorder';
                        console.log('createMMerrateorderSql. check it out: ', createMMerrateorderSql);
                        Rateorder.query(createMMerrateorderSql, function (err, r) {
                            if (err) return;
                            console.log('cb_tag4: The result of this create  is shown came out. check it out: ok');
                        });

                        Passwords.encryptPassword({
                            password: newPassword,
                            difficulty: 10,
                        }).exec({
                            error: function (err) {
                                return res.negotiate(err);
                            },
                            success: function (encryptpassword) {

                                var querySysSettingSql = { key: "merchantDefaultPermission" };
                                console.log('querySysSettingSql. check it out: ',querySysSettingSql);
                                SystemSetting.findOne(querySysSettingSql).exec(function (err, r) {
                                    if (err) return;
                                    console.log('cb_tag5: The result of this create  is shown came out. check it out: ok');

                                    //构造消息
                                    var groupObj = {};
                                    groupObj.hid = 0;
                                    groupObj.addid = 1;
                                    groupObj.storeid = storeid;
                                    groupObj.parentid = 0;
                                    groupObj.name = "管理员";
                                    groupObj.permission = r.value;

                                    //console.log('groupObj: check it out. ',groupObj);
                                    Departmentgroup.create(groupObj).exec(function (err, r) {
                                        if (err) return;

                                        //构造消息
                                        var adminUserObj = {};
                                        adminUserObj.hid = '';
                                        adminUserObj.isAdmin = 1;
                                        adminUserObj.parentid = 0;
                                        adminUserObj.isdelete = false;
                                        adminUserObj.storeid = storeid;
                                        adminUserObj.groupid = r.id;
                                        adminUserObj.mobile = usermobile;
                                        adminUserObj.username = useralias+"@"+useralias;
                                        adminUserObj.password = encryptpassword;

                                        //console.log('adminUserObj: check it out. ',adminUserObj);
                                        Adminuser.create(adminUserObj).exec(function (err, r) {
                                            if (err) return;
                                            console.log('cb_tag6: The result of this \' create \' is shown came out. check it out: ok');
                                            req.session.mine = r;
                                            return res.json({
                                                code: 200,
                                                msg: "注册成功"
                                            });
                                        });
                                    });
                                });
                            }
                        });
                    });
                }
            });
        }
    },
    validSeverSmsCode: function (req, res, userMobile, mobileCode, callback) {
        SmsService.validSmsCode(res,userMobile,mobileCode,function (err, server) {
            if (err) return res.negotiate(err);
            var serverData = JSON.parse(server);
            if (callback) {
                callback(serverData);
            } else {
                return res.json(serverData);
            }

        });
    },


    updateMerchants: function (req, res) {

        console.log('updateMerchants: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var storeid = mine.storeid;

        /**
        *
        *   d为1时添加新类别，为0时添加默认类别，
        *   namearr表示要添加的类别名称。
        */
        var categorylistObj = allParams.categorylistArry || {};
        var listItem = categorylistObj.namearr || [];
        var categoryid =  categorylistObj.id || 0;
        var categoryname =  listItem[0] ? listItem[0] + "类别" : "";
        var industry = categoryname || "";

        if (categoryid&&listItem.length) {

            //构造消息
            var MercategoryObj = {};
            MercategoryObj.hid = '';
            MercategoryObj.status = 0;
            MercategoryObj.parentid = 0;
            MercategoryObj.sortorder = 0;
            MercategoryObj.ischannel = 0;
            MercategoryObj.storeid = storeid;
            MercategoryObj.description = categoryname;
            MercategoryObj.categoryname = categoryname;

            Mercategory.create(MercategoryObj).exec(function (err, recond) {
                if (err) return;
                console.log("cb_tag2: The result of this create is shown came out. check it out: ok");

                recond = recond || {};
                var rid = recond.id || 0;
                var hid = recond.hid || "";
                recond.hid = gcom.hashToString([0, rid]);

                recond.save(function (err) {
                    if (err) return;
                    console.log("save_tag2: This saved successfully. ",recond.hid);
                });
            });
        }

        var updateObj = {};
        updateObj.id = allParams.id;
        updateObj.id = allParams.sex;
        updateObj.city = allParams.city;
        updateObj.area = allParams.area;
        updateObj.address = allParams.address;
        updateObj.userpic = allParams.userpic;
        updateObj.id_card = allParams.id_card;

        updateObj.nickname = allParams.nickname;
        updateObj.realname = allParams.realname;
        updateObj.province = allParams.province;
        updateObj.contacts = allParams.contacts;
        updateObj.industry = allParams.industry;

        updateObj.userbqlid = allParams.userbqlid;
        updateObj.telephone = allParams.telephone;
        updateObj.useralias = allParams.useralias;
        updateObj.useremail = allParams.useremail;
        updateObj.password1 = "e10adc3949ba59abbe56e057f20f883e";//allParams.password1;
        updateObj.password2 = "e10adc3949ba59abbe56e057f20f883e";//allParams.password2;

        updateObj.usermobile = allParams.usermobile;
        updateObj.straddress = allParams.straddress;
        updateObj.operatorno = allParams.operatorno;

        // updateObj.statuscode = allParams.statuscode;
        updateObj.statuscode = 2;
        updateObj.license_pic = allParams.license_pic;
        updateObj.legalperson = allParams.legalperson;
        updateObj.companyname = allParams.companyname;

        updateObj.mobileCode = allParams.mobileCode;
        updateObj.mainbusiness = allParams.mainbusiness;
        updateObj.telephonefax = allParams.telephonefax;
        updateObj.departmentid = allParams.departmentid;

        updateObj.alipayaccoun = allParams.alipayaccount;
        updateObj.weichataccount = allParams.weichataccount;
        updateObj.categorylist = allParams.categorylist;
        updateObj.servicetelephone = allParams.servicetelephone;
        updateObj.store_banner_pic = allParams.store_banner_pic;
        updateObj.store_banner_pic_phone = allParams.store_banner_pic_phone;
        updateObj.store_show_pic = allParams.store_show_pic;
        updateObj.industry = industry;

        for(var key in updateObj) {
            var obj = {};
            obj.key = key;
            obj.val = updateObj[key];
            if (gcom.isForbidden(obj)) {
                delete updateObj[key];
            }
        }
		//update Adminuser login
		/* var useralias = updateObj.useralias;
        var usermobile = updateObj.usermobile;
        var newPassword = updateObj.password1;

        Passwords.encryptPassword({
            password: newPassword,
            difficulty: 10,
        }).exec({
            error: function (err) {
                return res.negotiate(err);
            },
            success: function (encryptpassword) {

                //构造消息
                var adminUserObj = {};
                adminUserObj.mobile = usermobile;
                adminUserObj.username = useralias+"@"+useralias;
                adminUserObj.password = encryptpassword;

                //console.log('adminUserObj: check it out. ',adminUserObj);
                Adminuser.update({usermobile:usermobile}).set(adminUserObj).exec(function (err, r) {
                    if (err) return;
                    console.log('cb_tag6: The result of this \' create \' is shown came out. check it out: ok');
                    req.session.mine = r;
                });
            }
        }); */

        Accountseller.update({usermobile:updateObj.usermobile}).set(updateObj).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag2: The result of this \' update \' is shown came out. check it out: ok');

            recond = recond || {};
            for(var i = 0; i<recond.length; i++) {
                delete recond[i].userbqlid;
                delete recond[i].password1;
                delete recond[i].password2;
                delete recond[i].createdAt;
                delete recond[i].updatedAt;
                delete recond[i].sex;
                delete recond[i].birthday;
                delete recond[i].departmentid;
                delete recond[i].unfreeztime;
                delete recond[i].isopenship;
                delete recond[i].alipayaccount;
                delete recond[i].weichataccount;
                delete recond[i].contacts;
                delete recond[i].shiplist;
                delete recond[i].shiprequest; 
            }
            

            utility.mSellerlist[storeid] = updateObj.nickname;
            return res.json({
                data: recond,
                code: 200
            });
        });
    },

    horizontalAlliancesList: function (req, res) {

        console.log('horizontalAlliancesList: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var meid = mine.storeid;
        var isopenship = allParams.isopenship;

        console.log('storeid. check it out: ', meid);
        console.log('isopenship. check it out. ', isopenship);

        var self = this;
        var NULL_DATA = -1;
        var ZERO_ARRAY = 0;
        var INFO_ARRAY = 1;
        switch(isopenship) {
            case ZERO_ARRAY:
                return self.horizontalAlliancesStop(req,res);
            case NULL_DATA:
                return self.horizontalAlliancesData(req,res);
            case INFO_ARRAY:
                return self.horizontalAlliancesData(req,res);
            default:
                console.log('err: isopenship ',isopenship);
        }
    },


    horizontalAlliancesStop: function(req, res) {

        console.log('horizontalAlliancesStop: This is the function entry.');

        var mine = req.session.mine;
        var allParams = req.allParams();

        var meid = mine.storeid;
        var isopenship = allParams.isopenship;

        Accountseller.findOne({id: meid}).exec(function(err, selfObj) {
            if (err) return;
            console.log('cb_tag1: The result of this findOne is shown came out. check it out: ok');

            //已经成功建立异业联盟的商户
            var _shiplist = selfObj.shiplist || "";
            //自己已经请求异业联盟的商户
            var _shiprequest = selfObj.shiprequest || "";
            //暂未向其请求异业联盟的商户
            var _me_category = selfObj.me_category || "";

            var _shiplistArray = _shiplist.split(':');
            var _shiprequestArray = _shiprequest.split(':');
            var _me_categoryArray = _me_category.split(':');

            _shiplistArray.remove("");
            _shiprequestArray.remove("");
            _me_categoryArray.remove("");

            //关闭异业联盟
            selfObj.isopenship = 0;
            //已经成功建立异业联盟的商户
            selfObj.shiplist = "";
            //自己已经请求异业联盟的商户
            selfObj.shiprequest = "";
            //暂未向其请求异业联盟的商户
            selfObj.me_category = "";

            selfObj.save(function (err) {
                if (err) return;
                console.log("save_tag1: This saved successfully. ");
            });


            async.parallel({

                a: function(cb) { 

                    var len = _shiplistArray.length;
                    console.log('_shiplistArray. ', len);
                    async.times(len, function(n, next) {

                        var id = _shiplistArray[n];
                        console.log('id. ', id);
                        Accountseller.findOne({id: id}).exec(function(err, meObj) {
                            if (err) return;
                            console.log('cb_tag2: The result of this findOne is shown came out. check it out: ok');

                            //临时变量
                            var i,j;

                            //已经成功建立异业联盟的商户
                            var _shiplist = meObj.shiplist || "";
                            //自己已经请求异业联盟的商户
                            //var _shiprequest = meObj.shiprequest || "";
                            //暂未向其请求异业联盟的商户
                            //var _me_category = meObj.me_category || "";

                            var _shiplistArray = _shiplist.split(':');
                            //var _shiprequestArray = _shiprequest.split(':');
                            //var _me_categoryArray = _me_category.split(':');

                            _shiplistArray.remove("");
                            //_shiprequestArray.remove("");
                            //_me_categoryArray.remove("");

                            console.log('_shiplistArray. ', _shiplistArray);
                            //console.log('_shiprequestArray. ', _shiprequestArray);
                            //console.log('_me_categoryArray. ', _me_categoryArray);

                            //初始申请
                            var _storeid = meObj.id;
                            console.log('_storeid. check it out. ', _storeid);

                            _shiplistArray.remove(meid.toString());

                            shipstatus = 0;
                            shiplist = _shiplistArray.join(":");

                            console.log('shiplist. ', shiplist);
                            console.log('shipstatus. ', shipstatus);

                            meObj.shiplist = shiplist;
                            meObj.shipstatus = shipstatus;

                            meObj.save(function (err) {
                                if (err) return;
                                console.log("save_tag2: This saved successfully. ");
                                next(err,n);
                            });
                        });

                    }, function(err, r) {
                        cb(err,r);
                    });
                },
                b: function(cb) {

                    var len = _shiprequestArray.length;
                    console.log('_shiprequestArray. ', len);
                    async.times(len, function(n, next) {

                        var id = _shiprequestArray[n];
                        console.log('id. ', id);
                        Accountseller.findOne({id: id}).exec(function(err, meObj) {
                            if (err) return;
                            console.log('cb_tag3: The result of this findOne is shown came out. check it out: ok');

                            //临时变量
                            var i,j;

                            //已经成功建立异业联盟的商户
                            //var _shiplist = meObj.shiplist || "";
                            //自己已经请求异业联盟的商户
                            var _shiprequest = meObj.shiprequest || "";
                            //暂未向其请求异业联盟的商户
                            var _me_category = meObj.me_category || "";

                            //var _shiplistArray = _shiplist.split(':');
                            var _shiprequestArray = _shiprequest.split(':');
                            var _me_categoryArray = _me_category.split(':');

                            //_shiplistArray.remove("");
                            _shiprequestArray.remove("");
                            _me_categoryArray.remove("");

                            //console.log('_shiplistArray. ', _shiplistArray);
                            console.log('_shiprequestArray. ', _shiprequestArray);
                            console.log('_me_categoryArray. ', _me_categoryArray);

                            //初始申请
                            var _storeid = meObj.id;
                            console.log('_storeid. check it out. ', _storeid);

                            _shiprequestArray.remove(meid.toString());
                            _me_categoryArray.remove(meid.toString());

                            shipstatus = 0;
                            shiprequest = _shiprequestArray.join(":");
                            me_category = _me_categoryArray.join(":");

                            console.log('me_category. ', me_category);
                            console.log('shiprequest. ', shiprequest);
                            console.log('shipstatus. ', shipstatus);

                            meObj.me_category = me_category;
                            meObj.shiprequest = shiprequest;
                            meObj.shipstatus = shipstatus;

                            meObj.save(function (err) {
                                if (err) return;
                                console.log("save_tag3: This saved successfully. ");
                                next(err,n);
                            });
                        });

                    }, function(err, r) {
                        cb(err,r);
                    });
                },

            }, function (err, r) {

                var gd = ["id","nickname","useralias","industry","me_category","shiplist",
                "shipstatus","shipupdate","isopenship","shiprequest"]

                var queryAccountsellerSql = "select " + gd.join(',') + " from accountseller where statuscode = 1";
                console.log('queryAccountsellerSql. check it out. ', queryAccountsellerSql);
                Accountseller.query(queryAccountsellerSql, function (err, list) {
                    if (err) return;

                    console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);

                    var _shipupdateArray = {},_list = [];
                    var meObj,mineObj,sellerlist,i,j;
                    for(i = 0; i<list.length; i++) {
                        if (list[i].id === mine.storeid) {
                            meObj = utils.clone(list[i]);
                        }else{
                            sellerlist = sellerlist || [];
                            sellerlist.push(list[i]);
                        }

                        var _id = list[i].id;
                        _shipupdateArray[_id] = list[i].shipupdate;
                    }

                    var _list = sellerlist.slice();
                    //是否开启异业联盟标识
                    var _isopenship = meObj.isopenship || 0;
                    console.log('_isopenship. ', _isopenship);


                    //已经成功建立异业联盟的商户
                    var _shiplist = meObj.shiplist || "";
                    //自己已经请求异业联盟的商户
                    var _shiprequest = meObj.shiprequest || "";
                    //暂未向其请求异业联盟的商户
                    var _me_category = meObj.me_category || "";

                    var _shiplistArray = _shiplist.split(':');
                    var _shiprequestArray = _shiprequest.split(':');
                    var _me_categoryArray = _me_category.split(':');

                    _shiplistArray.remove("");
                    _shiprequestArray.remove("");
                    _me_categoryArray.remove("");

                    var shiplistArray =_shiplistArray.slice();
                    var shiprequestArray =_shiprequestArray.slice();
                    var me_categoryArray =_me_categoryArray.slice();

                    console.log('_shiplistArray. ', _shiplistArray);
                    console.log('_shiprequestArray. ', _shiprequestArray);
                    console.log('_me_categoryArray. ', _me_categoryArray);

                    updateShipstatus = function(list) {
                        for (i = 0; i < list.length; i++) {
                            list[i].shipstatus = 0;
                            list[i].shipupdate = '';
                            list[i].industry = list[i].industry || "其他"

                            var obj = list[i];
                            for (j = 0; j < shiprequestArray.length; j++) {

                                var _storeid = parseInt(obj.id);
                                var _otherid = parseInt(shiprequestArray[j]);

                                //已申请
                                if (_.isEqual(_storeid,_otherid)) {
                                    list[i].shipstatus = 1;
                                }
                            }

                            for (j = 0; j < me_categoryArray.length; j++) {

                                var _storeid = parseInt(obj.id);
                                var _otherid = parseInt(me_categoryArray[j]);

                                //已申请
                                if (_.isEqual(_storeid,_otherid)) {
                                    list[i].shipstatus = 2;
                                }
                            }

                            for (j = 0; j < shiplistArray.length; j++) {

                                var _storeid = parseInt(obj.id);
                                var _meid = parseInt(mine.storeid);
                                var _otherid = parseInt(shiplistArray[j]);

                                //已申请
                                if (_.isEqual(_storeid,_otherid)) {
                                    list[i].shipstatus = 3;
                                    if (!_.isEqual(_storeid,_meid)){
                                        var arr = _shipupdateArray
                                        list[i].shipupdate = arr[obj.id];
                                    }
                                }
                            }
                        }

                        return list;
                    }

                    sellerlist = updateShipstatus(sellerlist)
                    console.log('list: check it out: ', sellerlist.length);
                    return res.json({
                        data: sellerlist,
                        code: 200
                    });
                });
            });
        });

    },

    horizontalAlliancesData: function(req, res) {

       console.log('horizontalAlliancesData: This is the function entry.');

        var mine = req.session.mine;
        var allParams = req.allParams();

        var meid = mine.storeid;
        var isopenship = allParams.isopenship;

        console.log('storeid. check it out: ', meid);
        console.log('isopenship. check it out. ', isopenship);

        var gd = ["id","nickname","useralias","industry","me_category","shiplist",
        "shipstatus","shipupdate","isopenship","shiprequest"];

        var queryAccountsellerSql = "select " + gd.join(',') + " from accountseller where statuscode = 1";
        console.log('queryAccountsellerSql. check it out. ', queryAccountsellerSql);
        Accountseller.query(queryAccountsellerSql, function (err, list) {
            if (err) return;

            console.log('cb_tag1: The result of this query is shown came out. check it out: ', list.length);

            var _shipupdateArray = {},_list = [];
            var meObj,mineObj,sellerlist,i,j;
            for(i = 0; i<list.length; i++) {
                if (list[i].id === meid) {
                    meObj = utils.clone(list[i]);
                }else{
                    sellerlist = sellerlist || [];
                    sellerlist.push(list[i]);
                }

                var _id = list[i].id;
                _shipupdateArray[_id] = list[i].shipupdate;
            }

            console.log('dt. ',_shipupdateArray);

            var _list = sellerlist.slice();
            //是否开启异业联盟标识
            var _isopenship = meObj.isopenship || 0;
            console.log('_isopenship. ', _isopenship);


            //已经成功建立异业联盟的商户
            var _shiplist = meObj.shiplist || "";
            //自己已经请求异业联盟的商户
            var _shiprequest = meObj.shiprequest || "";
            //暂未向其请求异业联盟的商户
            var _me_category = meObj.me_category || "";

            var _shiplistArray = _shiplist.split(':');
            var _shiprequestArray = _shiprequest.split(':');
            var _me_categoryArray = _me_category.split(':');

            _shiplistArray.remove("");
            _shiprequestArray.remove("");
            _me_categoryArray.remove("");

            var shiplistArray =_shiplistArray.slice();
            var shiprequestArray =_shiprequestArray.slice();
            var me_categoryArray =_me_categoryArray.slice();

            console.log('_shiplistArray. ', _shiplistArray);
            console.log('_shiprequestArray. ', _shiprequestArray);
            console.log('_me_categoryArray. ', _me_categoryArray);


            var NULL_DATA = -1;
            var ZERO_ARRAY = 0;
            var INFO_ARRAY = 1;

            updateShipstatus = function(list) {
                for (i = 0; i < list.length; i++) {
                    list[i].shipstatus = 0;
                    list[i].shipupdate = '';

                    list[i].industry = list[i].industry || "其他"

                    var obj = list[i];
                    for (j = 0; j < shiprequestArray.length; j++) {

                        var _storeid = parseInt(obj.id);
                        var _otherid = parseInt(shiprequestArray[j]);

                        //已申请
                        if (_.isEqual(_storeid,_otherid)) {
                            list[i].shipstatus = 1;
                        }
                    }

                    for (j = 0; j < me_categoryArray.length; j++) {

                        var _storeid = parseInt(obj.id);
                        var _otherid = parseInt(me_categoryArray[j]);

                        //已申请
                        if (_.isEqual(_storeid,_otherid)) {
                            list[i].shipstatus = 2;
                        }
                    }

                    for (j = 0; j < shiplistArray.length; j++) {

                        var _storeid = parseInt(obj.id);
                        var _meid = parseInt(mine.storeid);
                        var _otherid = parseInt(shiplistArray[j]);

                        //已申请
                        if (_.isEqual(_storeid,_otherid)) {
                            list[i].shipstatus = 3;
                            if (!_.isEqual(_storeid,_meid)){
                                var arr = _shipupdateArray;
                                list[i].shipupdate = arr[obj.id];
                            }
                        }
                    }
                }

                return list;
            }

            switch(isopenship) {
                case ZERO_ARRAY:
                    _list = [];
                    break;
                case NULL_DATA:
                    _list = _isopenship === 1 ? updateShipstatus(_list) : [];
                    break;
                case INFO_ARRAY:
                    _list = _isopenship === 1 ? updateShipstatus(_list) : [];
                    break;
                default:
                    console.log('err: isopenship ',isopenship);
            }



            if (isopenship > -1) {
                var sKey = { id: meid };
                var uKey = { isopenship: isopenship };
                Accountseller.update(sKey).set(uKey).exec(function (err, recond) {
                    if (err) return;
                     console.log('cb_tag3: The result of this \' update \' is shown came out. check it out: ok');
                })
            }else{
                isopenship = _isopenship;
            }

            console.log('list: check it out: ', _list.length);
            return res.json({
                code: 200,
                data: {
                    list:_list,
                    isopenship:isopenship
                },
            });
        });
    },

    /**
     * 请求异业联盟
     *
     * @param  shipA                //异业联盟发起方 运营商id
     * @param  shipB                //异业联盟发起方 运营商id
     * @param  status               //0未申请   1已申请    2正常
     *
     * @return {}                   //返回结果集
     */
    sendHorizontalAlliances: function (req, res) {

        console.log('sendHorizontalAlliances: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var requestItem = [];
        var storeid = mine.storeid;
        var listItem = allParams.idArray;

        requestItem.push(storeid);
        for (var i = 0; i < listItem.length; i++) {
            allParams.meid = mine.id;
            requestItem.push(listItem[i]);
            allParams.storeid = mine.storeid;
            allParams.operatorno = listItem[i];
            m.notice.sendHorizontalAlliances(allParams);
        }

        var len = requestItem.length;
        console.log('requestItem. ', len);
        async.times(len, function(n, next) {

            var id = requestItem[n];
            console.log('id. ', id);
            Accountseller.findOne({id: id}).exec(function(err, meObj) {
                if (err) return;
                console.log('cb_tag1: The result of this findOne is shown came out. check it out: ok');

                //临时变量
                var i,j;

                //已经成功建立异业联盟的商户
                //var _shiplist = meObj.shiplist || "";
                //自己已经请求异业联盟的商户
                var _shiprequest = meObj.shiprequest || "";
                //暂未向其请求异业联盟的商户
                var _me_category = meObj.me_category || "";

                //var _shiplistArray = _shiplist.split(':');
                var _shiprequestArray = _shiprequest.split(':');
                var _me_categoryArray = _me_category.split(':');

                //_shiplistArray.remove("");
                _shiprequestArray.remove("");
                _me_categoryArray.remove("");

                //console.log('_shiplistArray. ', _shiplistArray);
                console.log('_shiprequestArray. ', _shiprequestArray);
                console.log('_me_categoryArray. ', _me_categoryArray);

                //初始申请
                var _storeid = meObj.id;
                console.log('_storeid. check it out. ', _storeid);
                if (!_shiprequestArray.length&&_.isEqual(_storeid,storeid)) {

                    var _requestArray,shiprequest;
                    _requestArray = requestItem.slice();

                    _requestArray.remove(storeid);
                    shiprequest  = _requestArray.join(":");
                    console.log('shiprequest_1. ', shiprequest);

                    meObj.shiprequest = shiprequest;
                }else{
                    if (_.isEqual(_storeid,storeid)) {

                        var _requestArray,shiprequest;
                        _requestArray = requestItem.slice();

                        for (i = 0; i < _shiprequestArray.length; i++) {
                            if (_requestArray.indexOf(_shiprequestArray[i]) ===-1) {
                                _requestArray.push(_shiprequestArray[i]);
                            }
                        }

                        _requestArray.remove(storeid);
                        shiprequest = _requestArray.join(":");
                        console.log('shiprequest_2. ', shiprequest);

                        meObj.shiprequest = shiprequest;
                    }
                }

                if (!_me_categoryArray.length&&!_.isEqual(_storeid,storeid)) {

                    var me_categoryArray,me_category;
                    me_categoryArray = _me_categoryArray.slice();

                    me_categoryArray.push(storeid.toString());
                    me_category  = me_categoryArray.join(":");
                    console.log('me_category_1. ', me_category);

                    meObj.me_category = me_category;
                }else{
                    if (!_.isEqual(_storeid,storeid)) {

                        var me_categoryArray = _me_categoryArray.slice(),me_category;
                        console.log('me_categoryArray: check it out: ', me_categoryArray);

                        if(me_categoryArray.indexOf(_storeid.toString()) ===-1) {
                            me_categoryArray.push(storeid.toString());
                        }

                        me_category  = me_categoryArray.join(":");
                        console.log('me_category_2. ', me_category);

                        meObj.me_category = me_category;
                    }
                }

                meObj.save(function (err) {
                    if (err) return;
                    console.log("save_tag1: This saved successfully. ");
                    next(null,n);
                });
            });
        }, function(err, r) {

            var gd = ["id","nickname","useralias","industry","me_category","shiplist",
            "shipstatus","shipupdate","isopenship","shiprequest"]

            var queryAccountsellerSql = "select " + gd.join(',') + " from accountseller where statuscode = 1";
            console.log('queryAccountsellerSql. check it out. ', queryAccountsellerSql);
            Accountseller.query(queryAccountsellerSql, function (err, list) {
                if (err) return;

                console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);

                var _shipupdateArray = {},_list = [];
                var meObj,mineObj,sellerlist,i,j;
                for(i = 0; i<list.length; i++) {
                    if (list[i].id === mine.storeid) {
                        meObj = utils.clone(list[i]);
                    }else{
                        sellerlist = sellerlist || [];
                        sellerlist.push(list[i]);
                    }

                    var _id = list[i].id;
                    _shipupdateArray[_id] = list[i].shipupdate;
                }

                var _list = sellerlist.slice();
                //是否开启异业联盟标识
                var _isopenship = meObj.isopenship || 0;
                console.log('_isopenship. ', _isopenship);


                //已经成功建立异业联盟的商户
                var _shiplist = meObj.shiplist || "";
                //自己已经请求异业联盟的商户
                var _shiprequest = meObj.shiprequest || "";
                //暂未向其请求异业联盟的商户
                var _me_category = meObj.me_category || "";

                var _shiplistArray = _shiplist.split(':');
                var _shiprequestArray = _shiprequest.split(':');
                var _me_categoryArray = _me_category.split(':');

                _shiplistArray.remove("");
                _shiprequestArray.remove("");
                _me_categoryArray.remove("");

                var shiplistArray =_shiplistArray.slice();
                var shiprequestArray =_shiprequestArray.slice();
                var me_categoryArray =_me_categoryArray.slice();

                console.log('_shiplistArray. ', _shiplistArray);
                console.log('_shiprequestArray. ', _shiprequestArray);
                console.log('_me_categoryArray. ', _me_categoryArray);

                updateShipstatus = function(list) {
                    for (i = 0; i < list.length; i++) {
                        list[i].shipstatus = 0;
                        list[i].shipupdate = '';
                        list[i].industry = list[i].industry || "其他"

                        var obj = list[i];
                        for (j = 0; j < shiprequestArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _otherid = parseInt(shiprequestArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 1;
                            }
                        }

                        for (j = 0; j < me_categoryArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _otherid = parseInt(me_categoryArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 2;
                            }
                        }

                        for (j = 0; j < shiplistArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _meid = parseInt(mine.storeid);
                            var _otherid = parseInt(shiplistArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 3;
                                if (!_.isEqual(_storeid,_meid)){
                                    var arr = _shipupdateArray
                                    list[i].shipupdate = arr[obj.id];
                                }
                            }
                        }
                    }

                    return list;
                }

                sellerlist = updateShipstatus(sellerlist)
                console.log('list: check it out: ', sellerlist.length);
                return res.json({
                    data: sellerlist,
                    code: 200
                });
            });

        });

    },

    /**
     * 异业联盟状态更新
     *
     * @param  id                   //索引 id
     * @param  shipA                //异业联盟发起方 运营商id
     * @param  shipB                //异业联盟发起方 运营商id
     * @param  status               //0未申请   1已申请    2正常
     *
     * @return {}                   //返回结果集
     */
    updateHorizontalAlliances: function (req, res) {

        console.log('updateHorizontalAlliances: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var meid = mine.storeid;
        var storeid = allParams.storeid;
        var isagree = allParams.isagree;

        var requestItem = [];
        requestItem.push(meid);
        requestItem.push(storeid);


        async.times(requestItem.length, function(n, next) {

            var id = requestItem[n];
            console.log('id. ', id);

            Accountseller.findOne({id: id}).exec(function(err, meObj) {
                if (err) return;
                console.log('cb_tag1: The result of this findOne is shown came out. check it out: ok');

                //临时变量
                var i,j;

                //已经成功建立异业联盟的商户
                var _shiplist = meObj.shiplist || "";
                //自己已经请求异业联盟的商户
                var _shiprequest = meObj.shiprequest || "";
                //暂未向其请求异业联盟的商户
                var _me_category = meObj.me_category || "";

                var _shiplistArray = _shiplist.split(':');
                var _shiprequestArray = _shiprequest.split(':');
                var _me_categoryArray = _me_category.split(':');

                _shiplistArray.remove("");
                _shiprequestArray.remove("");
                _me_categoryArray.remove("");

                //console.log('_shiplistArray. ', _shiplistArray);
                console.log('_shiprequestArray. ', _shiprequestArray);
                console.log('_me_categoryArray. ', _me_categoryArray);

                //初始申请
                var _storeid = meObj.id;
                console.log('_storeid. check it out. ', _storeid);

                if (isagree) {

                    //处理自己(操作)
                    if(_.isEqual(_storeid,meid)) {

                            var requestArray,shiplist;
                            requestArray = requestItem.slice();
                            requestArray.remove(meid);

                            var id = requestArray[0];
                            if (_shiplistArray.indexOf(id.toString()) === -1) {
                                _shiplistArray.push(id.toString());
                            }

                            shiplist = _shiplistArray.join(":");
                            console.log('true is shiplist_1. ', shiplist);

                            var me_category;
                            _me_categoryArray.remove(id.toString());

                            me_category = _me_categoryArray.join(":");
                            console.log('true is me_category_1. ', me_category);

                            var shipstatus,shipupdate;
                            shipstatus = 1;
                            shipupdate = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");

                            meObj.shiplist = shiplist;
                            meObj.me_category = me_category;
                            meObj.shipstatus = shipstatus;
                            meObj.shipupdate = shipupdate;

                    }else{

                        var requestArray,shiprequest;
                        requestArray = requestItem.slice();
                        requestArray.remove(_storeid);

                        var id = requestArray[0];
                        _shiprequestArray.remove(id.toString());

                        shiprequest = _shiprequestArray.join(":");
                        console.log('true is shiprequest_1. ', shiprequest);

                        if (_shiplistArray.indexOf(id.toString()) === -1) {
                            _shiplistArray.push(id.toString());
                        }

                        var shiplist;
                        shiplist = _shiplistArray.join(":");
                        console.log('true is shiplist_2. ', shiplist);

                        var shipstatus,shipupdate;
                        shipstatus = 1;
                        shipupdate = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");

                        meObj.shiplist = shiplist;
                        meObj.shipstatus = shipstatus;
                        meObj.shipupdate = shipupdate;
                        meObj.shiprequest = shiprequest;
                    }

                }else{

                    //处理自己(操作)
                    if(_.isEqual(_storeid,meid)) {

                        var requestArray,shiprequest;
                        requestArray = requestItem.slice();
                        requestArray.remove(_storeid);

                        var id = requestArray[0];
                        _shiprequestArray.remove(id.toString());

                        shiprequest = _shiprequestArray.join(":");
                        console.log('false is shiprequest_2. ', shiprequest);

                        meObj.shiprequest = shiprequest;

                    }else{

                       var me_category,requestArray;
                       requestArray = requestItem.slice();
                       requestArray.remove(_storeid);

                       var id = requestArray[0];
                       _me_categoryArray.remove(id.toString());

                       var me_category;
                       me_category = _me_categoryArray.join(":");

                       console.log('false is me_category_2. ', me_category);

                       meObj.me_category = me_category;
                    }
                }

                meObj.save(function (err) {
                    if (err) return;
                    console.log("save_tag1: This saved successfully. ");
                    next(null,n);
                });
            });

        }, function(err, users) {

            var gd = ["id","nickname","useralias","industry","me_category","shiplist",
            "shipstatus","shipupdate","isopenship","shiprequest"]

            var queryAccountsellerSql = "select " + gd.join(',') + " from accountseller where statuscode = 1";
            console.log('queryAccountsellerSql. check it out. ', queryAccountsellerSql);
            Accountseller.query(queryAccountsellerSql, function (err, list) {
                if (err) return;

                console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);

                var _shipupdateArray = {},_list = [];
                var meObj,mineObj,sellerlist,i,j;
                for(i = 0; i<list.length; i++) {
                    if (list[i].id === mine.storeid) {
                        meObj = utils.clone(list[i]);
                    }else{
                        sellerlist = sellerlist || [];
                        sellerlist.push(list[i]);
                    }

                    var _id = list[i].id;
                    _shipupdateArray[_id] = list[i].shipupdate;
                }

                var _list = sellerlist.slice();
                //是否开启异业联盟标识
                var _isopenship = meObj.isopenship || 0;
                console.log('_isopenship. ', _isopenship);


                //已经成功建立异业联盟的商户
                var _shiplist = meObj.shiplist || "";
                //自己已经请求异业联盟的商户
                var _shiprequest = meObj.shiprequest || "";
                //暂未向其请求异业联盟的商户
                var _me_category = meObj.me_category || "";

                var _shiplistArray = _shiplist.split(':');
                var _shiprequestArray = _shiprequest.split(':');
                var _me_categoryArray = _me_category.split(':');

                _shiplistArray.remove("");
                _shiprequestArray.remove("");
                _me_categoryArray.remove("");

                var shiplistArray =_shiplistArray.slice();
                var shiprequestArray =_shiprequestArray.slice();
                var me_categoryArray =_me_categoryArray.slice();

                console.log('_shiplistArray. ', _shiplistArray);
                console.log('_shiprequestArray. ', _shiprequestArray);
                console.log('_me_categoryArray. ', _me_categoryArray);

                updateShipstatus = function(list) {
                    for (i = 0; i < list.length; i++) {
                        list[i].shipstatus = 0;
                        list[i].shipupdate = '';
                        list[i].industry = list[i].industry || "其他"

                        var obj = list[i];
                        for (j = 0; j < shiprequestArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _otherid = parseInt(shiprequestArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 1;
                            }
                        }

                        for (j = 0; j < me_categoryArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _otherid = parseInt(me_categoryArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 2;
                            }
                        }

                        for (j = 0; j < shiplistArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _meid = parseInt(mine.storeid);
                            var _otherid = parseInt(shiplistArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 3;
                                if (!_.isEqual(_storeid,_meid)){
                                    var arr = _shipupdateArray
                                    list[i].shipupdate = arr[obj.id];
                                }
                            }
                        }
                    }

                    return list;
                }

                sellerlist = updateShipstatus(sellerlist)
                console.log('list: check it out: ', sellerlist.length);
                return res.json({
                    data: sellerlist,
                    code: 200
                });
            });
        });
    },
    /*
     * 撤销异业联盟
     *
     * @param  storeid               //运营商 ID
     */
    cancleHorizontalAlliances: function (req, res) {

        console.log('cancleHorizontalAlliances: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var meid = mine.storeid;
        var storeid = allParams.storeid;

        var requestItem = [];
        requestItem.push(meid);
        requestItem.push(storeid);

        async.times(requestItem.length, function(n, next) {

            var id = requestItem[n];
            console.log('id. ', id);

            Accountseller.findOne({id: id}).exec(function (err, meObj) {
                if(err) return;
                console.log('cb_tag1: The result of this findOne is shown came out. check it out: ok');

                //临时变量
                var i,j;

                //已经成功建立异业联盟的商户
                var _shiplist = meObj.shiplist || "";
                //自己已经请求异业联盟的商户
                //var _shiprequest = meObj.shiprequest || "";
                //暂未向其请求异业联盟的商户
                //var _me_category = meObj.me_category || "";

                var _shiplistArray = _shiplist.split(':');
                //var _shiprequestArray = _shiprequest.split(':');
                //var _me_categoryArray = _me_category.split(':');

                _shiplistArray.remove("");
                //_shiprequestArray.remove("");
                //_me_categoryArray.remove("");

                console.log('_shiplistArray. ', _shiplistArray);
                //console.log('_shiprequestArray. ', _shiprequestArray);
                //console.log('_me_categoryArray. ', _me_categoryArray);

                //初始申请
                var _storeid = meObj.id;
                console.log('_storeid. check it out. ', _storeid);

                if (_.isEqual(_storeid,meid)) {

                    var requestArray,shiplist,shipstatus;
                    requestArray = requestItem.slice();
                    requestArray.remove(meid);

                    var id = requestArray[0];
                    _shiplistArray.remove(id.toString());

                    shipstatus = 0;
                    shiplist = _shiplistArray.join(":");

                    console.log('shiplist. ', shiplist);
                    console.log('shipstatus. ', shipstatus);

                    meObj.shiplist = shiplist;
                    meObj.shipstatus = shipstatus;

                }else{

                    var requestArray,shiplist,shipstatus;
                    requestArray = requestItem.slice();
                    requestArray.remove(_storeid);

                    var id = requestArray[0];
                    _shiplistArray.remove(id.toString());

                    shipstatus = 0;
                    shiplist = _shiplistArray.join(":");

                    console.log('shiplist. ', shiplist);
                    console.log('shipstatus. ', shipstatus);

                    meObj.shiplist = shiplist;
                    meObj.shipstatus = shipstatus;
                }

                meObj.save(function (err) {
                    if (err) return;
                    console.log("save_tag1: This saved successfully. ");
                    next(null,n);
                });
            });

        }, function(err, r) {

            var gd = ["id","nickname","useralias","industry","me_category","shiplist",
            "shipstatus","shipupdate","isopenship","shiprequest"]

            var queryAccountsellerSql = "select " + gd.join(',') + " from accountseller where statuscode = 1";
            console.log('queryAccountsellerSql. check it out. ', queryAccountsellerSql);
            Accountseller.query(queryAccountsellerSql, function (err, list) {
                if (err) return;
                console.log('cb_tag2: The result of this query is shown came out. check it out: ', list.length);

                var _shipupdateArray = {},_list = [];
                var meObj,mineObj,sellerlist,i,j;
                for(i = 0; i<list.length; i++) {
                    if (list[i].id === mine.storeid) {
                        meObj = utils.clone(list[i]);
                    }else{
                        sellerlist = sellerlist || [];
                        sellerlist.push(list[i]);
                    }

                    var _id = list[i].id;
                    _shipupdateArray[_id] = list[i].shipupdate;
                }

                var _list = sellerlist.slice();
                //是否开启异业联盟标识
                var _isopenship = meObj.isopenship || 0;
                console.log('_isopenship. ', _isopenship);


                //已经成功建立异业联盟的商户
                var _shiplist = meObj.shiplist || "";
                //自己已经请求异业联盟的商户
                var _shiprequest = meObj.shiprequest || "";
                //暂未向其请求异业联盟的商户
                var _me_category = meObj.me_category || "";

                var _shiplistArray = _shiplist.split(':');
                var _shiprequestArray = _shiprequest.split(':');
                var _me_categoryArray = _me_category.split(':');

                _shiplistArray.remove("");
                _shiprequestArray.remove("");
                _me_categoryArray.remove("");

                var shiplistArray =_shiplistArray.slice();
                var shiprequestArray =_shiprequestArray.slice();
                var me_categoryArray =_me_categoryArray.slice();

                console.log('_shiplistArray. ', _shiplistArray);
                console.log('_shiprequestArray. ', _shiprequestArray);
                console.log('_me_categoryArray. ', _me_categoryArray);

                updateShipstatus = function(list) {
                    for (i = 0; i < list.length; i++) {
                        list[i].shipstatus = 0;
                        list[i].shipupdate = '';
                        list[i].industry = list[i].industry || "其他"

                        var obj = list[i];
                        for (j = 0; j < shiprequestArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _otherid = parseInt(shiprequestArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 1;
                            }
                        }

                        for (j = 0; j < me_categoryArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _otherid = parseInt(me_categoryArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 2;
                            }
                        }

                        for (j = 0; j < shiplistArray.length; j++) {

                            var _storeid = parseInt(obj.id);
                            var _meid = parseInt(mine.storeid);
                            var _otherid = parseInt(shiplistArray[j]);

                            //已申请
                            if (_.isEqual(_storeid,_otherid)) {
                                list[i].shipstatus = 3;
                                if (!_.isEqual(_storeid,_meid)){
                                    var arr = _shipupdateArray
                                    list[i].shipupdate = arr[obj.id];
                                }
                            }
                        }
                    }

                    return list;
                }

                sellerlist = updateShipstatus(sellerlist)
                console.log('list: check it out: ', sellerlist.length);
                return res.json({
                    data: sellerlist,
                    code: 200
                });
            });
        });
    },

    /**
     * 管理员修改用户信息
     *
     * @param  id                 //索引id
     * @param  usermobile         //手机
     * @param  statuscode         //状态
     * @param  operatorno         //运营商编号
     *
     * @return {}                //返回结果集
     */
    adminUpdateStatus: function (req, res) {

        console.log('adminUpdateStatus: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var listItem = allParams.accountlist;
        var statuscode = allParams.statuscode;

        var cbCount = 0;
        for (var i = 0; i < listItem.length; i++) {
            var e = listItem[i];
            Account.update({id:id}).set({statuscode:statuscode}).exec(function (err, recond) {
                if (err) return;

                cbCount = cbCount + 1;
                console.log('cb_tag1: The result of this \' update \' is shown came out. check it out: ');

                if (cbCount == listItem.length) {
                    return res.json({
                        data: [],
                        code: 200,
                        msg:"操作成功",
                    });
                }

            });
        };
    },

    /**
     * 管理员修改商户信息
     *
     * @param  id                 //索引id
     * @param  statuscode         //状态
     *
     * @return {}                //返回结果集
     */
    adminSellerStatus: function (req, res) {

        console.log('adminSellerStatus: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var listItem = allParams.accountlist;
        var statuscode = allParams.statuscode;

        var cbCount = 0;
        for (var i = 0; i < listItem.length; i++) {
            var e = listItem[i];
            Accountseller.update({id:id}).set({statuscode:statuscode}).exec(function (err, recond) {
                if (err) return;

                cbCount = cbCount + 1;
                console.log('cb_tag1: The result of this \' update \' is shown came out. check it out: ');

                if (cbCount == listItem.length) {
                    return res.json({
                        data: [],
                        code: 200,
                        msg:"操作成功",
                    });
                }

            });
        };
    },

    /**
     * 管理员确认编辑完成
     *
     *
     * @return {}                //返回结果集
     */
    adminUpdateSure: function (req, res) {

        console.log('adminUpdateSure: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id || 0;
        var sex = allParams.sex || 0;
        var birthday = allParams.birthday || "";
        var consignee = allParams.consignee || "";
        var createdAt = allParams.createdAt || "";
        var operatorno = allParams.operatorno || "";
        var statuscode = allParams.statuscode || "";
        var usermobile = allParams.usermobile || "";

        Account.update({id:id}).set({
            sex:sex,
            birthday:birthday,
            consignee:consignee,
            createdAt:createdAt,
            operatorno:operatorno,
            statuscode:statuscode,
            usermobile:usermobile,
        }).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this \' update \' is shown came out. check it out: ');
            return res.json({
                data: [],
                code: 200,
                msg:"操作成功",
            });
        });
    },

    /**
     * 管理员编辑用户详情信息
     *
     *
     * @return {}                //返回结果集
     */
    adminAccountDetails: function (req, res) {

        console.log('adminAccountDetails: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();


        var id = allParams.id || 0;
        var sex = allParams.sex || 0;
        var city = allParams.city || "";
        var area = allParams.area || "";
        var address = allParams.address || "";
        var nickname = allParams.nickname || "";
        var province = allParams.province || "";
        var birthday = allParams.birthday || "";
        var operatorno = allParams.operatorno || "";
        var usermobile = allParams.usermobile || "";

        Account.update({id:id}).set({
            sex:sex,
            city:city,
            area:area,
            address:address,
            nickname:nickname,
            province:province,
            birthday:birthday,
            operatorno:operatorno,
            usermobile:usermobile,
        }).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this \' update \' is shown came out. check it out: ');
            return res.json({
                data: [],
                code: 200,
                msg:"操作成功",
            });
        });
    },

    /**
     * 管理员重置商户密码
     *
     *
     * @return {}                //返回结果集
     */
    adminSellerReset: function (req, res) {

        console.log('adminSellerReset: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;
        var usermobile = allParams.usermobile;

        SystemSetting.findOne({key: "defaultPassword"}).exec(function (err, recond) {
            if (err) return;

             //12345678
             var pwd = "25d55ad283aa400af464c76d713c07ad";

             recond = recond || {};
             var pwd = recond.value || 0;
             Passwords.encryptPassword({
                password: pwd,
                difficulty: 10,
            }).exec({

                error: function (err) {
                    return res.negotiate(err);
                },

                success: function (encryptedPassword) {
                    Adminuser.update({
                        mobile: usermobile,
                        storeid: id,
                        isAdmin: 1
                    }).set({password: encryptedPassword}).exec(function (err, r) {
                        if (err) return;
                        if (r.length > 0) {
                            return res.json({
                                data: 'success!',
                                code: 200
                            });
                        } else {
                            return res.json({
                                data: '修改失败',
                                code: 400
                            });
                        }
                    });
                }
            });
        });
    },

    /**
     * 管理员修改商户详情
     *
     *
     * @return {}                //返回结果集
     */
    adminUpdateSellerDetails: function (req, res) {
        console.log('adminUpdateSellerDetails: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        allParams.id = allParams.id || 0;
        allParams.sex = allParams.sex || 0;
        allParams.city = allParams.city || "";
        allParams.area = allParams.area || "";
        allParams.address = allParams.address || "";
        allParams.userpic = allParams.userpic || "";
        allParams.id_card = allParams.id_card || "";

        allParams.birthday = allParams.birthday || ""
        allParams.nickname = allParams.nickname || "";
        allParams.realname = allParams.realname || "";
        allParams.province = allParams.province || "";
        allParams.contacts = allParams.contacts || "";
        allParams.industry = allParams.industry || "";

        allParams.userbqlid = allParams.userbqlid || 0;

        allParams.telephone = allParams.telephone || "";
        allParams.useralias = allParams.useralias || "";
        allParams.useremail = allParams.useremail || "";
        allParams.password1 = allParams.password1 || "";
        allParams.password2 = allParams.password2 || "";

        allParams.usermobile = allParams.usermobile || "";
        allParams.straddress = allParams.straddress || "";
        allParams.operatorno = allParams.operatorno || "";

        allParams.statuscode = allParams.statuscode || 2;
        allParams.license_pi = allParams.license_pic || "";
        allParams.legalperson = allParams.legalperson || "";
        allParams.companyname = allParams.companyname || "";

        allParams.isopenship = allParams.isopenship || false;
        allParams.mobileCode = allParams.mobileCode || false;
        allParams.mainbusiness = allParams.mainbusiness || "";
        allParams.telephonefax = allParams.telephonefax || "";
        allParams.departmentid = allParams.departmentid || "";

        allParams.alipayaccoun = allParams.alipayaccount || "";
        allParams.weichataccount = allParams.weichataccount || "";
        allParams.categorylist = allParams.categorylist || "其它";
        allParams.store_show_pic = allParams.store_show_pic || "";
        allParams.servicetelephone = allParams.servicetelephone || "";
        allParams.store_banner_pic = allParams.store_banner_pic || "";
        allParams.store_banner_pic_phone = allParams.store_banner_pic_phone || "";

        updateObj = {
            sex: allParams.sex,
            city: allParams.city,
            area: allParams.area,
            address: allParams.address,
            userpic: allParams.userpic,
            id_card: allParams.id_card,
            birthday: allParams.birthday,
            nickname: allParams.nickname,
            realname: allParams.realname,
            province: allParams.province,
            contacts: allParams.contacts,
            industry: allParams.industry,
            userbqlid: allParams.userbqlid,
            telephone: allParams.telephone,
            useremail: allParams.useremail,
            usermobile: allParams.usermobile,
            straddress: allParams.straddress,
            operatorno: allParams.operatorno,
            statuscode: allParams.statuscode,
            license_pi: allParams.license_pic,
            legalperson: allParams.legalperson,
            companyname: allParams.companyname,
            isopenship: allParams.isopenship,
            mobileCode: allParams.mobileCode,
            mainbusiness: allParams.mainbusiness,
            telephonefax: allParams.telephonefax,
            departmentid: allParams.departmentid,
            store_show_pic: allParams.store_show_pic,
            store_banner_pic: allParams.store_banner_pic,
            store_banner_pic_phone: allParams.store_banner_pic_phone,
        };
        console.log('updateObj: check it out. ',updateObj);
        Accountseller.update({id:allParams.id}).set(updateObj).exec(function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this \' update \' is shown came out. check it out: ok');
            return res.json({
                data: [],
                code: 200,
                msg:"操作成功",
            });
        });
    },

    /**
     * 商户修改密码
     *
     *
     * @return {}                   //返回结果集
     */
    updateMerPassword: function (req, res) {


        console.log('updateMerPassword: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        /**
        *
        *   password0: 原始密码
        *   password1: 修改密码
        *   password2: 确认修改
        */

        var meid = mine.id;
        var srcPassword = allParams.password0;
        var newPassword = allParams.password1;
        var verPassword = allParams.password2;
        var usermobile = allParams.usermobile;

        if (!_.isEqual(newPassword,verPassword)) {
            return res.json({
                data:[],
                code:400,
                msg:"两次密码输入不一样",
            })
        }

        Adminuser.findOne({id: meid}, function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this \' update \' is shown came out. check it out: ok');
            if (!recond) {
                return res.json({
                    data:[],
                    code: 400,
                    msg: "您好，您还是不是管理组用户."
                });
            }

            recond = recond || {};
            var oldPassword = recond.password || "";
            Passwords.checkPassword({
                passwordAttempt: srcPassword,
                encryptedPassword: oldPassword,
            }).exec({

                error: function (err) {
                    return res.json({
                        code: 400,
                        msg: "Sorry,您的密码校验失败,请确认后重新操作."
                    });
                },

                success: function () {

                    Passwords.encryptPassword({
                        password: newPassword,
                        difficulty: 10,
                    }).exec({

                        error: function (err) {
                            return res.json({
                                code: 400,
                                msg: "Sorry,服务器加密失败,请联系管理员."
                            });
                        },

                        success: function (encryptedPassword) {
                            Adminuser.update({mobile: usermobile}).set({password: encryptedPassword}).exec(function (err, r) {
                                if (err) return;
                                console.log('cb_tag3: The result of this \' update \' is shown came out. check it out: ok');
                                return res.json({
                                    data: [],
                                    code: 200,
                                    msg: "操作成功",
                                });
                            });
                        }
                    });
                }
            });
        });
    },

    /**
     * 管理员删除商户
     *
     *
     * @return {}                   //返回结果集
     */
    delSellerId: function (req, res) {

        console.log('updateMerPassword: This is the function entry. check it out: ', req.allParams());

        var mine = req.session.mine;
        var allParams = req.allParams();

        var id = allParams.id;

        var queryAccountsellerSql = 'delete from accountseller where id = ' + id;
        console.log('queryAccountsellerSql: check it out: ', queryAccountsellerSql);
        Accountseller.query(queryAccountsellerSql, function (err, recond) {
            if (err) return;
            console.log('cb_tag1: The result of this delete is shown came out. check it out: ok');
        });

        var queryAdminUserSql = 'delete from adminuser where storeid = ' + id;
        console.log('queryAdminUserSql: check it out: ', queryAdminUserSql);
        Adminuser.query(queryAdminUserSql, function (err, recond) {
            if (err) return;
            console.log('cb_tag2: The result of this delete is shown came out. check it out: ok');
        });

        var queryDepartMentGroupSql = 'delete from departmentgroup where storeid = ' + id;
        console.log('queryDepartMentGroupSql: check it out: ', queryDepartMentGroupSql);
        Departmentgroup.query(queryDepartMentGroupSql, function (err, recond) {
            if (err) return;
            console.log('cb_tag3: The result of this delete is shown came out. check it out: ok');
        });


        return res.json({
            data: [],
            code: 200,
            msg:"操作成功",
        });
    },
};
