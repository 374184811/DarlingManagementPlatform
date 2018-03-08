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
    serviceGetDeliverInfo: function(req, res){

        var reqData = req.allParams();
        console.log(reqData);
        var retData = {'code':4000,'codeInfo':'','data':null,'type':0};
        var ordernumber = reqData['ordernumber'];
        var querytext = 'select logisticsid,logisticsnumber from  ordermain where ordernumber='+ ordernumber+' limit 1';
        console.log(querytext);
        Ordermain.query(querytext, function(err, orderInfo) {
            if (err){
                return res.negotiate(err);
            }
            //console.log(orderInfo);
            var sqlStr1 = 'SELECT a.* FROM kuaidilog AS a WHERE a.deliverorder=\''+ orderInfo[0]['logisticsnumber'] +'\'';
            sqlStr1 += ' AND payorder=\''+ ordernumber +'\'';
            console.log(sqlStr1);
            Kuaidilog.query(sqlStr1, function(err, results1) {
                if (err){
                    return res.negotiate(err);
                }
                console.log("serviceGetDeliverInfo results1 ==> " + results1.length);
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
                    var sqlStr2 = "select b.name from kuaidicom as b where b.ename like '%" + results1[0]['company'] +"%'";
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
        });

    },
    /**
     * 物流单号检测接口
     * deliver/checkDeliverNum
     * @param req
     * @param res
     * @param  type 物流所属类别
     * @param  logisticsnumber 物流单号
     */
    checkDeliverNum:function(req,res){
        console.log(req.ip,req.path,req.allParams());
  
        var retData = {};
        var allParams = req.allParams();
        
        if(allParams['type'] == 3 || allParams['type'] == 2){
            retData.code = 400;
            retData.msg = '该单号未使用';
            return res.json(retData);
        }else{
            Kuaidilog.find({status:{'!':[7,6]},deliverorder:allParams['logisticsnumber']}).exec(function(err,list){
                if (err){
                    console.log(err);
                    return;
                }
                if (list.length){
                    retData.code = 200;
                    retData.msg = '该单号已被使用，若还需使用，选择自定义添加';
                }else {
                    retData.code = 100;
                    retData.msg = '该单号未使用';
                }
                return res.json(retData);
            });
        }
    },
    /**
     * 物流跟踪信息
     * @param req
     * @param res
     */
     //物流跟踪
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
            Kuaidilog.query(newsql, function(err, results) {
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
    *物流账单信息
    *@param time  如; 年-'2016', 月-'2016-10', 日-'2016-10-12'
    *@param unitprice  单价
    */
    logisticsBill: function(req, res){
        var nowDate = new Date();
        var nowStr = nowDate.getYear() + '-' + (nowDate.getMonth() + 1);

        var allParams = req.allParams();
        var time = req.param('time', nowStr);
        var unitPrice = req.param('unitprice', 0.15);
        var retdata = {
            one: {num: 0,total: 0 , msg: '提交成功'},
            two: {num: 0,msg: '重复订阅'},
            three: {num: 0,msg: '提交失败'}
        };

        async.series({
            one: function(callback){
                var querytext1 = "SELECT COUNT(DISTINCT deliverorder) AS num FROM kuaidilog_9 WHERE status=0 ";
                querytext1 += "AND detailbody LIKE '%200%' AND dayinfo LIKE '%"+ time +"%'";
                console.log(querytext1);
                Kuaidilog9.query(querytext1, function(err, result) {
                    callback(err, result);
                });
            },
            two: function(callback){
                var querytext2 = "SELECT COUNT(DISTINCT deliverorder) AS num FROM kuaidilog_9 WHERE status=0 ";
                querytext2 += "AND detailbody LIKE '%501%' AND dayinfo LIKE '%"+ time +"%'";
                console.log(querytext2);
                Kuaidilog9.query(querytext2, function(err, result) {
                    callback(err, result);
                });
            },
            three: function(callback){
                var querytext3 = "SELECT COUNT(DISTINCT deliverorder) AS num FROM kuaidilog_9 WHERE status=0 ";
                querytext3 += "AND dayinfo LIKE '%"+ time +"%' AND (detailbody LIKE '%700%' OR detailbody LIKE '%701%' ";
                querytext3 += "detailbody LIKE '%702%' OR detailbody LIKE '%600%' OR detailbody LIKE '%601%' OR detailbody LIKE '%500%')";
                console.log(querytext3);
                Kuaidilog9.query(querytext3, function(err, result) {
                    callback(err, result);
                });
            }
        },function(err, results){
            if (err) {
                console.log("updateData err ==> ",err);
                return res.negotiate(err);
            }

            var one = results.one;
            var two = results.two;
            var three = results.three;

            if(one.length > 0){
                retdata['one']['num'] = one[0]['num']
                retdata['one']['total'] = one[0]['num'] * unitPrice;
            }
            if(two.length > 0 ){
                retdata['two']['num'] = two[0]['num'];
            }
            if(three.length > 0){
                retdata['three']['num'] = three[0]['num'];
            }

            return res.json(retdata);
        });
    },
    /**
     * 物流公司数据
     * @param req
     * @param res
     * @returns {*}
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
     * 商户端发货
     * @param req
     * @param res
     */
    merTakeDelivery: function(req, res) {
        console.log(req.ip,req.path);
        var data =req.allParams();
        
        var data2={};
        console.log('merTakeDelivery');
        //console.log(data);
        
        data2['ordernumber']=data['ordernumber'];
        data2['logisticsid']=0;
        data2['logisticsnumber']=data['logisticsnumber'];
        data2['is_delivery']=1;
        data2['status']=2;
        var nowDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
        data2['delivery_time'] = nowDate;
        // 不同物流类型判断
        if (data['type'] == 2) {
            var detailbody=[{"time":nowDate,"ftime":nowDate,"context":"自提"}];
            
            var insertStr = 'INSERT INTO kuaidilog (`company`, `payorder`, `deliverorder`, `dayinfo`, `status`, `detailbody`) ';
            insertStr += 'VALUES (\''+ data['logisticsid'] +'\',\''+ data['ordernumber'] +'\',\''+ data['logisticsnumber']+ '\',\'';
            insertStr += utility2.getCurday() +'\','+ 6 +',\''+ JSON.stringify(detailbody) +'\')';
            console.log(insertStr);
            Kuaidilog.query(insertStr, function(err, results){
                if(err){
                    console.log("merTakeDelivery ==> ", err);
                    return 4001;
                }
                
                // 自动确认收货
                // utils2.autoReceipt(data3);
                utility2.updateOrderRecord(data2);
                return res.json({'code':200,'codeInfo':''});
            });
        }else if(data['type'] == 3){
            var nowDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var context = data['logisticsid'] + '-' + data['logisticsnumber'];
            var detailbody=[{"time":nowDate,"ftime":nowDate,"context":context}];
            
            var insertStr = 'INSERT INTO kuaidilog (`company`, `payorder`, `deliverorder`, `dayinfo`, `status`, `detailbody`) ';
            insertStr += 'VALUES (\''+ data['logisticsid'] +'\',\''+ data['ordernumber'] +'\',\''+ data['logisticsnumber']+ '\',\'';
            insertStr += utility2.getCurday() +'\','+ 7 +',\''+ JSON.stringify(detailbody) +'\')';
            console.log(insertStr);
            Kuaidilog.query(insertStr, function(err, results){
                if(err){
                    console.log("merTakeDelivery ==> ", err);
                    return 4002;
                }
                
                // 自动确认收货
                // utils2.autoReceipt(data3);
                utility2.updateOrderRecord(data2);
                return res.json({'code':200,'codeInfo':''});
            });
        }else if(data['type'] == 1){
            var subscriptData={};
            subscriptData['interface'] = sails.config.globals.storedeliver;
            subscriptData['payorder'] = data['ordernumber']||'';
            subscriptData['deliverorder'] = data['logisticsnumber']||'';
            subscriptData['refundrnumber'] = data['refundrnumber']||'';
            subscriptData['tablenameofitem'] = data['tablenameofitem']||'';
            subscriptData['saleflag'] = data['saleflag']||0;
            subscriptData['company'] = data['logisticsid']||'';
            subscriptData['detailbody'] = '';
            subscriptData['status'] = 0;
            subscriptData['fromaddre'] = '';
            subscriptData['toaddre'] = '';
            subscriptData['imgaddress'] = data['imgaddress']||'';
            subscriptData['remark'] = data['remark']||'';
            utility2.deliverSubscript(subscriptData,function(err,deliverData){
                //console.log('deliverData ==> ',deliverData);
                if (deliverData['code'] == 200) {
                    // 自动确认收货
                    // utils2.autoReceipt(data3);
                    
                    Kuaidicom.findOne({ename:data['logisticsid']}).exec(function(err,com){
                        if(err){console.log(err);return;}
                        data2['logisticsid'] = com.id||0;
                        utility2.updateOrderRecord(data2);
                    });
                }
                return res.json(deliverData);
            });
        }else{
            return res.json({
              code: 4000,
              msg: '其它情况，发货不成功'
            });
        }
    },
  
};

