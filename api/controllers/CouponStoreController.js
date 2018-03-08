var couponController = require('../publicController/couponController');
module.exports = {
    /*
    *增加优惠券
    *coupon/addCoupon
    *@param  storeid  卖家id
    *@param  couponnum  优惠券编码
    *@param  couponname  优惠券名称
    *@param  couponamount  优惠券数量
    *@param  parvalue  优惠券面值
    *@param  coupontype  优惠券类型,如现金券
    *@param  couponmode  优惠券模式类别
    *@param  islimitmoney  是否限制金额
    *@param  attainmoney  满足的金额
    *@param  picture  上传的图片，如新人券等
    *@param  ishavecode  是否拥有兑换码
    *@param  userange  使用范围
    *@param  userangecon  使用范围 具体内容
    *@param  limitnum  领取数目限制
    *@param  isrepeat  是否可以重叠使用
    *@param  isssued  是否派发或手动领取
    *@param  isvalid  是否立即生效
    *@param  starttime  有效开始时间
    *@param  endtime  有效结束时间
    *@param  remark  备注
    */
    addCoupon: function(req, res) {
        console.log(req.ip,req.path);

        var data = req.allParams();
        var mine = req.session.mine;
        var adminid1 = mine.userId;
        var storeid = mine.storeid;
        var retdata = {code:400,infor:'fail'};
        var insertObj = {};
        console.log("addCoupon ==> ",data);

        insertObj.storeid = storeid;
        insertObj.adminid1 = adminid1;
        insertObj.couponname = data['couponname'];
        insertObj.couponamount = data['couponamount'];
        insertObj.parvalue = data['parvalue'];
        insertObj.coupontype = data['coupontype'];
        insertObj.couponmode = data['couponmode'];
        insertObj.islimitmoney = data['islimitmoney'];
        insertObj.userange = data['userange'];
        insertObj.userangecon = JSON.stringify(data['userangecon']);

        var randomNum = utility.generateMixed(6, true);
        var nowDate1 = (new Date()).Format("yyyyMMdd");
        var coupoNnum = nowDate1 + randomNum;
        insertObj.couponnum = coupoNnum;

        if (data['couponmode'] == 2) {
            insertObj.isssued = data['isssued'];
        }

        if (data['couponmode'] == 3) {
            insertObj.picture = data['picture'];
        }

        if (data['couponmode'] == 4) {
            insertObj.isssued = data['isssued'];
            insertObj.ishavecode = 1;
        } else {
            insertObj.ishavecode = 2;
        }

        if (data['islimitmoney'] == 1) {
            insertObj.attainmoney = data['attainmoney'];
        }

        if (data['couponmode'] == 2 || (data['couponmode'] == 4&&data['isssued']==4)) {
            insertObj.code = UserCoupon.generateOrdinaryCode(data['starttime'],data['endtime'],data['couponmode']);
        }

        var nowDate2 = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        insertObj.limitnum = data['limitnum'];
        insertObj.isrepeat = data['isrepeat'];
        insertObj.isvalid = data['isvalid'];
        insertObj.starttime = data['starttime'];
        insertObj.endtime = data['endtime'];
        insertObj.createdAt = nowDate2;

        if (data['remark'] != '') {
            insertObj.remark = data['remark'];
        }

        coupon.create(insertObj).exec(function(err,insert){
            if (err) {
                return res.serverError(err);
            }
            console.log(insert);

            var couponObj = {
                id:insert['id'],
                couponname:data['couponname'],
                coupontype:data['coupontype'],
                parvalue:data['parvalue'],
                couponmode:data['couponmode'],
                endtime:data['endtime']
            };

            if (data['couponmode'] == 4&&data['isssued']==3) {//生成实体券兑换码
                UserCoupon.publishEntityCoupon(data['couponamount'],couponObj,function(err,usercoupon){
                    if (err) {
                        return res.serverError(err);
                    }
                    console.log(usercoupon);
                });
            }

            retdata.code = 200;
            retdata.infor = 'ok';
            retdata.id = insert['id'];
            return res.json(retdata);
        });
    },
     /*
    *修改优惠券
    *coupon/modifyCoupon
    *@param  id  优惠券id
    *@param  couponname  优惠券名称
    *@param  couponamount  优惠券数量
    *@param  parvalue  优惠券面值
    *@param  coupontype  优惠券类型,如现金券
    *@param  couponmode  优惠券模式类别
    *@param  islimitmoney  是否限制金额
    *@param  attainmoney  满足的金额，可自动领取
    *@param  picture  上传的图片，如新人券等
    *@param  userange  使用范围
    *@param  userangecon  使用范围 具体内容
    *@param  limitnum  领取数目限制
    *@param  isrepeat  是否可以重叠使用
    *@param  isvalid  是否立即生效
    *@param  isssued  是否派发或手动领取
    *@param  starttime  有效开始时间
    *@param  endtime  有效结束时间
    *@param  remark  备注
    */
    modifyCoupon: function(req, res) {
        return couponController.modifyCoupon(req,res);
    },
     /*
    *优惠券管理
    *coupon/selectCoupon
    *@param  number  编号
    *@param  couponname  优惠券名称
    *@param  isvalid  是否生效  ,1-生效，2-未生效
    *@param  createtime1  创建时间开始
    *@param  createtime2  创建时间结束
    *@param  isexpired  是否过期, 0-过期，1-未过期
    *@param  couponmode  优惠券模式类别
    *@param  parvalue1  优惠券模式面值开始
    *@param  parvalue2  优惠券模式面值结束
    */
    selectCoupon: function(req, res) {
        return couponController.selectCoupon(req,res);
    },
    /*
    *优惠券发放
    *coupon/couponIssued
    *@param  type  1-直接输入,2-上传文件,3-全部用户
    *@param  id   优惠券id
    *@param  storeId   商铺id
    *@param  usermobile  用户话号码 ,数组
    */
    couponIssued: function(req, res) {
        console.log(req.ip,req.path);
        
        var mine = req.session.mine;
        var data = req.allParams();
        var data1 = {successSum:0,failSum:0};
        var retdata = {code:400};
        console.log("couponIssued ==> ",data);

        var condition = {id:data['id']};
        coupon.findOne(condition).exec(function(err, result){
            if (err) {
                console.log(err);
                return;
            }
            if (result) {//判断是否存在
                var nowTime = (new Date()).getTime();
                var endDate = (new Date(result['endtime'])).getTime();
                if (endDate >= nowTime) {//判断是否已过期
                    UserCoupon.distributeCoupon(data['usermobile'],data['storeId'],result, null,function(err, ret){
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(ret);

                        if (ret['code'] == 200) {
                            data1.successSum = ret['count'];
                            data1.failSum = ret['failUsers'].length;
                            data1.failUsers = ret['failUsers'];
                            retdata.data = data1;
                            retdata.code = 200;
                            retdata.msg = 'ok';
                            console.log(ret['code']);

                            var content = "发钱啦，" +1+"张"+ result['couponname']+"优惠券,共"+result['parvalue']+"元已经放入你的优惠券管理里，赶紧去查看吧";
                            couponController.couponMsg(mine,content,ret['sendUsers']);
                            return res.json(retdata);
                        } else {
                            data1.successSum = 0;
                            data1.failSum = ret['failUsers'].length;
                            data1.failUsers = ret['failUsers'];
                            retdata.data = data1;
                            retdata.code =  ret['code'];
                            retdata.msg = ret['msg'];
                            return res.json(retdata);
                        }
                    });
                } else {
                    retdata.code = 401;
                    retdata.msg = '优惠券已过期';
                    return res.json(retdata);
                }
            } else {
                retdata.msg = '优惠券不存在';
                return res.json(retdata);
            }
        });
    },
     /*
    *删除优惠券
    *coupon/deleteCoupon
    *@param  id  优惠券id
    */
    deleteCoupon: function(req, res) {
        return couponController.deleteCoupon(req,res);
    },
    /*
    *手动领取优惠券
    *coupon/receiveCoupon
    *@param  tokenId  用户传入的tokenId
    *@param  mId  用户id
    *@param  phone  电话号码
    *@param  code 串码
    */
    receiveCoupon: function(req, res) {
        return couponController.receiveCoupon(req,res);
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
