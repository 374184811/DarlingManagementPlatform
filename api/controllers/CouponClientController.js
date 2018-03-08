var couponController = require('../publicController/couponController');
module.exports = {
    /*
    *手动领取优惠券
    *coupon/receiveCoupon
    *@param  tokenId  用户传入的tokenId
    *@param  mId  用户id
    *@param  phone  电话号码
    *@param  code 串码
    */
    receiveCoupon: function(req, res) {
        console.log(req.ip,req.path);
        console.log('ipip',req.ip.substring(7));

        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var phone = req.param("phone", '123456');
        var code = req.param("code", 0);
        var ip = req.ip.substring(7);
        // 1-代表该用户不存在，2-代表领取成功，3-代表领取失败(该优惠券不存在或已过期等)，4-代表用户已经领取过该优惠券
        var retdata = {code:400,infor:'fail'};
        console.log("receiveCoupon ==> ",req.allParams());

        common.getLoginUser(req, tokenId, mId, function(err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var menber = ret.user;
                checkCoupon(menber.id);
            } else {
                Account.findOne({usermobile:phone}).exec(function(err,user) {
                    if(err){
                        console.log(err);
                        return;
                    }
                    if(user){
                        checkCoupon(user.id);
                    } else {//未注册
                        checkCoupon(null);
                    }
                });
            }
        });

        function checkCoupon(userid){
            var userId = userid;
            var status = 1;
            if (userId == null ) {
                userId = 0;
                status = 3;
            }
            var nowTime = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            var where = {code:code,endtime:{'>=':nowTime}};
            coupon.findOne(where).exec(function(err,result1){
                if(err){
                    console.log(err);
                    return;
                }
                console.log(result1);
                if (result1) {
                    if (result1.isdel == 1) {
                        retdata.code = 3;
                        retdata.infor = '该优惠券已失效';
                        return res.json(retdata);
                    }
                    var selectStr = "SELECT count(*) AS cnt FROM user_coupon WHERE user IS NOT NULL AND cid="+result1.id;
                    UserCoupon.query(selectStr,function(err,cout){
                        if (err){
                            console.log(err);
                            return;
                        }

                        if (result1.couponamount <= cout[0].cnt) {
                            retdata.code = 3;
                            retdata.infor = '该优惠券已领取完';
                            return res.json(retdata);
                        }

                        UserCoupon.find({where:{user:phone,cid:result1.id},sort: 'createdAt DESC'}).exec(function(err,result2){
                            if(err){
                              console.log(err);
                              return;
                            }
                            console.log(result2);
                            if(result2.length >= result1.limitnum){
                                retdata.code = 4;
                                retdata.infor = '用户已经领取过该优惠券';
                                return res.json(retdata);
                            } else {
                                // 使用ip判断是否恶意领取
                                if (result2.length > 0) {
                                    if(ip == result2[0].ip){
                                        var nowTime = new Date().getTime();
                                        console.log(nowTime);
                                        var lastTime = new Date(result2[0].createdAt).getTime();
                                        console.log(lastTime);
                                        var diffVal = nowTime-lastTime;
                                        console.log(IP_VALID_TIME);
                                        if(diffVal < IP_VALID_TIME){
                                          retdata.code = 5;
                                          retdata.infor = '领取过于频繁';
                                          return res.json(retdata);
                                        }
                                    }
                                }

                                var condition = {};
                                condition.user = phone;
                                condition.uid = userId;
                                condition.cid = result1.id;
                                condition.cname = result1.couponname;
                                condition.type = result1.coupontype;
                                condition.cmode = result1.couponmode;
                                condition.cendtime = result1.endtime;
                                condition.cmoney = result1.parvalue;
                                condition.orderid = 0;
                                condition.status = status;
                                condition.ip = ip;
                                condition.createdAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                                console.log(condition);
                                UserCoupon.create(condition).exec(function(err,result3){
                                    if(err){
                                      console.log(err);
                                      return;
                                    }

                                    if (userId != 0) {
                                        retdata.code = 2;
                                        retdata.infor = '用户领取成功';
                                    } else {
                                        retdata.code = 1;
                                        retdata.infor = '该用户不存在';
                                    }
                                    return res.json(retdata);
                                });
                            }
                        });
                    });
                } else {
                    retdata.code = 3;
                    retdata.infor = '该优惠券已过期';
                    return res.json(retdata);
                }
            });
        }
    },
    /**
     * 推送给新注册用户优惠券
     * @param tokenId string 用户tokenid
     * @param mId int 用户id
     * @param req
     * @param res
     * @returns {*}
     */
    pubNewuserCoupon:function (req,res) {
        return couponController.pubNewuserCoupon(req,res);
    },
    /**
     * 获取实体记录
     * @param ecode string 实体券兑换码
     * @param status int 实体券状态 1未使用，2已使用
     * @param cid int 实体券id
     * @param req
     * @param res
     */
    getEntityCoupon: function (req, res) {
        return couponController.getEntityCoupon(req,res);
    },
    /**
     * 运营商查看自己优惠券
     * @param id int 优惠券id
     * @param req
     * @param res
     */
    detail:function (req,res) {
        return couponController.detail(req,res);
    },
    /**
     * 获取新人券
     * coupon/getNewUserCoupon
     * @param tokenId string 用户tokenid
     * @param mId int 用户id
     * @param req
     * @param res
     * @returns {*}
     */
    getNewUserCoupon:function (req,res) {
        return couponController.getNewUserCoupon(req,res);
    },
    /**
     * 普通用户查看优惠券详情
     * @param id int 优惠券id
     * @param tokenId string 用户token
     * @param mId int 用户id
     * @param status
     * @param req
     * @param res
     * @returns {*}
     */
    view:function (req,res) {
        return couponController.view(req,res);
    },
    /**
     * 用户获取自己优惠券记录
     * @param tokenId string 用户token
     * @param mId int 用户id
     * @param status string 优惠券状态status 0是分发的，1是领取的，2已使用 -1已失效
     * @param start string  优惠券下发开始时间
     * @param end string  优惠券下发结束时间
     * @param ustart string 优惠券使用开始时间
     * @param uend string 优惠券使用的结束时间
     * @param type int  1是个人中心返回可用或不可用的优惠券
     * @param req
     * @param res
     */
    getCouponUserRecord:function (req,res) {
        return couponController.getCouponUserRecord(req,res);
    },
    /**
     * 后台获取优惠券分发记录
     * @param status string 优惠券状态status 0是分发的，1是领取的，2已使用 -1已失效
     * @param start string  优惠券下发开始时间
     * @param end string  优惠券下发结束时间
     * @param ustart string 优惠券使用开始时间
     * @param uend string 优惠券使用的结束时间
     * @param uid int 用户id
     * @param storeid int 店铺id
     * @param type string 优惠券类型，优惠券模式类别,1-满减类，2-派发和手动领取类，3-新人券，4-实体券
     *
     * @param req
     * @param res
     */
    getCouponRecord:function (req,res) {
        return couponController.getCouponRecord(req,res);
    },
    /**
     * 获取优惠券总数
     * @param tokenId string 用户token
     * @param mId int 用户id
     * @param req
     * @param res
     */
    getCouponCnt:function (req,res) {
        return couponController.getCouponCnt(req,res);
    },
    /**
     * 根据优惠券获取所有商品
     * @param code string 兑换码
     * @param vid int 优惠券id
     * @param req
     * @param res
     */
    getGoodsByCoupon:function(req,res){
         return couponController.getGoodsByCoupon(req,res);
    },

    /**
     * 导出优惠券使用记录
     *@param  cid  int/string 优惠券id或者优惠券id组成的字符串
     * @param req
     * @param res
     */
    exportExcel: function (req, res) {
        return couponController.exportExcel(req,res);
    },
    /**
     * 兑换实体券
     * @param tokenId string 用户tokenid
     * @param mId int 用户id
     * @param ecode string 实体券兑换码
     * @param req
     * @param res
     */
    exchange:function (req,res) {
        return couponController.exchange(req,res);
    },
    /**
     * 二维码生成地址
     * @param content string 内容
     * @param req
     * @param res
     */
    qcode:function (req,res) {
        return couponController.qcode(req,res);
    },
    /**
     * 下载图片
     * @param content string 验证码内容
     * @param req
     * @param res
     */
    downImg:function(req,res){
        return couponController.downImg(req,res);
    },
    /**
     * 根据商品获取可以使用的优惠券
     * @param skus string 产品sku组成的字符串
     * @param tokenId string 用户tokenId
     * @param mId int 用户id
     * @param type int  1是普通优惠券，2是满减券,3.不区分
     * @param req
     * @param res
     */
    getEnableCouponBySku:function (req,res) {
        return couponController.getEnableCouponBySku(req,res);
    },
 
};
