/**
 * homeController
 *
 */
var schedule = require("node-schedule");
module.exports = {
    index: function(req, res){
        // var is_start = req.param('is_start');
        var _this = this;
        var queryStr1= 'SELECT goodsname, sku, goodsresidue, orderbeing, orderstarttime, ordervalidtime, timingname FROM presellgoodsmsg';
            presellgoodsmsg.query(queryStr1, function(err, data){
                if (err) return res.negotiate(err);
                if(data.length > 0){                   
                    for(var i=0; i<data.length;i++){
                        //定时，开始预购
                        var startname = 'start_' + data[i].sku;
                        _this.overTiming(data[i].orderstarttime, startname, function(){
                            var queryStr2 = 'UPDATE presellgoodsmsg SET is_orderstart = 1';
                            presellgoodsmsg.query(queryStr2, function(err, updated){
                                if (err) {
                                    console.log("[countTime] err is :" + err );
                                }
                                console.log("[countTime] is_orderstart is updated");
                            });                          
                        });

                        //定时，结束预购
                        var stopname = 'stop_' + data[i].sku;                      
                        _this.overTiming(data[i].ordervalidtime, stopname, function(){
                            var queryStr3 = 'UPDATE presellgoodsmsg SET is_orderstop = 1';
                            presellgoodsmsg.query(queryStr3, function(err, updated){
                                if (err) {
                                    console.log("[countTime]  err is :" + err );
                                }
                                console.log("[countTime] is_orderstop is updated");
                            });                       
                        });

                        // 更新数据库中定时器名字
                        _this.updateTimingName(stopname, data[i].sku);

                        // // 定时器取消
                        // if(data[i].goodsresidue == 0){
                        //     var j = schedule.scheduleJob(data[i].timingname);
                        //     if(j!= null || j!= undefined){
                        //         j.cancel();
                        //         console.log("取消" + j);
                        //     }
                        // }   
                    }

                    return res.json({
                        code: 200,
                        data: data
                    });
                } else {
                    return res.json({
                        code: 200,
                        data: []
                    });
                }          
            });
    },
    /**
    *预购定时
    *@param time  开始时间或者截止时间
    *@param callback  回调函数
    */
    overTiming: function(time, timingname, callback){
        var date = new Date(time);
        console.log(timingname);
    　　var j = schedule.scheduleJob(timingname, date, function(){  
            //console.log('开始抢购');
            callback();
            //j.cancel();
    　　});
        console.log(j);       
    },
     /**
    *预购定时
    *@param time  开始时间或者截止时间
    *@param callback  回调函数
    */
    cancelTiming: function(req, res){
         var queryStr1= 'SELECT sku, goodsresidue, orderbeing, timingname FROM presellgoodsmsg';
            presellgoodsmsg.query(queryStr1, function(err, data){
                if (err) return res.negotiate(err);
                if(data.length > 0){                   
                    if(data[i].goodsresidue == 0){
                        var j = schedule.scheduleJob(data[i].timingname);
                        if(j!= null || j!= undefined){
                            j.cancel();
                            //console.log("取消" + j);
                        }
                    }
                } else {
                    return res.json({
                        code: 200,
                        data: []
                    });
                }          
            });        
    },
    payTiming: function(req, res){
        var hour = Number(req.param('hour'));
        var minute = Number(req.param('minute'));
        var second = Number(req.param('second'));

        var rule = new schedule.RecurrenceRule();
    　　var times = [];
    　　for(var i=1; i<60; i++){
    　　　　times.push(i);
    　　}
    　　rule.hour = hour;
    　　rule.minute = minute;
        rule.second = second;
        var _this = this;
    　　var j = schedule.scheduleJob(rule, function(){
            //console.log('结束抢购');             
    　　});       
    },
    /*
    *查找所有数据
    *
    *
    *
    */
    selectPresellMsg:function(req, res){
        var sql = "select goodsname, sku, goodsresidue, goodstotal, orderbeing, reservegold, orderstarttime, ordervalidtime," +
                " payvalidtime, is_orderstart, is_orderstop, is_paystart, is_paystop from presellgoodsmsg";
        presellgoodsmsg.query(sql, function(err, goodsnsg){
            if(err) return res.serverError(err);
            //console.log(goodsnsg);
            return res.json({
                code: 200,
                msg: '已连接'
            });
        });
    },
    /*
    *添加数据
    *@param  限时抢购开始时间
    *@param  限时抢购有效时间
    *@param  尾款支付有效时间
    */
    updateTimingName: function(name, sku){
        var queryStr = "UPDATE presellgoodsmsg SET timingname='" + name + "' WHERE sku='" + sku + "'" ;
        presellgoodsmsg.query(queryStr, function(err, result){
            if(err) console.log("[countTime] err is :" + err );
            if(result) console.log("countTime: timingname is updated");           
        });
    },
    /*
    *存储从预售商品和订单获取的数据
    *@param  goodsname 预购商品名称
    *@param  sku  商品货号
    *@param  goodsresidue  预购商品剩余数量
    *@param  goodstotal  预购商品总数量
    *@param  orderbeing  已预购人数
    *@param  reservegold  预购需支付的定金
    *@param  orderstarttime  预购开始时间
    *@param  ordervalidtime  预购持续时间
    *@param  payvalidtime  尾款支付有效时间
    *@param  goodsresidue  预购商品剩余数量
    */
    updatePresellMsg: function(req, res){
        var sku = req.param('sku');
        var condition = {sku: sku};
        presellgoodsmsg.create().exec(function(err, result){
            if(err) return res. serverError(err);
            return res.json({
                code: 200,
                msg:''
            });
        });
    }

};