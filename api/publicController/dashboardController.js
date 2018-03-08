/**
 * DashboardController
 *
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Redis = require("redis");
module.exports = {
    /**
     * 后台首页显示用户总数，昨日订单数，总商户数量,今日订单数量
     */
    index: function (req, res) {
        console.log(req.ip,req.path);
        var config = sails.config.connections.redis;
        config.db=3;
        var redis=new Redis.createClient(config);

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var mine = req.session.mine;
       
        //console.log("+++++++++++++++++++++++++++++++++++++++++++++");
        //console.log(mine);
        //console.log("+++++++++++++++++++++++++++++++++++++++++++++");
        var key = "h0";
        if (mine.storeid) {
            key = "h" + mine.storeid;
        }
        var series = {};
        var yesterDay = (new Date(year + "-" + month + "-" + (day - 1))).Format("yyyy-MM-dd");
        var today = date.Format("yyyy-MM-dd");
        series.users = function (cb) {//昨日用户
            redis.hget("count_users"+yesterDay, key, function (err, val) {
                if (err) cb(err, null);
                if (val) {
                    cb(null, val);
                } else {
                    var sql = "select count(id) as count from account where createdAt>='" + yesterDay + "' AND createdAt<'" + today+"'";
                    if (mine.storeid) {
                        sql += " AND operatorno=" + mine.storeid;
                    }
                    //console.log(sql);
                    Account.query(sql, function (err, dat) {
                        if (err) cb(err, null);
                        if (dat) {
                            redis.hset("count_users"+yesterDay, key, dat[0]["count"], function (err, newVal) {
                                if (err) cb(err, null);
                                cb(err, dat[0]["count"]);
                            });
                            redis.expire("count_users"+yesterDay,68400);
                        } else {
                            cb(null, null);
                        }
                    });
                }
            });
        };
        if (mine.storeid == 0) {

            series.merchant = function (cb) { //昨日商户
                redis.get("merchants"+yesterDay, function (err, val) {
                    if (err) cb(err, null);
                    if (val) {
                        cb(null, val);
                    } else {
                        var sql = "select count(id) as count from accountseller where createdAt>='" + yesterDay + "' AND createdAt<'" + today+"'";
                        Accountseller.query(sql, function (err, dat) {
                            if (err) cb(err, null);
                            if (dat) {
                                redis.set("merchants"+yesterDay, dat[0]["count"], function (err, newVal) {
                                    if (err) cb(err, null);
                                    cb(err, dat[0]["count"]);
                                });
                                redis.expire("merchants"+yesterDay,68400);
                            } else {
                                cb(null, null);
                            }
                        });
                    }
                });
            }
        }
        if (mine.storeid) {
            series.new_order = function (cb) { //今日订单
                redis.get("today_order", function (err, val) {
                    if (err) cb(err, null);
                    if (val) {
                        cb(null, val);
                    } else {
                        Ordermain.getMerCurDayOrderNum(mine.storeid,function(err,count){
                            if (err) cb(err, null);
                            if(count){
                                cb(null, count["ordernum"]);
                            }else{
                                cb(null, null);
                            }

                        });

                    }
                });
            }
        }
        series.orders = function (cb) { //昨日商户
            redis.hget("count_order"+yesterDay,key, function (err, val) {
                if (err) cb(err, null);
                if (val) {
                    cb(null, val);
                } else {
                    if(mine.storeid==0){
                        Ordermain.getYesterdayTotalOrder(function(err,count){
                            if (err){
                                cb(err, null);
                            }
                            if(count){
                                redis.hset("count_order"+yesterDay,key, count["totalmoney"]||0, function (err, newVal) {
                                    if (err) cb(err, null);
                                    if(newVal){
                                        redis.expire("count_order"+yesterDay,68400);
                                        cb(null, count["totalmoney"]||0);
                                    }else{
                                        cb(null, 0);
                                    }
                                });


                            }else{
                                cb(null, null);
                            }

                        });
                    }else{
                        Ordermain.getYesterdayMerOrder(mine.storeid,function(err,count){
                            if (err){
                                cb(err, null);
                            }
                            if(count){
                                redis.hset("count_order"+yesterDay,key, count["totalmoney"]||0, function (err, newVal) {
                                    if (err) cb(err, null);
                                    if(newVal){
                                        redis.expire("count_order"+yesterDay,68400);
                                        cb(null, count["totalmoney"]||0);
                                    }else{
                                        cb(null, 0);
                                    }
                                });

                            }else{
                                cb(null, null);
                            }
                        });
                    }
                }
            });
        }
        async.series(series, function (err, results) {
            if (err) return res.negotiate(err);
            var ret = {};
            ret.count_users = results.users||0;
            ret.yesterday_order = results.orders?results.orders:0;
            if (mine.storeid == 0) {
                ret.count_merchant = results.merchant||0
            } else {
                ret.today_order = results.new_order||0;
            }
            console.log(ret);
            if (results != null) {
                return res.json({
                    code: 200,
                    msg: "数据获取成功",
                    data: ret
                });
            } else {
                return res.json({
                    code: 400,
                    msg: "数据获取失败",
                });
            }

        });

    },


};

