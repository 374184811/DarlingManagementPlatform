/**
 * 说明：官方给出的例子
 * 应用场景：模拟客服端请求服务器，是一个HTTP 客户端工具，用于向 HTTP 服务器发起请求。
 * @param {Object} options
 * @param {Function} callback
 */
module.exports = {
    /**
     * 获取物流数据
     * @param req
     * @param res
     */
    getDeliverInfo: function(req, res){
        var reqData = req.allParams();
        console.log(req.ip,req.path,reqData);
        var retData={'code':4000,'codeInfo':'','data':null,'type':0};
        var sqlStr1 = 'select a.* from kuaidilog as a where a.payorder=\''+reqData['ordernumber'];
        sqlStr1 += '\' and a.deliverorder=\''+reqData['logisticsnumber']+'\' and a.refundrnumber=\''+reqData['refundrnumber']+'\'';
        console.log(sqlStr1);
        Kuaidilog.query(sqlStr1, function(err, results1) {
            //console.log(results1);
            if (err){
                return res.negotiate(err);
            }
            console.log("getDeliverInfo results ==> " + results1.length);
            if(results1.length==1){
                // 自定义类型
                if(results1[0]['status'] == 7){
                    retData['code'] = 200;
                    retData['codeInfo'] ='ok';
                    retData['type'] = 3;
                    retData['data'] = results1[0];
                    return res.json(retData);
                }

                // 自提类型
                if (results1[0]['status'] == 6) {
                    results1[0]['company'] = '自提';

                    retData['code'] = 200;
                    retData['codeInfo'] ='ok';
                    retData['type'] = 2;
                    retData['data'] = results1[0];
                    return res.json(retData);
                }
                // 物流类型
                var sqlStr2 = "select b.name from kuaidicom as b where b.ename = '" + results1[0]['company'] +"'";
                console.log(sqlStr2);
                Kuaidicom.query(sqlStr2, function(err, results2){
                    if (err){
                        return res.negotiate(err);
                    }
                    if(results2.length == 1){
                        retData['type'] = 1;

                        if(results1[0]['status']==2 || results1[0]['status']==5 || results1[0]['status']==0){
                            results1[0]['company'] = results2[0]['name'];

                            retData['code'] = 200;
                            retData['codeInfo'] ='ok';
                            retData['data'] = results1[0];
                        } else {
                            results1[0]['company'] = results2[0]['name'];

                            retData['code'] = results1[0]['status'];
                            retData['codeInfo'] = results1[0]['detailbody'];
                            retData['data'] = results1[0];
                        }
                    }
                    return res.json(retData);
                });
            } else {
                return res.json(retData);
            }
        });
    },
    /**
     * 售后物流发货以及数据存储接口
     * @param req
     * @param res
     */
    trackStorage: function(req, res){
        console.log(req.ip,req.path);
        var data = req.allParams();
        
        var subscriptData={};
        subscriptData['interface'] = sails.config.globals.usersdeliver;
        subscriptData['payorder'] = data['ordernumber'];
        subscriptData['deliverorder'] = data['logisticsnumber'];
        subscriptData['refundrnumber'] = data['refundrnumber'];
        subscriptData['tablenameofitem'] = data['tablenameofitem'];
        subscriptData['saleflag'] = data['saleflag'];
        subscriptData['company'] = data['company'];
        subscriptData['detailbody'] = '';
        subscriptData['status'] = 0;
        subscriptData['fromaddre'] = '';
        subscriptData['toaddre'] = '';
        subscriptData['imgaddress'] = data['imgaddress']||[];
        subscriptData['imgaddress'] = subscriptData['imgaddress'].join(',');
        subscriptData['remark'] = data['remark']||'';
  
        
        utility2.deliverSubscript(subscriptData,function(err,deliverData){
            if (deliverData['code'] == 200) {
                //调用发货时候，修改订单状态函数
                utiorder.updateSaleAfterDeliver(data['ordernumber'],data['logisticsnumber'],data['tablenameofitem'],data['refundrnumber']);
            }
            return res.json(deliverData);
        });
    },
    /**
     * 物流跟踪信息
     * @param req
     * @param res
     */
    deliverTrack: function(req, res){
        console.log(req.ip,req.path);
        var retData = {"result":true,"returnCode":"200","message":"成功"};
        var trackData2 = req.allParams();
        var trackData = eval('(' + trackData2['param'] + ')');
        console.log(trackData['lastResult']['data']);

        if( trackData['lastResult']['data']&&
            trackData['status']&&
            trackData['lastResult']['nu']&&
            trackData['lastResult']['status']&&
            trackData['lastResult']['state']&&
            trackData['lastResult']['com'])
        {
            console.log('deliverTrack1');

            // kuaidilog_9 这个表是用来和快递100对账用的
            var newsql = 'INSERT INTO kuaidilog_9 (`company`, `payorder`, `deliverorder`, `dayinfo`, `status`, `detailbody`) ';
            newsql += 'VALUES (\''+ trackData['lastResult']['com'] +'\',1,\''+ trackData['lastResult']['nu'] +'\',\'';
            newsql += utility2.getCurday() +'\',1,\''+ trackData2['param'] + '\')';
            Kuaidilog9.query(newsql, function(err, results) {
                if (err) {
                    //console.log("err ==> ",err);
                    retData['result'] = false;
                    retData['returnCode'] = 500;
                    retData['message'] = "服务器错误";
                    return res.json(retData);
                }
            });

            // abort、polling、shutdown、updateall，状态的判断
            var len = trackData['lastResult']['data'].length;
            if(len>0){
                //只检测最新的那条物流信息
                trackData['lastResult']['data'][0]['context'] = trackData['lastResult']['data'][0]['context'].replace(/"/g,'');
            }

            var sqlStr = '';
            if(trackData['status']=='abort')
            {
                if(trackData['message'].indexOf('60天')!=-1 && !trackData['comNew']){
                    sqlStr += 'update kuaidilog set status=4, detailbody=\''+trackData['message']+'\' where deliverorder=\'';
                    sqlStr += trackData['lastResult']['nu']+'\'';
                    updateData(sqlStr);
                } else if(trackData['message'].indexOf('3天')!=-1 && !trackData['comNew']){
                    //10分钟后重新订阅
                    var nowDate = new Date();
                    var nowStr = nowDate.getYear() + '-' + (nowDate.getMonth() + 1);

                    var scription = function subscription(){
                        async.series({
                            one: function(callback){
                                var querytext1 = "SELECT COUNT(payorder) AS num FROM kuaidilog_9 WHERE deliverorder='";
                                querytext1 += trackData['lastResult']['nu'] +"' AND status=0 AND detailbody LIKE '%"+ nowStr +"%'";
                                Kuaidilog9.query(querytext1, function(err, result) {
                                    callback(err, result);
                                });
                            },
                            two: function(callback){
                                var querytext2 = "SELECT payorder, company FROM kuaidilog_9 WHERE deliverorder='";
                                querytext2 += trackData['lastResult']['nu'] +"' AND status=0 LIMIT 1";
                                Kuaidilog9.query(querytext2, function(err, result) {
                                    callback(err, result);
                                });
                            }
                        },function(err, results){
                            if (err) {
                                //console.log("err ==> ",err);
                                retData['result'] = false;
                                retData['returnCode'] = 500;
                                retData['message'] = "服务器错误";
                                return res.json(retData);
                            }
                            var one = results.one;
                            var two = results.two;
                            if(one[0]['num'] < 4 && one[0]['num'] >0){
                                var queryStr = "SELECT consignee_email,consignee_region_id,consignee_region_name,consignee_address";
                                queryStr += " FROM ordermain WHERE ordernumber='"+ two[0]['payorder'] +"'";
                                Ordermain.query(queryStr, function(err, order) {
                                    if(err){
                                        //console.log("merTakeDelivery ==> ", err);
                                        return 4003;
                                    }
                                    var fromAddress = '';
                                    var toAddress = '';
                                    if (order.length >0 ) {
                                        toAddress = order[0]['consignee_address'];
                                    }

                                    var subscriptData={};
                                    subscriptData['payorder'] = two[0]['payorder'];
                                    subscriptData['deliverorder'] = trackData['lastResult']['nu'];
                                    subscriptData['company'] = two[0]['company'];
                                    subscriptData['detailbody']='';
                                    subscriptData['status']=0;
                                    subscriptData['fromaddre'] = fromAddress;
                                    subscriptData['toaddre'] = toAddress;
                                    utility2.deliverSubscript(subscriptData,function(err,deliverData){
                                        if (err) {
                                            console.log("err ==> ",err);
                                            retData['result'] = false;
                                            retData['returnCode'] = 500;
                                            retData['message'] = "服务器错误";
                                            return res.json(retData);
                                        }
                                        //console.log(deliverData);
                                        // clearTimeout(timeOut);

                                        sqlStr += 'update kuaidilog set status=4, detailbody=\''+trackData['message']+'\' where deliverorder=\'';
                                        sqlStr += trackData['lastResult']['nu'] + '\'';
                                        updateData(sqlStr);
                                    });
                                });
                            } else if(one[0]['num'] >= 4){
                                sqlStr += "update kuaidilog set status=4, detailbody='此单为假单,不需要再将此单提交给快递100' where deliverorder='";
                                sqlStr += trackData['lastResult']['nu'] + "'";
                                updateData(sqlStr);
                            }
                        });

                    };
                    var timeOut = setTimeout(scription, 10*60*1000);
                }else if(trackData['comNew']){
                    //如查判断到status=abort且comNew不为空，则不需要重新提交订阅，且将贵司原来的快递公司编码改为comNew后的值
                    async.auto({
                        one: function(callback){
                            // 更新kuaidilog中的公司编码
                            sqlStr += 'update kuaidilog set status=3, company=\''+trackData['comNew']+'\', detailbody=\''+trackData['message'];
                            sqlStr += '\' where deliverorder=\''+trackData['lastResult']['nu']+'\'';
                            console.log(sqlStr);
                            Kuaidilog.query(sqlStr, function(err, result1) {
                                callback(err, result1);
                            });
                        },
                        two: function(callback){
                            var updatetext2 = "update kuaidilog_9 set company='"+ trackData['comNew'] +"' where deliverorder='";
                            updatetext2 += trackData['lastResult']['nu'] +"'";
                            console.log(updatetext2);
                            Kuaidilog9.query(updatetext2, function(err, result2) {
                                callback(err, result2);
                            });
                        }
                    },function(err, results){
                        if (err) {
                            console.log("err ==> ",err);
                            retData['result'] = false;
                            retData['returnCode'] = 500;
                            retData['message'] = "服务器错误";
                            return res.json(retData);
                        }
                        //console.log(results);
                        return res.json(retData);
                    });
                }
                console.log('deliverTrack2');
            }
            else if(trackData['status']=='polling')
            {
                
                Kuaidilog.find({deliverorder:trackData['lastResult']['nu']}).exec(function(err,kuaidilog){
                    if(err){console.log(err);return;}
                    if(kuaidilog.length>0&&kuaidilog[0]['saleflag']>0){//售后订单
                        var arr = [];
                        var obj = {};
                        for(var i = 0;i<kuaidilog.length;i++){
                            obj.ordernumber = kuaidilog[i].payorder;
                            obj.refundrnumber = kuaidilog[i].refundrnumber;
                            obj.tablenameofitem = kuaidilog[i].tablenameofitem;
                            obj.saleflag = kuaidilog[i].saleflag;
                            arr.push(obj);
                        }
                        //调用售后订单状态变化函数
                        utiorder.updateOrderHasSign(arr);
                    }else if(kuaidilog.length>0&&kuaidilog[0]['saleflag']== 0){//正常订单
                        var state = trackData['lastResult']['state'];
                        switch(parseInt(state)){//已揽件或同城发送短信通知
                            case 1://物流已揽件
                            case 3://已签收
                            case 5://同城物流
                                async.auto({
                                    one:function(callback){
                                        var orderSql = "SELECT consigneename,consignee_mobile,ordernumber,storeid,tablenameofitem FROM ordermain ";
                                        orderSql += "WHERE logisticsnumber='"+trackData['lastResult']['nu']+"'";
                                        Ordermain.query(orderSql,function(err,order){
                                            // var sellerlist = seller.getStoreArray();
                                            // var nickname = sellerlist[order[0]['storeid']];
                                            // order[0].nickname = nickname;
                                            callback(err,order);
                                        });
                                    },
                                    two:['one',function(callback,result1){
                                        var one = result1.one;
                                        var numArr = [];
                                        if(one.length<=0){
                                            callback(null,[]);
                                        }else{
                                            for(var i=0;i<one.length;i++){
                                                numArr.push("\'"+one[i]['ordernumber']+"\'");
                                            }
                                            var selectSql = "SELECT distinct goodsname FROM "+one[0]['tablenameofitem']+" WHERE ordernumber in ("+numArr.join(',')+")";
                                            console.log(selectSql);
                                            Orderchilditem.query(selectSql,function(err,orderitem){
                                                if(err){
                                                    return callback(err,null);
                                                }
                                                var selectSql = "SELECT name FROM kuaidicom WHERE ename='"+trackData['lastResult']['com']+"'";
                                                Kuaidicom.query(selectSql,function(err,com){
                                                    var one2 = one[0];
                                                    var two = '';
                                                    for(var i=0;i<orderitem.length;i++){
                                                        two += orderitem[i].goodsname + '、'
                                                    }
                                                    var three = com[0];
                                
                                                    var userMobile = one2.consignee_mobile;
                                                    var datas = [];
                                                    // datas.push(one2.consigneename);
                                                    // datas.push(one2.nickname);
                                                    // datas.push(two.substring(0,(two.length)-1));
                                                    datas.push(three.name);
                                                    datas.push(trackData['lastResult']['nu']);
                                                    // datas.push('http://www.kuaidi100.com/');
                                                    datas.push('4009308600');
                                                    var templateId = '';
                                                    console.log(datas);
                                
                                                    if(trackData['lastResult']['state']=='1'){//物流已揽件
                                                        templateId = '206707';
                                                    }else if(trackData['lastResult']['state']=='5'){//同城物流
                                                        templateId = '206671';
                                                        datas = [];
                                                    }else if(trackData['lastResult']['state']=='3'){//已签收
                                                        templateId = '206672';
                                                        datas = [];
                                                    }
                                
                                                    SmsService.sendSms(callback,userMobile,templateId,datas);
                                                });
                                            });
                                        }
                                    }]
                                },function(err,results){
                                    if(err){return res.negotiate(err);}
                
                                    console.log("deliverTrack\'s sendMsg ======> ",results);
                                });
                                break;
                        }
                    }
                });
                
                sqlStr += 'update kuaidilog set status=2,detailbody=\''+JSON.stringify( trackData['lastResult']['data'] );
                sqlStr += '\' where deliverorder=\''+trackData['lastResult']['nu']+'\'';
                updateData(sqlStr);
                console.log('deliverTrack3');
            }
            else if(trackData['status']=='shutdown')
            {
                sqlStr += 'update kuaidilog set status=5,detailbody=\''+JSON.stringify( trackData['lastResult']['data'] );
                sqlStr += '\' where deliverorder=\''+trackData['lastResult']['nu']+'\'';
                updateData(sqlStr);
            }
            else if(trackData['status']=='updateall')
            {
                sqlStr += 'update kuaidilog set status=5,detailbody=\''+JSON.stringify( trackData['lastResult']['data'] );
                sqlStr += '\' where deliverorder=\''+trackData['lastResult']['nu']+'\'';
                updateData(sqlStr);
            }
            else
            {
                sqlStr += 'update kuaidilog set status=1,detailbody=\''+JSON.stringify( trackData['lastResult']['data'] );
                sqlStr += '\' where deliverorder=\''+trackData['lastResult']['nu']+'\'';
                updateData(sqlStr);
            }
        }else{
            console.log('deliverTrack4');
        }

        // kuaidilog表,更新物流数据
        function updateData(sql){
            console.log(sql);
            Kuaidilog.query(sql, function(err, results) {
                if (err) {
                    console.log("updateData err ==> ", err);
                    retData['result'] = false;
                    retData['returnCode'] = 500;
                    retData['message'] = "服务器错误";
                    return res.json(retData);
                }
                console.log(retData);
                return res.json(retData);
            });
        }
    },
    /*
    参数：
    reqData.newPaymentid
    reqData.oldPaymentid
    reqData.chargeid
    reqData.ordernumber
    */
    pingppRetrieve: function(req, res) {
        var reqData = req.allParams();
        console.log(reqData);
        //console.log('pingppRetrieve');
        var returnData={'code':200,'codeInfo':'ok','ordernumber':'','isNeedNewOrderNumber':0};
        if(reqData.newPaymentid==1){
            returnData['codeInfo']='暂不支持合约支付';
            returnData['code']=4000;
            return res.json(returnData);
        }
        var tokenId = req.param('tokenId');
        var mId = req.param("mId");
        var openid='';
        var ispad=0;
        if(req.param('ispad')&& req.param('ispad')==1 ){
            ispad=1;
        }
        var tablenameofitem='';
        async.series({

            checklogin: function (cb) {
                common.getLoginUser(req, tokenId, mId, function (err, ret) {
                    if (err) return res.negotiate(err);
                    console.log("=========checklogin===========");
                    if (ret && ret.code == 200) {
                        var member = ret.user;
                        cb(null, 0);
                    }else{
                        returnData['code']=4500;
                        returnData['codeInfo']='user not login';
                        cb(1);
                    }
                });
            },
            one: function (cb) {
                var querytext = 'select * from ordermain where ordernumber=\''+reqData.ordernumber+'\' limit 1';
                Ordermain.query(querytext, function(err,results) {
                    if (err){
                        returnData['codeInfo']='mysql query error';
                        returnData['code']=4001;
                        cb(err);
                    }
                    if(results.length==1){
                        tablenameofitem=results[0]['tablenameofitem'];
                        if(results[0]['isValidly']==0 ){
                            if(results[0]['status']==0 ){
                                results[0]['paymentid']=reqData.newPaymentid;
                                if (parseInt(reqData.newPaymentid)==7)
                                {
                                    if (sails.config.connections.pingppKey=='sk_test_P0uDGK1SqfPGzzzfHKLWnb5G') {
                                        openid='ob';
                                    }else{
                                        var redisKey=results[0]['buyerid']+'_openid';
                                        var myRedis = redis.client({db:5});
                                        console.log('redisKey ',redisKey);
                                        myRedis.hget(redisKey, '4',function (err, value) {
                                            if (err){
                                                returnData['codeInfo']='no openid';
                                                returnData['code']=4500;
                                            }
                                            else {
                                                openid = value;
                                                console.log('huangpeng_openid_createorder');
                                                //console.log(value);
                                                if(!value){
                                                    returnData['codeInfo']='no openid';
                                                    returnData['code']=4500;
                                                    returnData['data']=sails.config.connections.redirectURL;
                                                    //console.log('huangpeng_openid_createorder2');
                                                }
                                            };
                                        });
                                    }
                                }
                                //  判断优惠券的合法性
                                if (parseInt(results[0].coupon_number)>0 )
                                {
                                    if(results[0].ordertype==0){
                                            var couponLoseNum=0;
                                            var couponLoseAmount=0;
                                            var newCouponArr=[];
                                            coupon.getCouponDetail(0,results[0].coupon_id,results[0]['buyerid'],reqData.ordernumber,function(err,couponData){
                                                console.log('getCouponOfOrder',couponData);
                                                console.log('getCouponDetailerr',err);
                                                console.log('results',results);
                                                if(!err){
                                                    if(results[0].status==0){
                                                        for (var i = 0; i < couponData.data.length; i++) {
                                                            if(couponData.data[i].isexpired==1 || couponData.data[i].isdel==1 || couponData.data[i].isvalid==2){
                                                                couponLoseNum+=1;
                                                                couponLoseAmount+=couponData.data[i].parvalue;
                                                                var myCoupon={};
                                                                myCoupon.status=1;
                                                                myCoupon.orderid=0;
                                                                myCoupon.usedAt=null;
                                                                     if(couponData.data[i].couponmode==1){
                                                                        var criteria = {
                                                                            orderid:ordernumber,
                                                                            uid:results[0]['buyerid'],
                                                                            id:couponData.data[i].aid,
                                                                            cmode:1
                                                                        };
                                                                        UserCoupon.destroy(criteria).exec(function (err) {
                                                                            if (err) {return;}
                                                                        });
                                                                    }else{
                                                                        UserCoupon.update({id:couponData.data[i].aid},myCoupon).exec(function afterwards(err, updated){
                                                                          if (err) {return;}
                                                                        });
                                                                    }
                                                            }else{
                                                                newCouponArr.push(couponData.data[i].aid);
                                                                newCouponArr.push(couponData.data[i].id);
                                                            }
                                                        };
                                                    }
                                                    if (couponLoseNum>0) {
                                                        var newCouponAmount = results[0]['coupon_amount'] - couponLoseAmount;
                                                        var newCouponNum = results[0]['coupon_number'] - couponLoseNum;
                                                        if (newCouponAmount<0) {newCouponAmount=0};
                                                        results[0].payment_amount+=couponLoseAmount;
                                                        results[0].total_amount  +=couponLoseAmount;
                                                        results[0].coupon_number =newCouponNum;
                                                        results[0].coupon_amount =newCouponAmount;
                                                        results[0].coupon_id =newCouponArr.toString();
                                                        var querytextnew   = ' UPDATE ordermain SET payment_amount= payment_amount+'+couponLoseAmount +',total_amount= total_amount+'+couponLoseAmount +',coupon_number = '+newCouponNum+',coupon_amount = '+newCouponAmount+',coupon_id=\''+newCouponArr.toString()+'\' WHERE (id='+results[0].id+')';
                                                        Ordermain.query(querytextnew, function(err, results) {
                                                            if (err) {
                                                                returnData['code']=4011;//
                                                                returnData['codeInfo']='更新订单优惠券详情有问题';
                                                                return res.serverError(err);
                                                            }else{
                                                                cb(null, results[0]);
                                                            }
                                                        });
                                                    }else{
                                                        cb(null, results[0]);
                                                    }
                                                }else{
                                                    console.log('couponCheck667');
                                                    returnData['code']=4085;
                                                    returnData['codeInfo']='优惠券err 4085';
                                                    cb(1,0);
                                                }
                                            });
                                    }else{
                                        console.log('couponCheck66');
                                        returnData['code']=4080;
                                        returnData['codeInfo']='预售商品不能使用优惠券';
                                        cb(1,0);
                                    }
                                }
                                else{
                                    cb(null, results[0]);
                                }

                            }else{
                                returnData['codeInfo']='订单状态不正确';
                                returnData['code']=4002;
                                cb(1,0);
                            }
                        }else{
                            returnData['codeInfo']='订单过期';
                            returnData['code']=40021;
                            cb(1,0);
                        }
                    }
                });
            },
            two: function (cb) {
                var step2 = sails.config.connections.ordernumberbase;
                utility.getOrderMainTableId( function (err, decode) {
                    if (err){
                        returnData['codeInfo']='redis get ordernumber error';
                        returnData['code']=4003;
                        cb(err);
                    }
                    step2=step2+decode;
                    returnData['ordernumber']=step2;
                    cb(null, 1);
                });
            },
            there: function (cb) {
                var counterNum=0;
                var querytext = 'select * from '+tablenameofitem+' where ordernumber=\''+reqData.ordernumber+'\'';
                Ordermain.query(querytext, function(err,results) {
                    if (err){
                        returnData['codeInfo']='mysql query error';
                        returnData['code']=4001;
                        cb(err);
                    }
                    results.forEach(function(elem,key){
                        var querytext3=' select stock,reserve10 from mergoodsList'+elem['storeid']+' where sku=\''+elem['sku']+'\'';
                        console.log(querytext3);
                        Ordermain.query(querytext3, function(err,results3) {

                            counterNum+=1;
                            if (err){
                                returnData['codeInfo']='mysql query error';
                                returnData['code']=4006;
                                cb(err);
                            }
                            //console.log('stock ,',results3[0]['stock']);
                            //console.log('reserve10 ,',results3[0]['reserve10']);
                            //console.log('buy_num ,',elem['buy_num']);
                            if (  ( parseInt(results3[0]['stock'])  -parseInt(results3[0]['reserve10']) )<parseInt(elem['buy_num']) ) {
                                returnData['codeInfo']='该商品已售罄';
                                returnData['code']=4007;
                            };
                            if(counterNum==results.length){
                                cb(null, results[0]);
                            }
                        });

                    });
                });
            }
        }, function (err, result) {
            if(returnData['code']!=200){
                //console.log(returnData);
                return res.json(returnData);
            }

            var orderData={};
            orderData['paymentid']=reqData.newPaymentid;
            orderData['itemNames']=result.there.goodsname;
            orderData['ordernumber']=returnData['ordernumber'];
            if(result.one['ordertype']==10){
                orderData['total_amount']=result.one.payment_amount;
            }else if(result.one['ordertype']==12){
                orderData['total_amount']=result.one.total_amount-result.one.payment_amount;
            }else if(result.one['ordertype']==0){
                orderData['total_amount']=result.one.total_amount;
            }else{
                returnData['codeInfo']='该支付已过期';
                returnData['code']=4008;
                //console.log(returnData);
                return res.json(returnData);
            }
            orderData['openid']=openid;
            orderData['metadata']={ordertype:result.one['ordertype'],ordernumber:reqData.ordernumber,tablenameofitem:tablenameofitem};
            utility2.createPayment(orderData,'1.1.1.1',ispad, function(err, charge) {
                if (err != null) {
                    console.log(err);
                }else{
                    var   querytext  = '';
                    if (result.one['ordertype']!=12)
                    {
                        querytext  = 'update ordermain set paymentid='+reqData.newPaymentid+ ',chargeid=\''+charge['id'] +
                            '\' ,status=0 , outordernumber=\'' +charge['order_no'] +'\',ordernumber1=\''+charge['order_no']+'\' where ordernumber=\''+ reqData.ordernumber+'\'';

                    }else{
                        querytext  = 'update ordermain set paymentid2='+reqData.newPaymentid+ ',chargeid2=\''+charge['id'] +
                            '\' ,status=0 , outordernumber2=\'' +charge['order_no'] +'\',ordernumber2=\''+charge['order_no']+'\' where ordernumber=\''+ reqData.ordernumber+'\'';
                    }
                    console.log(querytext);
                    Ordermain.query(querytext, function(err, results) {
                        if (err) return res.serverError(err);
                    });
                    returnData['charge']=charge;
                    return res.json(returnData);
                }
            });
        });
    },
    /**
     * 上传图片
     * @param req
     * @param res
     */
    uploadImg:function(req,res){
        console.log(req.ip,req.path);
        upload.uploadFile(req,res,"pic","aftersalecert");
    },
    /**
     * 获取物流公司
     * @param req
     * @param res
     */
    deliverCom: function(req, res){
        console.log(req.ip,req.path);
        var retData={ 'code':200,'data':[]};
        var querytext   = 'select * from kuaidicom';
        Ordermain.query(querytext, function(err, results) {
            if (err) {
                retData['code']=4000;
                return res.serverError(err);
            }
            retData['data']=results;
            return res.json(retData);
        });
    },
    /**
     * 客户端确认收货
     * @param req
     * @param res
     */
    clientTakeDelivery: function(req, res) {
        console.log(req.ip,req.path);
        var data = req.allParams();
        var data3 = {},data2 = {};
        console.log('clientTakeDelivery');
        console.log(data);
        var retData = {'code':200,'codeInfo':'ok'};
        // 开启自动评价
        data3['ordernumber'] = data['ordernumber'];
        data3['tablenameofitem'] = data['tablenameofitem'];
        data3['orderdetailid'] = data['orderdetailid'];
        // (data3);
        // 更新订单状态
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        dateInfo.setDate(dateInfo.getDate()+7);

        data2['ordernumber'] = data['ordernumber'];
        data2['status'] = 3;
        data2['is_delivery'] = 2;
        data2['expire_refund_money'] = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        dateInfo.setDate(dateInfo.getDate()+8);
        data2['expire_refund_item'] = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        utility2.updateOrderRecord(data2);
        
        return res.json(retData);
    },
};

