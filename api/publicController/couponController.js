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
        console.log(req.ip,req.path);

        var data = req.allParams();
        var mine = req.session.mine;
        var adminid2 = mine.userId;
        var retdata = {code:400,infor:'fail'};
        var condition1 = {id:data['id']};
        var condition2 = {cid:data['id'],status:{'!':[2,-1]}};
        var set1 = {};
        var set2 = {};
        console.log("modifyCoupon ==> ",data);

        set1.couponname = data['couponname'];
        set1.coupontype = data['coupontype'];
        set1.parvalue = data['parvalue'];
        set1.couponmode = data['couponmode'];
        set1.adminid2 = adminid2;
        set1.couponamount = data['couponamount'];
        set1.islimitmoney = data['islimitmoney'];
        set1.attainmoney = data['attainmoney'];

        if (data['couponmode'] == 3) {
            set1.picture = data['picture'];
        }

        if (data['couponmode'] == 2) {
            set1.isssued = data['isssued'];
        }

        set1.userange = data['userange'];
        set1.userangecon = JSON.stringify(data['userangecon']);
        set1.limitnum = data['limitnum'];
        set1.isrepeat = data['isrepeat'];
        set1.isvalid = data['isvalid'];
        set1.starttime = data['starttime'];
        set1.endtime = data['endtime'];

        var nowDate = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        set1.updatedAt = nowDate;
        set1.remark = data['remark'];

        set2.cname = data['couponname'];
        set2.type = data['coupontype'];
        set2.cmoney = data['parvalue'];
        set2.cmode = data['couponmode'];
        set2.cendtime = data['endtime'];

        async.auto({
            one: function(callback){
                coupon.update(condition1,set1).exec(function(err,one){
                    callback(err, one);
                });
            },
            two: function(callback){
                UserCoupon.update(condition2,set2).exec(function(err,two){
                    callback(err, two);
                });
            }
        },function(err, results){
            if (err) {
                console.log(err);
                return;
            }
            retdata.code = 200;
            retdata.infor = 'ok';
            return res.json(retdata);
        });
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
        console.log(req.ip,req.path);

        var data = req.allParams();
        var mine = req.session.mine;
        var storeid = mine.storeid;
        var retdata = {code:400,infor:'fail'};
        var selectObj = {isdel:0};
        console.log("selectCoupon ==> ",data);

        if (data['number']!=null) {
            selectObj.couponnum = {'like':"%"+data['number']+"%"};
        }
        if (data['couponname']!=null) {
            selectObj.couponname = {'like':"%"+data['couponname']+"%"};
        }
        if (data['parvalue1']!=null&&data['parvalue2']!=null) {
            selectObj.parvalue = {'>=':data['parvalue1'],'<=':data['parvalue2']};
        }
        if (data['isvalid'] != -1) {
            selectObj.isvalid = data['isvalid'];
        }
        if (data['createtime1']!=null&&data['createtime2']!=null) {
            selectObj.createdAt = {'>=':data['createtime1'],'<=':data['createtime2']};
        }
        if (data['isexpired'] != -1) {
            var nowTime = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            if (data['isexpired'] == 1) {
                selectObj.endtime = {'<':nowTime};
            } else {
                selectObj.endtime = {'>=':nowTime};
            }
        }
        if (data['couponmode'] != -1) {
            selectObj.couponmode = data['couponmode'];
        }

        // 区别是商户后台还是总后台查询
        if (storeid > 0 ) {
            selectObj.storeid = storeid;
        }else{
            if (data['id'] != -1) {
                selectObj.storeid = data['id'];
            }
        }

        console.log(selectObj);
        coupon.find(selectObj).exec(function(err, results) {
            if (err) {
                console.log(err);
                return;
            }
            retdata.code = 200;
            retdata.infor = 'ok';
            retdata.data = results;
            console.log(retdata.data.length);
            return res.json(retdata);
        });
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

        var _this = this;
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
                            _this.couponMsg(mine,content,ret['sendUsers']);
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
        console.log(req.ip,req.path);

        var data = req.allParams();
        var couponId = data['id'];
        var retdata = {code:400,infor:'fail'};
        console.log("deleteCoupon ==> ",data);

        async.auto({
            one:function(callback){
                coupon.update({id:couponId},{isdel:1}).exec(function(err,one){
                    callback(err,one);
                });
            },
            two:function(callback){
                UserCoupon.update({cid:couponId,status:{'!':2}},{status:-2}).exec(function(err,two){
                    callback(err,two);
                });
            }
        },function(err,result){
            if (err) {
                console.log(err);
                return;
            }
            console.log(result.two.length);

            retdata.code = 200;
            retdata.infor = 'ok';
            return res.json(retdata);
        });
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
        console.log(req.ip,req.path);

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
        console.log(req.ip,req.path);
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var _this=this;
        if (!tokenId || !mId) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }

        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                // console.log(member);
                var time=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
                Ordermain.findOne({buyerid:member.id,status:{">":1}}).exec(function (err,order) {
                    if(err) return res.negotiate(err);
                    console.log(order);
                    if(order){//非新人
                        sails.sockets.broadcast('bootload', 'newreg', {
                            msg:"已经不是新人了",
                            code:400,
                            data:[],
                        }, req);
                    }else{
                        var where={storeid:member.operatorno,couponmode:3,endtime:{">":time},starttime:{"<=":time}};
                        console.log(where);
                        coupon.find(where).exec(function (err,coupons) {
                            if(err) return res.negotiate(err);

                            if(coupons&&coupons.length>0){
                                var cids=[];
                                coupons.forEach(function (item) {
                                    if(item.issuedamount<item.couponamount){
                                        cids.push(item.id);
                                    }
                                });
                                console.log(cids);
                                UserCoupon.find({cid:cids,uid:member.id},function (err,records) {
                                    if(err) return res.negotiate(err);
                                    var myCids=[];
                                    if(records&&records.length>0){
                                        records.forEach(function (r) {
                                            myCids.push(r.cid);
                                        });
                                    }

                                    var noCoupons=[];
                                    if(myCids.length>0){
                                        coupons.forEach(function (item) {
                                            if(myCids.indexOf(item.id)==-1){
                                                noCoupons.push(item);
                                            }
                                        });
                                    }else{
                                        noCoupons=coupons;
                                    }
                                    console.log(noCoupons);
                                    if(noCoupons.length>0){
                                        async.mapSeries(noCoupons,function (item,cb) {
                                            var newRecord={
                                                uid:member.id,
                                                user:""+member.usermobile,
                                                cid:item.id,
                                                type:item.coupontype,
                                                orderid:'',
                                                code:Math.ceil((new Date()).getTime()/1000),
                                                createdAt:time,
                                                status:0,
                                                qcode:''
                                            };

                                            console.log(newRecord);
                                            UserCoupon.create(newRecord).exec(cb);

                                        },function (err,ret) {
                                            if(err) return res.negotiate(err);
                                            sails.sockets.broadcast('bootload', 'newreg', {
                                                code:200,
                                                data:noCoupons,
                                            }, req);
                                            return res.json({
                                                code:200,
                                                data:noCoupons,
                                            });
                                        });

                                    }else{
                                        sails.sockets.broadcast('bootload', 'newreg', {
                                            msg:"没有新的优惠券",
                                            code:400,
                                            data:[],
                                        }, req);
                                        return res.json({
                                            msg:"没有新的优惠券",
                                            code:400,
                                            data:[],
                                        })
                                    }

                                });
                            }else{
                                sails.sockets.broadcast('bootload', 'newreg', {
                                    msg:"没有新的优惠券",
                                    code:400,
                                    data:[],
                                }, req);
                                return res.json({
                                    msg:"没有新的优惠券",
                                    code:400,
                                    data:[],
                                })
                            }
                        });
                    }
                });



            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });
        // sails.sockets.broadcast('appupdate', 'newreg', { howdy: 'hi there!'}, req);
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
        console.log(req.ip,req.path);
        var code = req.param("ecode", 0);
        var status = req.param("status", 0);
        // var num=req.param("num",10);
        // var page=req.param("page",1);
        var cid = req.param("cid", 0);
        var mine = req.session.mine;

        var condition = {cid:cid};
        if (code) {
            condition.code = code;
        }
        switch (parseInt(status)) {
            case 1:
                condition.status = -1;
                break;
            case 2:
                condition.status = [1,2];
                break;
        }
        // condition.skip=(page-1)*num;
        // condition.limit=num;
        var where = {id: cid};
        if (mine.storeid) {
            where.storeid = mine.storeid;
        }
        console.log(status,where,condition);
        coupon.findOne(where).exec(function (err,cp) {
            if(err) return res.negotiate(err);
            if(cp){
                UserCoupon.find(condition).exec(function (err,records) {
                    if (err) return res.negotiate(err);
                    if (records && records.length > 0) {
                        return res.json({
                            code: 200,
                            data: {
                                count: cp.couponamount,
                                records: records
                            }
                        });
                    } else {
                        return res.json({
                            code: 400,
                            msg: "没有数据"
                        });
                    }
                });
            }else{
                return res.json({
                    code:400,
                    msg:"你查询的优惠券不存在"
                });
            }
        });


    },
    /**
     * 运营商查看自己优惠券
     * @param id int 优惠券id
     * @param req
     * @param res
     */
    detail:function (req,res) {
        console.log(req.ip,req.path);
        var id=req.param("id");
        var code=req.param("code");
        var mine=req.session.mine;

        if(code){
            var condition={code:code};
        }else if(id){
            var condition={id:id};
        }
        coupon.findOne(condition).exec(function (err,record) {
            if(err) return res.negotiate(err);

            if(record){
                var sql="select count(*) cnt  from user_coupon where orderid!=0 AND cid="+record.id
                    +" UNION ALL select count(*) as cnt from user_coupon where (user IS NOT NULL) AND cid="+record.id;
                console.log(sql);
                UserCoupon.query(sql,function (err,count) {
                    if(err) return res.negotiate(err);
                    console.log(count);
                    record.useamount=count&&count[0]&&count[0]["cnt"]?count[0]["cnt"]:0;
                    record.issuedamount=count&&count[1]&&count[1]["cnt"]?count[1]["cnt"]:0;
                    return res.json({
                        code:200,
                        data:record
                    });
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
     * 获取新人券
     * coupon/getNewUserCoupon
     * @param tokenId string 用户tokenid
     * @param mId int 用户id
     * @param req
     * @param res
     * @returns {*}
     */
    getNewUserCoupon:function (req,res) {
        console.log(req.ip,req.path);
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        if (!tokenId || !mId) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                var curTime=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
                var sql="select a.*,b.createdAt as receive_time from coupon a right join user_coupon b on a.id=b.cid where b.cmode=3 AND b.uid="
                    +member.id+" AND b.status=0 AND a.couponmode=3 AND a.endtime>'"+curTime+"' AND view=0";
                console.log(sql);
                UserCoupon.query(sql,function (err,coupons) {
                    if(err) return res.negotiate(err);
                    if(coupons&&coupons.length>0){
                        console.log('getNewUserCoupon\'s length is ',coupons.length);
                        UserCoupon.update({cmode:3,status:[0,1],cendtime:{">":curTime},view:0,uid:member.id}).set({view:1}).exec(function (err,records) {
                            if(err) return res.negotiate(err);
                            console.log(records);
                            return res.json({
                                code:200,
                                data:coupons[0]
                            });
                        });
                    }else{
                        return res.json({
                            code:400,
                            msg:"没有数据"
                        });
                    }

                });

            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });
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
        console.log(req.ip,req.path);
        var id=req.param("id");
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        if (!tokenId || !mId) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                coupon.findOne({id:id}).exec(function (err,record) {
                    if(err) return res.negotiate(err);
                    if(record){
                        var condition={
                            uid: member.id,
                            cid:id
                        };
                        UserCoupon.find(condition).exec(function (err,records) {
                            if(err) return res.negotiate(err);
                            if(records&&records.length>0){
                                var ret=Object.assign(record,records[0]);
                                return res.json({
                                    code:200,
                                    data:ret
                                });
                            }else{
                                return res.json({
                                    code:400,
                                    msg:"没有记录"
                                });
                            }
                        });
                    }else{
                        return res.json({
                            code:400,
                            msg:"没有数据"
                        });
                    }
                });

            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });
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
        console.log(req.ip,req.path);
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var status=req.param("status");
        var start=req.param("start");
        var end=req.param("end");
        var type=req.param("type");
        var useStart=req.param("ustart");
        var useEnd=req.param("uend");
        if (!tokenId || !mId) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        var curTime=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);

            if(ret&&ret.code==200){
                var member=ret.user;
                var sql="select b.* from" +
                    " user_coupon a left join coupon b on a.cid=b.id where a.uid="+member.id;
                     if(start) sql+=" AND a.createdAt>='"+start+"'";
                     if(end) sql+=" AND a.createdAt<='"+end+"'";
                    if(useStart) sql+=" AND a.usedAt>='"+useStart+"'";
                    if(useEnd) sql+=" AND a.usedAt<='"+useEnd+"'";
                    if(type==1){
                        sql+=" AND a.cmode IN(2,3,4) AND a.status IN(0,1,3) AND b.isdel=0 ";
                    }else if([0,-1,1,2].indexOf(status)!=-1){
                        sql+=" AND a.status="+status ;
                    }
                    sql+=" AND b.isvalid=1 ";
                    sql+=" ORDER BY a.cendtime ASC,a.cmoney DESC";
                    console.log(sql);
                UserCoupon.query(sql,function (err,coupons) {
                    if(err) return res.negotiate(err);
                    if(coupons.length>0){

                        var enableCoupons=[],disableCoupons=[];
                        coupons.forEach(function (cp) {
                            cp.userangecon=JSON.parse(cp.userangecon);
                            var cTime=(new Date()).getTime();
                            if((new Date(cp.endtime)).getTime()>cTime){
                                enableCoupons.push(cp);
                            }else{
                                disableCoupons.push(cp);
                            }
                        });
                        return res.json({
                            code:200,
                            data:{
                                enable:enableCoupons,
                                disable:disableCoupons
                            }
                        });
                    }else{
                        return res.json({
                            code:400,
                            msg:"没有记录"
                        });
                    }
                });

            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });
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
        console.log(req.ip,req.path);

        var status=req.param("status");
        var start=req.param("start");
        var end=req.param("end");
        var useStart=req.param("ustart");
        var useEnd=req.param("uend");
        var type=req.param("type");
        var uid=req.param("uid");
        var storeid=req.param("storeid");
        var cid=req.param("cid");
        var condition={};
        if(start||end){
            condition.createdAt={};
        }
        if(start){
            condition.createdAt[">="]=start;
        }
        if(end){
            condition.createdAt["<="]=end;
        }
        if(useStart||useEnd) condition.usedAt={};
        if(useStart) condition.usedAt[">="]=useStart;
        if(useEnd) condition.usedAt["<="]=useEnd;
        if(status) condition.status=status;
        if(status==2){
            condition.orderid={"!":0};
            condition.status=[-1,2];
        }

        if(cid) condition.cid=cid;
        if(type) condition.cmode=type;
        if(uid) condition.uid=parseInt(uid);
        var mine=req.session.mine;
        if(mine.storeid){
          //  condition.storeid=mine.storeid;
        }
        condition.sort={cendtime:"ASC",cmoney:"DESC",createdAt:"DESC",usedAt:"DESC"};
        console.log(condition);
        UserCoupon.find(condition).exec(function (err,records) {
            if(err) return res.negotiate(err);
            if(records&&records.length>0){
                return res.json({
                    code:200,
                    data:records
                });
            }else{
                return res.json({
                    code:400,
                    msg:"没有记录"
                });
            }
        });

    },
    /**
     * 获取优惠券总数
     * @param tokenId string 用户token
     * @param mId int 用户id
     * @param req
     * @param res
     */
    getCouponCnt:function (req,res) {
        console.log(req.ip,req.path);
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        if (!tokenId || !mId) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        var curTime=(new Date()).Format("yyyy-MM-dd hh:mm:ss");
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                var sql="select count(*) as cnt from user_coupon where uid="+member.id
                    +" AND status IN(0,1,3)  UNION ALL (select count(*) as cnt from coupon a right join user_coupon b on a.id=b.cid where (b.cmode BETWEEN 2 AND 4) AND b.uid="+member.id
                    +" AND (b.status IN(0,1,3)) AND (b.cmode BETWEEN 2 AND 4) AND a.endtime>'"+curTime+"'  AND a.isvalid=1 AND a.isdel=0)";
                console.log(sql);
                UserCoupon.query(sql,function (err,records) {
                    if(err) return res.negotiate(err);
                    console.log(records);
                    if(records&&records.length>0){
                        var totalCnt=records[0]["cnt"]||0;
                        var enableCnt=records[1]["cnt"]||0;
                        var disableCnt=totalCnt-enableCnt;
                        return res.json({
                            code:200,
                            data:{
                                total:totalCnt,
                                enable:enableCnt,
                                disabled:disableCnt,
                            }
                        });
                    }else{
                        return res.json({
                            code:400,
                            msg:"没有记录"
                        });
                    }
                });

            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });
    },
    /**
     * 根据优惠券获取所有商品
     * @param code string 兑换码
     * @param vid int 优惠券id
     * @param req
     * @param res
     */
    getGoodsByCoupon:function(req,res){
        console.log(req.ip,req.path);
        var code=req.param("code");
        var vid=req.param("vid");
        var condition={};
        if(code)condition.code=code;
        if(vid)condition.id=vid;
        condition.isvalid=1;
        coupon.findOne(condition).exec(function (err,theCp) {
            if(err) return res.negotiate(err);
            if(theCp){
                var where={};
                var categories=[];
                var skus=[];
                var sql="select id,storecategoryid,propertyvaluelist,brandid,storeid,name,keywords,sku,imagedefault,type," +
                    "attachment,price,pricepoint,pricepromotion,deposit,premoneey,parentid from mergoodsList"+theCp.storeid+" ";
                var useRange=JSON.parse(theCp.userangecon);
                    switch (theCp.userange){
                        case 1:
                             useRange.forEach(function (rg) {
                                  categories.push(rg.id);
                             });
                            sql+=" where parentid IN("+categories.join(",")+") AND status=3 AND goodsseries=0 ";
                            break;
                        case 2:
                            sql+=" where  status=3 AND goodsseries=0 ";
                            break;
                        case 3:
                            useRange.forEach(function (rg) {
                                skus.push("'"+rg.sku+"'");
                            });
                            sql+=" where sku IN("+skus.join(",")+") AND status=3";
                            break;
                    }
                    console.log(sql);
                    Creator.query(sql,function (err,goods) {
                        if(err) return res.negotiate(err);
                        console.log(theCp);
                        if(goods&&goods.length>0){
                            var products=[];
                              if(theCp.userange==1){
                                  useRange.forEach(function (ur) {
                                       var cat={
                                           id:ur.id,
                                           cname:ur.name,
                                           goods:[]
                                       };
                                      console.log(cat);
                                      goods.forEach(function (product) {
                                          console.log(product.parentid,ur.id);
                                          if(product.parentid==parseInt(ur.id)){
                                              cat.goods.push(product);
                                          }
                                      });
                                      products.push(cat);
                                  });

                              }else if(theCp.userange==2){
                                  products=goods;
                              }else if(theCp.userange==3){
                                  products=goods;
                              }
                            return res.json({
                                code:200,
                                data:products
                            });
                        }else{
                            return res.json({
                                code:400,
                                msg:"没有数据"
                            });
                        }
                    });
            }else{
                return res.json({
                    code:200,
                    msg:"该优惠券不存在或者可能过期"
                });
            }
        });
    },

    /**
     * 导出优惠券使用记录
     *@param  cid  int/string 优惠券id或者优惠券id组成的字符串
     * @param req
     * @param res
     */
    exportExcel: function (req, res) {
        console.log(req.ip,req.path);
        var cid = req.param("cid");
        if (!cid) {
            return res.json({
                code: 400,
                msg: '参数不正确'
            });
        }
        var where = {id: cid};
        var mine=req.session.mine;
        if(!mine){
            return res.json({
                code:400,
                msg:"用户未登录"
            });
        }
        if (mine.storeid) {
            where.storeid = mine.storeid;
        }
        coupon.findOne(where).exec(function (err,cp) {
            if(err) return res.negotiate(err);
            if(cp){
                UserCoupon.find({cid:cid},function (err, records) {
                    if (err)   return res.negotiate(err);
                    var data = [];
                    for (var i = 0; i < records.length; i++) {
                        data.push({
                            "编号": records[i].id,
                            "订单编号": records[i].orderid,
                            "兑换码":records[i].code,
                            "兑换者": records[i].user,
                            "使用时间": records[i].usedAt,
                            "是否兑换":records[i].status==2?"是":"否"
                        });
                    }
                    utility.exportExcelList(req, res, data);
                });
            }else{
                return res.json({
                    code:400,
                    msg:"你查询的优惠券不存在"
                });
            }
        });

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
        console.log(req.ip,req.path);
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var code=req.param("ecode",false);
        if (!tokenId || !mId||!code) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        console.log("coupon/exchange",req.allParams());
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                UserCoupon.obtainEntityCoupon(member.id, member.usermobile, code, function (err,ret) {
                    if(err) return res.negotiate(err);
                    return res.json(ret);
                });
            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });
    },
    /**
     * 二维码生成地址
     * @param content string 内容
     * @param req
     * @param res
     */
    qcode:function (req,res) {
        console.log(req.ip,req.path);
        var referer=req.headers.referer;
        if(!referer){
            return res.end("error");
        }
        var hosts=[
            '119.147.36.61',
            'dev.darlinglive.com',
            "devmer.darlinglive.com",
            "devmana.darlinglive.com",
            "testmana.darlinglive.com",
            "testmer.darlinglive.com",
            "management.darlinglive.com",
            "merchant.darlinglive.com",
            'pronode2.darlinglive.com',
            'pronode.darlinglive.com',
            'devnode.darlinglive.com',
            'testnode.darlinglive.com'
        ];
        var urls=referer.match(/^http:\/\/([a-zA-Z0-9\.\-]+)(\/)?/);
         console.log("服务器:"+referer);
         if(urls&&urls.length>0&&urls[1]){
             if(hosts.indexOf(urls[1])==-1){
                 console.log("地址错误");
                 return res.end("error");
             }else{
                 var qr = require('qr-image');
                 var qcode=req.param("content");
                 var img = qr.image(qcode,{size :10});
                 res.writeHead(200, {'Content-Type': 'image/png'});
                 img.pipe(res);
             }
         }else{
              return res.end("error");
         }
    },
    /**
     * 下载图片
     * @param content string 验证码内容
     * @param req
     * @param res
     */
    downImg:function(req,res){
        console.log(req.ip,req.path);
        var mine=req.session.mine;
        if(!mine){
            return res.json({
                code:400,
                msg:"你没有权限访问"
            });
        }
        var qr = require('qr-image');
        var qcode = req.param("content");
        var img = qr.image(qcode,{size :10});
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);
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

        var skus=req.param("skus");
        var tokenId = req.param("tokenId", 0);
        var mId = req.param("mId", 0);
        var type = req.param("type", 0);
        if (!tokenId || !mId||!skus) {
            return res.json({
                code: 400,
                msg: "参数缺失"
            });
        }
        var skus=skus.split(',');
        console.log(skus);
        var skuObj=gcom.revertSku(skus[0]);
        var storeid=skuObj.storeid;
        common.getLoginUser(req, tokenId, mId, function (err,ret) {
            if (err) return res.negotiate(err);
            if(ret&&ret.code==200){
                var member=ret.user;
                var pSkus=[];
                skus.forEach(function (item) {
                    pSkus.push("'"+item+"'");
                });
                var sql="select * from mergoodsList"+storeid+" where sku IN ("+pSkus.join(",")+")";
                console.log(sql);
                Creator.query(sql,function (err,goods) {
                    if(err) return res.negotiate(err);
                    if(goods&&goods.length>0){
                        var products=[],amount=0;
                        var gSkus=[],cIds=[];
                        goods.forEach(function (product) {
                            skus.forEach(function (sku) {
                                if(product.sku==sku){
                                  var skuObj=gcom.revertSku(product.sku);
                                  var realSku=skuObj.randomNum+"-"+skuObj.storeid+"-"+skuObj.timestamp;
                                   products.push({
                                       parentid:product.parentid,
                                       price:product.price,
                                       sku:realSku,
                                       storeid:product.storeid,
                                   });
                                    amount+=product.price;
                                    gSkus.push(realSku);
                                    cIds.push(product.parentid);
                                }
                            });
                        });
                        console.log(products,amount);
                        if(type==1){
                            UserCoupon.getEnableCouponByGoods(products,amount,member,cIds,gSkus,function (err,ret) {
                                if(err) return res.negotiate(err);
                                return res.json(ret);
                            });
                        }else if(type==2){
                            UserCoupon.getEnableFullCutCouponByGoods(products,amount,member.id,cIds,gSkus,function (err,ret) {
                                if(err) return res.negotiate(err);
                                return res.json(ret);
                            });
                        }else if(type==3){
                            async.series({
                                custom:function (cb) {
                                    UserCoupon.getEnableCouponByGoods(products,amount,member,cIds,gSkus,cb)
                               },
                                fullcut:function (cb) {
                                    UserCoupon.getEnableFullCutCouponByGoods(products,amount,member.id,cIds,gSkus,cb);
                                }
                            },function (err,ret) {
                                if(err) return res.negotiate(err);
                                var disabled=ret.custom.data.disableCps||[];
                                console.log("---------------------------------");
                                console.log(ret);
                                console.log("---------------------------------");
                                return res.json({
                                    code:200,
                                    data:{
                                        custom:ret.custom.data.enableCps,
                                        fullcut:ret.fullcut.data,
                                        disabled:disabled

                                    }
                                });
                            });
                        }else{
                            return res.json({
                                code:400,
                                msg:"参数type未传递"
                            });
                        }

                    }else{
                        return res.json({
                            code:400,
                            msg:"商品不存在"
                        });
                    }
                });
            }else{
                return res.json({
                    code: 400,
                    msg: "用户未登录，或登录已失效"
                });
            }
        });
    },
    /*
    *发送消息提示
    * mine 发送消息的账户
    * content 消息内容
    * receiverUsers  接收消息的账户
    * retdata  返回客服端信息
    * callback 回调函数
     */
    couponMsg:function(mine,content,receiverUsers){
        var sign = utility.generateMixed(3, false);
        sign += Math.ceil((new Date()).getTime() / 1000);
        var detail = content.replace(/<[^>]+>/g, '');
        var title = detail.substring(0, 40);
        var sendid =  mine.id;
        var sender = mine.shop_name;
        var sendavatar = mine.logo;

        async.series({
            online: function (next) {
                console.log("保存数据");
                async.mapSeries(receiverUsers, function (item, cb) {
                    var kVal = {};
                    kVal.senderid = sendid;
                    kVal.sendername = sender;
                    kVal.rid = item.id;
                    kVal.receiver = item.usermobile;
                    if (mine.storeid == 0) {
                        kVal.type = 1
                    } else {
                        kVal.type = 0;
                    }

                    kVal.status = 0;
                    kVal.storeid = mine.storeid;
                    kVal.title = title;
                    kVal.content = content;
                    kVal.sign = sign;
                    kVal.sendavatar = sendavatar;

                    kVal.createdAt = kVal.updatedAt = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
                    UserMsgprototype.sendMsg(kVal, cb);
                }, next);
            },
            save: function (next) {
                var extra = {
                    sign: sign,
                    sender: sender,
                    sendavatar: sendavatar
                };
                var sendUsers=[];
                receiverUsers.forEach(function (ac) {
                    sendUsers.push("dl_"+ac.id);
                });
                console.log(sendUsers.join(","));
                common.pushMessage(sendUsers.join(","),title,content,extra,next);
            }
        }, function (err, ret) {
            if (err) return console.log(err);
            console.log(ret);
        });
    }
};
