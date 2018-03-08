
var orderController = require('../publicController/orderController');

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
    /*
    商户后台管理员同意退款接口
    url:
    order/adminRefund?ordernumber=1000000000002422&orderitemid=44&amount=1&refundreason=noway
    参数:ordernumber              ：商户订单好
         refuse_reason             ：退款理由
         remark                     ：备注
         status                   ：0拒绝退款   1同意退款
         id                       ：子订单详细信息表中的id Orderchilditem表的id
         tablenameofitem
    返回值：
    {
        "code": 200,
        "codeInfo": "code不等于200 表示 退款申请更新写失败 "
    }
    */
    merConfromRefund: function(req, res){
        console.log(req.path);
        console.log(req.allParams());

        var self = this;
        var retdata={'code':200,'codeInfo':'ok'};
        var tablenameofitem  = req.param('tablenameofitem');
        var ordernumber  = req.param('ordernumber');
        var orderitemid  = req.param('id');
        var status       = req.param('status');
        var refundData1=req.allParams();
        refundData1['path']=req.path;
        var refuse_reason = '无';
        if(req.param('refuse_reason')){
            refuse_reason=req.param('refuse_reason');
        }
        var remark = '无';
        if(req.param('remark')){
            remark=req.param('remark');
        }

        remark=remark.replace(/"([^"]*)"/g, "$1");
        remark=remark.replace(/'/g, "");

        refuse_reason=refuse_reason.replace(/"([^"]*)"/g, "$1");
        refuse_reason=refuse_reason.replace(/'/g, "");

        var querytext    = 'SELECT a.chargeid ,a.storeid,a.buyerid  ,a.paymentid ,b.is_refund ,b.refund_type ,b.buy_price,b.refund_amount,b.refundrnumber from ordermain as a , '+
        tablenameofitem +' as b where a.ordernumber=\''+ ordernumber +'\' and b.ordernumber=a.ordernumber and b.is_refund=1 and b.id='+orderitemid+' limit 1';

        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            console.log(results);
            var refundData2=results;
            if(err){
                retdata['code']=4000;
                retdata['codeInfo']='主订单不存在1';
                utility2.adminRefundlog(refundData1,retdata,refundData2);
                return res.json(retdata);
            }
            if(results.length==0){
                retdata['code']=4010;
                retdata['codeInfo']='主订单不存在2';
                utility2.adminRefundlog(refundData1,retdata,refundData2);
                return res.json(retdata);
            }
            console.log('status:',status);
           // console.log(results);
            //发送短信start
            var querytext3='select usermobile from account where id='+results[0]['buyerid'];
            console.log(querytext3);
            Ordermain.query(querytext3, function(err, usermobile) {
                if(err){

                }else{
                    var sql22='select * from   userchattemplate limit 1';
                    Ordermain.query(sql22, function(err, template) {
                        if(err){
                        }else{
                            if(status==0){
                                SmsService.sendSms(function (err,dat) {
                                    if (err) {
                                        console.log("textMsg: check it out: ", err);
                                        return;
                                    }
                                },usermobile[0]['usermobile'],'206696',[]);
                            }else{
                                if(results[0]['refund_type']!=3){
                                    utility2.addScheduleOfTime(results[0]['refundrnumber'],tablenameofitem,6,4,usermobile[0]['usermobile']);
                                }

                                tList = eval('(' + template[0].message + ')');
                                for (var i = 0; i < tList.length; i++) {
                                    if( tList[i]['default']===true ){
                                        var kk=tList[i]['text'].replace(/[\r\n]/g,',');
                                        console.log(kk);
                                        SmsService.sendSms(function (err,dat) {
                                            if (err) {
                                                console.log("textMsg: check it out: ", err);
                                                return;
                                            }
                                        },usermobile[0]['usermobile'],'211801',['7天',kk]);
                                    }else{
                                        var kk=tList[i]['text'].replace(/[\r\n]/g,'===');
                                        console.log(kk);
                                    }
                                };
                            }
                        }
                        
                    });

    
                }
            });
            //发送短信end
            var querytext2='';

            var dateInfo = new Date();
            var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
            if(status==0){
                querytext2='update '+tablenameofitem+' set mer_agree=1,is_refund=6 ,refund_time3= \''+timestr +'\', refund_time2= \''+timestr +'\', refuse_reason=\''+ refuse_reason+'\',remark=\''+remark+'\' where id='+ orderitemid;
            }else{
                querytext2='update '+tablenameofitem+' set mer_agree=2,is_refund=2 ,refund_time2= \''+timestr +'\',refuse_reason=\''+ refuse_reason+'\',remark=\''+remark+'\' where id='+ orderitemid;
                if(results[0]['refund_type']!=3){
                    utility2.addScheduleOfTime(results[0]['refundrnumber'],tablenameofitem,7,1);
                }
            }

            console.log(querytext2);
            Ordermain.query(querytext2, function(err, results) {
                if(err){
                    retdata['code']=401;
                    retdata['data']=err;
                    retdata['codeInfo']='退合約金';
                    return res.json(retdata);
                }else{
                    return res.json(retdata);
                }
            });




        });
    },

    /*
    商户后台发货前调用该接口判断用户是否已经发起售后
    url:
    OrderStore/merJudgeIsRefund?ordernumber=1000000000002422&id=44&tablenameofitem=orderchilditem201701
    参数:ordernumber               ：商户订单号
         tablenameofitem           ：子订单表名
         id                        ：子订单详细信息表中的id Orderchilditem表的id
         
    返回值：
    {
        "code": 200, 
        "codeInfo": "code 等于200 表示 表示该订单没有申请售后 "
    }
    */
    merJudgeIsRefund: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        var retdata={'code':200,'codeInfo':'ok'};
        var ordernumber  = req.param('ordernumber');
        var tablenameofitem  = req.param('tablenameofitem');
        var id  = req.param('id');

        var sql='select * from '+tablenameofitem+' where ordernumber=\''+ ordernumber+'\' and id='+id;               
        Ordermain.query(sql, function(err, orderinfo) {
            if(err){
                retdata['code']=4000;
                retdata['codeInfo']='主订单不存在';
                return res.json(retdata);
            }else{
                if (orderinfo.length>0) {
                    if(orderinfo[0].is_refund==0){
                        return res.json(retdata);
                    }else{
                        retdata['code']=4001;
                        retdata['codeInfo']='订单是售后状态';
                        return res.json(retdata);
                    }
                }else{
                    retdata['code']=4002;
                    retdata['codeInfo']='订单不存在';
                    return res.json(retdata);
                }
            }
        });
    },
    /*
    商户后台帮买家申请延长3天填写售后快递
    url:
    OrderStore/merTimeExpand3Days?ordernumber=1000000000002422&id=44&tablenameofitem=orderchilditem201701
    参数:ordernumber               ：商户订单号
         tablenameofitem           ：子订单表名
         id                        ：子订单详细信息表中的id Orderchilditem表的id
         
    返回值：
    {
        "code": 200, 
        "codeInfo": "code 等于200 表示 延长3天添加售后快递信息成功 "
    }
    */
    merTimeExpand3Days: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        var retdata={'code':200,'codeInfo':'ok'};
        var ordernumber  = req.param('ordernumber');
        var tablenameofitem  = req.param('tablenameofitem');
        var id  = req.param('id');
        var sql='select * from '+tablenameofitem+' where ordernumber='+ ordernumber+' and id='+id;               
        Ordermain.query(sql, function(err, orderinfo) {
            if(err){
                retdata['code']=4000;
                retdata['codeInfo']='主订单不存在';
                return res.json(retdata);
            }else{
                if (orderinfo.length>0) {
                    if(orderinfo[0].maintenance<100){
                        utility2.addSchedule3Day(orderinfo[0].refundrnumber);
                        var dateInfo = new Date(orderinfo[0].expire_delivery_time);
                        dateInfo.setDate(dateInfo.getDate()+3);
                        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
                        orderinfo[0].maintenance+=100;
                        var sql2='UPDATE '+tablenameofitem+' SET expire_delivery_time=\''+timestr+'\',maintenance='+orderinfo[0].maintenance+'    where ordernumber='+ ordernumber+' and id='+id;           
                        
                        Ordermain.query(sql2, function(err, orderinfo) {
                            if(err){
                                retdata['code']=4003;
                                retdata['codeInfo']='延长3天填写售后快递失败';
                                return res.json(retdata);
                            }
                        });
                        return res.json(retdata);
                    }else{
                        retdata['code']=4001;
                        retdata['codeInfo']='订单已经延长3天填写售后快递过了';
                        return res.json(retdata);
                    }
                }else{
                    retdata['code']=4002;
                    retdata['codeInfo']='订单不存在';
                    return res.json(retdata);
                }
            }
        });
    },
};