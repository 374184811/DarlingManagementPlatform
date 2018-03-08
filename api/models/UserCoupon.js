/**
 * User_coupon.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    lowMoney:0.1,
    tableName: "user_coupon",
    attributes: {
        id: {
            type: "integer",
            size: 11,
            primaryKey: true,
        },
        uid: { //用户id
            type: "integer",
            size: 10,
        },
        user: { //用户名或者手机号
            type: "string",
            size: 50,
            defaultsTo:0,
        },
        cid: { //优惠券id
            type: "integer",
            size: 10,
        },
        cname: {//优惠券名称
            type: "string",
            size: 50,
        },
        cmoney: {//优惠类型
            type: "float",
            size: 10,
        },
        cmode: { //优惠模式
            type: "integer",
            size: 1,
        },
        type: { //优惠类型
            type: "integer",
            size: 1,
        },
        code: { //优惠券兑换码
            type: "string",
            size: 10,
        },
        qcode: { //优惠券生成二维码的地址
            type: "string",
            size: 255,
        },
        status: { //优惠券状态,-1不可用，1已领取，2已经使用，0已派发,3链接领取 -2已失效
            type: "integer",
            size: 1,
        },
        ip:{
            type:"string",
            size:15
        },
        view:{//是否查看
            type: "integer",
            size: 1,
        },
        orderid: { //订单id
            type: "string",
            size: 50,
            defaultsTo:0,
        },
        usedAt: {//使用时间
            type: "datetime"
        },
        createdAt: { //创建时间(领取时间)
            type: "datetime",
        },
        cendtime: { //优惠券最后截止时间
            type: "datetime",
        },
    },
    autoCreatedAt: true,
    autoUpdatedAt: false,
    /**
     *
     * @param cstartime  开始时间
     * @param cendtime 结束时间
     * @param type 类型
     * @returns {string}
     */
    generateOrdinaryCode: function (cstartime, cendtime, type) {
        var startTime = (new Date(cstartime)).getTime() / 1000;
        var endTime = (new Date(cendtime)).getTime() / 1000;
        return Math.ceil(startTime) + "-" + this.generateCode() + "-" + Math.ceil(endTime) + "-" + type;
    },
    /**
     * 生成实体兑换码
     * @returns {*|randkey|返回随机码}
     */
    generateCode: function () {
        return utility.generateMixed(6 + Math.ceil(Math.random() * 10) % 3, false);
    },
    /**
     * 分发实体优惠券
     * @param num
     * @param coupon
     * @param callback
     */
    publishEntityCoupon: function (num, coupon, callback) {
        var _this = this;
        var time = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        var coupons = [];
        for (var i = 0; i < num; i++) {
            var code = _this.generateCode();
            var record = {
                uid: 0,
                cname: coupon.couponname,
                type: coupon.coupontype,
                cmoney: coupon.parvalue,
                cmode: coupon.couponmode,
                cendtime: coupon.endtime,
                cid: coupon.id,
                orderid: '',
                code: code,
                createdAt: time,
                status: -1,
                qcode: '',
            };
            coupons.push(record);
        }

        this.insertData(coupons, callback);

    },
    /**
     * 用户领取实体券
     * @param uid
     * @param code
     */
    obtainEntityCoupon: function (uid, username, code, callback) {
        var _this = this;

        this.findOne({code:code,cmode:4}).exec(function (err, dat) {
            if (err) return callback(err, {code: 501, msg: "服务器错误"});
            if(!dat){
                callback(null, {code: 404, msg: "兑换失败，检查一下兑换码是否有误哟"});
            }else if (dat&&dat.status==1) {
                callback(null, {code: 400, msg: "该兑换码已兑换过"});
            }else {
                coupon.findOne({id:dat.cid,isvalid:1}).exec(function (err,cp) {
                    if (err) return callback(err, {code: 503, msg: "服务器错误"});
                    if(cp){
                        console.log(cp);
                        if((new Date(cp.endtime)).getTime()<(new Date()).getTime()){
                            return  callback(null,{
                                code:402,
                                msg:"优惠券已过期"
                            });
                        }
                        var where={cid:dat.cid,code: code,cmode:4, status:-1};

                        var sql="select count(*) as cnt from user_coupon where cid="+dat.cid+" AND uid="+uid;
                        _this.query(sql,function (err,count) {
                            if (err) return callback(err, {code: 505, msg: "服务器错误"});

                            if(parseInt(count[0]["cnt"])<parseInt(cp.limitnum)){

                                _this.update({code: code,cmode:4, status:-1}).set({
                                    uid: uid,
                                    user: username,
                                    status: 1
                                }).exec(function (err, ret) {
                                    if (err) {
                                        return callback(err, {code: 502, msg: "服务器错误"});
                                    }

                                    if (ret&&ret.length>0) {
                                        callback(null, {code: 200, msg: "领取成功",data:cp.couponname});
                                    } else {
                                        callback(null, {code: 401, msg: "领取失败"});
                                    }
                                });
                            }else{
                                callback(null, {code: 402, msg: "领取失败,已超过领取限制"});
                            }

                        });
                    }else{
                        callback(null, {code: 400, msg: "领取失败,优惠券失效或者不存在"});
                    }



                });

            }
        });
    },
    /**
     * 向指定用户分发优惠券
     * @param usermobiles
     * @param storeid
     * @param coupon   object  "id","couponname","couponamount","couponmode",coupontype,"coupontype",'endtime','couponamount',
     * @param code
     * @param callback
     */
    distributeCoupon: function (usermobiles, storeid, coupon, code, callback) {
        var _this = this;
        var condition = {operatorno: storeid};
        if (usermobiles.length > 0) {
            condition.usermobile = usermobiles;
        }
        this.query("select count(*) as cnt from user_coupon where cid="+coupon.id,function (err,grant) {
            if (err) return callback(err, {code: 502, msg: "服务器错误"});
            var grantCount=grant&&grant[0]&&grant[0]["cnt"]?grant[0]["cnt"]:0;
            var num = parseInt(coupon.couponamount) - parseInt(grantCount); //剩余可以发送的数量

            if (num < 1) {
                return callback(err, {code: 502, msg: "没有足够的优惠券",failUsers:usermobiles});
            }
            var time = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
            Account.find(condition).exec(function (err, users) {
                if (err) callback(err, {code: 502, msg: "数据库错误!"});
                if (users && users.length > 0) {
                    async.mapSeries(users, function (userinfo, cb) {
                        _this.find({cid: coupon.id, uid: userinfo.id}).exec(function (err, coup) {
                            cb(err, {
                                id: userinfo.id,
                                usermobile: userinfo.usermobile,
                                cnt: coup ? coup.length : 0
                            });
                        });
                    }, function (err, ret) {
                        if (err) return callback(err, {code: 502, msg: "服务器错误"});
                        var totalUsers = [],failUsers=[];
                        console.log("======================");
                        console.log(ret);
                        console.log("======================");
                        for (var i = 0; i < ret.length; i++) {
                            if (ret[i].cnt < parseInt(coupon.limitnum)) {
                                totalUsers.push(ret[i]);
                            }
                        }

                        var sendUsers = totalUsers;
                        if (num < totalUsers.length) {
                            sendUsers = totalUsers.slice(0, num);
                        }
                        console.log(sendUsers.length, totalUsers.length, num, coupon);
                        var sendMobiles=[];
                        sendUsers.forEach(function (item) {
                            sendMobiles.push(parseInt(item.usermobile));
                        });

                        if(usermobiles.length>0){
                            usermobiles.forEach(function (mobile) {
                                var mobile=parseInt(mobile);
                                if(sendMobiles.indexOf(mobile)==-1){
                                    failUsers.push(mobile);
                                }
                            });
                        }else{
                            // console.log(sendMobiles);
                            users.forEach(function (user) {
                                var mobile=parseInt(user.usermobile);
                                if(sendMobiles.indexOf(mobile)==-1){
                                    failUsers.push(mobile);
                                }
                            });
                        }
                        if (sendUsers.length < 1) {
                            return callback(err, {code: 403, msg: "没有人需要发送",failUsers:failUsers});
                        }

                        var sendData = [];
                        for (var i = 0; i < sendUsers.length; i++) {
                            var newRecord = {
                                uid: sendUsers[i].id,
                                user: "" + sendUsers[i].usermobile,
                                cid: coupon.id,
                                cname: coupon.couponname,
                                type: coupon.coupontype,
                                cmoney: coupon.parvalue,
                                cmode: coupon.couponmode,
                                cendtime: new Date(coupon.endtime).Format("yyyy-MM-dd hh:mm:ss"),
                                orderid: '',
                                createdAt: time,
                                status: 0,
                                qcode: ''
                            };
                            sendData.push(newRecord);
                        }

                        _this.insertData(sendData, function (err, ret) {
                            if (err) return callback(err, {code: 502, msg: "数据库错误"});
                            callback(err, {code: 200, msg: "有" + ret.affectedRows + "条发送成功!", count: ret.affectedRows,failUsers:failUsers,sendUsers:sendUsers});
                        });

                    });
                } else {
                    callback(null, {code: 503, msg: "用户全部没有注册",failUsers:usermobiles});
                }
            });
        });



    },
    insertData: function (dat, callback) {

        if (_.isArray(dat)) {
            var keys = _.keys(dat[0]);
            var sql = "insert into user_coupon (" + keys.join(",") + ") values";
            for (var i = 0; i < dat.length; i++) {
                var values = [];
                for (var key in dat[i]) {
                    if (isNaN(dat[i][key])) {
                        values.push("'" + dat[i][key] + "'");
                    } else {

                        values.push(dat[i][key] || 0);
                    }
                }
                sql += "(" + values.join(",") + "),";
            }
            sql = sql.substring(0, sql.length - 1);

        } else {
            var keys = _.keys(dat), values = [];
            for (var key in dat) {
                if (isNaN(dat[key])) {
                    values.push("'" + dat[key] + "'");
                } else {
                    values.push(dat[key] || 0);
                }
            }
            var sql = "insert into user_coupon (" + keys.join(",") + ") values(" + values.join(",") + ")";

        }
         console.log(sql);
        this.query(sql, callback);
    },
    /**
     * 用户领取优惠券
     * @param userinfo object 用户id 用户名
     * @param coupon   object  "id","couponname","couponamount","couponmode","coupontype",'endtime','couponamount',couponname,parvalue,couponmode
     * @param callback
     */
    obtainCoupon: function (userinfo, coupon, callback) {

        var _this = this;
        var time = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        this.find({cid: coupon.id, uid: userinfo.id}).exec(function (err, dat) {
            if (err) return callback(err, {code: 501, msg: "数据库错误"});
            console.log(dat);
            if (dat && dat.length >= coupon.limitnum) {
                callback(err, {code: 503, msg: "已经领取过了" + coupon.limitnum});
            } else {
                pubCoupon(userinfo, coupon, callback);
            }
        });
        function pubCoupon(userinfo, coupon, callback) {
            var newRecord = {
                uid: userinfo.id,
                user: "" + userinfo.usermobile,
                cid: coupon.id,
                type: coupon.coupontype,
                cname: coupon.couponname,
                cmoney: coupon.parvalue,
                cmode: coupon.couponmode,
                orderid: '',
                createdAt: time,
                status: 0,
                qcode: ''
            };
            _this.create(newRecord).exec(function (err, ret) {
                if (err) return callback(err, {code: 502, msg: "服务器错误"});
                if (ret) {
                    callback(err, {code: 200, msg: "领取成功"});
                } else {
                    callback(err, {code: 505, msg: "领取失败"});
                }
            });
        }

    },
    /**
     * 使用优惠券
     * @param orderid
     * @param uid
     * @param coupon Object "id","couponname","couponamount","couponmode","coupontype",'endtime'
     * @param callback
     */
    useCoupon: function (orderid, uid, coupon, callback) {
        for (var key in ["id", "couponname", "couponamount", "couponmode", "coupontype", 'endtime']) {
            if (!coupon.hasOwnProperty(key)) {
                callback(null, {code: 501, msg: "参数不全"});
                return;
            }
        }
        var condition = {
            cid: coupon.id,
            uid: uid
        };
        var time = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
        var set = {
            orderid: orderid,
            usedAt: time,
            status: 2,
            cname: coupon.couponname,
            type: coupon.coupontype,
            cmode: coupon.couponmode,
            cendtime: coupon.endtime,
            cmoney: coupon.couponamount,
        };
        this.update(condition).set(set).exec(callback);
    },
    /**
     * 根据商品获取用户可用和不可用优惠券
     * @param goods
     * @param amount
     * @param user
     * @param callback
     *
     *products,amount,member,isCommonType,gSkus,cb
     */
    getEnableCouponByGoods:function (goods,amount,user,cIds,gSkus,callback) {
        console.log("订单总金额:",amount,UserCoupon.lowMoney);
        var _this=this;
        var curTime=(new Date().Format("yyyy-MM-dd hh:mm:ss"));
        var sql="select a.id as aid,b.id,b.couponname,b.coupontype,b.couponmode,b.parvalue,b.picture,b.userange,b.userangecon,b.islimitmoney,b.attainmoney," +
            "b.endtime,b.isrepeat,b.starttime,b.remark,b.islimitmoney,b.attainmoney from user_coupon a right join coupon b on a.cid=b.id where b.storeid="
            +goods[0].storeid+"  AND b.endtime>'"+curTime +"'  AND a.status IN(0,1) AND a.uid="+user.id
            +" AND (a.orderid is NULL OR a.orderid='0' OR a.orderid='') AND b.isvalid=1 AND b.isdel=0 ORDER BY b.endtime ASC,b.parvalue DESC";
        console.log(sql);
        this.query(sql,function (err,cps) {
            if(err) callback(err,null);
             console.log(cps.length);
            if(cps&&cps.length>0){
                var enableCps=[],disableCps=[];
                var tmpCps=_this.DistCouponRange(cps,amount,goods,cIds,gSkus);
                console.log("返回可用和不可用优惠券id：",tmpCps);
                var disableCpIds=tmpCps.disable.unique();
                var enableCpIds=tmpCps.enable.unique();
                console.log("总共有张"+cps.length+"优惠券,可用和不可用优惠券id",disableCpIds,enableCpIds);
                var aids=[];
                cps.forEach(function (cp) {
                    aids.push(cp.aid);
                    cp.userangecon=JSON.parse(cp.userangecon);
                    disableCpIds.forEach(function (id) {
                        if(cp.aid==id){
                            disableCps.push(cp);
                        }
                    });
                    enableCpIds.forEach(function (id) {
                        if(cp.aid==id){
                            if((new Date(cp.starttime)).getTime()>(new Date()).getTime()){
                                disableCps.push(cp);
                            }else{
                                enableCps.push(cp);
                            }

                        }
                    });
                });
                console.log("全部优惠券:",aids);
                if(disableCpIds.length<=0&&enableCpIds.length<=0){
                    callback(null,{code:404,msg:"没有可用优惠券",data:[]});

                }else{
                    callback(null,{code:200,data:{
                        disableCps:disableCps,
                        enableCps:enableCps
                    }});
                }

            }else{
                callback(null,{code:404,msg:"没有可用优惠券",data:[]});
            }
        });
    },
    /**
     * 区分可用和不可用优惠券
     * @param cps
     * @param goods
     * @returns {{enable: Array, disable: *}}
     * @constructor
     * cps,amount,goods,isCommonType,gSkus
     */
    DistCouponRange:function (cps,amount,goods,cIds,gSkus) {
        var enableCps=[],disableCps=[];
        function diffCoupon(cp,sMoney,enableCps,disableCps){
            if(amount-cp.parvalue>=UserCoupon.lowMoney){
                if(cp.islimitmoney==1){
                    if(cp.attainmoney<=sMoney){
                        enableCps.push(cp.aid);
                    }else{
                        disableCps.push(cp.aid);
                    }
                }else if(cp.islimitmoney==2){
                    enableCps.push(cp.aid);
                }else{
                    disableCps.push(cp.aid);
                }
            }else{
                disableCps.push(cp.aid);
            }
        }

        for(var i=0;i<cps.length;i++){
            var cp=cps[i];
            var userangecon=JSON.parse(cp.userangecon);
            console.log("*******************************");
            console.log("每个使用范围：",cp.aid,cp.userange);
            console.log("*******************************");
            switch(cp.userange){

                case 1:
                    var catIds=[],isCommonType=true;
                    userangecon.forEach(function (con) {
                        catIds.push(parseInt(con.id));
                    });
                    console.log("****************");
                    console.log("允许类别:",cp.couponname,catIds);
                    console.log("****************");
                    for(var j=0;j<cIds.length;j++){
                        if(catIds.indexOf(cIds[j])==-1){
                            isCommonType=false;
                            break;
                        }
                    }
                    if(!isCommonType){
                        disableCps.push(cp.aid);
                        break;
                    }
                    var sMoney=0;
                    goods.forEach(function (product) {
                        sMoney+=product.price;
                    });
                    console.log("同类别商品价格："+sMoney);
                    diffCoupon(cp,sMoney,enableCps,disableCps);
                    break;
                case 2:
                    console.log("调用-----");
                    if(amount-cp.parvalue>=UserCoupon.lowMoney){

                        if(cp.islimitmoney==1){
                            if(amount>=cp.attainmoney){
                                enableCps.push(cp.aid);
                            }else{
                                disableCps.push(cp.aid);
                            }

                        }else if(cp.islimitmoney==2){
                            enableCps.push(cp.aid);
                        }else{
                            disableCps.push(cp.aid);
                        }
                    }else{
                        disableCps.push(cp.aid);
                    }
                    // console.log("调用完成");
                 /*   goods.forEach(function (product) {
                        diffCoupon(cp,product,enableCps,disableCps);

                    });*/
                    console.log("2----完成");
                    break;
                case 3:

                    var enable=true, gconSKus=[];
                    for(var j=0;j<userangecon.length;j++){

                        gconSKus.push(userangecon[j].sku);
                    }
                    console.log("++++++++++++++++");
                    console.log(gSkus,gconSKus);
                    console.log("++++++++++++++++");
                    for(var j=0;j<gSkus.length;j++){
                        if(gconSKus.indexOf(gSkus[j])==-1){
                            enable=false;
                            break;
                        }
                    }

                    console.log("enable"+cp.id);
                    if(!enable){
                        console.log("不可用");
                        disableCps.push(cp.aid);
                    }else{
                        var sMoney=0;
                        goods.forEach(function (product) {
                            sMoney+=product.price;
                        });
                        console.log("可用商品总金额:",sMoney);
                        diffCoupon(cp,sMoney,enableCps,disableCps);
                    }
                    console.log("3----完成");
                    break;
            }

        };
        return {
            enable:enableCps,
            disable:disableCps
        };
    },
    /**
     * 获取可用的满减券
     * @param goods 商品列表
     * @param amount 金额
     * @param callback
     *
     */

    getEnableFullCutCouponByGoods:function (goods,amount,uid,cIds,gSkus,callback) {
        var curTime=(new Date().Format("yyyy-MM-dd hh:mm:ss"));
        // var sql="select id,couponname,coupontype,couponmode,parvalue,limitnum,picture,userange,userangecon,islimitmoney,attainmoney,remark," +
        //     "endtime,isrepeat,starttime from coupon where storeid="+goods[0].storeid+" AND couponmode=1 AND endtime>'"+curTime+
        //     "' AND isvalid=1 AND parvalue>0";
        var sql="select count(b.id) as user_count,a.* from coupon a LEFT JOIN user_coupon b on a.id=b.cid where a.couponmode=1" +
            " AND a.storeid="+goods[0].storeid+" AND a.couponmode=1 AND a.endtime>'"+curTime+
           "' AND a.isvalid=1 AND a.parvalue>0 AND a.isdel=0  GROUP BY a.id HAVING a.couponamount>user_count";
        sql+=" ORDER BY a.endtime ASC,a.parvalue DESC";
        console.log('----------------------------------');
        console.log(goods,amount,sql);
        console.log('----------------------------------');
        this.query(sql,function (err,cps) {
            if(err) callback(err,null);
            var enableCps=[],disableCps=[];
            console.log("满减券共有:"+cps.length);
            console.log("商品:",goods,amount);
            if(cps&&cps.length>0){
                cps.forEach(function (cp) {
                    var userangecon=cp.userangecon=JSON.parse(cp.userangecon);
                    if((new Date(cp.starttime)).getTime()>(new Date()).getTime()){
                        disableCps.push(cp.aid);
                    }else{
                        switch(cp.userange){
                            case 1:
                                var catIds=[],isCommonType=true;
                                userangecon.forEach(function (con) {
                                    catIds.push(parseInt(con.id));
                                });
                                console.log("****************");
                                console.log("允许类别:",cp.couponname,catIds);
                                console.log("****************");
                                for(var j=0;j<cIds.length;j++){
                                    if(catIds.indexOf(cIds[j])==-1){
                                        isCommonType=false;
                                        break;
                                    }
                                }
                                if(!isCommonType){
                                    disableCps.push(cp.aid);
                                    break;
                                }
                                var sum=0;
                                userangecon.forEach(function (range) {
                                    goods.forEach(function (product) {
                                        if(range.id==product.parentid){   //某个类别可以使用满减
                                            console.log("商品"+product.sku+"价格:"+product.price);
                                            sum+=product.price;
                                        }
                                    });
                                });
                                console.log("一个类别的商品总金额:",sum);
                                if(sum-cp.parvalue>=UserCoupon.lowMoney){//商品金额达到满减
                                    console.log("dddd");
                                    if(cp.islimitmoney==1&&cp.attainmoney<=sum){
                                        enableCps.push(cp);
                                    }else if(cp.islimitmoney==2){
                                        enableCps.push(cp);
                                    }else{
                                        disableCps.push(cp);
                                    }
                                }else{
                                    disableCps.push(cp);
                                }
                                break;
                            case 2:

                                if(amount-cp.parvalue>=UserCoupon.lowMoney){//商品金额达到满减
                                    console.log("aaaa");
                                    if(cp.islimitmoney==1&&cp.attainmoney<=amount){
                                        enableCps.push(cp);
                                    }else if(cp.islimitmoney==2){
                                        enableCps.push(cp);
                                    }else{
                                        disableCps.push(cp);
                                    }
                                }else{
                                    disableCps.push(cp);
                                }
                                break;
                            case 3:
                                var enable=true, gconSKus=[];
                                for(var j=0;j<userangecon.length;j++){
                                    gconSKus.push(userangecon[j].sku);
                                }
                                console.log("++++++++++++++++");
                                console.log(gSkus,gconSKus);
                                console.log("++++++++++++++++");
                                for(var j=0;j<gSkus.length;j++){
                                    if(gconSKus.indexOf(gSkus[j])==-1){
                                        enable=false;
                                        break;
                                    }
                                }

                                if(!enable){
                                    disableCps.push(cp);
                                    break;
                                }
                                var goodsAmount=0;
                                userangecon.forEach(function (range) {
                                    goods.forEach(function (product) {
                                        if(range.sku==product.sku){   //某个sku可以使用满减
                                            goodsAmount+=product.price;
                                        }
                                    });
                                });

                                console.log("goodsAmount:",goodsAmount);
                                if(goodsAmount-cp.parvalue>=UserCoupon.lowMoney){//商品金额达到满减
                                    if(cp.islimitmoney==1&&cp.attainmoney<=goodsAmount){
                                        enableCps.push(cp);
                                    }else if(cp.islimitmoney==2){
                                        enableCps.push(cp);
                                    }else{
                                        disableCps.push(cp);
                                    }
                                }else{
                                    disableCps.push(cp);
                                }
                                break;
                        }

                    }

                });
            }
            console.log(enableCps);
            async.mapSeries(enableCps,function (cp,cb) {
                    coupon.query("select count(*) as cnt from user_coupon where cid="+cp.id+" AND uid="+uid +" AND status IN(-1,2)",function (err,dat) {
                        if(err) cb(err,null);
                        var cnt=0;
                        if(dat&&dat.length&&dat[0]["cnt"]) cnt=dat[0]["cnt"];
                            console.log("某张满减券==="+cp.id+"---"+cnt+"---"+cp.limitnum);
                        if(cnt<cp.limitnum){
                            console.log("====");
                            cb(null,cp);
                        }else{
                            cb(null,null);
                        }
                    });
            },function (err,ret) {
                var retCps=[];
                ret.forEach(function (myCp) {
                    if(myCp){
                        retCps.push(myCp);
                    }
                });
                if(retCps.length>0&&retCps[0]){
                    callback(err,{code:200,data:retCps});
                }else{
                    callback(err,{code:200,data:[]});
                }

            });


        });
    }

};

