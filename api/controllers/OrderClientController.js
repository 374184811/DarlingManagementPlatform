
var orderController = require('../publicController/orderController');
var schedule = require("node-schedule");
module.exports = {

    serviceSign: function(req, res){
        return orderController.serviceSign(req, res)
    },

    authorizationWeixin: function(req, res){
        return orderController.authorizationWeixin(req, res)
    },
   
    deleteAuthorizationWeixin: function(req, res){
        return orderController.deleteAuthorizationWeixin(req, res)
    },

    sqlDeleteBugTest: function(req, res){
        return orderController.sqlDeleteBugTest(req, res)
    },
   
    wxAuthForCoupon: function(req, res){
        return orderController.wxAuthForCoupon(req, res)
    },

    wxAuthForCouponInfo: function(req, res){
        return orderController.wxAuthForCouponInfo(req, res)
    },
   
    getWeichatInfo3: function(req, res){
        return orderController.getWeichatInfo3(req, res)
    },
    getWeichatOpenid3: function(req, res){
        return orderController.getWeichatOpenid3(req, res)
    },
    getWeichatOpenid4: function(req, res){
        return orderController.getWeichatOpenid4(req, res)
    },
    getWeichatOpenid5: function(req, res){
        return orderController.getWeichatOpenid5(req, res)
    },
    getWeichatOpenid6: function(req, res){
        return orderController.getWeichatOpenid6(req, res)
    },
    getWeichatOpenid8: function(req, res){
        return orderController.getWeichatOpenid8(req, res)
    },
    getWeichatOpenid7: function(req, res){
        return orderController.getWeichatOpenid7(req, res)
    },
    
    qrPolling: function(req, res){
        return orderController.qrPolling(req, res)
    },

    pingPayNotice: function(req, res){
        return orderController.pingPayNotice(req, res)
    },

    createOrder: function (req, res) {
       return orderController.createOrder(req, res)
    },

    createOrderWithSecond: function(req, res){
        return orderController.createOrderWithSecond(req, res)
    },
    paylimittest: function(req, res){
       return orderController.paylimittest(req, res)
    },
    
    getMerRefundOrderList: function(req, res){
        return orderController.getMerRefundOrderList(req, res)
    },

    exportMerRefundOrderList: function(req, res){
       return orderController.exportMerRefundOrderList(req, res)
    },

    updateLogisticsInfo: function(req, res) {
        return orderController.updateLogisticsInfo(req, res)
    },
    userShowList: function(req, res) {
        return orderController.userShowList(req, res)
    },
    getOrderDetail: function(req, res) {
        return orderController.getOrderDetail(req, res)
    },

    getMerOrderList: function(req, res) {
        return orderController.getMerOrderList(req, res)
    },
  
    updateOrderStatus: function(req, res){
        return orderController.updateOrderStatus(req, res)
    },

    adminRefundPre: function(req, res){
        return orderController.adminRefundPre(req, res)
    },
    
    merConfromRefund: function(req, res){
        return orderController.merConfromRefund(req, res)
       
    },

    findChargeid: function(req, res){
        return orderController.findChargeid(req, res)
    },
   
    adminRefund: function(req, res){
        return orderController.adminRefund(req, res)
    },

    merGetRefundOrder: function(req, res){
        return orderController.merGetRefundOrder(req, res)
    },

    clientDeleteOrder: function(req, res){
        return orderController.clientDeleteOrder(req, res)
    },

    afterSaleInfo: function (req, res) {
        return orderController.afterSaleInfo(req, res)
    },

    h5ExtraSave: function (req, res) {
        return orderController.h5ExtraSave(req, res)
    },
   
    h5ExtraGet: function (req, res) {
        return orderController.h5ExtraGet(req, res)
    },

    merDeleteOrder: function(req, res){
        return orderController.merDeleteOrder(req, res)
    },

    exportExcel: function (req, res) {
        return orderController.exportExcel(req, res);
    },
    mytemptest: function (req, res) {
        utility2.redisSubPubPCI();
        console.log(req.path);
        console.log(req.allParams());
        return res.json('totalResults');
    },
    mytemptest22: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        var retdata={'code':200,'codeInfo':'ok','data':[]};
        var storeid  =req.param('storeid') ;

        var showred  =req.param('showred',-1) ;// -1 all  0 read  1 Non-read 

        var merNameList=seller.getStoreArray();
        var mine = req.session.mine;
        //console.log(mine);

        var whereinfo = ' and c.is_refund>0 ';

        // if(mine.storeid==0){
        //     if (storeid!=-1) {
        //         whereinfo += ' and  a.storeid=' + storeid;
        //     }
        // }
        // else{
        //     whereinfo += ' and  a.storeid=' + mine.storeid;
        // }
        whereinfo += ' and  a.storeid=' +storeid;
        if( req.param('mobile') ){
            whereinfo+=' and  b.usermobile  like   \'%'+req.param('mobile')+'%\'';
        }

        if ( req.param('createtime1') && req.param('createtime2') ) {
            whereinfo+=' and a.createdAt>=\''+req.param('createtime1')+'\' and  a.createdAt<=\''+req.param('createtime2')+'\' ';
        };



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


        var dateInfo = new Date();
        var nowYear = parseInt(dateInfo.getFullYear()) ;
        var viewName1='view_orderchilditem'+nowYear;
        var viewName2='view_orderchilditem'+(nowYear-1);
        //whereinfo = whereinfo.slice(0,whereinfo.length-3);
        var querytext   = 'select a.* ,c.* ,b.usermobile from  ordermain as a , account as b , '+ viewName1 +' as c where   a.ordernumber=c.ordernumber  and  a.buyerid=b.id  and  a.is_refund>0 '+ whereinfo+'  order by a.createdAt desc';
        var querytext2   = 'select a.* ,c.* ,b.usermobile from  ordermain as a , account as b , '+ viewName2 +' as c where   a.ordernumber=c.ordernumber  and  a.buyerid=b.id  and  a.is_refund>0 '+ whereinfo+'  order by a.createdAt desc';
        var counter=0;
        console.log(querytext);
        var counter=0;
        var results=null;
        Ordermain.query(querytext, function(err, resultsN) {
                console.log(querytext2);
                Ordermain.query(querytext2, function(err, resultsN2) {
                    if (!err) {
                        console.log('mytemptest');
                        if(resultsN.length>0){
                            if (resultsN2.length>0) {
                                results=resultsN.concat(resultsN2);
                            }else{
                                results=resultsN;
                            }
                        }else{
                            if (resultsN2.length>0) {
                                results=resultsN2;
                            }
                        }


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
                                            if (result.length==1) {
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
                                        //console.log("retdata['data']:"+retdata['data'].length);
                                        return res.json(retdata);
                                    }
                                });
                                // if(counter==results.length){
                                //     retdata['data']=results;
                                //     return res.json(retdata);
                                //}
                            });
                        }
                        else{
                            return res.json(retdata);
                        }
                    };
                });
        });

    },
        /*
    客户端申请退货接口
    参数:ordernumber              ：商户订单好
         id                       ：子订单详细信息表中的id Orderchilditem表的id
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 退款申请更新写失败 "
    }
    */
    clientApplyRefund: function(req, res){

        console.log(req.path);
        console.log(req.allParams());

        var retdata={'code':200,'codeInfo':'ok','refundrnumber':' ','tablenameofitem':' '};
        var ordernumber  = req.param('ordernumber');
        var orderitemid  = req.param('id');

        var refund_num  = 0;
        if ( req.param('refund_num') ) {
            refund_num = parseInt( req.param('refund_num') );
        }//buy_num
        var refund_reason='';
        if (req.param('refund_reason')) {
            refund_reason= req.param('refund_reason');
            refund_reason=refund_reason.replace(/"([^"]*)"/g, "$1");
            refund_reason=refund_reason.replace(/'/g, "");
        };
        //if(refund_reason==undefined){refund_reason=" no reason";}
        var  picArr = eval(req.param('refund_pic'));
        var refund_pic  = picArr.join(',');
        var merNameList=seller.getStoreArray();
        var allParams = req.allParams();
        var client = redis.client({db: 2});
        var mId = allParams.mId;
        var tokenId = allParams.tokenId;
        var hashIdentity = mId + ":" + tokenId;
        var userData=null;
        client.get(hashIdentity, function (err, value) {
            if (err) { res.serverError(err); }
            userData = utility.decodeToken(value);//userData.userMobile
            
            console.log('clientApplyRefund_test',userData);
            //0:正常 1:换货 2:退款退货   3退款不退货
            var refund_type  = req.param('refund_type');
            var querytext = 'select * from ordermain where (status>=1 or ordertype=11 or ordertype=12)  and ordernumber=\''+ ordernumber+'\'';

            console.log(querytext);
            Ordermain.query(querytext, function(err, results2) {
                if(err){
                    retdata['code']=4000;
                    retdata['codeInfo']='主订单不存在';
                    console.log(retdata);
                    return res.json(retdata);
                }
                if(results2.length==1){ 
                    retdata.tablenameofitem=results2[0]['tablenameofitem'];
                    if (results2[0].is_delivery==0) {
                        if (refund_type!=3) {
                            retdata['code']=4001;
                            retdata['codeInfo']='未发货只能发起退款不退货申请';
                            console.log(retdata);
                            return res.json(retdata);
                        }
                    }else if (results2[0].is_delivery==1){
                        //if (refund_type==3) {
                            retdata['code']=4002;
                            retdata['codeInfo']='用户未收到货不能发起售后申请';
                            console.log(retdata);
                            return res.json(retdata);
                        //}
                    }else{
                        if (refund_type==3) {
                            retdata['code']=4003;
                            retdata['codeInfo']='不能发起退款不退货申请';
                            console.log(retdata);
                            return res.json(retdata);
                        }
                    }

                    //var querytext2   = 'select * from '+results2[0]['tablenameofitem']+' where id='+orderitemid;
                    var querytext2   = 'select * from '+results2[0]['tablenameofitem']+' where ordernumber=\''+ ordernumber+'\'';
                    console.log(querytext2);
                    Orderchilditem.query(querytext2, function(err, resultsT) {
                        var results= new Array(),itemTotalNum=0,refund_freight_str='';
                        if(err){
                            retdata['code']=4004;
                            retdata['codeInfo']='子订单不存在';
                            console.log(retdata);
                            return res.json(retdata);
                        }
                            for (var i = 0; i < resultsT.length; i++) {
                                itemTotalNum+= parseInt(resultsT[i].buy_num);
                                if (resultsT[i]['is_refund']>0) {
                                    itemTotalNum-=parseInt(resultsT[i].refund_num);
                                };
                                if(resultsT[i].id==orderitemid){
                                    results.push(resultsT[i]);
                                }
                            };
                            if (refund_num==0) {
                                itemTotalNum-=parseInt(results[0].buy_num);
                            }else{
                                itemTotalNum-=parseInt(refund_num);
                            }
                            if (itemTotalNum<=0) {
                                
                                if (results2[0]['is_delivery']==0) {
                                        refund_freight_str='+'+results2[0]['freight']*1;
                                };
                            };
                        

                        console.log('is_need_re_freight:',refund_freight_str);
                        retdata.refundrnumber   =results[0]['refundrnumber'];
                         console.log('is_need_re_freight',retdata);
                        if( (results.length==1 &&  results[0]['is_refund']==0 )  || ( results[0]['mer_agree']==1 &&  results[0]['is_refund']>0)  ){
                            var querytext3   = '';
                            var dateInfo = new Date();
                            var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
                            var timestr2 = (new Date(results2[0].expire_refund_money)).Format("yyyy-MM-dd hh:mm:ss");
                            var timestr3 = (new Date(results2[0].expire_refund_item)).Format("yyyy-MM-dd hh:mm:ss");
                            var presaleEndtime = (new Date(results2[0].presale_endtime)).Format("yyyy-MM-dd hh:mm:ss");
                            var finalEndtime = (new Date(results2[0].final_endtime)).Format("yyyy-MM-dd hh:mm:ss");

                            console.log("timestr:",timestr);
                            console.log("timestr2:",timestr2);
                            console.log("timestr3:",timestr3);
                            if (results2[0].ordertype==12 || results2[0].ordertype==11) {
                                var dateInfo = new Date(results2[0].presale_endtime);
                                dateInfo.setDate(dateInfo.getDate()+15);
                                var timestr15 = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
                                if (refund_type==3) {
                                    if(timestr>timestr15){
                                        retdata['code']=4005;
                                        retdata['codeInfo']='预售结束15天后不可以申请退定金';
                                        console.log(retdata);
                                        return res.json(retdata);
                                    }
                                }else{
                                    retdata['code']=4005;
                                    retdata['codeInfo']='预售定金只能申请退款不退货';
                                    console.log(retdata);
                                    return res.json(retdata);
                                }
                            }
                            if (timestr>timestr2) {
                                if (refund_type==2) {
                                    retdata['code']=4005;
                                    retdata['codeInfo']='确认收货7天后不可以申请退款';
                                    console.log(retdata);
                                    return res.json(retdata);
                                };
                            }
                            if (timestr>timestr3) {
                                if (refund_type==1) {
                                    retdata['code']=4006;
                                    retdata['codeInfo']='确认收货15天后不可申请换货时间';
                                    console.log(retdata);
                                    return res.json(retdata);
                                };
                            };
                            
                            if (results[0]['maintenance']==0) {
                                utility.getOrderMainTableId( function (err, decode) {
                                    if(err){
                                        retdata['code']=4007;
                                        retdata['codeInfo']='生成退单编号失败';
                                        console.log(retdata);
                                        return res.json(retdata);
                                    }else{
                                        var refundrnumber=sails.config.connections.ordernumberbase+decode;
                                        retdata.refundrnumber   =refundrnumber;
                                        var dateInfo = new Date();
                                        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
                                        //orderData['updatedAt'] = timestr;
                                        if (results2[0].ordertype==0) {
                                            var moenywithoutfreight=results2[0]['count']-results2[0]['freight']*1;
                                            if(refund_num==0){
                                                querytext3   = 'update  '+results2[0]['tablenameofitem']+' set maintenance=maintenance+1,mer_agree=0,mer_agree2=0, refund_time1=\''+timestr +'\' ,refundrnumber=\''+refundrnumber +'\',is_refund=1,refund_amount=(buy_price*buy_num-buy_price*buy_num/'+moenywithoutfreight*results2[0]['coupon_amount']+refund_freight_str+'),refund_type='+
                                                refund_type+' , createdAt=\''+timestr+'\'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num=buy_num, refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                            }else{
                                                querytext3   = 'update  '+results2[0]['tablenameofitem']+' set  maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+ timestr+'\' , refundrnumber=\''+refundrnumber +'\',is_refund=1,refund_amount=(buy_price*'+refund_num+'-buy_price*'+refund_num+'/'+moenywithoutfreight+'*'+results2[0]['coupon_amount']+refund_freight_str+'),refund_type='+
                                                refund_type+'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num='+refund_num+' , createdAt=\''+timestr+'\', refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                            }
                                        }else if (results2[0].ordertype==11) {
                                            if(refund_num==0){
                                                querytext3   = 'update  '+results2[0]['tablenameofitem']+' set maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+timestr +'\' ,refundrnumber=\''+refundrnumber +'\',is_refund=1,refund_amount=pre_price*buy_num'+refund_freight_str+',refund_type='+
                                                refund_type+' , createdAt=\''+timestr+'\'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num=buy_num, refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                            }else{
                                                querytext3   = 'update  '+results2[0]['tablenameofitem']+' set  maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+ timestr+'\' , refundrnumber=\''+refundrnumber +'\',is_refund=1,refund_amount=pre_price*'+refund_num+refund_freight_str+',refund_type='+
                                                refund_type+'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num='+refund_num+' , createdAt=\''+timestr+'\', refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                            }
                                        }else if (results2[0].ordertype==12) {
                                            if(refund_num==0){
                                                querytext3   = 'update  '+results2[0]['tablenameofitem']+' set maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+timestr +'\' ,refundrnumber=\''+refundrnumber +'\',is_refund=1,refund_amount=pre_price*buy_num'+refund_freight_str+',refund_type='+
                                                refund_type+' , createdAt=\''+timestr+'\'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num=buy_num, refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                            }else{
                                                querytext3   = 'update  '+results2[0]['tablenameofitem']+' set  maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+ timestr+'\' , refundrnumber=\''+refundrnumber +'\',is_refund=1,refund_amount=pre_price*'+refund_num+refund_freight_str+',refund_type='+
                                                refund_type+'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num='+refund_num+' , createdAt=\''+timestr+'\', refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                            }

                                        }else if (results2[0].ordertype==13) {
                                            if(refund_num==0){
                                                querytext3   = 'update  '+results2[0]['tablenameofitem']+' set maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+timestr +'\' ,refundrnumber=\''+refundrnumber +'\',is_refund=1,refund_amount=buy_price*buy_num'+refund_freight_str+',refund_type='+
                                                refund_type+' , createdAt=\''+timestr+'\'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num=buy_num, refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                            }else{
                                                querytext3   = 'update  '+results2[0]['tablenameofitem']+' set  maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+ timestr+'\' , refundrnumber=\''+refundrnumber +'\',is_refund=1,refund_amount=buy_price*'+refund_num+refund_freight_str+',refund_type='+
                                                refund_type+'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num='+refund_num+' , createdAt=\''+timestr+'\', refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                            }
                                        }


                                        console.log('update  :::::::::::::::',querytext3);
                                        Orderchilditem.query(querytext3, function(err, results) {
                                            if(err){
                                                retdata['code']=4008;
                                                retdata['codeInfo']='退款更新写失败'+querytext3;
                                                console.log(retdata);
                                                return res.json(retdata);
                                            }
                                            var querytext4 = ' update  ordermain set is_refund=1  where ordernumber=\''+ordernumber+'\'';
                                            console.log(querytext4);
                                            Orderchilditem.query(querytext4, function(err, results) {
                                                if(err){
                                                    retdata['code']=4009;
                                                    retdata['codeInfo']='退款更新写失败'+querytext4;
                                                    console.log(retdata);
                                                    return res.json(retdata);
                                                }

                                                // 开始售后自动确认功能
                                                // utils2.autoAfterMarket({
                                                //     ordernumber: refundrnumber,
                                                //     tablenameofitem:results2[0]['tablenameofitem'],
                                                //     orderdetailid: orderitemid
                                                // });
                                                console.log(retdata);
                                                return res.json(retdata);
                                            });
                                        });
                                        var scheduleinfo3 = merNameList[results2[0]['storeid']]+','+userData.usermobile+','+results2[0]['buyername']+','+refund_type;

                                        console.log('clientApplyRefund_test_1',scheduleinfo3);
                                        utility2.addScheduleOfTime(refundrnumber,results2[0]['tablenameofitem'],3,0,scheduleinfo3);
                                    }
                                });
                            }else{
                                var dateInfo = new Date();
                                var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
                                //orderData['updatedAt'] = timestr;
                                if (results2[0].ordertype==0) {
                                    var moenywithoutfreight=results2[0]['count']-results2[0]['freight']*1;
                                    if(refund_num==0){
                                        querytext3   = 'update  '+results2[0]['tablenameofitem']+' set maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+timestr +'\' ,is_refund=1,refund_amount=(buy_price*buy_num-buy_price*buy_num/'+moenywithoutfreight*results2[0]['coupon_amount']+refund_freight_str+'),refund_type='+
                                        refund_type+' , createdAt=\''+timestr+'\'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num=buy_num, refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                    }else{
                                        querytext3   = 'update  '+results2[0]['tablenameofitem']+' set  maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+ timestr+'\',is_refund=1,refund_amount=(buy_price*'+refund_num+'-buy_price*'+refund_num+'/'+moenywithoutfreight+'*'+results2[0]['coupon_amount']+refund_freight_str+'),refund_type='+
                                        refund_type+'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num='+refund_num+' , createdAt=\''+timestr+'\', refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                    }
                                }else if (results2[0].ordertype==11) {
                                    if(refund_num==0){
                                        querytext3   = 'update  '+results2[0]['tablenameofitem']+' set maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+timestr +'\' ,is_refund=1,refund_amount=pre_price*buy_num'+refund_freight_str+',refund_type='+
                                        refund_type+' , createdAt=\''+timestr+'\'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num=buy_num, refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                    }else{
                                        querytext3   = 'update  '+results2[0]['tablenameofitem']+' set  maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+ timestr+'\',is_refund=1,refund_amount=pre_price*'+refund_num+refund_freight_str+',refund_type='+
                                        refund_type+'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num='+refund_num+' , createdAt=\''+timestr+'\', refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                    }
                                }else if (results2[0].ordertype==12) {
                                    if(refund_num==0){
                                        querytext3   = 'update  '+results2[0]['tablenameofitem']+' set maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+timestr +'\' ,is_refund=1,refund_amount=pre_price*buy_num'+refund_freight_str+',refund_type='+
                                        refund_type+' , createdAt=\''+timestr+'\'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num=buy_num, refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                    }else{
                                        querytext3   = 'update  '+results2[0]['tablenameofitem']+' set  maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+ timestr+'\',is_refund=1,refund_amount=pre_price*'+refund_num+refund_freight_str+',refund_type='+
                                        refund_type+'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num='+refund_num+' , createdAt=\''+timestr+'\', refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                    }

                                }else if (results2[0].ordertype==13) {
                                    if(refund_num==0){
                                        querytext3   = 'update  '+results2[0]['tablenameofitem']+' set maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+timestr +'\' ,is_refund=1,refund_amount=buy_price*buy_num'+refund_freight_str+',refund_type='+
                                        refund_type+' , createdAt=\''+timestr+'\'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num=buy_num, refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                    }else{
                                        querytext3   = 'update  '+results2[0]['tablenameofitem']+' set  maintenance=maintenance+1,mer_agree=0,mer_agree2=0,refund_time1=\''+ timestr+'\',is_refund=1,refund_amount=buy_price*'+refund_num+refund_freight_str+',refund_type='+
                                        refund_type+'  ,refuse_reason="",refund_reason=\''+refund_reason+'\',refund_num='+refund_num+' , createdAt=\''+timestr+'\', refund_pic=\''+ refund_pic +'\' where id='+orderitemid;
                                    }
                                }


                                console.log('update  :::::::::::::::',querytext3);
                                Orderchilditem.query(querytext3, function(err, results) {
                                    if(err){
                                        retdata['code']=4011;
                                        retdata['codeInfo']='退款更新写失败'+querytext3;
                                        console.log(retdata);
                                        return res.json(retdata);
                                    }
                                    var querytext4 = ' update  ordermain set is_refund=1  where ordernumber=\''+ordernumber+'\'';
                                    console.log(querytext4);
                                    Orderchilditem.query(querytext4, function(err, results) {
                                        if(err){
                                            retdata['code']=4012;
                                            retdata['codeInfo']='退款更新写失败'+querytext4;
                                            console.log(retdata);
                                            return res.json(retdata);
                                        }

                                        // 开始售后自动确认功能
                                        // utils2.autoAfterMarket({
                                        //     ordernumber: refundrnumber,
                                        //     tablenameofitem:results2[0]['tablenameofitem'],
                                        //     orderdetailid: orderitemid
                                        // });
                                        console.log(retdata);
                                        return res.json(retdata);
                                    });
                                });
                                var scheduleinfo3 = merNameList[results2[0]['storeid']]+','+userData.usermobile+','+results2[0]['buyername']+','+refund_type;;

                                        console.log('clientApplyRefund_test_2',scheduleinfo3);
                                utility2.addScheduleOfTime(results[0]['refundrnumber'],results2[0]['tablenameofitem'],3,0,scheduleinfo3);
                            }

                            
                        }else{
                            retdata['code']=4005;
                            retdata['codeInfo']='子订单不存在 或者 is_refund:'+results[0]['is_refund'];
                            if(results.length==1 ){
                                if( results[0]['is_refund']!=0 ){
                                    retdata['code']=4007;
                                    retdata['codeInfo']='请等待商户后台同意，当前状态不能申请售后:is_refund'+results[0]['is_refund'];
                                }
                            }
                            console.log(retdata);
                            return res.json(retdata);
                        }
                    });
                }else{
                    retdata['code']=4008;
                    retdata['codeInfo']='主订单不存在 length:'+results2.length;
                    console.log(retdata);
                    return res.json(retdata);
                }
            });
        });



    },

    /*
    客户端将订单变成完成状态接口   /order/clientFinishOrder
    参数:ordernumber              ：商户订单号
        tablenameofitem             详情订单表名
         id                       ：子订单详细信息表中的id Orderchilditem表的id
         userid                       ：用户id
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 退款申请更新写失败 "
    }
    */
    clientFinishOrder: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        var retdata={'code':200,'codeInfo':'ok','refundrnumber':' '};
        var ordernumber  = req.param('ordernumber');
        var tablenameofitem  = req.param('tablenameofitem');
        var id  = req.param('id');

        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        var querytext    = 'update '+ tablenameofitem +'  set refund_time3=\''+timestr+'\', updatedAt=\''+timestr+'\',is_finished =1, is_refund =7 where ordernumber='+ ordernumber+' and id='+id;
        console.log(querytext);
        Ordermain.query(querytext, function(err, results2) {
            
            //console.log(results2);
            if(err){
                retdata['code']=4000;
                retdata['codeInfo']='主订单不存在';
                return res.json(retdata);
            }
            //retdata.refundrnumber=
            if(results2['affectedRows']==1){
                return res.json(retdata);
            }else if(results2['affectedRows']==0){
                retdata['code']=4001;
                retdata['codeInfo']='主订单不能被完成:'+results2.length;
                return res.json(retdata);
            }
        });
    },
    /*
    客户端撤消退货   /ClientOrder/clientCancelRefund
    参数:refundrnumber              ：售后退单号
        tablenameofitem             详情订单表名
         id                       ：子订单详细信息表中的id Orderchilditem表的id
         userid                       ：用户id
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 撤消退货失败 "
    }
    */
    clientCancelRefund: function(req, res){

        console.log(req.path);
        console.log(req.allParams());
        var retdata={'code':200,'codeInfo':'ok'};
        var refundrnumber  = req.param('refundrnumber');
        var tablenameofitem  = req.param('tablenameofitem');
        var id  = req.param('id');

        var sql='select * from '+tablenameofitem+' where refundrnumber=\''+ refundrnumber+'\' and id='+id;        
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
        console.log(sql);           
        Ordermain.query(sql, function(err, orderinfo) {
            if(err){
                retdata['code']=4000;
                retdata['codeInfo']='主订单不存在';
                return res.json(retdata);
            }else{
                if (orderinfo.length>0) {
                    if(orderinfo[0].mer_agree!=2){
                        var querytext    = 'update '+ tablenameofitem +
                        '  set is_refund =0,mer_agree=0,mer_agree2=0,maintenance=maintenance+1,'+
                        ' refund_time4=\''+timestr+'\' where refundrnumber=\''+ 
                        refundrnumber+'\' and id='+id;
                        console.log(querytext);
                        Ordermain.query(querytext, function(err, results) {
                            if(err){
                                retdata['code']=4001;
                                retdata['codeInfo']='主订单不存在';
                                return res.json(retdata);
                            }
                            if(results['affectedRows']==1){
                                return res.json(retdata);
                            }else if(results['affectedRows']==0){
                                retdata['code']=4002;
                                retdata['codeInfo']='主订单不能被完成:'+results.length;
                                return res.json(retdata);
                            }
                        });

                        var sql_orderSche = 'DELETE FROM orderschedule WHERE scheduleinfo=\''+refundrnumber+'\'';
                        console.log(sql_orderSche);
                        Orderchilditem.query(sql_orderSche, function(err, reslist) {
                            if(err){
                                retdata['code']=4006;
                                retdata['codeInfo']='sql_orderSche_err';
                                retdata['codeInfo2']=err;
                                console.log(retdata);
                                return res.json(retdata);
                            }else{
                                utility2.redisSubPubPCI();
                            }
                        });

                    }else{
                        retdata['code']=4003;
                        retdata['codeInfo']='主订单不能被完成:'+orderinfo.length;
                        return res.json(retdata);
                    }
                }
            }
        });

    },

    abPressure5Test5: function(req, res){
        utility2.killList=[];
        return res.json(5);
    },
    abPressure4Test4: function(req, res){
        console.log(utility2.killList.length);
        return res.json(4);
        
    },
    abPressure3Test3: function(req, res){
        var myRedis = redis.client({db:5});
        var redisKeyStr='abPressureTest5';
        myRedis.set(redisKeyStr,-1);
        return res.json(3);
        
    },
    abPressure2Test2: function(req, res){
        
        
        

    },
    abPressureTest2: function(req, res){
 const log4js = require('log4js');
        log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});

const logger = log4js.getLogger('cheese');
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');
        res.json("3log4js");
    },

    abPressureTest: function(req, res){

        var retData={ 'code':200,'data':[]};
        console.log(req.path);
        console.log(req.allParams());
       
        var serchArray = [];
        var serchStr='';
        serchArray.push(' where ');
        serchArray.push('storeid = 4 and a.buyerid=52');
        serchArray.push(' and ');

        if(req.param('ordertype') != undefined){
            if( req.param('ordertype')==1 ){
                serchStr = ' ordertype = 0';
                serchArray.push(serchStr);
                serchArray.push(' and ');
            }

            if( req.param('ordertype')==2 ){
                serchStr = ' ordertype >= 10';
                serchArray.push(serchStr);
                serchArray.push(' and ');
            }

            if( req.param('ordertype')==3 ){
                serchStr = ' is_secKill = 1 ';
                serchArray.push(serchStr);
                serchArray.push(' and ');
            }
        }
        if(req.param('mobile') != undefined){
            if( req.param('mobile').length<11 ){
                serchStr = ' b.usermobile  like  \'%' + req.param('mobile') +'%\'';
            }else{
                serchStr = ' b.usermobile = \''+req.param('mobile')+'\'';
            }
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }


        if(req.param('paymentid') != undefined && req.param('paymentid') != -1){
            if(req.param('paymentid')=='1'){
                serchStr = ' paymentid=1';
            }else if(req.param('paymentid')=='2'){
                serchStr = ' paymentid in (2,3,4)';
            }else if(req.param('paymentid')=='3'){
                serchStr = ' paymentid in (5,6,7)';
            }else{
                serchStr = ' paymentid =\''+req.param('paymentid') +'\'';
            }
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }

        // 创建时间~
        if( typeof req.param('createdAt1') == 'date')
        {
          console.log('createdAt1 is date');
        }else{
          console.log('createdAt1 is not date');
        }

        if( typeof  parseInt(req.param('payamount1'))=='number')
        {
          console.log('payamount1 is number');
        }else{
          console.log('payamount1 is not number');
        }
        if(req.param('createdAt1') != undefined   && req.param('createdAt1') != null   && req.param('createdAt1') != ''
          &&  req.param('createdAt2') != undefined   && req.param('createdAt2') != null   && req.param('createdAt2') != ''  ){
            console.log('req.paramlength=',req.param('createdAt1').length );
            serchStr = ' a.createdAt > \''+req.param('createdAt1')+'\' and a.createdAt < \''+req.param('createdAt2')+'\'';
            serchArray.push(serchStr);
            serchArray.push(' and ');
          
        }
        // 订单状态
        if(req.param('status') != undefined  && req.param('status') != -1){
            if( req.param('status') == 4){
                serchStr = 'status >=4';
            }
            else if(req.param('status') == 5){
                serchStr = 'ordertype = 11 ';
            }
            else if(req.param('status') == 6){
                serchStr = 'ordertype = 12 ';
            }
            else if(req.param('status') == 0){
                serchStr = 'status=0 and ordertype<11';
            }
            else if(req.param('status') == 1){
                serchStr = ' status>=1  and status<3';
            }
            else{
                serchStr = ' status = '+req.param('status') ;
            }
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }
        // 发货状态
        if(req.param('deliverstatus') != undefined  && req.param('deliverstatus') != -1){
            if( req.param('deliverstatus') == 1){
                serchStr = ' is_delivery = 1';
            }
            else{
                serchStr = ' is_delivery = 0';
            }
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }

        // 交易金额~

        if(req.param('payamount1') != undefined && req.param('payamount2') != undefined ){
            serchStr = ' count > '+req.param('payamount1')+' and count < '+req.param('payamount2');
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }
        //console.log(serchArray);
        console.log(serchArray.length);
        serchArray.pop();
        //console.log(serchArray.length);
        if(serchArray.length<=1){
            serchStr = '';
            //console.log('hehe 总后台1');
        }else{
            serchStr = serchArray.join(' ');
            //console.log('hehe 总后台2');
        }
       
        if(retData['code'] != 200 ){
            return res.json(retData);
        }
        var querytext   = 'select a.*,b.usermobile from ordermain as a, account as b '+ serchStr+' and a.buyerid=b.id  order by a.createdAt desc';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if (err) {
                retData['code']=4000;
                return res.serverError(err);
            }
            retData['data']=results;
            return res.json(retData);
        });
    },

};