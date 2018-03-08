var exec = require('child_process').exec;
module.exports = {
    _cmdBase:'/usr/bin/curl http://localhost:1338/',
    /*  dev
        判断是否授权该商户
        接口 /order/authorizationWeixin
        参数  tokenId
                mId
                sku
        返回值：{'code':400,'codeInfo':'ok','isNeedAuth':1}
        code不等于200 说明有错误发生
        code等于200时  isNeedAuth等于1 是需要重新授权
        code等于200时  isNeedAuth等于0 是不需要重新授权
    */
    serviceSign: function(req, res){
        retData=servicessign.sign('123','baidu.com');
        return res.json(retData);
    },
    authorizationWeixin: function(req, res){
        console.log(req.path);
        var dataInfo    =req.allParams();
        console.log(dataInfo);
        var tokenId     = req.param('tokenId');
        var mId         = req.param("mId");
        var sku         = req.param('sku');
        var skuArr      = sku.split('-');
        var storeid     = skuArr[1];
        storeid=4;// 后期需要注释
        var retData={'code':400,'codeInfo':'ok','isNeedAuth':1};
        common.getLoginUser(req, tokenId, mId, function (err, ret) {
            console.log(ret);
            if (err) {
                retData.code=450;
                retData['codeInfo']='user not login err';
                console.log(retData);
                return res.json(retData);
            }
            if (ret && ret.code == 200) {
                var member = ret.user;
                        console.log('authorizationWeixin  exist3');
                var myRedis = redis.client({db:5});


                var redisKey=mId+'_openid';
                console.log('authorizationWeixin_redisKey  =',redisKey);

                myRedis.hget(redisKey,storeid,function(err,value) {
                    if (!err) {
                        console.log('authorizationWeixin  exist4');
                        console.log(value);
                        retData.code=200;
                        retData['isNeedAuth']=0;
                    }

                    console.log('authorizationWeixin_value  =',value);
                    if(!value){
                        retData['isNeedAuth']=1;
                    }
                    console.log(retData);
                    console.log('authorizationWeixin  exist5');
                    return res.json(retData);
                });
            }else{
                retData.code=431;
                console.log('authorizationWeixin  exist6');
                retData['codeInfo']='user not login';
                console.log(retData);
                return res.json(retData);
            }
        });
    },
    /*
        清除授权该商户
        接口 /order/deleteAuthorizationWeixin
        参数  tokenId
                mId
        返回值：{'code':200,'codeInfo':'ok'}
        code不等于200 说明有错误发生
        code等于200时   清除授权成功
    */
    deleteAuthorizationWeixin: function(req, res){

        console.log(req.path);
        var dataInfo =req.allParams();
        var tokenId     = req.param('tokenId');
        var mId         = req.param("mId");
        var myRedis = redis.client({db:5});
        var redisKey=mId+'_openid';
        console.log('redisKey = ',redisKey);
        myRedis.del(redisKey, function (err, reply) {
            if (err) {
                console.log("hptest",err);
                return;
            };
            console.log(reply);     // 删除成功，返回1，否则返回0(对于不存在的键进行删除操作，同样返回0)
        });

        var retData={'code':200,'codeInfo':'ok'};
        return res.json(retData);
    },


    sqlDeleteBugTest: function(req, res){
        var mid=   600000000000002+  parseInt(req.param('id')) ;
        var obj = {
            order_no: mid,
            app: { id: 'app_KOenDCvTiP48vzvD' },
            channel: 'wx_pub_qr',
            amount: '20000',
            client_ip: '113.116.141.116',
            currency: 'cny',
            subject: '优惠券接口测试',
            body: '优惠券接口测试',
            metadata: { ordernumber: mid, ordertype: 0 },
            extra: { product_id: mid } };
        console.log('mid=',mid);
        utility.mPingpp.charges.create(obj,
            function(err, charge) {

                console.log('payAndCharge  5');
                if (err != null) {
                    var querystring = require('querystring');
                    var contents = querystring.stringify(err);
                    console.log(err);
                    return res.json(contents);
                }
                else{
                    if (charge != null) {
                        console.log('payAndCharge_99999999999999');
                        console.log(charge);
                        return res.json(charge);
                    }
                }
        });


        // var couponNum=4;
        // var couponList=[ 155, 157, 153, 156 ];
        // var couponamount=144;
        // var skuArray=['U5OP-4-1478747472954-20-172','U5OP-4-1478747472954-21-171','U5OP-4-1478747472954-21-172'];
        // coupon.judgeCoupon(couponList,skuArray,function(paylimit){

        //     return res.json(paylimit);

        // });
    },
    /*
        微信公众号授权
        接口 /order/wxAuthForCoupon?url=XXXXXXXX
        返回值：{'code':200,'codeInfo':'ok'}
        code不等于200 说明有错误发生
        code等于200时   清除授权成功
    */
    wxAuthForCoupon: function(req, res){
        var storeid     = 4;
        var url='http://test.darlinglive.com/order/wxAuthForCouponInfo?showwxpaytitle=1';
        var oauthUrl = utility.mPingpp.wxPubOauth.createOauthUrlForCode(sails.config.connections.wxauth_info[storeid][0], url,true);
        var myRedis = redis.client({db:5});
        myRedis.set('wxAuthForCouponurl',req.param('url'));
        var retData={'code':200,'codeInfo':'','data':oauthUrl};
        console.log('wxAuthForCoupon');
        //res.end('');
        return res.json(retData);
    },
    wxAuthForCouponInfo: function(req, res){
        var dataInfo =req.allParams();
        utility.mPingpp.wxPubOauth.getOpenid(sails.config.connections.wxauth_info[storeid][0], sails.config.connections.wxauth_info[storeid][1], dataInfo.code, function(err, openid){
            console.log('err = ',err);
            var myRedis = redis.client({db:5});
            myRedis.get('wxAuthForCouponurl', function (err, value) {
                console.log(err);
                console.log('wxAuthForCouponInfo');
                return res.redirect(value);
            });
        });
    },
    //  微信客户端调用登录接口成功后  就调用该接口 获得openid
    //  http://www.darlinglive.com/order/getWeichatInfo3
    /*
        接口 /order/getWeichatInfo3
        参数  tokenId
                mId
                sku
                redirectUrl
    */
    getWeichatInfo3: function(req, res){
        if (sails.config.connections.pingppKey=='sk_test_P0uDGK1SqfPGzzzfHKLWnb5G') {
            return res.json({'code':200,'codeInfo':'','data':sails.config.connections.redirectURL});
        };

        var dataInfo =req.allParams();
        var tokenId     = req.param('tokenId');
        var mId         = req.param("mId");
        var sku         = req.param('sku');
        var skuArr      = sku.split('-');
        var storeid     = skuArr[1];
        storeid=4;// 后期需要注释
        console.log(dataInfo);
        console.log('getWeichatInfo335566  '+mId);
        var retData={'code':200,'codeInfo':'ok','data':null}

        var redisKey=mId+'_openid';
        var myRedis = redis.client({db:5});
        myRedis.hset(redisKey,'wxredirecturl',req.param('redirectUrl'));

        var url=sails.config.connections.wxPubOauthURL+mId+'&storeid='+storeid;
        //var oauthUrl = utility.mPingpp.wxPubOauth.createOauthUrlForCode('wx8c9b3748a225ed20', url,true);

        console.log('url  '+url);
        console.log('storeid  '+storeid);
        console.log('公众号  '+sails.config.connections.wxauth_info[storeid][0]);
        var oauthUrl = utility.mPingpp.wxPubOauth.createOauthUrlForCode(sails.config.connections.wxauth_info[storeid][0], url,true);

        var retData={'code':200,'codeInfo':'','data':oauthUrl};
        //res.end('');
        return res.json(retData);
    },
    getWeichatOpenid3: function(req, res){
        var dataInfo =req.allParams();
        console.log(dataInfo);
        console.log('getWeichatOpenid3335577  '+dataInfo.userid);
        //var trackData = eval('(' + dataInfo + ')');
        // if(!dataInfo.code){
        //     console.log('getWeichatOpenid3335588');
        //     return res.redirect(sails.config.connections.wxGetCode+dataInfo.userid);
        // }
        var storeid     =  dataInfo.storeid;
        var redisKey=dataInfo.userid+'_openid';
        var myRedis = redis.client({db:5});
        myRedis.hget(redisKey,'wxredirecturl', function (err, value) {
            if(!value){
                retData['isNeedAuth']=1;
            }else{
                //utility.mPingpp.wxPubOauth.getOpenid('wx8c9b3748a225ed20', '9838bbce9d99790c287a5a30e1c59aa6', dataInfo.code, function(err, openid){
                console.log(sails.config.connections.wxauth_info[storeid][0]);
                console.log(sails.config.connections.wxauth_info[storeid][1]);
                utility.mPingpp.wxPubOauth.getOpenid(sails.config.connections.wxauth_info[storeid][0], sails.config.connections.wxauth_info[storeid][1], dataInfo.code, function(err, openid){
                    console.log('err = ',err);
                    if(err){
                        console.log(err);
                        console.log('getWeichatOpenid3335599');
                        return res.redirect(sails.config.connections.wxGetCode+dataInfo.userid);
                    }
                    console.log(openid);
                    console.log('redisKey = ',redisKey);
                    myRedis.hset(redisKey,storeid,openid,
                        function (err, red) {
                            if(err){
                                console.log(err);
                            }else{
                                //console.log(redisKey+' : ',red);
                            }
                    });
                });
                console.log('wxredirecturl : ',value);
                return res.redirect(value);
            }

        });



    },
    getWeichatOpenid4: function(req, res){
        var redisKey=req.param('userid')+'wxopendid';
            redis.client().get(redisKey, function (err, value) {
                if (!err) {
                    openid = value;
                    console.log('huangpeng_openid_createorder');
                    console.log(value);
                };
                return res.json(value);
            });
    },
    getWeichatOpenid5: function(req, res){
        var client=redis.client({db:5});
        // client.hdel("xian", function (err, reply) {
        //     if (err) {
        //         console.log("xian",err);
        //         return;
        //     };
        //     console.log(reply);     // 删除成功，返回1，否则返回0(对于不存在的键进行删除操作，同样返回0)
        // });
        var obj={};
        client.hmset("hptest",obj);
        return res.json({
                code:200,
                data:'getWeichatOpenid5',
            })
    },
    getWeichatOpenid6: function(req, res){
        var client=redis.client({db:5});
        client.hset("hptest",'name',req.param('name'));
        return res.json({
                code:200,
                data:'getWeichatOpenid6',
            })
    },
    getWeichatOpenid8: function(req, res){
        var client=redis.client({db:5});
        client.del("hptest", function (err, reply) {
            if (err) {
                console.log("hptest",err);
                return;
            };
            console.log(reply);     // 删除成功，返回1，否则返回0(对于不存在的键进行删除操作，同样返回0)
        });
        return res.json({
                code:200,
                data:'getWeichatOpenid8',
            })
    },
    getWeichatOpenid7: function(req, res){
        var client=redis.client({db:5});
        client.hget("hptest",'age',function(err,value) {
            if (err) {
                console.log("hptest",err);
                return;
            };
            return res.json({
                code:200,
                data:value,
            })
        })
    },
    // 二维码支付 轮询接口
    qrPolling: function(req, res){

        console.log(req.path);
        console.log(req.allParams());
        var retData={'code':200,'codeInfo':'ok','data':null}
        var ordernumber = req.param('ordernumber');
        var myRedis = redis.client({db:5});
        var redisKeyStr='qrPolling_'+ordernumber;
        myRedis.get(redisKeyStr, function (err, value) {
            if (value) {
                    var newvalue= parseInt(value)+1;
                    console.log(redisKeyStr+': times '+newvalue);
                    myRedis.set(redisKeyStr,newvalue);
                }else{
                    console.log(redisKeyStr+': times 1');
                    myRedis.set(redisKeyStr,1);
                }
        });
        var querytext    = 'select storeid,tablenameofitem,status,ordertype from  ordermain where ordernumber=\''+ ordernumber+'\' or ordernumber1=\''+ ordernumber+'\'';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if (err) return res.serverError(err);
            if(results.length==1 && (results[0]['status']==1 ||  results[0]['ordertype']==11 ||  results[0]['ordertype']==13)){
                return res.json(retData);
            }else{
                retData['code']=4000;
                return res.json(retData);
            }
        });
        //return res.json({"OK":200});
    },
    // ping++支付通知接口
    isNeedCheckPassword: function (paymentid,tokenId, userId, password, callback) {
        if(paymentid==1){
            Account.validPayPassword(tokenId, userId, password, callback);
        }else{
            callback(null, {code: 200, msg: "非合约支付", data: 0});
        }
    },

    pingPayNotice: function(req, res){
        var payData =req.allParams();
        console.log('pingPayNotice');
        console.log(payData);
        var querynotice0=JSON.stringify(payData);
        var querynotice1=querynotice0.replace(/"([^"]*)"/g, "$1");
        var querynotice2=querynotice1.replace(/'/g, "");
        var querynotice = 'insert into paynotice (`detailbody`) VALUES (\''+querynotice2+ '\')';
        Paynotice.query(querynotice, function(err,results) {
            if (err) return res.serverError(err);
        });

        var resp = function (ret, status_code) {
            res.writeHead(status_code, {
            "Content-Type": "text/plain; charset=utf-8"
            });
            res.end(ret);
        }
        var pingData = req.param('data');
        //var pingData2 =JSON.parse(req.param('data') );//临时替代 稍后注释
        //pingData=pingData2['data']
        //console.log(pingData);
        switch (req.param('type')) {
            case 'charge.succeeded':
                var ordernumber_old = pingData['object']['metadata']['ordernumber'];
                var ordernumber_new = pingData['object']['order_no'];
                var chargeid = pingData['object']['id'];
                var outordernumber = pingData['object']['transaction_no'];
                var paymentid=0;
                if( pingData['object']['channel']=='alipay'){
                    paymentid = 2;
                }else if( pingData['object']['channel']=='alipay_wap'){
                    paymentid = 3;
                }else if( pingData['object']['channel']=='alipay_qr'){
                    paymentid = 4;
                }else if( pingData['object']['channel']=='wx'){
                    paymentid = 5;
                }else if( pingData['object']['channel']=='wx_pub_qr'){
                    paymentid = 6;
                }else if( pingData['object']['channel']=='wx_wap'){
                    paymentid = 7;
                }
                var querytext  = 'select * from  ordermain where ordernumber=\''+ ordernumber_old+'\'';

                console.log(querytext);
                var msgParam={};
                Ordermain.query(querytext, function(err, results) {
                    if (err) return res.serverError(err);
                    if(results.length==1 && results[0]['status']==0){
                            msgParam.sid=results[0]['buyerid'];
                            msgParam.sendname=results[0]['buyername'];
                            msgParam.type=4;
                            msgParam.sendavatar = "";
                            msgParam.rid=results[0]['storeid'];
                            var dateInfo = new Date();
                            var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");

                            var amount=pingData['object']['amount']/100;
                            var querytext2   = '';
                            if( pingData['object']['metadata']['ordertype']>=10  && pingData['object']['metadata']['ordernumber'] ){
                                if (pingData['object']['metadata']['ordertype']==10) {
                                    querytext2 = 'update ordermain set pay_time=\''+timestr+'\',ordertype=11,outordernumber=\'' +outordernumber +'\',ordernumber1=\'' +ordernumber_new +'\',chargeid=\''+chargeid +'\'   where ordernumber=\''+ ordernumber_old+'\'';
                                }else if(pingData['object']['metadata']['ordertype']==12){
                                    querytext2 = 'update ordermain set count=total_amount,pay_time2=\''+timestr+'\',paystatus=1,outordernumber1=\''+outordernumber +'\',ordertype=13,paystatus=1,status=1 , ordernumber2=\'' +ordernumber_new +'\',chargeid2=\''+chargeid +'\'   where ordernumber=\''+ ordernumber_old+'\'';

                                }
                            }
                            else{
                                querytext2 = 'update ordermain set pay_time=\''+timestr+'\',paystatus=1,status=1 , outordernumber=\'' +outordernumber +'\',ordernumber1=\'' +ordernumber_new +'\',chargeid=\''+chargeid +'\'   where ordernumber=\''+ ordernumber_old+'\'';
                            }

                            console.log(querytext2);
                            Ordermain.query(querytext2, function(err, results) {
                                if (err) return res.serverError(err);
                            });

                            //updata usercoupon info start
                            if(results[0]['coupon_number']>0){
                                UserCoupon.query('update user_coupon set status=2 where orderid=\''+ordernumber_old+'\'',function (err,cnt) {
                                    if(err) next(err,null);
                                })
                            }
                            //updata usercoupon info end

                            if( !pingData['object']['metadata']['delaypay'] ){
                                var querytext3   = 'select storeid,goodsname,goodsid,categoryid,sku,buy_num  from '+results[0]['tablenameofitem']+'  where ordernumber=\''+ ordernumber_old+'\'';

                                console.log(querytext3);
                                Orderchilditem.query(querytext3, function(err, results) {
                                    if (err) return res.serverError(err);
                                    //console.log(results);
                                    if (results.length>=1) {
                                        var merMsg = '订单号：'+ordernumber_old+' ,商品为：';
                                        results.forEach(function(elem,key){
                                            merMsg+='  '+elem['goodsname'];
                                            var querytext4 = 'update  mergoodsList'+elem['storeid']+' set reserve10=reserve10+'+elem['buy_num']+'   WHERE sku=\''+elem['sku']+'\'';
                                            var querytext5 = '   update  goodsList'+elem['categoryid']+' set reserve10=reserve10+'+elem['buy_num']+'   WHERE sku=\''+elem['sku']+'\'';
                                            console.log('querytext4:',querytext4);
                                            console.log('querytext5:',querytext5);
                                            //io.gotoQueryGoods(elem['sku']);
                                            Goodscontent.query(querytext4, function(err, results3) {
                                                if (err) return res.serverError(err);
                                                Goodscontent.query(querytext5, function(err, results4) {
                                                    if (err) return res.serverError(err);
                                                    //console.log(elem);
                                                    if (pingData['object']['metadata']['ordertype']>=10) {
                                                        presellgoodsmsg.updateOrderBeing(elem['sku'],elem['buy_num'],function(err,goods){
                                                            if(err){
                                                                console.log(err);
                                                            }
                                                            console.log(goods);
                                                        });
                                                    }
                                                });
                                            });
                                        });

                                       
                                        //msgParam.detailbody=merMsg;
                                        //m.notice.userPay(msgParam);
                                    };
                                });
                            }
                        return res.json({"OK":200});
                    }
                });
                break;
            case 'refund.succeeded':
                console.log(pingData);

                var amount = pingData['object']['amount'];
                var orderitemid = pingData['object']['metadata']['orderitemid'];
                var ordertype   = pingData['object']['metadata']['ordertype'];
                var ordernumber_old   = pingData['object']['metadata']['ordernumber'];
                var metadata   = pingData['object']['metadata'];
                var querytext    = 'select chargeid,chargeid2,tablenameofitem,is_refund,total_amount,refund_amount,ordertype from  ordermain where ordernumber=\''+ ordernumber_old+'\'';
                //  metadata={tablenameofitem:dataInfo.tablenameofitem,ordernumber:dataInfo.ordernumber,ordertype:11,orderitemid:dataInfo.id};
                console.log(querytext);
                Ordermain.query(querytext, function(err, results) {
                    //console.log(results);

                    results = results || {};
                    results.refund_amount
                    console.log('amount :',amount);

                    if(err){console.log('refund.succeeded error'); return;}
                    if(results.length==1&&results[0]['is_refund']>=1&&((parseInt(amount) +parseInt(results[0]['refund_amount']) )<=(results[0]['total_amount'] *100))){
                        console.log('amount :',parseInt(amount) +parseInt(results[0]['refund_amount']));
                        console.log('amount :',results[0]['total_amount'] *100);
                        var dd = new Date();        dd.setDate(dd.getDate()+21);
                        var timestr = dd.Format("yyyy-MM-dd hh:mm:ss.S");
                        var querytext3='';
                        var concat_str2=pingData['object']['description'].replace(/"([^"]*)"/g, "$1");
                        var concat_str=concat_str2.replace(/'/g, "");
                        if (ordertype==0) {
                            querytext3='update '+results[0]['tablenameofitem']+' set is_refund=5,updatedAt=\''+timestr+'\'  where id='+ orderitemid;
                        }else if (ordertype==11){
                            if(results[0]['ordertype']==13){
                                querytext3='update '+results[0]['tablenameofitem']+' set is_refund=18,updatedAt=\''+timestr+'\' where id='+ orderitemid;
                            }else{
                                querytext3='update '+results[0]['tablenameofitem']+' set is_refund=5,updatedAt=\''+timestr+'\' where id='+ orderitemid;
                            }

                        }else if (ordertype==13){
                            querytext3='update '+results[0]['tablenameofitem']+' set is_refund=5,updatedAt=\''+timestr+'\'  where id='+ orderitemid;
                        }

                        console.log(querytext3);

                        Ordermain.query(querytext3, function(err, results) {
                            if(err)console.log(err);
                            return resp("OK", 200);
                        });

                        if(results[0]['ordertype']==13){
                            if(metadata.ordertype&&metadata.ordertype==11){
                                    console.log('results[0].ordertype==13');
                                    //console.log(metadata);
                                    metadata.id=metadata.orderitemid;
                                    metadata.status=1;
                                    utility2.adminRefund(metadata,1,res);
                                }
                        }
                        
                    }else{
                        if(results.length==1){console.log('results.length==1');}
                        //if(results[0]['outordernumber']==transaction_no){console.log('results.length==1');}
                        if(results[0]['is_refund']>=1){console.log('results.length==2');}
                        if((amount+results[0]['refund_amount'])<=(results[0]['total_amount']*100)){console.log('results.length==3');}
                    }
                });
                // 开发者在此处加入对退款异步通知的处理代码
                break;
            default:
                console.log('未知 Event 类型');
                return resp("未知 Event 类型", 400);
                break;
        }
    },

    // http://119.147.36.61:1347/order/createOrder?storeid=4&userid=52&paymentid=4&
    // data=[ { sku: 'ND4G-4-1476342920538-151 ', num: '1',  value: '78', property: '颜色:红色' } ]&addressid=1&remark=黄鹏&
    // addresData={name:"陈文", mobile:"15914096553",province:"", city:"北京1", area:"东城区2",address:"天安门广场3",isdefaut:1}&
    // tokenId=AFC5312ADEF44F64B93005C7F99BE552&password=123456&goodstype=10&preprice=10

    //http://192.168.0.66:1337/order/createOrder?storeid=10&userid=15&paymethod=1&data=[{'gid':3,'cid':100,'num':5,'value':1.90,'property':'nike_shoes1'},{'gid':3,'cid':100,'num':5,'value':1.90,'property':'nike_shoes1'}]
    /* 创建订单的数据结构 一条就是在一个商家中购买的一些商品
        {'storeid':10,'data':[{'gid':3,'cid':100,'num':5,'value':1.90,'property':'nike_shoes1'},{'gid':3,'cid':100,'num':5,'value':1.90,'property':'nike_shoes1'}]};

    //    (b goods   3:500:5:adidas_shoes1,5:700:5:adidas_shoes1    )
    添加新的参数
    freight   运费
    ordertype    普通订单：0    预售订单：10
    preprice    当ordertype为10时此参数有效，
    */
    //创建订单接口
    /*
    storeid=4
    userid=52
    paymentid=1
    data=[ { sku: 'ND4G-4-1476342920538-151 ', num: '1',  value: '78', property: '颜色:红色' } ]
    1
    addressid=1
    remark=黄鹏
    addresData={name:"陈文", mobile:"15914096553",province:"", city:"北京1", area:"东城区2",address:"天安门广场3", isdefaut:1     }
    1
    tokenId=AFC5312ADEF44F64B93005C7F99BE552&password=123456
    mId=52
    password=123
    ordertype=10 是预售 11是已经定金 12是已经交尾款
    preprice
    couponNum  该订单一共使用的优惠券张数
    couponList=[]
    couponamount 优惠券抵用金额
    couponNum: 4,
    couponList: [ 155, 157, 153, 156 ],
    couponamount: 144 }
    */
    createOrder: function (req, res) {
        self = this;
        console.log(req.path);
        console.log(req.allParams());
        var openid = '';
        var  orderlistinfo = {};
        var money=0,money2=0,itemNo=0,freight=0;
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        var member={};
        var tokenId = req.param('tokenId');
        var isSecKill = req.param('isSecKill',0);
        console.log('tokenId = ',tokenId);
        var password = req.param('password');
        var mId = req.param("mId");
        var couponList = req.param('couponList')
        orderlistinfo['storeid']=req.param('storeid');
        orderlistinfo['addressid']=req.param('addressid');
        orderlistinfo['remark']='';
        if(req.param('remark')){
            orderlistinfo['remark']=req.param('remark');
        }
        var ordertype=0;
        var presaleendtime=null;
        orderlistinfo['preprice']=0;
        if(req.param('preprice')){
            orderlistinfo['preprice']= req.param('preprice');
        }
        orderlistinfo['userid']=req.param('userid');
        orderlistinfo['paymentid']=req.param('paymentid');
        orderlistinfo['data']= eval('(' + req.param('data') + ')');
        orderlistinfo['addresData']= eval('(' + req.param('addresData') + ')');
        orderlistinfo['ordernumber']='';
        orderlistinfo['codeInfo']='ok';
        orderlistinfo['code']=200;
        //console.log(orderlistinfo);
        var skuArray=[];
        var orderData = {};
        orderData['coupon_amount'] = 0;
        orderData['coupon_number'] = 0;
        var ispad=0;
        if(req.param('freight')){
            if( req.param('freight') >=0){
                orderData['freight'] = req.param('freight');
            }else{
                orderData['freight'] = 0;
            }
        }else{
            orderData['freight'] = 0;
        }

        // var mine = req.session.mine;
        // if (!mine) {
        //     orderlistinfo['codeInfo']='session过期请重新登录';
        //     orderlistinfo['code']=400;
        //     return res.json(orderlistinfo);
        // }


        if(req.param('ispad')&& req.param('ispad')==1 ){
            ispad=1;
        }

        var itemNames='';
        var openid = '';
        async.auto({

            checklogin: function (callback, results) {
                common.getLoginUser(req, tokenId, mId, function (err, ret) {
                    if (err) return res.negotiate(err);
                    //console.log("=========checklogin===========");
                    if (ret && ret.code == 200) {
                        member = ret.user;
                        console.log('exclude_member',member);
                        for (var j = 0; j < orderlistinfo['data'].length; j++) {
                            orderlistinfo['data'][j]['sku']= orderlistinfo['data'][j]['sku'].trim();
                            var skuArr= orderlistinfo['data'][j]['sku'].split('-');
                            console.log('exclude_sku',skuArr[1]);
                            if( parseInt(orderlistinfo['paymentid'])==1 && parseInt( member.operatorno) != parseInt(skuArr[1])){
                                orderlistinfo['code']=4055;
                                orderlistinfo['codeInfo']='合约方式不能购买其它商户的商品';
                                callback(1, 0);
                            }
                        }
                        if(orderlistinfo['code']!=4055){
                            callback(null, 0);
                        }
                    }else{
                        orderlistinfo['code']=4031;
                        orderlistinfo['codeInfo']='user not login';
                        callback(1, 0);
                    }
                });
            },
            //  去秒杀服务器验证 秒杀是否有效 参数数组对象   sku
            checkSecKill: function (callback, results) {
               //获取商户服务中心实例
                if (isSecKill) {
                    var cmdStr = self._cmdBase + 'CmdGoods/cmdServiceCenter?storeid=4';
                    console.log("cmdStr. ",cmdStr);
                    exec(cmdStr, function(err,stdout,stderr) {

                        console.log("err: ",err," \n ");
                        if (!stdout) {
                            orderlistinfo['codeInfo']='秒杀服务器中获取信息失败';
                            orderlistinfo['code']=45002;
                            callback(1, 0);
                        }else{
                            //实例数据
                            var instance = JSON.parse(stdout);
                            //商品时间组
                            instance.seckillinggroup = instance.seckillinggroup;
                            //常规商品
                            instance.gormalgoodsdata = instance.gormalgoodsdata;
                            //预售商品
                            instance.presalegoodsdata = instance.presalegoodsdata;
                            //秒杀商品
                            instance.seckillinggoodsdata = instance.seckillinggoodsdata;
                            //当前秒杀商品
                            instance.currentseckillingdata = instance.currentseckillingdata;
                            var skuArray = new Array();
                            for (var j = 0; j < orderlistinfo['data'].length; j++) {
                                if( orderlistinfo['data'][j]['secKillType']==1 ){
                                    var skuObjtemp = gcom.revertSku(orderlistinfo['data'][j]['sku']);
                                    skuArray.push(skuObjtemp.sku);
                                }
                            }

                            console.log('~~~~~~~~~~~~1~~~~~~~~~~~~~~~~miaosha~~~~');
                            console.log(skuArray)
                            //console.log('~~~~~~~~~~~~2~~~~~~~~~~~~~~~~miaosha~~~~');
                            //console.log(instance)
                            var isSecKillOk = seller.isSeckillingSku(skuArray,instance.currentseckillingdata);
                            if(isSecKillOk){
                                callback(null, 0);
                            }else{
                                orderlistinfo['codeInfo']='秒杀商品与服务器不一致';
                                orderlistinfo['code']=45001;
                                callback(1, 0);
                            }
                        }

                    });
                }else{
                    callback(null, 0);
                }
                
                    
            },
            //  重redis中拿出openid
            getWXOpenid: function (callback, results) {
                if (parseInt(req.param('paymentid'))==7)
                {
                    if (sails.config.connections.pingppKey=='sk_test_P0uDGK1SqfPGzzzfHKLWnb5G') {
                        openid='ob';
                        callback(null, 1);
                    }else{
                        var sku = orderlistinfo['data'][0]['sku'];
                        var skuArr      = sku.split('-');
                        var skuStoreid     = skuArr[1];

                        skuStoreid=4;// 后期需要注释
                        var redisKey=req.param('userid')+'_openid';
                        //console.log('getWXOpenid  ',redisKey);
                        var myRedis = redis.client({db:5});
                        myRedis.hget(redisKey, skuStoreid,function (err, value) {
                            //console.log(err);
                            if (err) {
                                orderlistinfo['codeInfo']='no openid';
                                orderlistinfo['code']=4500;
                                callback(1, 0);
                            }else{
                                openid = value;
                                console.log('huangpeng_openid_createorder');
                                //console.log(value);
                                if (value=='0') {
                                    orderlistinfo['codeInfo']='no openid';
                                    orderlistinfo['code']=4500;
                                    callback(1, 0);
                                }else{
                                    callback(null, 1);
                                }
                            }
                        });
                    }
                }else{
                    callback(null, 0);
                }


            },
            onyBuyOneStore: function (callback, results) {
                for (var j = 0; j < orderlistinfo['data'].length; j++) {
                    orderlistinfo['data'][j]['sku']= orderlistinfo['data'][j]['sku'].trim();
                    var skuArr= orderlistinfo['data'][j]['sku'].split('-');
                    if(orderlistinfo['storeid'] != skuArr[1]){
                        orderlistinfo['code']=4045;
                        orderlistinfo['codeInfo']='订单包含不同商户的商品';
                        callback(1, 0);
                    }
                }
                callback(null, 1);
            },
            // 判断该商品是否有购买限制
            buylimit: function (callback, results) {
                var paylimitcount=[];
                var haspaylimit=0;
                console.log('buylimit');
                for (var j = 0; j < orderlistinfo['data'].length; j++) {

                    utility2.checkPaylimit(req.param('userid'),orderlistinfo['data'][j]['sku'].trim(),orderlistinfo['data'][j]['num'],function(err,paylimit){
                        if(!err){
                            paylimitcount.push(paylimit);
                            if(paylimitcount.length==orderlistinfo['data'].length){
                                for (var i = 0; i < paylimitcount.length; i++) {
                                    if(paylimitcount[i]==0){
                                        haspaylimit=1;
                                    }
                                }
                                if (haspaylimit==1) {
                                    orderlistinfo['code']=4015;
                                    orderlistinfo['codeInfo']='已经达到商品的购买限制';
                                }
                            }
                        }
                    })
                }
                callback(null, 2);
            },

            // 生产服务器的订单号
            ordernumber: function (callback, results) {
                console.log('ordernumber1');
                utility.getOrderMainTableId( function (err, decode) {
                    if(err){
                        callback(null, {'orderid':-1});
                    }else{
                        var step2=sails.config.connections.ordernumberbase+decode;
                        //console.log('ordernumber2');
                        //console.log(orderlistinfo);
                        callback(null, {'orderid':step2});
                    }
                });
            },
            // 合约支付
            checkPassword: function (callback, results) {
                //console.log('checkPassword');
                if(orderlistinfo['paymentid']==1){
                    Account.validPayPassword(req.param('tokenId'), orderlistinfo['userid'], req.param('password'), function(err,data){
                        if(err){
                            orderlistinfo['code']=data['code'];
                            orderlistinfo['codeInfo']=data['msg'];
                            callback(1, data);
                        }
                        console.log('checkPassword_data',data);
                        if(data.code==200){
                            callback(null, data);
                        }else{
                            orderlistinfo['code']=data.code;
                            orderlistinfo['codeInfo']=data.msg;
                            callback(1, data);
                        }

                    });
                }else{
                    callback(null, {code: 200, msg: "非合约支付", data: 0});
                }
            },

            // 其他的判断
            checkElseData: ["checkPassword", function (callback, results) {

                //console.log('checkElseData');
                //console.log(results);
                var selectStr=' select id,propertypic,imagedefault,name,status,sku,propertyrelated,propertyvaluelist,storeid,stock,reserve10,price,pricepoint,pricepromotion,parentid,storecategoryid,type,deposit,premoneey,presaleendtime,seckillingstock,seckillingprice,isseckilling from mergoodsList'+orderlistinfo['storeid'];
                var whereStr=' where ';
                for (var j = 0; j < orderlistinfo['data'].length; j++) {
                    whereStr+= ' ( sku=\''+orderlistinfo['data'][j]['sku']+'\') or';
                }

                whereStr = whereStr.substring(0, whereStr.length-2);
                var querytext = selectStr+whereStr;
                console.log(querytext);
                var resultsTemp={};
                Ordermain.query(querytext, function(err,results2) {
                    skuArray = results2;
                    if (err) {
                        orderlistinfo['code']=4101;
                        orderlistinfo['codeInfo']='支付商品查询异常';
                        console.log('err 2:',err);
                    }else{
                        if (results2.length!=orderlistinfo['data'].length) {
                            orderlistinfo['code']=4001;
                            orderlistinfo['codeInfo']='商品不存在或者商品异常';
                            console.log('err 3:');
                        }
                        else{
                            console.log('results2.length = ',results2.length);
                            console.log('orderlistinfo.data.length = ',orderlistinfo['data'].length);
                            for (var i = 0; i < results2.length; i++) {
                                if(results2[i]['storeid'] == orderlistinfo['storeid']){


                                    if(results2[i]['status']!=3){
                                        orderlistinfo['code']=4021;
                                        orderlistinfo['codeInfo']='商品不是正常销售状态';
                                    }

                                    for (var j = 0; j < orderlistinfo['data'].length; j++) {
                                        var skuObj1 = gcom.revertSku(orderlistinfo['data'][j]['sku']);
                                        var skuObj2 = gcom.revertSku(results2[i]['sku']);
                                        if( _.isEqual(skuObj1,skuObj2) ){
                                            console.log('!!!!!!!!!!!!!!!!!!!!!! 3');
                                            //判断是否是预售购买
                                            skuArray[i]['num']=parseInt(orderlistinfo['data'][j]['num']);
                                            if( results2[i]['type']==2){
                                                if( results2.length!=1){
                                                    orderlistinfo['code']=4017;
                                                    orderlistinfo['codeInfo']='预售只能购买一种商品error';
                                                }else{
                                                    if (results2[i]['presaleendtime']<timestr) {
                                                        orderlistinfo['code']=4018;
                                                        orderlistinfo['codeInfo']='商品预售时间结束error';
                                                    }else{
                                                        presaleendtime=results2[i]['presaleendtime'].Format("yyyy-MM-dd hh:mm:ss");
                                                        ordertype=10;
                                                    }
                                                }
                                            }
                                            console.log('!!!!!!!!!!!!!!!!!!!!!! 4');
                                            //判断库存不足
                                            if ( orderlistinfo['data'][j]['secKillType']==1 ) {//是否是秒杀商品
                                                // if( results2[i]['isseckilling']!=1){
                                                //     orderlistinfo['code']=40041;
                                                //     orderlistinfo['codeInfo']='数据库中商品不是秒杀类型error';
                                                // }
                                                // else 

                                                console.log('秒杀sku',results2[i]['sku']+'-----'+orderlistinfo['data'][j]['sku']);
                                                console.log('秒杀价格',results2[i]['seckillingprice']+'-----'+orderlistinfo['data'][j]['value']);
                                                if(parseInt(results2[i]['seckillingprice']) !=parseInt(orderlistinfo['data'][j]['value'])){
                                                    orderlistinfo['code']=40042;
                                                    orderlistinfo['codeInfo']='与数据库中商品秒杀价格不一致error';
                                                }
                                                else if( orderlistinfo['data'][j]['num']>( results2[i]['seckillingstock']-results2[i]['seckillingsell'] ) ){
                                                    orderlistinfo['code']=40040;
                                                    orderlistinfo['codeInfo']='秒杀库存不够error';
                                                }else{
                                                    //results2[i]['price']=results2[i]['seckillingprice'];
                                                }
                                            }else{
                                                if( orderlistinfo['data'][j]['num']>( results2[i]['stock']-results2[i]['reserve10'] ) ){
                                                    orderlistinfo['code']=4004;
                                                    orderlistinfo['codeInfo']='库存不够error';
                                                }
                                            }

                                            //更新该系列商品的总库存  应该是在函数 在ping++通知回调中更新库存
                                            if( results2[i]['type']==2){//预售
                                                console.log('!!!!!!!!!!!!!!!!!!!!!! 5');
                                                if(orderlistinfo['paymentid'] == 1)//合约支付不用调用ping++接口
                                                {
                                                    money=results2[i]['deposit']*orderlistinfo['data'][j]['num'];
                                                    money2=results2[i]['premoneey']*orderlistinfo['data'][j]['num'];

                                                    itemNo=orderlistinfo['data'][j]['num'];
                                                    console.log('!!!!!!!!!!!!!!!!!!!!!!',results2[i]['presaleendtime']);
                                                    console.log( typeof results2[i]['presaleendtime'] );

                                                    if(results.checkPassword.data.operatorno!=req.param('storeid')){
                                                        orderlistinfo['code']=4016;
                                                        orderlistinfo['codeInfo']='用户不是该商户的会员';
                                                    }
                                                    if(results.checkPassword.data.money<money){
                                                        orderlistinfo['code']=4006;
                                                        orderlistinfo['codeInfo']='用户合约金额不足';
                                                    }
                                                }else{
                                                    console.log('!!!!!!!!!!!!!!!!!!!!!! 55');
                                                    money=results2[i]['deposit']*orderlistinfo['data'][j]['num'];
                                                    money2=results2[i]['premoneey']*orderlistinfo['data'][j]['num'];
                                                    itemNo=orderlistinfo['data'][j]['num'];
                                                }
                                            }
                                            else{
                                                if(orderlistinfo['paymentid'] == 1)//合约支付不用调用ping++接口
                                                {
                                                    money+=results2[i]['pricepoint']*orderlistinfo['data'][j]['num'];
                                                    itemNo+=orderlistinfo['data'][j]['num'];
                                                    presaleendtime=results2[i]['presaleendtime'];

                                                    if(results.checkPassword.data.operatorno!=req.param('storeid')){
                                                        orderlistinfo['code']=4016;
                                                        orderlistinfo['codeInfo']='用户不是该商户的会员';
                                                    }
                                                    if(results.checkPassword.data.money<money){
                                                        orderlistinfo['code']=4006;
                                                        orderlistinfo['codeInfo']='用户合约金额不足';
                                                    }
                                                }else{
                                                    //money+=orderlistinfo['data'][j]['value']*orderlistinfo['data'][j]['num'];
                                                    console.log('!!!!!!!!!!!!!!!!!!!!!! price_start');
                                                    console.log(results2[i]);
                                                    console.log('!!!!!!!!!!!!!!!!!!!!!! price_end');
                                                    if ( orderlistinfo['data'][j]['secKillType']==1) {
                                                        money+=results2[i]['seckillingprice']*orderlistinfo['data'][j]['num'];
                                                        itemNo+=orderlistinfo['data'][j]['num'];
                                                    }else{
                                                        money+=results2[i]['price']*orderlistinfo['data'][j]['num'];
                                                        itemNo+=orderlistinfo['data'][j]['num'];
                                                    }
                                                }
                                            }

                                            console.log('money :',money);
                                            console.log('money2 :',money2);
                                        

                                        }
                                    };
                                }else{
                                    orderlistinfo['code']=4005;
                                    orderlistinfo['codeInfo']='商品与商户不一致';
                                }
                            }


                            /*----会员购买的商品的合法性判断  end----*/

                            for (var i = 0; i < results2.length; i++) {
                                //orderlistinfo['data'][j]['sku'].trim()
                                resultsTemp[results2[i]['sku'].trim()]=results2[i];
                            };
                        }
                    }
                    callback(null,resultsTemp);
                });
            }],
            //  判断优惠券的合法性
            couponCheck: ["buylimit","checkElseData", function (callback, results) {
                //callback(null, 0);
                if (parseInt(req.param('couponNum'))>0 )
                {
                    if(ordertype==0){
                        coupon.judgeCoupon(couponList.toString(),mId,skuArray,function(couponData){
                            console.log('couponCheck3',couponData);
                            if( couponData.code==200  && couponData.discount==req.param('couponamount') ){
                                console.log('couponCheck4');
                                orderData['coupon_id'] = couponList.toString() ;
                                orderData['coupon_amount'] = couponData.discount;
                                orderData['coupon_number'] =parseInt(req.param('couponNum'));
                                callback(null, couponData.couponarr);
                            }else{
                                console.log('couponCheck5');
                                orderlistinfo['code']=couponData.code+1;
                                orderlistinfo['codeInfo']=couponData.discount+'服务器优惠价格和客户端不一致  '+req.param('couponamount');
                                callback(1, orderlistinfo);
                            }
                        });
                    }else{
                        console.log('couponCheck6');
                        orderlistinfo['code']=4080;
                        orderlistinfo['codeInfo']='预售商品不能使用优惠券';
                        callback(1, orderlistinfo);
                    }

                }
                else{
                    callback(null, 0);

                }
            }],
            checkEveryThingIsOk: ["checkSecKill","couponCheck","checklogin","getWXOpenid","buylimit","ordernumber", "checkPassword","checkElseData", function (callback, results) {
                console.log('checkEveryThingIsOk1');
                console.log( typeof results.ordernumber.orderid);
                console.log(results.checkPassword.code);
                //console.log(orderlistinfo['code']);
                if( orderlistinfo['code']==200 && results.ordernumber.orderid!=-1 && results.checkPassword.code==200){
                    console.log('checkEveryThingIsOk2');
                    callback(null,{'everythingIsOk':1});
                }else{
                    console.log('checkEveryThingIsOk3');
                    callback(null,{'everythingIsOk':0});
                }

            }],
            savePaylimit: ["checkEveryThingIsOk", function (callback, results) {
                if( results.checkEveryThingIsOk.everythingIsOk==1){
                    for (var jj = 0; jj < orderlistinfo['data'].length; jj++) {
                        console.log('****************check save*******************************savePaylimit');
                        utility2.savePaylimit(req.param('userid'),orderlistinfo['data'][jj]['sku'].trim(),orderlistinfo['data'][jj]['num']);
                    }
                }
                callback(null,1);
            }],
            payPricepoint: ["checkEveryThingIsOk", function (callback, results) {
                console.log('payPricepoint');
                //console.log(orderlistinfo);
                if( results.checkEveryThingIsOk.everythingIsOk==1){
                    if(orderlistinfo['paymentid']==1){
                        console.log('payPricepoint');
                        var money_T=money+orderData['freight']*1;
                        if (parseInt(req.param('couponNum'))>0 )
                        {
                            money_T-=orderData['coupon_amount'];
                        }
                        if(money_T<0){money_T=0;}
                        Account.updateUserAmount(tokenId,orderlistinfo['userid'], money_T, function(err,data){
                            if(err){
                                orderlistinfo['code']=data['code'];
                                orderlistinfo['codeInfo']=data['msg'];
                                console.log(orderlistinfo);
                                callback(null,0);
                            }else{
                                var log = {
                                    userid: mId,
                                    username: member.useralias,
                                    storeid: -1,
                                    operatorid: -1,
                                    operatorname: 'buy_goods_'+orderlistinfo['storeid'],
                                    beforeprice: member.money,
                                    price: money_T,
                                    afterprice: member.money-money_T
                                };
                                Logaddmoney.create(log).exec(function (err, log) {
                                    if (err) {
                                        return res.negotiate(err);
                                    }
                                });

                                console.log('goood = ',results.checkElseData);
                                orderlistinfo['data'].forEach(function(elem,key){
                                    console.log('elem:',elem);
                                    console.log('key:',key);
                                    var goodsku=elem['sku'];
                                    var querytext4 = 'update  mergoodsList'+orderlistinfo['storeid']+' set reserve10=reserve10+'+elem['num']+'  WHERE sku=\''+goodsku+'\'';
                                    console.log('parentid = ',results.checkElseData[goodsku]['parentid']);

                                    var querytext5 = 'update  goodsList'+results.checkElseData[goodsku]['parentid']+' set reserve10=reserve10+'+elem['num']+'  WHERE sku=\''+goodsku+'\'';
                                    console.log('querytext4:',querytext4);
                                    console.log('querytext5:',querytext5);
                                    Goodscontent.query(querytext4, function(err, results) {
                                        presellgoodsmsg.updateOrderBeing(elem['sku'],elem['num'],function(err,goods){
                                            if(err){
                                                console.log(err);
                                            }
                                        });
                                    });
                                    Goodscontent.query(querytext5, function(err, results) {});
                                });

                                callback(null,1);
                            }
                        });
                    }else{callback(null,0);}
                }else{callback(null,0);}
            }],
            updataMysql: ["payPricepoint", function (callback, results5) {
                console.log('updataMysql1');
                if( results5.checkEveryThingIsOk.everythingIsOk==1){
                    console.log('updataMysql2');
                    /*----插入主订单star----*/

                    utility.checkOrderchilditemTable(dateInfo);
                    orderData['paymentid'] = orderlistinfo['paymentid'];
                    orderData['paymentalias'] = "getway";
                    orderData['ordernumber'] =results5.ordernumber.orderid;
                    // if ( parseInt(req.param('userid')) == 52 ) {

                    //     orderData['ordernumber'] ='1000000000000062';
                    // };
                    orderData['outordernumber'] = orderData['ordernumber'];
                    orderlistinfo['ordernumber']= orderData['ordernumber'];
                    orderlistinfo['chargeid']= '';
                    orderData['tablenameofitem'] = utility.orderItemTableName;
                    orderData['ordertype'] = ordertype;
                    orderData['buyerid'] = req.param('userid');
                    orderData['buyername'] = orderlistinfo['addresData']['name'];
                    orderData['storeid'] = orderlistinfo['storeid'];
                    orderData['remark'] = orderlistinfo['remark'];

                    if(orderlistinfo['paymentid'] == 1 && results5.payPricepoint==1){
                        orderData['status'] = 1;
                        orderData['paystatus'] = 1;
                    }else{
                        orderData['status'] = 0;
                        orderData['paystatus'] = 0;
                    }
                    orderData['paytype'] = 0;
                    orderData['logisticsid'] = 0;
                    orderData['logisticsnumber'] = 0;
                    //[{"name":"陈麒文","mobile":"15914096553","province":"","city":"北京","area":"东城区","address":"天安门广场","isdefaut":1}]
                    orderData['consigneename'] = orderlistinfo['addresData']['name'];
                    orderData['consignee_region_id'] = orderlistinfo['addresData']['city'];
                    orderData['consignee_region_name'] = orderlistinfo['addresData']['area'];
                    orderData['consignee_address'] = orderlistinfo['addresData']['address'];
                    orderData['consignee_zipcode'] = orderlistinfo['addresData']['address'];
                    orderData['consignee_email'] = orderlistinfo['addresData']['province'];
                    orderData['consignee_mobile'] = orderlistinfo['addresData']['mobile'];
                    // 发票信息
                    
                    if( req.param('invoice_tax') ) {
                        orderData['invoice_tax'] = req.param('invoice_tax');
                    }else{
                        orderData['invoice_tax'] = '0';
                    }
                    if(req.param('isinvoice') == 0) {
                        orderData['isinvoice'] = req.param('isinvoice');
                        orderData['invoice_belong'] = "打令智能";
                    }
                    if(req.param('isinvoice') == 1) {
                        orderData['isinvoice'] = req.param('isinvoice');
                        orderData['invoice_belong'] = req.param('invoice_belong');
                    }
                    if(req.param('isinvoice') == 2) {
                        orderData['isinvoice'] = req.param('isinvoice');
                        orderData['invoice_belong'] = req.param('invoice_belong');
                    }


                    orderData['promotion_amount'] = 0;
                    orderData['is_cancel'] = 0;
                    orderData['is_urgent'] = 0;
                    orderData['refund_amount'] = 0;

                    orderData['is_refund'] = 0;
                    orderData['isdelete'] = 0;
                    orderData['is_del_user'] =0;

                    orderData['pay_time'] = timestr;
                    //orderData['delivery_time'] = timestr;
                    orderData['finished_time'] = timestr;
                    orderData['is_secKill'] = isSecKill;
                    if(ordertype==10){
                        orderData['presale_endtime'] = presaleendtime;
                        orderData['final_endtime'] = presaleendtime;
                        orderData['payment_amount']  = money;
                        orderData['total_amount']    = money2+orderData['freight']*1;
                        orderData['count']           = money;
                    }else{
                        orderData['payment_amount'] = money+orderData['freight']*1-orderData['coupon_amount'];
                        orderData['total_amount']   = money+orderData['freight']*1-orderData['coupon_amount'];
                        orderData['count']          = money+orderData['freight']*1;
                    }
                    orderData['createdAt'] = timestr;
                    orderData['updatedAt'] = timestr;

                    var querytext2 = utility.insertDataToTable(orderData,'ordermain');

                    Ordermain.query(querytext2, function(err,results) {
                        if (err){
                            console.log(err);
                            callback(null,{'updataMysql':0});
                        }else{
                            if (orderData['coupon_number']>0) {
                                var tmpCps=[];
                                console.log('results5.couponCheck = ',results5.couponCheck);
                                for(var i=0;i<results5.couponCheck.length;i++){
                                    var myCoupon={};
                                    myCoupon.status=-1;
                                    if(orderlistinfo['paymentid']==1){
                                        myCoupon.status=2;
                                    }
                                    myCoupon.uid=mId;
                                    myCoupon.user=member.usermobile;
                                    myCoupon.cid=results5.couponCheck[i].id;
                                    myCoupon.type=results5.couponCheck[i].coupontype;
                                    myCoupon.cmode=results5.couponCheck[i].couponmode;
                                    myCoupon.cname=results5.couponCheck[i].couponname;
                                    myCoupon.cendtime=(new Date(results5.couponCheck[i].endtime)).Format("yyyy-MM-dd hh:mm:ss");
                                    myCoupon.cmoney=results5.couponCheck[i].parvalue;
                                    myCoupon.usedAt=timestr;
                                    myCoupon.orderid=orderData['ordernumber'];
                                    if(myCoupon.cmode==1){
                                        myCoupon.createdAt=timestr;
                                        tmpCps.push(myCoupon);
                                    }else{

                                        myCoupon.id=results5.couponCheck[i].aid;
                                        UserCoupon.update({id:myCoupon.id},myCoupon).exec(function afterwards(err, updated){
                                          if (err) {return;}
                                        });
                                    }
                                }
                                console.log('tmpCps',tmpCps);
                                if(tmpCps.length>0){
                                    UserCoupon.insertData(tmpCps,function (err,data) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                }
                            };
                            //订单失效后不能发起再付款
                            if (isSecKill==1) {
                                //秒杀商品未付款订单15分钟失效
                                utility2.addScheduleOfTimeMinute(orderData['ordernumber'],orderData['tablenameofitem'],15,20,'mem'); 
                                //mergoodsList+orderlistinfo['storeid']
                            }else{
                                //普通商品未付款订单24小时失效
                                utility2.addScheduleOfTime(orderData['ordernumber'],orderData['tablenameofitem'],1,21,'minu');
                            }

                            utility.updateCreateOrderInfo(orderData['ordernumber'],"step1",res);
                            /*----插入与订单相关的商品详情记录star----*/

                            console.log('goood  1');
                            var orderItemDate = {};
                            orderItemDate['ordernumber']      = orderData['ordernumber'];
                            orderItemDate['is_comment']     = 0;
                            orderItemDate['is_package']     = 0;
                            orderItemDate['is_delivery']    = 0;
                            orderItemDate['is_invoice']     = 0;
                            orderItemDate['is_refund']      = 0;
                            orderItemDate['refund_type']    = 0;
                            orderItemDate['refund_amount']  = 0;
                            orderItemDate['ordernumber']        = orderData['ordernumber'];
                            orderItemDate['storeid']            = orderData['storeid'];
                            orderItemDate['createdAt'] = timestr;
                            orderItemDate['updatedAt'] = timestr;
                            //orderItemDate['buyerid'] = req.param('userid');

                            console.log('goood  2');
                            var isErrorCallback=0;
                            var orderlistcounter=0;
                            var discount_price_last=0.0;
                            for (var j = 0; j < orderlistinfo['data'].length; j++) {
                                orderItemDate['goodsid']        = 0;//results5.checkElseData  resultsTemp

                                console.log('goood  3');
                                //var skuObjj = gcom.revertSku(orderlistinfo['data'][j]['sku']);
                                orderItemDate['sku']            = orderlistinfo['data'][j]['sku'];
                                console.log('results5.checkElseData',results5.checkElseData);
                                console.log('goood  sku',orderItemDate['sku']);
                                orderItemDate['categoryid']     = results5.checkElseData[orderItemDate['sku']]['parentid'];
                                if(results5.checkElseData[orderItemDate['sku']]['propertypic']&&results5.checkElseData[orderItemDate['sku']]['propertypic']!=0){
                                    orderItemDate['goodsimage']     = results5.checkElseData[orderItemDate['sku']]['propertypic'];
                                }else{
                                    orderItemDate['goodsimage']     = results5.checkElseData[orderItemDate['sku']]['imagedefault'];
                                }

                                console.log('goood  41');
                                orderItemDate['goods_property'] = orderlistinfo['data'][j]['property'];
                                orderItemDate['goodsname']      = results5.checkElseData[orderItemDate['sku']]['name'];

                                console.log('goood  42');
                                orderItemDate['original_price'] = results5.checkElseData[orderItemDate['sku']]['price'];;
                                orderItemDate['buy_price']      = orderlistinfo['data'][j]['value'];
                                orderItemDate['buy_num']        = orderlistinfo['data'][j]['num'];
                                orderItemDate['secKillType']        = orderlistinfo['data'][j]['secKillType'];
                                orderItemDate['discount_price']=0;

                                console.log('goood  43');
                                if(ordertype==0){

                                    console.log('discount_price1 = ',orderItemDate['discount_price']);
                                    console.log('buy_price = ',orderItemDate['buy_price']);
                                    console.log('buy_num = ',orderItemDate['buy_num']);
                                    console.log('coupon_amount = ',orderData['coupon_amount']);
                                    console.log('money = ',money);
                                    if( j ==(orderlistinfo['data'].length-1) ){
                                        orderItemDate['discount_price'] = 1 - discount_price_last;
                                    }else{
                                        orderItemDate['discount_price'] = orderItemDate['buy_price']*orderItemDate['buy_num']/money;
                                        discount_price_last+=orderItemDate['discount_price'];
                                    }
                                }

                                console.log('goood  44');
                                console.log('discount_price2 = ',orderItemDate['discount_price']);
                                //console.log('!!!!!!!!!!!!!!!!!!!!!! 6',results5.checkElseData[orderItemDate['sku']]['deposit']);
                                if (orderItemDate['secKillType']==1) {
                                    var sql3='UPDATE  mergoodsList4 SET seckillingsell=seckillingsell+'+orderItemDate['buy_num']+'  where sku=\''+orderItemDate['sku']+'\'';
                                    console.log(sql3);
                                    Ordermain.query(sql3, function(err, orderinfo2) {
                                        if(err){
                                            console.log('err',err);
                                        }else{
                                            console.log('增加秒杀售出 ok2');
                                        }
                                    });

                                    var skuObjtemp = gcom.revertSku(orderItemDate['sku']);
                                    var sql4='UPDATE  mergoodsList4 SET seckillingsell=seckillingsell+'+orderItemDate['buy_num']+'  where sku=\''+skuObjtemp.sku+'\'';
                                    console.log(sql4);
                                    Ordermain.query(sql4, function(err, orderinfo2) {
                                        if(err){
                                            console.log('err',err);
                                        }else{
                                            console.log('上报sku');
                                            cmdGoods.cmdUpdateGoods(skuObjtemp.sku);
                                        }
                                    });
                                };

                                if(ordertype==10){

                                    orderItemDate['original_price'] = results5.checkElseData[orderItemDate['sku']]['premoneey'];;

                                    orderItemDate['pre_price']        = results5.checkElseData[orderItemDate['sku']]['deposit'];
                                }

                                //itemNames=orderItemDate['goodsname']+' x '+orderItemDate['buy_num']+' ';
                                itemNames=orderItemDate['goodsname'];
                                var querytext3 = utility.insertDataToTable(orderItemDate,utility.orderItemTableName);

                                Orderchilditem.query(querytext3, function(err,results) {
                                    orderlistcounter++;
                                    if (err){
                                        console.log(err);
                                        if(isErrorCallback==0){
                                            isErrorCallback=1;
                                            callback(null,{'updataMysql':0});
                                        }
                                    }else{
                                        if(isErrorCallback==0 && orderlistinfo['data'].length==orderlistcounter){
                                            callback(null,{'updataMysql':1});
                                        }
                                    }
                                });


                            }
                        }
                    });

                    console.log('goood  4');
                    /*----插入主订单 end----*/
                }else{
                    callback(null,{'updataMysql':0});
                }
            }],
            payAndCharge: ["updataMysql", function (callback, results) {
                console.log('payAndCharge  1');
                console.log('results.checkEveryThingIsOk.updataMysql  =',results.updataMysql.updataMysql);
                if( results.updataMysql.updataMysql==1){
                    console.log('payAndCharge  2');
                    if(orderlistinfo['paymentid']!=1){
                        console.log('payAndCharge  4');
                        //orderData['ordertype'] = 1;
                        var amount = orderData['payment_amount']*100;
                        var client_ip = '1.1.1.1';
                        var ipArr = req.ip.split(":");
                        if(ipArr.length>=1){
                            if(ipArr[ipArr.length-1].length>5){
                                client_ip=ipArr[ipArr.length-1];
                            }
                        }

                        orderData['openid']=openid;
                        orderData['itemNames']=itemNames;
                        orderData['metadata']={'ordernumber':orderData['ordernumber'],'ordertype':ordertype};
                        if(ordertype==10){
                            orderData['total_amount']=orderData['payment_amount'];
                        }
                        orderData['mId']=req.param("mId");
                        utility2.createPayment(orderData,client_ip,ispad, function(err, charge) {

                            console.log('payAndCharge  5');
                            if (err != null) {
                                var querystring = require('querystring');
                                var contents = querystring.stringify(err);
                                console.log(err);
                                //console.log(contents);
                                return res.json(contents);
                            }
                            else{
                                if (charge != null) {
                                    console.log('payAndCharge_99999999999999');
                                    console.log(charge);
                                    var querytext2   = 'update ordermain set chargeid=\''+charge['id'] +'\'   where ordernumber='+ charge['order_no'];
                                    console.log(querytext2);
                                    Ordermain.query(querytext2, function(err,results) {
                                        if (err) return res.serverError(err);
                                    });
                                    return res.json(charge);
                                }else{
                                    return res.json(orderlistinfo);
                                }
                            }

                        });
                    }else{
                        callback(null,0);
                        return res.json(orderlistinfo);
                    }
                }else{
                    return res.json(orderlistinfo);
                }
            }]
        },
        function(err,data){
            console.log(orderlistinfo);
            if(err){
                return res.json(orderlistinfo);
            }
        });
    },

    createOrderWithSecond: function(req, res){

        console.log(req.path);
        console.log(req.allParams());
        var returnData = {'codeInfo':'ok','code':200};
        var ordernumber = req.param('ordernumber');
        var tablenameofitem = req.param('tablenameofitem');
        var paymentid = req.param('paymentid');
        var tokenId = req.param('tokenId');
        var mId = req.param("mId");
        var openid='';
        var orderData={};
        var ispad=0;
        if(req.param('ispad')&& req.param('ispad')==1 ){
            ispad=1;
        }
        orderData['paymentid']=paymentid;
        orderData['buyerid']=parseInt(req.param('userid')) ;
        async.auto({

            checklogin: function (callback, results) {
                common.getLoginUser(req, tokenId, mId, function (err, ret) {
                    if (err) return res.negotiate(err);
                    console.log("=========checklogin===========");
                    if (ret && ret.code == 200) {
                        var member = ret.user;
                    }else{
                        orderlistinfo['code']=4500;
                        orderlistinfo['codeInfo']='user not login';
                    }
                    callback(null, 0);
                });
            },
            // 生产服务器的订单号
            ordernumber: function (callback, results) {
                utility.getOrderMainTableId( function (err, decode) {
                    if(err){
                        callback(null, {'orderid':-1});
                    }else{
                        var step2=sails.config.connections.ordernumberbase+decode;
                        callback(null, {'orderid':step2});
                    }
                });
            },
            checkIsPreSecond: function (callback, results) {
                var querytext    = 'select a.payment_amount,a.total_amount,a.buyerid,a.storeid,a.chargeid,a.chargeid2,a.ordertype,a.tablenameofitem,a.status,b.goodsname,b.buy_num,b.buy_price,b.pre_price from  ordermain as a , '+
                tablenameofitem+' as b  where a.ordernumber=\''+ ordernumber+'\' and a.ordernumber=b.ordernumber';
                console.log(querytext);
                Ordermain.query(querytext, function(err, results) {
                    if (err) {
                        console.log(err);
                        returnData['code']=4000;
                        returnData['codeInfo']='mysql query error';
                        callback(null, 0);
                    }else{

                        if(results.length==1){
                            if(results[0]['ordertype']<10){
                                returnData['code']=4001;
                                returnData['codeInfo']='非预付订单';
                            }else if(results[0]['ordertype']==10){
                                returnData['code']=4002;
                                returnData['codeInfo']='未支付定金';
                            }else if(results[0]['ordertype']==11){
                                returnData['code']=4003;
                                returnData['codeInfo']='已支付定金,交尾款时间未到';
                            }else if(results[0]['ordertype']>12){
                                returnData['code']=4004;
                                returnData['codeInfo']='已支付定金,已支付交尾,已经完成';
                            }else{
                                console.log('该预付订单可以交尾款 ordertype :',results[0]['ordertype']);
                            }
                            if(results[0]['buyerid']!=orderData['buyerid']){
                                returnData['code']=4005;
                                returnData['codeInfo']='两次付款不是同一个用户';
                            }
                        }else{
                            returnData['code']=4006;
                            returnData['codeInfo']='订单不唯一';
                        }
                        callback(null, results[0]);
                    }
                });
            },
            getWXOpenid: function (callback, results) {
                if (parseInt(req.param('paymentid'))==7)
                {
                    if (sails.config.connections.pingppKey=='sk_test_P0uDGK1SqfPGzzzfHKLWnb5G') {
                        openid='ob';
                        callback(null, 1);
                    }else{
                        var redisKey=req.param('userid')+'wxopendid';
                        var myRedis = redis.client({db:5});
                        console.log('redisKey ',redisKey);
                        myRedis.get(redisKey, function (err, value) {
                            if (err) {
                                returnData['code']=4500;
                                returnData['codeInfo']='no openid';
                                returnData['data']=sails.config.connections.redirectURL;
                            }else{
                                openid = value;
                                console.log('huangpeng_openid_createorder');
                                console.log(value);
                                if (!openid) {
                                    returnData['code']=4500;
                                    returnData['codeInfo']='no openid';
                                    returnData['data']=sails.config.connections.redirectURL;
                                };
                            };
                            callback(null, 1);
                        });
                    }
                }else{
                    callback(null, 0);
                }


            },
            /* 合约支付
            checkPassword: function (callback, results) {
                if(orderlistinfo['paymentid']==1){
                    Account.validPayPassword(req.param('tokenId'), orderlistinfo['userid'], req.param('password'), callback);
                }else{
                    callback(null, {code: 200, msg: "非合约支付", data: 0});
                }
            },*/
            payAndCharge: ["checklogin","checkIsPreSecond","getWXOpenid", function (callback, finalResults) {
                if( returnData['code']==200){
                    if(orderData['paymentid']==1){
                        console.log('payAndCharge  3');
                    }else{
                        console.log('payAndCharge  4');
                        console.log( finalResults.checkIsPreSecond);
                        console.log(typeof finalResults.checkIsPreSecond['pre_price']);
                        console.log(typeof finalResults.checkIsPreSecond['buy_num']);
                        var amount = finalResults.checkIsPreSecond['total_amount']-finalResults.checkIsPreSecond['payment_amount'];
                        console.log('amount : ',amount);
                        var client_ip = '1.1.1.1';
                        var ipArr = req.ip.split(":");
                        if(ipArr.length>=1){
                            if(ipArr[ipArr.length-1].length>5){
                                client_ip=ipArr[ipArr.length-1];
                            }
                        }

                        orderData['total_amount']=amount;
                        orderData['itemNames']=finalResults.checkIsPreSecond['goodsname'];

                        orderData['metadata']={'ordernumber':parseInt(ordernumber) ,'ordertype':'12'};

                        orderData['ordernumber']=finalResults.ordernumber['orderid'];
                        orderData['openid']=openid;
                        console.log(orderData);

                        utility2.createPayment(orderData,client_ip,ispad, function(err, charge) {

                            console.log('payAndCharge  5');
                            if (err != null) {
                                console.log(err);
                                returnData['code']=4007;
                                returnData['codeInfo']='charge error';
                            }
                            else{
                                if (charge != null) {
                                    console.log(charge);
                                    var querytext2   = 'update ordermain set paymentid2='+orderData['paymentid']+', chargeid2=\''+charge['id']+'\' ,ordernumber2=\''+ charge['order_no']+'\'    where ordernumber=\''+ ordernumber+'\'';
                                    console.log(querytext2);
                                    Ordermain.query(querytext2, function(err,results) {
                                        if (err) return res.serverError(err);
                                    });
                                    returnData['charge']=charge;
                                }
                            }

                            return res.json(returnData);

                        });
                    }
                }else{
                    return res.json(returnData);
                }
            }]
        });

    },
    paylimittest: function(req, res){
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        utility2.checkPaylimit(req.param('userid'),req.param('sku'),req.param('num'),function(err,data){
            console.log('是否可以购买：',data);
        })
        utility2.savePaylimit(req.param('userid'),req.param('sku'),req.param('num'));
        return res.json('paylimittest');
    },
    /*
    商家查看 退货，换货订单
    */
    getMerRefundOrderList: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        var selectData  = ['ordernumber','consignee_mobile','status','paymentid','total_amount','total_amount','tablenameofitem'];
        var storeid   =req.param('storeid');
        var serchStr=' where storeid='+storeid;
        var querytext   = 'select '+selectData.toString()+ ' from  ordermain'+ serchStr+'  order by createdAt desc';
        Ordermain.query(querytext, function(err, results) {
            if (err) return res.serverError(err);
            return res.json(results);
        });
    },
    /*
    商家 导出 退货换货订单  到 exls
    */
    exportMerRefundOrderList: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        //var selectData  = ['parentordernumber','logisticsid','tablenameofitem','paymentid','storeid','consignee_region_name'];
        var selectData  = ['logisticsid','storeid','paymentid','id'];
        var tableName   =' orderchild12';
        var querytext   = 'select * from '+tableName +' order by createdAt desc';
        Banner.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
            utility.exportExcelList(req, res,results);
        });
    },


    // 添加物流信息 order/updateLogisticsInfo?storeid=10&logisticsid=101&logisticsnumber=101&childordernumber=20160718184110000000010110101
    updateLogisticsInfo: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        console.log('updateLogisticsInfo action');

        var storeid = req.param('storeid');
        var tableName   = req.param('tablename');
        var logisticsID   = req.param('logisticsid');
        var logisticsNum   = req.param('logisticsnumber');
        var childordernumber   = req.param('childordernumber');

        var querytext1 = 'select * from orderchild'+storeid+' where  childordernumber = '+childordernumber+' limit 1';
        var querytext2 = 'UPDATE orderchild'+storeid+' SET logisticsid=';
        var serchArray = [];
        var serchStr=' where childordernumber ='+req.param('childordernumber');

        console.log(querytext1);
        Orderchild.query(querytext1, function(err, results1) {//找到这个订单
            if (err) return res.serverError(err);
            if(results1.length==1){
                querytext2 +='\''+results1[0]['logisticsid']+','+logisticsID+'\'';
                querytext2 += ', logisticsnumber = \'' + results1[0]['logisticsnumber']+','+logisticsNum+'\'' +' where childordernumber='+childordernumber;
                console.log(querytext2);
                Orderchild.query(querytext2, function(err, results2) {//更新这个订单的物流信息
                    if (err) return res.serverError(err);
                    //console.log(results);
                });
            }

        });
    },
    userShowList: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        console.log('userShowList action');
        utility.updateCreateOrderInfo(req.param('orderno'),req.param('step'),res);
    },
    getOrderDetail: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        console.log('getOrderDetail action');
        var tableName   = req.param('tablename');

        var serchArray = [];
        var serchStr=' where childordernumber ='+req.param('childordernumber');
        var querytext   = 'select *  from '+tablename +' '+ serchStr +' limit 1';
        Orderchild.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          return res.json(results);
        });
    },


    //订单的查询   各种过滤   以及
    // 序号   订单号   用户手机号  状态    发货状态    交易渠道    交易金额         创建时间              操作
    // 03      0003    123123123  待收货   未发货      合约支付     123123    2016-02-02  12:20:20      详情 发货
/*
商户在后台查看 所有的订单
*/
    getMerOrderList: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        var selectData  = ['ordernumber','storeid','consignee_mobile','status','paymentid','total_amount','total_amount','tablenameofitem'];
        var tableName   =' merrateorder'+req.param('storeid');
        var serchArray = [];
        var serchStr='';
        serchArray.push(' where ');
        if(req.param('ordernumber') != undefined){
            if( req.param('ordernumber').length<20 )
            {
                serchStr = ' childordernumber like  \'%' + req.param('ordernumber') +'%\'';
            }
            else{
                serchStr = ' childordernumber = '+req.param('ordernumber');
            }
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }

        if(req.param('mobile') != undefined){
            if( req.param('mobile').length<11 )
            {
                serchStr = ' consignee_mobile like  \'%' + req.param('mobile') +'%\'';
            }
            else{
                serchStr = ' consignee_mobile = '+req.param('mobile');
            }

            serchArray.push(serchStr);
            serchArray.push(' and ');
        }


        if(req.param('paymentid') != undefined){
            serchStr = ' paymentid = '+req.param('mobile');
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }

        // 创建时间~
        if(req.param('createdAt1') != undefined  && req.param('createdAt2') != undefined){
            serchStr = ' createdAt > '+req.param('createdAt1')+' and createdAt < '+req.param('createdAt2');
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }
        // 订单状态
        if(req.param('status') != undefined  ){
            serchStr = ' status = '+req.param('status');
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }
        // 发货状态
        if(req.param('isdeliver') != undefined  ){
            if( req.param('isdeliver') == 1){
                serchStr = ' logisticsid > 0';
            }else{
                serchStr = ' logisticsid = 0';
            }
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }

        // 交易金额~
        if(req.param('payamount1') != undefined && req.param('payamount2') != undefined ){
            serchStr = ' payment_amount > '+req.param('payamount1')+' and payment_amount < '+req.param('payamount2');
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }
        serchArray.pop();
        if(serchArray.length>=2){
            serchStr = serchArray.join(' ');
        }else{
            serchStr = '';
        }

        strInsertInto += 'select ';
        strInsertInto += obj.toString();
        strInsertInto += tablename;
        var querytext   = 'select '+selectData.toString()+ ' from '+tablename + serchStr+' order by createdAt desc';
        Orderchild.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          return res.json(results);
        });
    },
    /*
    买家查看 所有的订单
    INSERT INTO `buyermaporder` (`parentordernumber`, `childordernumber`, `storeid`, `createdAt`, `updatedAt`) VALUES ('201607181841100000000101', '20160718184110000000010110101', '17', '2016-07-26 09:21:23', '2016-07-26 09:21:26')
    */
    updateOrderStatus: function(req, res){

        console.log(req.path);
        console.log(req.allParams());
        var outordernumber ='';
        if(req.param('trade_status')!= undefined  ){
            if(req.param('outordernumber').length == 20){
                outordernumber = req.param('outordernumber');
                var querytext   = 'update ordermain set status=' +req.param('trade_status') +'   where outordernumber='+ outordernumber;
                Ordermain.query(querytext, function(err, results) {
                  if (err) return res.serverError(err);
                  return res.json(results);
                });
            }
        }
    },




    /*
    后台管理员   预定商品退款接口
    url:
    order/adminRefundPre?ordernumber=1000000000002422&orderitemid=44&amount=1&refundreason=noway
    参数:ordernumber              ：商户订单好
     refuse_reason             ：退款理由
     status                   ：0拒绝退款   1同意退款
     id                       ：子订单详细信息表中的id Orderchilditem表的id
     tablenameofitem
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 退款申请更新写失败 "
    }
    */
    adminRefundPre: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        var self = this;
        var retdata={'code':200,'codeInfo':'ok'};
        var tablenameofitem  = req.param('tablenameofitem');
        var ordernumber  = req.param('ordernumber');
        var orderitemid  = req.param('id');
        var status       = req.param('status');
        var refundData1=req.allParams();
        var refuse_reason = '无';
        if(req.param('refuse_reason')){
            refuse_reason=req.param('refuse_reason');
        }
        var querytext    = 'SELECT a.chargeid ,a.buyerid ,a.paymentid ,b.is_refund ,b.buy_price,b.refund_amount from ordermain as a , '+
        tablenameofitem +' as b where a.ordernumber=\''+ ordernumber +'\' and b.ordernumber=a.ordernumber and b.is_refund=2 and b.refund_type=2 and b.id='+orderitemid+' limit 1';

        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
        });
    },
    
    findChargeid: function(req, res){
        utility.mPingpp.charges.retrieve(
            req.param('chargeid'),
            function(err, charge) {
            // 异步调用
            return res.json(charge);
        });
    },


    /*
    后台管理员退款接口
    url:
    order/adminRefund?ordernumber=1000000000002422&orderitemid=44&amount=1&refundreason=noway
    参数:ordernumber              ：商户订单好
         refuse_reason             ：退款理由
         status                   ：0拒绝退款   1同意退款
         id                       ：子订单详细信息表中的id Orderchilditem表的id
         tablenameofitem
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 退款申请更新写失败 "
    }
    */
    adminRefund: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        if(req.session.mine&&req.session.mine.storeid==0){
            var refundData1=req.allParams();
            utility2.adminRefund(refundData1,0,res);
        }else{
            var retdata={'code':407,'codeInfo':'没有操作权限 ！'};
            return res.json(retdata);
        }
        // var tablenameofitem  = req.param('tablenameofitem');
        // var ordernumber  = req.param('ordernumber');
        // var orderitemid  = req.param('id');
        // var status       = req.param('status');
    },



    merGetRefundOrder: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        var retdata={'code':200,'codeInfo':'ok','data':[]};
        var storeid  =req.param('storeid') ;

        var showred  =req.param('showred',-1) ;// -1 all  0 read  1 Non-read 

        var merNameList=seller.getStoreArray();
        var mine = req.session.mine;
        //console.log(mine);

        var whereinfo = ' and c.is_refund>0 ';

        if(mine.storeid==0){
            if (storeid!=-1) {
                whereinfo += ' and  a.storeid=' + storeid;
            }
        }
        else{
            whereinfo += ' and  a.storeid=' + mine.storeid;
        }

        if( req.param('mobile') ){
            whereinfo+=' and  b.usermobile  like   \'%'+req.param('mobile')+'%\'';
        }

        if ( req.param('createdAt1') && req.param('createdAt2') ) {
            whereinfo+=' and a.createdAt>=\''+req.param('createdAt1')+'\' and  a.createdAt<=\''+req.param('createdAt2')+'\' ';
        };

        var dateInfo = new Date();
        var nowYear = parseInt(dateInfo.getFullYear()) ;
        var userYear = 2016;
        if ( req.param('createdAt1') ) {
            console.log('---kk---');
            var dateInfo2 = new Date(req.param('createdAt1'));
            userYear = parseInt(dateInfo2.getFullYear()) ;

        }

        if (userYear < 2016) {
            console.log('---kk--1-');
            nowYear=2016;
        }
        if (nowYear < userYear) {
            console.log('---kk--1-');
            userYear=nowYear;
        }

        console.log('---kk--1-',userYear);
        console.log('---kk--1-',nowYear);

        if( req.param('ordernumber') ){
            whereinfo+=' and  a.ordernumber like \'%'+req.param('ordernumber')+'%\'';
        }


        /*
        req.param('refund') 的状态说明
        -1--->所有
        0---->已经申请  is_refund>0&& mer_agree==0
        1---->进行中    is_refund>0 && mer_agree==2
        2---->已经撤销  maintenance>=1&&is_refund==0 
        3---->售后结束（售后成功，7天之内没有上传物流单号，管理后台拒绝） is_finished==1
        4---->失败（商家拒绝）     is_refund>0 && mer_agree==1
        */
        if( req.param('refund') == 0 ){
            whereinfo+=' and c.is_refund>0 and c.mer_agree=0 ';
        }else if( req.param('refund') == 1 ){
            whereinfo+=' and c.is_refund>0 and c.mer_agree=2 ';
        }else if( req.param('refund') == 2 ){
            whereinfo+=' and c.maintenance>1 and c.is_refund=0 ';
        }else if( req.param('refund') == 3 ){
            whereinfo+=' and c.is_finished=1 ';
        }else if( req.param('refund') == 4 ){
            whereinfo+=' and c.is_refund>0 and c.mer_agree=1 ';
        }

        if( req.param('refund_type') > 0 ){
            whereinfo+=' and c.refund_type='+req.param('refund_type');
        }
        var viewName1='view_orderchilditem'+userYear;
        var querytext   = 'select a.* ,c.* ,b.usermobile from  ordermain as a , account as b , '+ viewName1 +' as c where   a.ordernumber=c.ordernumber   and  a.buyerid=b.id  and  a.is_refund>0 '+ whereinfo+'  order by a.createdAt desc';
        var counter=0;
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if (!err) {
                console.log('mytemptest');

                if(results.length>0){
                    results.forEach(function(elem,key){
                        results[key]['storename']=merNameList[elem['storeid']];
                        var tableName = "view_userchatmsg" + results[key]['tablenameofitem'].substring(14,18);
                        var sqltext = 'select * from '+tableName+' as a where a.refundrnumber="'+results[key]['refundrnumber']+'" and a.receiver="'+results[key]['storename']+'" and a.isRead=0 order by a.createdAt asc';
                        //console.log(sqltext);
                        UserchatMsg.query(sqltext, function(err, result) {
                        //UserchatMsg.find({refundrnumber:results[key]['refundrnumber'], receiver:results[key]['storename'],isRead:0}).exec(function (err, result) {
                            if (err) return res.negotiate(err);

                            if (result.length > 0) {
                                results[key]['tableName']=result[0].tableName;
                            }else{
                                results[key]['tableName']="";
                            }

                            if (showred==-1) {
                                if (result.length==0) {
                                    results[key]['redFlag']=0;
                                }else{
                                    results[key]['redFlag']=1;
                                }
                            }else{
                                if (showred==0) {
                                    if (result.length==0) {
                                        results[key]['redFlag']=0;
                                    }else{
                                        delete(results[key]);
                                    }
                                }else {
                                    if (result.length>=1) {
                                        results[key]['redFlag']=1;
                                    }else{
                                        delete(results[key]);
                                    }
                                }
                            }
                            
                            counter+=1;
                            if(counter==results.length){
                                for(var index = 0; index < results.length; index++){
                                    if(results[index]) retdata['data'].push(results[index]);
                                }
                                return res.json(retdata);
                            }
                        });
                    });
                }
                else{
                    return res.json(retdata);
                }
            };
        });
        


    },
    /*
    客户端删除订单接口
    参数:clientDeleteOrder              ：商户订单好
        userid                       ：用户id
        ordernumber                订单号
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 删除订单失败 "
    }
    */
    clientDeleteOrder: function(req, res){

        console.log(req.path);
        console.log(req.allParams());
        var retData={'code':200,'codeInfo':'ok'};
        var userid  =req.param('userid');
        var ordernumber  =req.param('ordernumber');
        if(req.param('ordernumber')) {
            console.log(ordernumber);
            var querytext    = 'select id,coupon_id,coupon_number,storeid,tablenameofitem,isdelete,status,is_secKill,isValidly from  ordermain where ordernumber='+ ordernumber+' and isdelete=0 and buyerid='+userid;
            console.log(querytext);
            Ordermain.query(querytext, function(err, results) {
                if(err){
                    retData['code']=4000;
                    retData['data']=err;
                    return res.json(retData);
                }
                //console.log(results);

                if(results.length>=1&&results[0]['status']==0 && results[0]['isValidly']==0 && results[0]['is_secKill']==1){
                    var dateInfo = new Date();
                    var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
                    var sql_orderSche   ='UPDATE orderschedule SET triggertime=\''+timestr+'\' WHERE type=20 and scheduleinfo=\''+ordernumber+'\'';
                    console.log(sql_orderSche);
                    Orderchilditem.query(sql_orderSche, function(err, reslist) {
                        if(err){
                            retdata['code']=4006;
                            retdata['codeInfo']='sql_orderSche_err';
                            retdata['codeInfo2']=err;
                            console.log(retdata);
                        }else{
                            utility2.redisSubPubPCI();
                        }
                    });
                }
                        

                if(results.length>=1&&results[0]['status']!=1&&results[0]['status']!=2){
                    if(results[0].coupon_number>0 ){
                        coupon.getCouponDetail(1,results[0].coupon_id,userid,ordernumber,function(err,couponData){
                            console.log('getCouponOfOrder',couponData);
                            if(!err){
                                for (var i = 0; i < couponData.data.length; i++) {
                                    var myCoupon={};
                                    myCoupon.status=0;
                                    myCoupon.orderid=0;
                                    myCoupon.usedAt=null;
                                    myCoupon.cmoney=couponData.data[i].parvalue;
                                    myCoupon.cname=couponData.data[i].couponname;
                                    myCoupon.type=couponData.data[i].coupontype;
                                    myCoupon.cendtime=couponData.data[i].endtime;
                                    if(couponData.data[i].couponmode==1){
                                        var criteria = {
                                            orderid:ordernumber,
                                            uid:userid,
                                            id:couponData.data[i].aid,
                                            cmode:1
                                        };
                                        UserCoupon.destroy(criteria).exec(function (err) {
                                            if (err) {return;}
                                        });
                                    }else{

                                            console.log('UserCoupon.couponData.aid : ',couponData.data[i].aid);
                                        UserCoupon.update({id:couponData.data[i].aid},myCoupon).exec(function afterwards(err, updated){

                                            console.log('UserCoupon.update : ',updated);
                                            console.log('UserCoupon.update err: ',err);
                                          if (err) {return;}
                                        });
                                    }
                                };

                            }
                        });
                    }


                    var querytext2    = 'update  ordermain set coupon_number=0,isdelete=1  where ordernumber='+ ordernumber+' and isdelete=0 and buyerid='+userid+' and id='+results[0]['id'];
                    console.log(querytext2);
                    Ordermain.query(querytext2, function(err, results) {
                        if(err){
                            retData['code']=4000;
                            retData['data']=err;
                            return res.json(retData);
                        }



                        return res.json(retData);
                    });
                    if(results[0]['coupon_number']>0){

                    }
                }else{
                    retData['code']=4000;
                    return res.json(retData);
                }
            });
        }else{
            retData['code']=4000;
            retData['codeInfo']='need param ordernumber';
            return res.json(retData);
        }

    },


    /*
    客户端修改退货状态接口
    参数:ordernumber              ：商户订单好
         id                       ：子订单详细信息表中的id Orderchilditem表的id
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 退款申请更新写失败 "
    }
    */
    clientSetRefundStatus: function(req, res){

        console.log(req.path);
        console.log(req.allParams());
    },


/*
接口售后详情查询
/order/afterSaleInfo
参数：
ordernumber 订单号
refundrnumber  退单号
tablenameofitem  详情订单表名称
*/
    afterSaleInfo: function (req, res) {
        console.log(req.path);
        var allParams = req.allParams();
        console.log(allParams);

        var sql ='select a.*,b.presale_endtime,b.ordertype,b.expire_refund_item,b.expire_refund_money from '+ allParams.tablenameofitem +' as a , ordermain as b  where  b.ordernumber=\''+allParams.ordernumber+'\'  and a.refundrnumber= \''+ allParams.refundrnumber+'\' limit 1';


        console.log(sql);
        Ordermain.query(sql,function(err,orderlist){
            if(err) return res.negotiate(err);
            if(orderlist&&orderlist.length==1){
                orderlist[0]['tablenameofitem']=allParams.tablenameofitem;
                return res.json({code:200,data:orderlist[0]});
            }else{
                return res.json({code:400,data:"没有数据"});
            }
        });




    },

    /*
    给H5 额外调用的信息存储接口
    order/h5ExtraSave?mId=??&dataInfo=??&tokenId=??&p
    返回值：
    {code:200,data:'ok'}
    */
    h5ExtraSave: function (req, res) {
        console.log(req.path);
        var allParams = req.allParams();
        console.log(allParams);
        var redisKey='h5Extra_'+allParams.mId;
        var myRedis = redis.client({db:5});
        myRedis.set(redisKey,allParams.dataInfo);
        return res.json({code:200,data:'ok'});
    },
    /*
    给H5 额外调用的信息获取接口
    order/h5ExtraGet?mId=??&dataInfo=??&tokenId=??&p
    返回值：
    {code:200,data:value}
    成功获取信息 code=200
    成功获取信息失败 code=400
    */
    h5ExtraGet: function (req, res) {
        console.log(req.path);
        var allParams = req.allParams();
        console.log(allParams);
        var redisKey='h5Extra_'+allParams.mId;
        var myRedis = redis.client({db:5});
        myRedis.get(redisKey, function (err, value) {
            if (!err) {
                console.log(value);
                myRedis.del(redisKey, function (err, reply) {
                    if (err) {
                        console.log("hptest",err);
                        return;
                    };
                    console.log(reply);     // 删除成功，返回1，否则返回0(对于不存在的键进行删除操作，同样返回0)
                });
                if (value) {
                    return res.json({code:200,data:value});
                }else{
                    return res.json({code:400,data:value});
                }
            }else{
                return res.json({code:401,data:value});
            }
        });
    },

    /*
    总后台删除订单接口
    参数:order/merDeleteOrder
        ordernumber                订单号
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 删除订单失败 "
    }
    */
    merDeleteOrder: function(req, res){

        console.log(req.path);
        console.log(req.allParams());
        var retData={'code':200,'codeInfo':'ok'};
        var ordernumber  =req.param('ordernumber');
        if(req.param('ordernumber')) {
            var querytext    = 'select * from  ordermain where ordernumber='+ ordernumber+' and isdelete=0 ';
            console.log(querytext);
            Ordermain.query(querytext, function(err, results) {
                if(err){
                    retData['code']=4000;
                    retData['data']=err;
                    return res.json(retData);
                }
                console.log(results);
                if(results.length>=1&&( results[0]['status']==0 || results[0]['status']==3|| results[0]['status']==4 )){
                    if(results[0].coupon_number>0 ){
                        coupon.getCouponDetail(1,results[0].coupon_id,userid,ordernumber,function(err,couponData){
                            console.log('getCouponOfOrder',couponData);
                            if(!err){
                                for (var i = 0; i < couponData.data.length; i++) {
                                    var myCoupon={};
                                    myCoupon.status=0;
                                    myCoupon.orderid=0;
                                    myCoupon.usedAt=null;
                                    
                                    myCoupon.cmoney=couponData.data[i].parvalue;
                                    myCoupon.cname=couponData.data[i].couponname;
                                    myCoupon.type=couponData.data[i].coupontype;
                                    myCoupon.cendtime=couponData.data[i].endtime;
                                    if(couponData.data[i].couponmode==1){
                                        var criteria = {
                                            orderid:ordernumber,
                                            uid:userid,
                                            id:couponData.data[i].aid,
                                            cmode:1
                                        };
                                        UserCoupon.destroy(criteria).exec(function (err) {
                                            if (err) {return;}
                                        });
                                    }else{

                                            console.log('UserCoupon.couponData.aid : ',couponData.data[i].aid);
                                        UserCoupon.update({id:couponData.data[i].aid},myCoupon).exec(function afterwards(err, updated){

                                            console.log('UserCoupon.update : ',updated);
                                            console.log('UserCoupon.update err: ',err);
                                          if (err) {return;}
                                        });
                                    }
                                };

                            }
                        });
                    }

                    var querytext2    = 'update  ordermain set coupon_number=0,isdelete=1  where ordernumber='+ ordernumber+' and id='+results[0]['id'];
                    console.log(querytext2);
                    Ordermain.query(querytext2, function(err, results) {
                        if(err){
                            retData['code']=4000;
                            retData['data']=err;
                            return res.json(retData);
                        }
                        return res.json(retData);
                    });
                    if(results[0]['coupon_number']>0){

                    }
                }else{
                    retData['code']=4000;
                    return res.json(retData);
                }
            });
        }else{
            retData['code']=4000;
            retData['codeInfo']='need param ordernumber';
            return res.json(retData);
        }
    },


    exportExcel: function (req, res) {

        var allParams = req.allParams();
        orders = allParams.orders;
        //var orders = req.param("orders");
        //orders=JSON.parse(orders);
        //console.log(orders);
        if (!orders || !orders.length) {
            return res.json({
                code: 400,
                msg: '参数不正确'
            });
        }
        var sql="";
        for(var i=0;i<10;i++){

            sql+="select * from ordermain_"+i+" where ordernumber in("+orders+") UNION ";
        }
        var sql=sql.substring(0,sql.length-6);
        console.log(sql);
        Creator.query(sql,function(err,orderlist){
            if(err) return res.negotiate(err);
            if(orderlist&&orderlist.length){
                utility.exportExcelList(req, res, orderlist);
            }else{
                return res.json({code:400,msg:"没有数据"});

            }
        });

    },

};

/*
select count(*),ordernumber from ordermain group by ordernumber having count(*) >1;
1.订单状态的。已完成对应客户端退货款页面状态显示的结束，

待处理=已申请，进行中=进行中（退款：商家已同意，等待平台处理；退货：商家已同意）

2.商家处理结果：显示商家的处理结果，接受or拒绝

3.已完成状态：用户在客户端自行确认完成，默认21天进行中状态，不确认则为完成

4.商户拒绝原因需在商户处理结果为拒绝的情况下，出现。显示商户填写的拒绝原因

5.详情部分，规格多个以,隔开
6.详情的完成时间为该售后流程结束的时间
7.退款订单在进行中状态的详情页中，新增同意按钮。为平台同意退款，点击后执行退款操作



在推送信息中abort的需要人工关注（abort场景：3天查无此单，60天状态无变化）。
3天均查无此单中止（abort）说明：当您提交的快递单号，我们连续跟踪3天均查不到跟踪信息，
我们认为可能是单号对应的包裹还未被快递员送出去、单号过期了或单号是错误的了，

这时会
（1）判断一次贵司提交的快递公司编码是否正确，如果正确，给贵司的回调接口（callbackurl）
返回带有如下字段的信息：autoCheck=0、comOld与comNew都为空；
（2）如果贵司提交的快递公司编码出错，
我们会帮忙用正确的快递公司编码+原来的运单号重新提交订阅并开启监控（后续如果监控到单号有更新就给贵司的回调接口
（callbackurl）推送带有如下字段的信息：autoCheck=1、comOld=原来的公司编码、comNew=新的公司编码）；

并且给贵方的回调接口（callbackurl）推送一条含有如下字段的信息：status=abort、autoCheck=0、
comOld为空、comNew=纠正后的快递公司编码。所以，如果判断到status=abort且comNew为空，

如查判断到status=abort且comNew不为空，
则不需要重新提交订阅，且将贵司原来的快递公司编码改为comNew后的值，

或在贵司数据库中增加一个快递公司编码为comNew+原来单号的运单；如果判断到status=polling且autoCheck=1，

则此单为纠正公司编码后的跟踪信息，应保存

   60天状态无变化中止（abort）说明：对贵司提交订阅的快递单号，
我们收到后会对其进行持续跟踪，如果快递单一开始有跟踪信息，但从某个节点起连续10天状态不发生变化后，
系统自动回调将查询频率为每天一次，直到第60天，这时会给贵方的回调接口发起一次status=abort、
message包含“60天”的推送，告知您这张单异常,在推送发出以后，我们将停止对此单进行跟踪。

如果您觉得我们的判断有误，可在收到status=abort后隔半小时向我方提交订阅此单进行跟踪

   如果贵公司回调时需要其他参数，请在回调接口的地址（callbackurl字段）上自行添加。

   如果贵司在快递单正处于监控过程时（即单号status=polling时）再次提交订阅此快递单号，
    我方会会做排重处理，即报returnCode=501的错。

   对于某次更新推送，如果由于网络问题导致推送失败，我们会每半个小时重新推一次，
尝试推3次，如果3次无法成功会放弃这次更新推送，直至下一次更新推送。

   如果由于重大事故或其它原因导致长时间无法推送，请48小时以内联系我们，我们可以为您重新推送历史数据。
   对于某个单号，当贵方正确提交订阅了后，我们一般会在15分钟左右后进行第一次监控，

如果监控到单号本身有了跟踪信息，即进行第一次推送，否则等待一下次监控。
此后我们一般每4小时进行一次监控，并会根据单号的状态等因素作调整。。

{ no: '12349',
  param: '{"status":"shutdown","billstatus":"check","message":"","autoCheck":"0","comOld":"","comNew":"",
  "lastResult":{"message":"ok","nu":"3910630379405","ischeck":"1","condition":"F00","com":"yunda","status":"200","state":"3",
  "data":[{"time":"2016-09-19 18:07:24","ftime":"2016-09-19 18:07:24","context":"在河南平顶山公司幸福街分部进行签收扫描，快件已被 已签收 签收"},
  {"time":"2016-09-19 13:10:48","ftime":"2016-09-19 13:10:48","context":"在河南平顶山公司幸福街分部进行派件扫描；派送业务员：党国旗；联系电话：13353750531"},
  {"time":"2016-09-19 09:27:34","ftime":"2016-09-19 09:27:34","context":"在河南平顶山公司进行快件扫描，将发往：河南平顶山公司幸福街分部"},
  {"time":"2016-09-18 21:46:39","ftime":"2016-09-18 21:46:39","context":"从漯河分拨中心发出，本次转运目的地：河南平顶山公司"},
  {"time":"2016-09-18 15:05:05","ftime":"2016-09-18 15:05:05","context":"在分拨中心河南郑州分拨中心进行卸车扫描"},
  {"time":"2016-09-17 00:06:41","ftime":"2016-09-17 00:06:41","context":"在广东佛山公司进行发出扫描，将发往：河南郑州分拨中心"},
  {"time":"2016-09-16 23:52:30","ftime":"2016-09-16 23:52:30","context":"在广东佛山公司进行下级地点扫描，将发往：漯河分拨中心"},
  {"time":"2016-09-16 18:53:24","ftime":"2016-09-16 18:53:24","context":"在广东佛山公司进行到件扫描"}]}}' }

  [{"time":"2016-10-28 11:23:17","ftime":"2016-10-28 11:23:17","context":"自提"}]

*/
