module.exports = {
    /**
     * 显示用户合约金额
     * mobile 手机号码
     * start 大于的起始金额
     * end  小于的截止金额
     * storeid 店铺id
     * @param req
     * @param res
     */
    moneyIndex: function (req, res) {
        this.checkIsPost(req, res);
        var mobile = req.param("mobile", 0);
        var start = req.param("start", 0);
        var end = req.param("end", 0);
        var storeid = req.param("storeid", 0);
        var num = req.param("num", 0);
        var offset = req.param("offset", 0);

        var condition = {};
        if (mobile != '') {
            condition.usermobile = {like: '%' + mobile + "%"};
        }
        if (start != '' && end != '') {
            condition.money = {">=":start,"<=":end};
        }
        var mine = req.session.mine;
        if(mine.storeid){
            condition.operatorno = mine.storeid;
        }else{
            if(!storeid){
                return res.json({
                    code:400,
                    msg:"请选择商铺"
                });
            }
            condition.operatorno =storeid;
        }
        console.log(condition);
        if (num) {
            query = Account.find(condition).skip(offset).limit(num)
        } else {
            query = Account.find(condition);
        }
        query.exec(function (err, records) {
            if (err) return res.negotiate(err);

            if (records.length > 0) {
                var lists = [];

                for (i = 0; i < records.length; i++) {
                    var record = records[i];
                    lists.push({
                        id: record.id,
                        username: record.useralias,
                        usermobile: record.usermobile,
                        money: record.money
                    });
                }
                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "返回成功",
                    "data": lists
                });
            } else {
                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "没有数据",
                    "data": []
                });
            }
        });

    },


    /**
     * 添加合约金
     *    money 金额
     *    uid 用户id
     * @return view                     //返回视图页面
     */
    addMoney: function (req, res) {
        this.checkIsPost(req, res);
        var money = req.param("money", 0);
        var uid = req.param("uid", 0);
        var mine = req.session.mine;
        if (!mine) {
            return res.json({
                code: 400,
                msg: '用户未登陆'
            });
        }

        Account.findOne({id: uid}).exec(function (err, entry) {
            if (err) {
                return res.negotiate(err);
            }
            if(entry.operatorno==mine.storeid){
                var wealth=parseFloat(entry.money)+ parseFloat(money);
                    console.log(entry.money,wealth);
                Account.update({id: uid}, {money:  wealth}).exec(function (err, account) {
                    if (err) {
                        return res.negotiate(err);
                    }
                    if (account.length > 0) {

                        var record = account[0];
                        var log = {
                            userid: record.id,
                            username: record.useralias,
                            storeid: mine.storeid,
                            operatorid: mine.id,
                            operatorname: mine.userAlias,

                            beforeprice: parseFloat(entry.money),
                            price: money,
                            afterprice: wealth
                        };
                        Logaddmoney.create(log).exec(function (err, log) {
                            if (err) {
                                return res.negotiate(err);
                            }
                            return res.json({
                                code: 200,
                                msg: '添加成功',
                            });

                        });
                    } else {
                        return res.json({
                            msg: e.message,
                            code: 400
                        });
                    }

                });
            }else{
                return res.json({
                            msg: '只能给本商户会员充值合约金',
                            code: 400
                        });
            }


        });

    },
    /**
     * 显示某个用户在某个店铺下的合约记录
     *@param uid 用户Id
     *@param storeid 店铺id
     *@param num int 每页显示多少条
     *@param offset 每页显示的其实偏移量
     * @param req
     * @param res
     */
    moneylist: function (req, res) {
        var uid = req.param("uid", 0);
        var storeid = req.param("storeid", 0);
        var num = req.param("num", 0);
        var offset = req.param("offset", 0);
        
        if (num) {
            query = Logaddmoney.find({userid: uid, storeid: storeid}).skip(offset).limit(num)
        } else {
            query = Logaddmoney.find({userid: uid, storeid: storeid});
        }
        query.exec(function (err, records) {
            if (err) return res.negotiate(err);
            if (records.length > 0) {
                return res.json({
                    "success": true,
                    "code": 200,
                    "msg": "",
                    "data": records
                });
            } else {
                return res.json({
                    "success": false,
                    "code": 400,
                    "msg": "没有数据",
                    "data": ""
                });
            }

        });


    },

    /**
     * 合约金参数
     *
     * @param  userid               //充值的用户id
     * @param  storeid              //运营商 ID
     * @param  operatorid           //操作员 id
     * @param  username             //充值用户名字
     * @param  operatorname         //操作员名字
     * @param  beforeprice          //充值前金额
     * @param  price                //充值金额
     * @param  afterprice           //充值后金额
     *
     * @return {}                   //返回结果集
     */
    logAddMoneyParameter: function (req, res) {

        var msg = {} || msg;
        msg.price = req.param('price');
        msg.userid = req.param('userid');
        msg.storeid = req.param('storeid');
        msg.username = req.param('username');
        msg.afterprice = req.param('afterprice');
        msg.operatorid = req.param('operatorid');
        msg.beforeprice = req.param('beforeprice');
        msg.operatorname = req.param('operatorname');
        console.log('logAddMoneyParameter: This is the function entry.  check it out: ', msg);

        for (var key in msg) {
            if (msg[key] == undefined || msg[key] == '') {
                delete msg[key];
            }
        }

        Logaddmoney.create(msg, function afterFind(err, loglist) {

            if (err) {
                console.log("err_ta1: When this error is returned, the query fails.");
                return res.negotiate(err);
            }


            console.log("cb_tag1: The data of this \' create \' is shown came out. check it out: ok");
            return res.json({
                user: loglist,
                code: 202
            });
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

};
