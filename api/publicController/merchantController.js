var mysql = require("sails-mysql");
var Passwords = require('machinepack-passwords');
var crypto = require("crypto");
var fs = require("fs");

module.exports = {
    goodsListView: function (req, res) {
        Goodscontent.find({}, function userCreated(err, goods) {
            if (err) {
                console.log("err: When this error is returned, the query fails.");
                return res.negotiate(err);
            }
            return res.view('goods/showgoods', {goods: goods});
        });

    },
    /**
     * 运营商登录
     * @param req
     * @param res
     */
    login: function (req, res) {
        if (req.method != "POST") {
            return res.json({
                "success": false,
                "code": 411,
                "msg": "操作失败，传入参数错误",
                "data": {}
            });
        }
        var loginType = req.param("loginType", 0);
        var userName = req.param("userName", false);
        var pwd = req.param("password", false);
        var verifyCode = req.param("verifyCode", false);
        console.log(loginType + "|" + userName + "|" + pwd);

        if (!userName || !pwd) {
            return res.json({
                "success": false,
                "code": 407,
                "msg": "参数解密错误，请检查传入参数",
                "data": {}
            });
        }
        if (loginType == 1 && !validator.isMobile(userName)) {
            return res.json({
                "success": false,
                "code": 400,
                "msg": "操作失败，无效的手机号码",
                "data": {}
            });
        }
        var conditions={};
        if (loginType == 1) {
            conditions = {mobile: userName};
        } else {
            conditions = {username: userName};
        }
        Adminuser.findOne(conditions).exec(function (err, account) {
            if (err) return res.negotiate(err);
            //console.log(account);
            if (account == undefined) {
                return res.json({
                    "success": false,
                    "code": 400,
                    "msg": "不存在的用户",
                    "data": {}
                });
            }

            Passwords.checkPassword({
                passwordAttempt: pwd,
                encryptedPassword: account.password,
            }).exec({
                error: function (err) {
                    return res.json({
                        "success": false,
                        "code": 400,
                        "msg": "登录失败，用户名密码错误",
                        "data": {}
                    });
                },
                success: function () {


                    if (account.storeid == 0) {//总后台
                        var system={
                             id:account.id,
                            'userId': account.id,
                            'userMobile': account.mobile,
                            'userAlias': account.username,
                            'storeid': account.storeid,
                            'nickname': account.nickname,
                            'groupid':account.groupid,
                            'avatar':account.avatar
                        };
                        getUserPermission(res,system);
                    } else {
                        Accountseller.findOne({id: account.storeid}).exec(function (err, seller) {
                            if (err) return res.serverError(err);
                            if (seller) {
                                //console.log(seller);
                                var delKeys=["userbqlid","password1","password2","createdAt","updatedAt","sex",
                                    "birthday", "departmentid",  "unfreeztime",   "isopenship",    "alipayaccount",
                                    "weichataccount","contacts", "shiplist", "shiprequest", ];
                                for(var key in delKeys){
                                       delete seller[key];
                                }

                                if (seller.statuscode == 3 || seller.statuscode == 2) {
                                    return res.json({
                                        "code": 411,
                                        "msg": "商户未审核通过",
                                        data: seller
                                    });
                                }
                                if (seller.statuscode == 4) {
                                    return res.json({
                                        "code": 412,
                                        "msg": "商户已停用",
                                        data: seller
                                    });
                                }
                                account.shop_name = seller.nickname;
                                account.logo = seller.store_show_pic;
                                var merchant={
                                     id:account.id,
                                    'userId': account.id,
                                    'userMobile': account.mobile,
                                    'userAlias': account.username,
                                    'storeid': account.storeid,
                                    'groupid':account.groupid,
                                    'nickname': account.nickname,
                                    'shop_name': seller.nickname,
                                    'logo':seller.store_show_pic,
                                    'store_show_pic': seller.store_show_pic,
                                    'store_banner_pic': seller.store_banner_pic,
                                    'avatar':account.avatar
                                };

                                getUserPermission(res,merchant);

                            } else {
                                return res.json({
                                    code: 400,
                                    msg: "用户所属的商铺不存在"
                                });
                            }
                        })
                    }

                }
            });

        });
        function sessionSetStore(req, account) {
            delete account.password;
            req.session.mine = account;
        }
        function getUserPermission(res,account) {
            Departmentgroup.findOne({id: account.groupid,storeid: account.storeid}).exec(function (err, record) {
                if (err)return res.negotiate(err);

                if (record) {
                    account.gname=record.name;
                    sessionSetStore(req, account);
                    account.per=record.permission;
                    return res.json({
                        code:200,
                        msg:"登录成功",
                        data:account
                    });
                 }else{
                    return res.json({
                        code:200,
                        msg:"登录成功",
                        data:account
                    });
                }
            });
        };
    },
    /**
     * 退出登录
     * @param req
     * @param res
     */
    logout: function (req, res) {
        delete req.session.mine;
        return res.json({
            code: 200,
            msg: "退出登录成功"
        });
    },
    /**
     * 运营商注册
     * @param req
     * @param res
     */
    registerOnesetup: function (req, res) {
        this.checkIsPost(req);
        var userMobile = req.param("userMobile", false);
        var userAlias = req.param("userAlias", false);
        var password = req.param("password", false);
        var mobileCode = req.param("mobileCode", false);
        if (!userAlias || !userMobile || !password || !mobileCode) {
            return res.json({
                "success": false,
                "code": 407,
                "msg": "参数解密错误，请检查传入参数",
                "data": {}
            });
        }
        if (!validator.isMobile(userMobile)) {
            return res.json({
                "success": false,
                "code": 408,
                "msg": "操作失败，无效的手机号码",
                "data": {}
            });
        }
        if (!req.session.mer_code || req.session.mer_code.code != mobileCode || req.session.mer_code.mobile != userMobile) {
            return res.json({
                "success": false,
                "code": 414,
                "msg": "验证码错误或已失效，请重新获取",
                "data": {}
            });
        }
        Adminuser.find({or: [{username: userAlias}, {mobile: userMobile}]}).exec(function (err, theUser) {
            if (err)return res.negotiate(err);
            if (theUser.length > 0) {
                return res.json({
                    "success": false,
                    "code": 400,
                    "msg": "商户已经存在",
                    "data": {}
                });
            } else {

                Passwords.encryptPassword({
                    password: password,
                    difficulty: 10,
                }).exec({
                    error: function (err) {
                        console.log("err:  When this error is returned, the encryption operation fails.");
                        return res.negotiate(err);
                    },
                    success: function (encryptpassword) {
                        accountseller = {
                            usermobile: userMobile,
                            useralias: userAlias,
                            nickname: "达令商户_" + utility.generateMixed(5, false)
                        };

                        Accountseller.create(accountseller).then(function (entries) {
                            Accountseller.query("START TRANSACTION;");
                            return entries;
                        }).then(function (entries) {
                            var admin = {
                                username: userAlias,
                                mobile: userMobile,
                                hid: 1,
                                parentid: 0,
                                password: encryptpassword,
                                storeid: entries.id,
                                isAdmin: 1
                            };
                            return Adminuser.create(admin);
                        }).then(function (entry) {
                            Accountseller.query("COMMIT;");
                            var token = utility.generateToken({
                                id: entry.storeid,
                                username: entry.username,
                                mobile: entry.mobile,
                            });
                            return res.json({
                                "success": true,
                                "code": 200,
                                "msg": "",
                                "data": {
                                    username: entry.username,
                                    mobile: entry.mobile,
                                    tokenId: token,
                                }
                            });
                        }).catch(function (e) {
                            Accountseller.query("ROLLBACK;");
                            return res.serverError(e.message);
                        });
                    }
                });
            }
        });
    },
    registerTwosetup: function (req, res) {
        this.checkIsPost(req);
        var companyname = req.param("companyname", false);
        var operatorno = req.param("operatorno", false);
        var legalperson = req.param("legalperson", false);
        var id_card = req.param("card", false);
        var tokenId = req.param("tokenId", false);
        if (!tokenId) {
            return res.json({
                "success": false,
                "code": 407,
                "msg": "参数解密错误，请检查传入参数",
                "data": {}
            });
        }
        var member = utility.decodeToken(tokenId);
        if (member) {
            Accountseller.update({id: member.id}, {
                operatorno: operatorno,
                companyname: companyname,
                legalperson: legalperson,
                id_card: id_card,
            }).exec(function (err, account) {
                if (err) return res.negotiate(err);
                if (account) {
                    return res.json({
                        "success": true,
                        "code": 0,
                        "msg": "操作成功",
                        "data": {
                            username: member.username,
                            mobile: member.mobile,
                            tokenId: tokenId,
                        }
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
    registerThreesetup: function (req, res) {
        this.checkIsPost(req);
        var vset = {};
        vset.displayName = req.param("displayName", false);
        vset.telephone = req.param("telephone", false);
        vset.industry = req.param("industry", false);
        vset.mainbusiness = req.param("mainbusiness", false);
        vset.telephonefax = req.param("telephonefax", false);
        vset.useremail = req.param("useremail", false);
        vset.province = req.param("province", false);
        vset.city = req.param("city", false);
        vset.area = req.param("area", false);
        vset.straddress = req.param("straddress", false);
        vset.legalperson = req.param("legalperson", false);
        vset.servicetelephone = req.param("servicetelephone", false);
        vset.store_banner_pic = req.param("store_banner_pic", false);
        vset.license_pic = req.param("license_pic", false);
        vset.store_show_pic = req.param("store_show_pic", false);
        vset.shop_logo = req.param("shop_logo", false);
        var tokenId = req.param("tokenId", false);

        if (!tokenId) {
            return res.json({
                "success": false,
                "code": 407,
                "msg": "参数解密错误，请检查传入参数",
                "data": {}
            });
        }
        var member = utility.decodeToken(tokenId);
        if (member) {
            Accountseller.update({id: member.id}, vset).exec(function (err, account) {
                if (err) return res.negotiate(err);
                if (account) {
                    return res.json({
                        "success": true,
                        "code": 0,
                        "msg": "操作成功",
                        "data": {
                            username: member.username,
                            mobile: member.mobile,
                            tokenId: tokenId,
                        }
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
     * 上传商户各种图片
     * @param req
     * @param res
     */
    uploadImage: function (req, res) {
        var tokenId = req.param("tokenId", false);
        var store = req.param("storeid", false);
        var filePath = sails.config.globals.uploadPath + "info/";
        var urlPath = sails.config.globals.ImageUrl + "info/";
        var storeid = false;

        if (!tokenId) {
            var member = utility.decodeToken(tokenId);
            var storeid = member.id;
        } else if ((mine = req.session.mine)) {
            if (store == mine.id) {
                storeid = mine.id;
            }
        }
        if (!storeid) {
            return res.json({
                "success": false,
                "code": 400,
                "msg": "操作失败",
                "data": {}
            });
        }

        if (storeid) {
            filePath += "store" + storeid + "/";
            urlPath += "store" + storeid + "/";
        }
        req.file("pic").upload({dirname: filePath}, function (err, uploadFiles) {
            if (err) return res.serverError(err);
            var files = [];
            if (uploadFiles.length > 0) {
                for (i in uploadFiles) {
                    var theFile = uploadFiles[i].fd;
                    if (theFile && theFile.length > 0) {
                        var filename = theFile.substring(theFile.lastIndexOf("/") + 1, theFile.length);

                        var file = {
                            url: urlPath + filename
                        };
                        files.push(file);
                    }
                }

                return res.json({
                    code: 200,
                    message: uploadFiles.length + ' file(s) uploaded successfully!',
                    data: files
                });
            } else {
                return res.json({
                    message: '上传文件失败',
                    code: 400
                });
            }

        });
    },
    /**
     * 商户后台入驻发送验证码
     * @param usermobile 手机号码
     * @param res
     */
    sendSmsCode: function (req, res) {
        console.log(req.ip,req.allParams());
        
        var code = utility.generateMixed(6, true);//随机验证码
        var validTime = 5;//有效时间
        var datas = new Array();
        datas.push(code);
        datas.push(validTime);
        console.log(datas);

        var userMobile = req.param('usermobile');
        if (!validator.isMobile(userMobile)){
            return res.json({
                statusCode:4002,
                statusMsg:'号码格式错误'
            });
        }

        //商户验证码发送
        SmsService.sendSms(function(err,serdata){
            if(err){console.log(err);return;}
            var data = JSON.parse(serdata);
            console.log('sendSmsCode ======> ',data);

            var statusCode = parseInt(data.statusCode);
            delete data.statusCode;
            if(statusCode == 0){
                // 验证码存储redis
                var myRedis = redis.client({db:7});
                var key = 'smscode:'+ userMobile;
                myRedis.set(key,code);
                //设置有效期
                myRedis.expire(key,5*60);

                data.code = 200;
            } else if(statusCode == 160040){
                data.code = 4000;
            } else {
                data.code = 4001;
            }

            return res.json(data);
        },userMobile,'170108',datas);
    },
    /**
     * 验证手机号是否已注册
     * @param usermobile 手机号码
     */
    validUser:function(req,res){
        console.log(req.ip,req.allParams());
        var userMobile = req.param('usermobile');
        if (!validator.isMobile(userMobile)){
            return res.json({
                code:402,
                msg:'号码格式错误'
            });
        }
        Accountseller.findOne({usermobile:userMobile}).exec(function(err,seller){
            if (err){console.log(err);return;}
            if(seller){
               return res.json({code:400,msg:'已注册'});
            }
            return res.json({code:200,msg:'未注册'});
        });
    },
    /**
     * 商户后台验证码有效性验证
     * @param usermobile 手机号码
     * @param mobilecode 验证码
     * @param res
     */
    validSms:function(){
        console.log(req.ip,req.allParams());
        var userMobile = req.param('usermobile');
        var mobileCode = req.param('mobilecode');
        if (!validator.isMobile(userMobile)){
            return res.json({
              code:4002,
              msg:'号码格式错误'
            });
        }

        SmsService.validSmsCode(req,userMobile,mobileCode,function(err,server){
            if (err) return res.negotiate(err);
            var serverData = JSON.parse(server);
            return res.json(serverData);
        });
    },
    checkIsPost: function (req, res) {
        if (req.method != "POST") {
            return res.json({
                "success": false,
                "code": 411,
                "msg": "操作失败，传入参数错误",
                "data": {}
            });
        }
    },
    /**
     * 商户详情
     * @param sku storeid 任传一个
     * @param req
     * @param res
     */
    detail: function (req, res) {
        var sku = req.param("sku", false);
        var storeid = req.param("storeid", false);
        if (sku) {
            var skuArray = sku.split("-");
            var storeid = skuArray[1];
            if (skuArray[2] == undefined) {
                return res.json({
                    code: 400,
                    msg: "sku不符合规范"
                });
            }
        }
        if (!storeid) {
            return res.json({
                code: 400,
                msg: "商铺id为传递"
            });
        }
        Accountseller.findOne({id: storeid, statuscode: 1}).exec(function (err, account) {
            if (err) return res.serverError(err);
            if (!account) {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
            var delArray = ["userbqlid", "usermobile", "realname", "password1", "password2", "userpic",
                "license_pic", "sex", "birthday", "departmentid", "province", "city", "area", "straddress", "address",
                "unfreeztime", "operatorno", "isopenship", "alipayaccount", "weichataccount", "telephonefax",
                "mainbusiness", "contacts", "legalperson", "shiplist", "statuscode", "createdAt", "updatedAt", "id_card"];


            if (account) {
                function delObj(account) {
                    var obj = {};
                    for (var propert in account) {
                        if (delArray.indexOf(propert)==-1) {
                            obj[propert] = account[propert];
                        }
                    }
                    return obj;
                }

                var user = account.toJSON();
                var merchant = delObj(user);
                return res.json({
                    code: 200,
                    data: merchant
                });
            }


        });
    },
    /**
     * 运营商默认密码设置
     *pwd 密码
     * @param req
     * @param res
     */
    defaultPwd: function (req, res) {
        var mine = req.session.mine;
        var storeid = mine.storeid;
        if (!storeid) {
            return res.json({
                code: 400,
                msg: "你没有权限"
            })
        }
        var set = {};
        var pwd1 = req.param("pwd1", 0);//第一个是普通用户默认密码,
        // var pwd2 = req.param("pwd2", 0);//第二个是管理人员默认密码
        // if(pwd2){
        //     var cmd5 = crypto.createHash("md5");
        //     var userDefaultPwd = cmd5.update(pwd2).digest("hex");
        //     set.password1=userDefaultPwd;
        // }
        if(pwd1){
            var cmd52 = crypto.createHash("md5");
            var adminPwd = cmd52.update(pwd1).digest("hex");
            set.password2=adminPwd;
        }



        Accountseller.update({id: storeid}, set).exec(function (err, record) {
            if (err) {
                // if (err) return res.serverError(err);
                return res.json({code: 400, msg: "设置失败"});
            }

            return res.json({
                code: 200,
                msg: "设置成功"
            });
        });
    },
    /**
     * 判断用户密码是否设置
     * @param req
     * @param res
     */
    getDefaultPwd:function (req,res) {
        
        var mine = req.session.mine;
        var storeid = mine.storeid;
       
        Accountseller.findOne({id: storeid}).exec(function (err,seller) {
            if(err) return res.negotiate(err);
            if(seller){
                return res.json({
                    code:200,
                    data:{
                        pwd1:seller.password1?true:false,
                        pwd2:seller.password2?true:false
                    }
                });
            }else{
                return res.json({
                    code:400,
                    msg:"没有数据"
                });
            }
        });
    },
    /**
     * 运营商状态修改
     * @param storeid int  店铺id 必须
     * @param status  int  状态[0=>审核失败,1审核成功] 必须
     * @param mark string 审核备注 非必须
     * @param req
     * @param res
     */
    examine: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        var storeid = req.param("storeid", false);
        var status = req.param("status", false);
        var mark = req.param("mark", false);
        if (!storeid) {
            return res.json({
                code: 400,
                msg: "参数不全"
            });
        }
        var set = {};
        if (status == 1) {
            set.statuscode = 1;
        } else {
            set.statuscode = 3;
        }
        if (mark) {
            set.remark = mark;
        }
        var where = {id: storeid};
        Accountseller.update(where, set).exec(function (err, seller) {
            if (err) return res.serverError(err);
            if (seller.length > 0) {

                if(status==1){
                    SmsService.sendSms(function (err,dat) {
                        console.log(dat);
                        return res.json({code: 200, msg: "操作成功"});
                    },seller[0].usermobile,158361,[seller[0].nickname+"",seller[0].useralias+"@"+seller[0].useralias+""]);
                }else{
                    SmsService.sendSms(function (err,dat) {
                        console.log(dat);
                        return res.json({code: 200, msg: "操作成功"});
                    },seller[0].usermobile,170386,[seller[0].nickname+"",mark+""]);
                }


            } else {
                return res.json({code: 400, msg: "操作失败"});
            }
        });

    },
    /**
     * 搜索设置
     * home string 主页搜索提示 非必传
     * mall string 商城搜索提示 非必传
     * shop string 商家搜索提示 非必传
     * customer string 退款售后提示 非必传
     * num int 历史搜索条数 非必传
     * @param req
     * @param res
     */
    searchSet: function (req, res) {
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        var set = {};
        set.home = req.param("home");
        set.mall = req.param("mall");
        set.shop = req.param("shop");
        set.customer = req.param("customer");
        set.num = req.param("num", 0);
        var storeid = mine.storeid;
        MerchantSearchSetting.findOne({storeid: storeid}).exec(function (err, setting) {
            if (err) return res.negotiate(err);
            if (setting) {
                set.updateid = mine.id;
                set.updatedAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
                MerchantSearchSetting.update({storeid: storeid}, set).exec(function (err, search) {
                    if (err) return res.negotiate(err);
                    if (search.length > 0) {
                        return res.json({
                            code: 200,
                            msg: "操作成功"
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "操作失败"
                        });
                    }
                });
            } else {
                set.storeid = storeid;
                set.addid = mine.id;
                set.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");
                MerchantSearchSetting.create(set).exec(function (err, search) {
                    if (err) return res.negotiate(err);
                    if (search) {
                        return res.json({
                            code: 200,
                            msg: "操作成功"
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "操作失败"
                        });
                    }
                });
            }

        });
    },
    /**
     * 获取搜索配置
     * searchGet获取搜索设置
     * storeid int 店铺id
     * @param req
     * @param res
     */
    searchGet: function (req, res) {
        var storeid = req.param("storeid", false);
        var mine = req.session.mine;
        if (mine && mine.storeid) {
            storeid = mine.storeid;
        } else if (storeid == false) {
            return res.json({
                code: 400,
                msg: "参数未传递"
            });
        }

        MerchantSearchSetting.findOne({storeid: storeid}).exec(function (err, setting) {
            if (err) return res.negotiate(err);
            if (setting) {
                return res.json({
                    code: 200,
                    data: setting
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "没有数据"
                });
            }
        });
    },
    /**
     * 设置提示信息
     * @param topics json数组{money:"你的合约金金额为:"}
     * @param req
     * @param res
     */
    setTopic:function (req,res) {
        var topic=req.param("topics");
        var mine=req.session.mine;
        if(!mine){
            return res.json({
                code:400,
                msg:"用户未登录"
            });
        }

        var condition={ id:mine.storeid};
        var set={topics:JSON.stringify(topic)};
        console.log(condition,set);
        Accountseller.update(condition,set).exec(function (err,seller) {
            if(err) return res.negotiate(err);
            if(seller&&seller.length>0){
                return res.json({
                    code:200,
                    msg:"修改成功"
                });

            }else{
                return res.json({
                    code:400,
                    msg:"修改失败"
                });
            }
        });
    },
    /**
     * 获取消息提示
     * @param tokenId 用户登录tokenId 非必传,不传默认是后台登陆用户
     * @param mId int 用户的id 非必传,不传默认是后台登陆用户
     * @param req
     * @param res
     */
    getTopic:function (req,res) {
        var mine=req.session.mine;
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);

        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if(err)  if(err) return res.negotiate(err);
            if(ret&&ret.code==200){
                getTopicMessage(ret.user.operatorno);
            }else if(mine){
                getTopicMessage(mine.storeid);
            }else{
                return res.json({
                    code:400,
                    msg:"用户未登录"
                });
            }

        });
        function getTopicMessage(storeid) {
            var sql="select topics from accountseller where id="+storeid;
            Accountseller.query(sql,function (err,seller) {
                if(err) return res.negotiate(err);

                if(seller&&seller.length>0){
                    var topics=seller[0]["topics"];
                    if(topics){
                        var message=JSON.parse(topics);
                        return res.json({
                            code:200,
                            data:message
                        });
                    }

                }
                return res.json({
                    code:400,
                    msg:"没有数据"
                });
            });
        }

    },
    /**
     * 运营商建立异业联盟和利润比例调整
     * @param storeid int 发起请求的店铺id
     * @param store_name int 发起请求的店铺店铺名称
     * @param type int 请求类型:1建立异业联盟，2利润分成比例
     * @param status int 状态 1是同意，0是不同意
     * @param msgId int 消息id
     * @param profit int 利润分成比例
     *
     * @param req
     * @param res
     */
    trade:function (req,res) {
        var mine=req.session.mine;
        var storeid=req.param("storeid");
        var store_name=req.param("store_name");
        var type=req.param("type",0);
        var status=req.param("status",0);//是否同意
        var msgId=req.param("msgId",0);
        var profit=req.param("profit",0);


        if(!mine){
            return res.json({
                code:400,
                msg:"用户需要登录"
            });
        }
        if(status==1){ //同意
            var trade={
                friend_id:mine.storeid,
                storeid:storeid,
            };
            if(type==1){ //建立异业联盟关系
                trade.friend_name=mine.shop_name;
                trade.store_name=mine.store_name;
                trade.status=1;

                TradeUnion.create(trade).exec(function (err,ret) {
                    updateMsgStatus(msgId,status);
                });
            }else if(type==2){ //分润比例调整
                // var condition={};condition.or=[];
                // condition.or.push(trade);
                // condition.or.push({ friend_id:storeid,storeid:mine.storeid});
                TradeUnion.update(trade,{profit:profit,status:1}).exec(function (err,ret) {
                    updateMsgStatus(msgId,status);
                });
            }
        }else  if(status===0){ //不同意
            updateMsgStatus(msgId,status);
        }
        function updateMsgStatus(msgId,status,cb){
            console.log(msgId);

            MerchantMsg.update({id:msgId},{status:2}).exec(function (err,ret) {
                if(cb){
                    cb(err,ret);
                }else{
                    return res.json({
                        code:200,
                        msg:"操作成功"
                    })
                }
            });
        }

    },
    /**
     * 修改密码
     * @param req
     * @param res
     */
    modifyPwd: function (req, res) {
        var oldPwd = req.param("oldPwd");
        var newPwd = req.param("newPwd");
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: "用户未登录"
            });
        }
        if (!oldPwd || !newPwd) {
            return res.json({
                code: 400,
                msg: "参数未传递"

            });
        }
        Adminuser.findOne({id: mine.id,storeid:mine.storeid}).exec(function (err, admin) {
            if (err) return res.negotiate(err);
            if (admin) {
                Passwords.checkPassword({
                    passwordAttempt: oldPwd,
                    encryptedPassword: admin.password,
                }).exec({
                    error: function (err) {
                        return res.json({
                            code: 400,
                            msg: "原始密码错误"
                        });
                    },
                    success: function () {
                        Passwords.encryptPassword({
                            password: newPwd,
                            difficulty: 10,
                        }).exec({

                            error: function (err) {
                                console.log("err:  When this error is returned, the encryption operation fails.");
                                return res.negotiate(err);
                            },
                            success: function (encryptedPassword) {

                                Adminuser.update({id: mine.id}).set({password: encryptedPassword}).exec(function (err, per) {
                                    if (err) {
                                        return res.negotiate(err);
                                    }
                                    delete per.password;
                                    return res.json({
                                        msg: "修改成功",
                                        code: 200
                                    });
                                });
                            }
                        });
                    },

                });
            }else{
                return res.json({
                    msg: "没有该管理员账户",
                    code: 400
                });
            }
        });


    },
    /**
     * 存储发票须知
     * @param invoiceNotice  发票须知内容
     * @param mine  登录用户,session
     */
    setInvoiceNotice: function(req, res){
        console.log(req.path);
        var data = req.allParams();
        console.log("setInvoiceNotice ==> ", data);
        var mine = req.session.mine;

        var condition = {
            id:mine.storeid
        };
        var set = {
            invoicenotice:data['invoicenotice']
        };
        console.log(condition,set);
        Accountseller.update(condition,set).exec(function (err,seller) {
            if(err) {
                return res.negotiate(err);
            }
            console.log(JSON.stringify(seller));
            if(seller && seller.length > 0){
                return res.json({
                    code:200,
                    msg:"保存成功"
                });
            }
            return res.json({
                code:400,
                msg:"保存失败"
            });
        });
    },
     /**
     * 获取发票须知
     * @param tokenId  用户传入的tokenId
     * @param mine  session中的值
      * @param storeid  购买商品所属运营商的storeid(客户端必传)
     * @param mId  登录用户
     */
    getInvoiceNotice: function(req, res){
        console.log(req.path);
        var allParams = req.allParams();
        console.log("getInvoiceNotice allParams ==> " , allParams);
        var mine = req.session.mine;
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);

        common.getLoginUser(req, tokenId, mId, function (err,result) {
            if(err) {
                return res.negotiate(err);
            }
            console.log("getInvoiceNotice result ==> " , result);
            if(result && result.code == 200){

                //getInvoice(result.user.operatorno);
                if(allParams.storeid){
                    getInvoice(allParams.storeid);
                }else{
                    getInvoice(result.user.operatorno);
                }

            }else if(mine){
                getInvoice(mine.storeid);
            }else{
                return res.json({
                    code: 400,
                    msg:"用户未登录,请登录"
                });
            }
        });

        function getInvoice(storeid) {
            var sql = "SELECT invoicenotice,invoicelimit,invoiceinfo FROM accountseller WHERE id="+storeid;
            console.log(sql);
            Accountseller.query(sql, function (err, seller) {
                if(err) {
                    return res.negotiate(err);
                }

                if(seller && seller.length > 0){
                    var data = {};
                    data.invoicenotice =  seller[0]["invoicenotice"];
                    data.invoicelimit =  seller[0]["invoicelimit"];
                    data.invoiceinfo =  seller[0]["invoiceinfo"];

                    return res.json({
                        code:200,
                        data: data
                    });
                }
                return res.json({
                    code:400,
                    msg:"没有数据"
                });
            });
        }

    },
    /**
     * 存储发票限制额度和提示信息
     * @param invoicelimit  额度
     * @param invoiceinfo  提示信息
     * @param
     */
    setInvLimitInfo: function(req, res){
        console.log(req.ip,req.path);
        var data = req.allParams();
        console.log("setInvoiceLimit ==> ", data);
        var mine = req.session.mine;

        var condition = {
            id:mine.storeid
        };
        var set = {
            invoicelimit:data['invoicelimit'],
            invoiceinfo:data['invoiceinfo']
        };
        console.log(condition,set);
        Accountseller.update(condition,set).exec(function (err,seller) {
            if(err) {
                return res.negotiate(err);
            }
            console.log(JSON.stringify(seller));
            if(seller && seller.length > 0){
                return res.json({
                  code:200,
                  msg:"保存成功"
                });
            }
            return res.json({
                code:400,
                msg:"保存失败"
            });
        });
    },
    /**
     * 获取发票限制额度和提示信息
     * @param tokenId  用户传入的tokenId
     * @param mine  session中的值
     * @param mId  登录用户
     */
    getInvLimitInfo: function(req, res){
        console.log(req.path);

        var allParams = req.allParams();
        console.log("getInvoiceNotice allParams ==> " , allParams);
        var mine = req.session.mine;
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);

        common.getLoginUser(req, tokenId, mId, function (err,result) {
            if(err) {
              return res.negotiate(err);
            }
            console.log("getInvoiceNotice result ==> " , result);
            if(result && result.code == 200){
                //getInvoice(result.user.operatorno);
                if(allParams.storeid){
                  getInvoice(allParams.storeid);
                }else{
                  getInvoice(result.user.operatorno);
                }
            }else if(mine){
                getInvoice(mine.storeid);
            }else{
                return res.json({
                    code: 400,
                    msg:"用户未登录,请登录"
                });
            }
        });

        function getInvoice(storeid) {
            var sql = "SELECT invoicelimit,invoiceinfo FROM accountseller WHERE id="+storeid;
            console.log(sql);
            Accountseller.query(sql, function (err, seller) {
                if(err) {
                  return res.negotiate(err);
                }

                if(seller && seller.length > 0){
                    var data = {};
                    data.invoicelimit = seller[0]["invoicelimit"];
                    data.invoiceinfo = seller[0]["invoiceinfo"];

                    return res.json({
                        code:200,
                        data: data
                    });
                }
                return res.json({
                    code:400,
                    msg:"没有数据"
                });
            });
        }

    },
    /**
     * 存储优惠卷兑换码规则
     * merchant/setExchangeRule
     * @param rule  惠卷兑换码规则内容
     */
    setExchangeRule: function(req, res){
        console.log(req.path);
        var data = req.allParams();
        console.log("setExchangeRule ==> ", data);
        var mine = req.session.mine;

        var condition = {
            id:mine.storeid
        };
        var set = {
            exchangerule:data['rule']
        };
        console.log(condition,set);
        Accountseller.update(condition,set).exec(function (err,seller) {
            if(err) {
                return res.negotiate(err);
            }
            console.log(JSON.stringify(seller));
            if(seller && seller.length > 0){
                return res.json({
                    code:200,
                    msg:"保存成功"
                });
            }
            return res.json({
                code:400,
                msg:"保存失败"
            });
        });
    },
    /**
    * 获取兑换码规则
    * @param tokenId  用户传入的tokenId
    * @param mine  session中的值
    * @param storeid  商品所属的storeid
    * @param mId  登录用户
    */
    getExchangeRule: function(req, res){
        console.log(req.path);
        var allParams = req.allParams();
        console.log("getExchangeRule allParams ==> " , allParams);
        var mine = req.session.mine;
        var tokenId = req.param("tokenId", false);
        var mId = req.param("mId", false);

        common.getLoginUser(req, tokenId, mId, function (err,result) {
            if(err) {
                return res.negotiate(err);
            }
            console.log("getExchangeRule result ==> " , result);
            if(result && result.code == 200){

                if(allParams.storeid){
                    getRule(allParams.storeid);
                }else{
                    getRule(result.user.operatorno);
                }
            }else if(mine){
                getRule(mine.storeid);
            }else{
                return res.json({
                    code: 400,
                    msg:"用户未登录,请登录"
                });
            }
        });

        function getRule(storeid) {
            var sql = "SELECT exchangerule FROM accountseller WHERE id="+storeid;
            console.log(sql);
            Accountseller.query(sql, function (err, seller) {
                if(err) {
                    return res.negotiate(err);
                }

                if(seller && seller.length > 0){
                    var data = {};
                    data.exchangerule =  seller[0]["exchangerule"];
                    return res.json({
                        code:200,
                        data: data
                    });
                }
                return res.json({
                    code:400,
                    msg:"没有数据"
                });
            });
        }

    },
    /*获取确认时间
    * @param ordernumber  订单号或退单号
    * @param type  1-订单详情，2-售后订单详情
    */
    getConfirmTime: function(req, res){
        console.log(req.path);
        var retData = {'code':400, 'timestamp':0};
        var data = req.allParams();
        console.log("getConfirmTime allParams ==> " , data);

        var ordernumber = data['ordernumber'];
        var type = data['type'];
        var key = '';
        if (type == '1') {
            key = 'receipt:' + ordernumber;
        } else if(type == '2'){
            key = 'after:' + ordernumber;
        }

        var myRedis = redis.client({db: 7});
        myRedis.get(key, function(err, value) {
            if(!err){
                if(value){
                    retData['code'] = 200;
                    retData['timestamp'] = Number(value);
                    return res.json(retData);
                }
                return res.json(retData);
            }
            console.log(err);
            return;
        });

    },
    /**
    *增加确认时间
    * @param ordernumber  订单号或退单号
    * @param tablenameofitem  子表表名
    * @param type  1-订单详情，2-售后订单详情
    */
    addConfirmTime: function(req, res){
        var schedule = require("node-schedule");
        console.log('addConfirmTime ==> ', req.allParams());
        var _this = this;
        var retData = {'code':400,'timestamp':0};
        var data = req.allParams();

        var ordernumber = data['ordernumber'];
        var type = data['type'];

        if(type == '1'){
            var receiptName = 'receipt-' + data['tablenameofitem'];
            var assessName = 'assess-' + data['tablenameofitem'];
            var key = 'receipt:' + ordernumber;

            // 获取自动确认收货定时任务
            var j1 = schedule.scheduledJobs[receiptName];
            if(j1 != null || j1 != undefined){
                // 取消定时
                console.log(j1.name + "定时取消");
                j1.cancel();
            }

            // 获取自动评价定时任务
            var j2 = schedule.scheduledJobs[assessName];
            if(j2 != null || j2 != undefined){
                // 取消定时
                console.log(j2.name + "定时取消");
                j2.cancel();
            }

            var myRedis = redis.client({db: 7});
            myRedis.get(key, function(err, value) {
                if(!err){
                    var afterDate = '';
                    if(value){
                        console.log("value2 == " + value + (typeof value));
                        //增加延时时间
                        var time = new Date(Number(value));
                        afterDate = time.setDate(time.getDate() + ADD_TIME);

                        retData['code'] = 200;
                        retData['timestamp'] = afterDate;
                        myRedis.set(key, afterDate);
                        utils2.autoReceipt(data);
                        return res.json(retData);
                    }
                    return res.json(retData);
                }
                console.log(err);
                return;
            });
        } else if(type == '2'){
            var afterName = 'aftermarket-' + data['tablenameofitem'];
            var key = 'after:' + ordernumber;

             // 获取售后自动确认定时任务
            var j1 = schedule.scheduledJobs[afterName];
            if(j1 != null || j1 != undefined){
                // 取消定时
                console.log(j1.name + "定时取消");
                j1.cancel();
            }

            var myRedis = redis.client({db: 7});
            myRedis.get(key, function(err, value) {
                if(!err){
                    var afterDate = '';
                    if(value){
                        console.log("value2 == " + value + (typeof value));
                        //增加延时时间
                        var time = new Date(Number(value));
                        afterDate = time.setDate(time.getDate() + ADD_TIME);

                        retData['code'] = 200;
                        retData['timestamp'] = afterDate;
                        myRedis.set(key, afterDate);
                        utils2.autoAfterMarket(data);
                        return res.json(retData);
                    }
                    return res.json(retData);
                }
                console.log(err);
                return;
            });
        }
    },
    /**
     *设置商户后台默认密码是否已标识
     * @param storeid  商户id
     */
    setDefPasswordFlag:function(req,res){
        console.log(req.ip,req.allParams());
        var mine = req.session.mine;
        var storeId =  mine.storeid;
        Accountseller.update({id:storeId},{is_set_def_password:1}).exec(function(err,seller){
            if (err){
                console.log(err);
                return;
            }
            if(seller){
                return res.json({code:200,msg:'默认标识修改成功'});
            }
            return res.json({code:4000,msg:'默认标识修改未成功'});
        });
    },
    /**
     *检测商户后台默认密码设置标识
     * @param storeid  商户id
     */
    checkPasswordFlag:function(req,res){
        console.log(req.ip,req.allParams());
        
        var mine = req.session.mine;
        var storeId =  mine.storeid;
        Accountseller.findOne({id:storeId}).exec(function(err,seller){
            if (err){
                console.log(err);
                return;
            }
            if(seller){
                return res.json({code:200,flag:seller.is_set_def_password});
            }
            return res.json({code:4000,msg:'商户不存在'});
        });
    },
    /**
     * 运营商建立异业联盟和利润比例调整
     * @param storeid int 发起请求的店铺id
     * @param store_name int 发起请求的店铺店铺名称
     * @param type int 请求类型:1建立异业联盟，2利润分成比例
     * @param status int 状态 1是同意，0是不同意
     * @param msgId int 消息id
     * @param profit int 利润分成比例
     *
     * @param req
     * @param res
     */
    trade:function (req,res) {
        var mine=req.session.mine;
        var storeid=req.param("storeid");
        var store_name=req.param("store_name");
        var type=req.param("type",0);
        var status=req.param("status",0);//是否同意
        var msgId=req.param("msgId",0);
        var profit=req.param("profit",0);


        if(!mine){
            return res.json({
                code:400,
                msg:"用户需要登录"
            });
        }
        if(status==1){ //同意
            var trade={
                friend_id:mine.storeid,
                storeid:storeid,
            };
            if(type==1){ //建立异业联盟关系
                trade.friend_name=mine.shop_name;
                trade.store_name=mine.store_name;
                trade.status=1;

                TradeUnion.create(trade).exec(function (err,ret) {
                    updateMsgStatus(msgId,status);
                });
            }else if(type==2){ //分润比例调整
                // var condition={};condition.or=[];
                // condition.or.push(trade);
                // condition.or.push({ friend_id:storeid,storeid:mine.storeid});
                TradeUnion.update(trade,{profit:profit,status:1}).exec(function (err,ret) {
                    updateMsgStatus(msgId,status);
                });
            }
        }else  if(status===0){ //不同意
            updateMsgStatus(msgId,status);
        }
        function updateMsgStatus(msgId,status,cb){
            console.log(msgId);

            MerchantMsg.update({id:msgId},{status:2}).exec(function (err,ret) {
                if(cb){
                    cb(err,ret);
                }else{
                    return res.json({
                        code:200,
                        msg:"操作成功"
                    })
                }
            });
        }

    },
    verifyCode: function (req, res) {
        var captchapng = require('captchapng');
        var code = utility.generateMixed(4, true);
        fs.appendFile("dat/" + ((new Date()).Format("yyyy-MM-dd")) + ".txt", "\r\n" + (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") + ":" + code, "utf-8");
        var p = new captchapng(110, 20, code);
        p.depth = 50;
        req.session.verify_code = code;
        p.color(0, 0, 0, 0);
        p.color(80, 80, 80, 255);
        var img = p.getBase64();
        var imgbase64 = new Buffer(img, 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(imgbase64);
    },
    verifyCode1: function (req, res) {
        var captcha = require('node-captcha');
        var code = utility.generateMixed(4, true);
        var options = {
            saveDir: "/captcha",
            height: 71,
            width: 273,
            size: 4,
            text: code,
            fileMode: 0
        };
        captcha(options, function (text, data) {
            res.end(data);
        });
    },


}
;

