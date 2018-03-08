//购物车控制器
var https = require('https');
var crypto = require('crypto');
module.exports = {
wxjsOauthShare2: function(req, res) {
    var dataInfo    =req.allParams();
    console.log(dataInfo);
    var values ={};
    var dateInfo = new Date();
    var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
    values.ordernumber=req.param("ordernumber");;
    values.buy_price=1;
    values.original_price=1;
    values.refund_amount=1;
    values.pre_price=1;
    values.discount_price=1;
    values.refund_time1=timestr;
    values.refund_time2=timestr;
    values.refund_time3=timestr;
    values.createdAt=timestr;
    values.UpdatedAt=timestr;

    Orderchilditem.create(values).exec(function (err, records) {
        if (err) {
                console.log(err);
            }else{

                console.log(records);
            }
    });
    return res.json(values);
},

wxjsOauthShare3: function(req, res) {
    var dataInfo    =req.allParams();
    console.log(dataInfo);
    var values ={};
    var dateInfo = new Date();
    var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss");
    values.ordernumber=req.param("ordernumber");;
    values.buy_price=1;
    values.original_price=1;
    values.refund_amount=1;
    values.pre_price=1;
    values.discount_price=1;
    values.refund_time1=timestr;
    values.refund_time2=timestr;
    values.refund_time3=timestr;
    values.createdAt=timestr;
    values.UpdatedAt=timestr;

                console.log('Orderchilditem.adapter.definition',Orderchilditem.adapter.definition);
    //Orderchilditem.tableName='orderchilditem201711';
    //var definition = Orderchilditem.adapter.definition;
    //Orderchilditem.adapter.collection='orderchilditem201711';
   // Orderchilditem.adapter.definition=definition;
    //            console.log('Orderchilditem.adapter.definition',Orderchilditem.adapter.definition);
    Orderchilditem.create(values).exec(function (err, records) {
        if (err) {
                console.log(err);
            }else{

                console.log(records);
            }
    });
    return res.json(values);
},
    wxjsOauthShare: function(req, res) {
            var urlstring = req.param("urlstring");
            var dataInfo    =req.allParams();
        console.log(dataInfo);
        var access_token='';
        function getAccessTonke(res) {
            console.log('KO1');
            var tokenUrl="/cgi-bin/token?grant_type=client_credential&appid="+AppID+"&secret="+AppSecret;
            var req2 = https.request({
                host: 'api.weixin.qq.com',
                path: tokenUrl,
                port: 443,
                method: 'GET',
                secureProtocol: 'TLSv1_method'
            }, function(res2) {
                var response = '';
                res2.setEncoding('utf8');
                res2.on('data', function(chunk) {
                    response += chunk;
                });
                res2.on('end', function(){
                  var responseJson = JSON.parse(response);
                  access_token=responseJson.access_token;
                  getJsapiTicket(res);
                });
            });

            req2.end();
        }

        function getJsapiTicket(res) {
            var _this=this;
            var ticketUrl="/cgi-bin/ticket/getticket?access_token="+access_token+"&type=jsapi&callback=JSON_CALLBACK"
            var req2 = https.request({
                host: 'api.weixin.qq.com',
                port: 443,
                path: ticketUrl,
                method: 'GET',
                secureProtocol: 'TLSv1_method'
            }, function(res2) {
                var response = '';
                res2.setEncoding('utf8');
                res2.on('data', function(chunk) {
                response += chunk;
                });
                res2.on('end', function(){
                try {
                    var responseJson = JSON.parse(response);
                    console.log('KO1');
                    console.log('KO1',responseJson);
                    var retData=servicessign.sign(responseJson.ticket,AppID,access_token,urlstring);
                    return res.json(retData);
                    } catch (e) {
                    }
                });
            });

            req2.end();
        }
        function randomString(len) {
            len = len || 32;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }
        var AppID='wxd79f90c607d053b6';
        var AppSecret='1f99539e8d35f660f0c52eee7bf4e200';
        var configData={
            appId : AppID, // 必填，公众号的唯一标识
            timestamp : Date.parse(new Date()), // 必填，生成签名的时间戳
            nonceStr : randomString(10), // 必填，生成签名的随机串
            signature : null,// 必填，签名，见附录1
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }
        var access_token=null;
        var timestamp=null;
        getAccessTonke(res);
        console.log(req.path);
        console.log(req.allParams());
        var retData={'code':200,'codeInfo':'o546546k'};
        //return res.json(retData);
    },
    wxjsOauth: function(req, res) {
        var urlstring = req.param("urlstring", "http://dev.darlinglive.com/html/coupon/?code=1488902400-U5K4ICD-1490975999-2");
        var ticket='';
        function getAccessTonke(res) {
            console.log('KO1');
            var tokenUrl="/cgi-bin/token?grant_type=client_credential&appid="+AppID+"&secret="+AppSecret;
            var req2 = https.request({
                host: 'api.weixin.qq.com',
                path: tokenUrl,
                port: 443,
                method: 'GET',
                secureProtocol: 'TLSv1_method'
            }, function(res2) {
                var response = '';
                res2.setEncoding('utf8');
                res2.on('data', function(chunk) {
                    response += chunk;
                });
                res2.on('end', function(){
                  var responseJson = JSON.parse(response);
                  access_token=responseJson.access_token;
                  getJsapiTicket(res);
                });
            });

            req2.end();
        }
        function getSignature(res) {
            console.log('KO16');
            var string1="jsapi_ticket=" +ticket+"&noncestr=" +configData.nonceStr+"&timestamp=" +configData.timestamp+"&url="+urlstring;
            configData.signature=crypto.createHash('sha1').update(string1).digest('hex');
            console.log(configData.signature);
            return res.json(configData);
        }
        function getJsapiTicket(res) {
            var _this=this;
            var ticketUrl="/cgi-bin/ticket/getticket?access_token="+access_token+"&type=jsapi&callback=JSON_CALLBACK"
            var req2 = https.request({
                host: 'api.weixin.qq.com',
                port: 443,
                path: ticketUrl,
                method: 'GET',
                secureProtocol: 'TLSv1_method'
            }, function(res2) {
                var response = '';
                res2.setEncoding('utf8');
                res2.on('data', function(chunk) {
                response += chunk;
                });
                res2.on('end', function(){
                try {
                    var responseJson = JSON.parse(response);
                    console.log('KO1');
                    console.log('KO1',responseJson);
                    ticket=responseJson.ticket;
                    getSignature(res);
                    } catch (e) {
                    }
                });
            });

            req2.end();
        }
        function randomString(len) {
            len = len || 32;
            var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
            var maxPos = $chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }
        var AppID='wxd79f90c607d053b6';
        var AppSecret='1f99539e8d35f660f0c52eee7bf4e200';
        var configData={
            appId : AppID, // 必填，公众号的唯一标识
            timestamp : Date.parse(new Date()), // 必填，生成签名的时间戳
            nonceStr : randomString(10), // 必填，生成签名的随机串
            signature : null,// 必填，签名，见附录1
            // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }
        var access_token=null;
        var timestamp=null;
        getAccessTonke(res);
        console.log(req.path);
        console.log(req.allParams());
        var retData={'code':200,'codeInfo':'o546546k'};
        //return res.json(retData);
    },
    updateCartItemNum: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        var retData={'code':200,'codeInfo':'ok'};
        var itemData =req.allParams();
        var tableno = itemData.userid%10;
        if(tableno<0 || tableno >9){
            retData['code']=4000;
            retData['data']='cart table no exist';
            return res.json(retData);
        }
        var tableName ="cart_"+tableno;
        var querytext = ' update '+tableName+' set num = num+'+itemData['num'] + ' where sku=\''+itemData['sku']+'\' and userid='+itemData.userid;
        console.log(querytext);
        Cart.query(querytext, function(err,results) {
            if (err) {
                retData['code']=4000;
                retData['data']=err;
                return res.json(retData);
            }
            return res.json(retData);
        });

    },
    // updateCartItemNum: function(req, res) {

    //     console.log(req.path);
    //     console.log(req.allParams());
    //     var retData={'code':200,'codeInfo':'ok'};
    //     var itemData =req.allParams();
    //     var tableno = itemData.userid%10;
    //     if(tableno<0 || tableno >9){
    //         retData['code']=4000;
    //         retData['data']='cart table no exist';
    //         return res.json(retData);
    //     }
    //     var tableName ="cart_"+tableno;

    //     Cart.query('select id,num from '+tableName+' where sku=\''+itemData['sku']+'\' and userid='+itemData.userid+' limit 1', function(err,results1) {
    //         if (err) {
    //             retData['code']=4001;
    //             retData['data']=err;
    //             return res.json(retData);
    //         }
    //         if ( results1.length==1 && (  parseInt(results1[0].num) <= parseInt(itemData['num']) )   ) {
    //             Cart.query(' DELETE FROM '+tableName+'  where id='+results1[0].id, function(err,results) {
    //                 if (err) {
    //                     retData['code']=4002;
    //                     retData['data']=err;
    //                     return res.json(retData);
    //                 }
    //                 return res.json(retData);
    //             });
    //         }else{
    //             var querytext = ' update '+tableName+' set num = num+'+itemData['num'] + ' where id='+results1[0].id;
    //             console.log(querytext);
    //             Cart.query(querytext, function(err,results) {
    //                 if (err) {
    //                     retData['code']=4003;
    //                     retData['data']=err;
    //                     return res.json(retData);
    //                 }
    //                 return res.json(retData);
    //             });
    //         }

    //     });



    // },
    addNewItem: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        var itemData =req.allParams();

        var retData={'code':200,'codeInfo':'ok'};
        var dateInfo = new Date();
        var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss.S");
        //if (req.session.user) {
        //    console.log('addNewItem_addNewItem',req.session.user);
        //}
        if (itemData.psecret) {delete itemData.psecret;}

        if (itemData.tokenId) {delete itemData.tokenId;}
        if (itemData.mId) {delete itemData.mId;}
        console.log('I am here');
        itemData['createdAt']         = timestr;
        itemData['updatedAt']         = timestr;
        itemData['isdelete']         = 0;
        var tableno = itemData.userid%10;
        if(tableno<0 || tableno >9){
            retData['code']=4000;
            retData['codeInfo']='cart table no exist';
            console.log(retData);
            return res.json(retData);
        }
        if(!itemData['sku']){

            retData['code']=4001;
            retData['codeInfo']='no param sku';
            console.log(retData);
            return res.json(retData);
        }
        var sku   = itemData['sku'];
        var skuArr= sku.split('-');
        var storeid     = skuArr[1];
        var sqlStrFirst =' select  operatorno from `account` where id ='+itemData.userid;
        console.log(sqlStrFirst);
        Ordermain.query(sqlStrFirst, function(err,resultsFirst) {
            if (err) {
                retData['code']=4031;
                retData['codeInfo']='用户查询失败';
                console.log('err 2:',err);
                return res.json(retData);
            }
            if (resultsFirst.length==1) {
                if(resultsFirst[0]['operatorno']==storeid){
                    var sqlStr=' select type from mergoodsList'+storeid+' where sku=\''+sku+'\'';
                    Ordermain.query(sqlStr, function(err,results2) {
                        if (err) {
                            retData['code']=4002;
                            retData['codeInfo']='商品查询异常';
                            console.log('err 2:',err);
                            return res.json(retData);
                        }else{
                            if (results2.length!=1) {
                                retData['code']=4003;
                                retData['codeInfo']='商品不存在或者商品异常';
                                console.log('err 3:');
                                return res.json(retData);
                            }
                            else if (results2[0]['type']==2) {
                                retData['code']=4004;
                                retData['codeInfo']='预售商品不能添加到购物车';
                                console.log(retData);
                                return res.json(retData);
                            }else{
                                var tableName ="cart_"+tableno;
                                var querytext0 = ' select * from '+tableName+' where  userid= '+itemData.userid +'  and  sku=\''+itemData['sku']+'\'';
                                console.log('querytext0:',querytext0);
                                Cart.query(querytext0, function(err,results0) {
                                    if (err) {
                                        retData['code']=4005;
                                        retData['data']=err;
                                        console.log(retData);
                                        return res.json(retData);
                                    }
                                    if(results0.length==1){

                                        //console.log('results0.length==1');
                                        if(results0[0]['sku']==itemData['sku']){

                                            var querytext1 = ' update '+tableName+' set num = num+'+itemData['num'] + ' where userid= '+itemData.userid +'  and   sku=\''+itemData['sku']+'\'';

                                            console.log('querytext1:',querytext1);
                                            Cart.query(querytext1, function(err,results0) {
                                            });
                                        }
                                        console.log(retData);
                                        return res.json(retData);
                                    }else{
                                        var querytext = utility.insertDataToTable(itemData,tableName);
                                        console.log('querytext:',querytext);
                                        Cart.query(querytext, function(err,results) {
                                            if (err) {
                                                retData['code']=4006;
                                                retData['data']="err_4006 ";
                                                console.log(retData);
                                                return res.json(retData);
                                            }else{
                                                console.log(retData);
                                                return res.json(retData);
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }else{
                    retData['code']=4032;
                    retData['codeInfo']='其它商户商品不能添加购物车';
                    return res.json(retData);
                }
            }else{
                retData['code']=4033;
                retData['codeInfo']='用户不存在';
                return res.json(retData);
            }
        });

    },

    clientCartList: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        // 添加到用户
        var retData={'code':200,'codeInfo':'ok','data':[]};
        var userid = 0;
        if(req.param('userid')){
            userid = req.param('userid');
        }
        var tableno = req.param('userid')%10;
        if(tableno<0 || tableno >9){
            retData['code']=4000;
            retData['data']='cart table no exist';
            return res.json(retData);
        }
        var tableName ="cart_"+tableno;
        var counter=0;
        var finalData={};
        var querytext = 'SELECT * from '+tableName+ ' where userid='+userid+'  ORDER BY  createdAt DESC';
        var merNameList=seller.getStoreArray();
        Cart.query(querytext, function(err,results) {
            if (err) {
                retData['code']=4000;
                retData['data']=err;
                return res.json(retData);
            }
            if(results.length>0){
                results.forEach(function(elem,key){
                    var querytext2 = ' SELECT status,name,stock,price,pricepoint,pricepromotion,seckillingtime,type,seckillingsell,seckillingstock,seckillingprice from mergoodsList'+elem['storeid']+ '  where  sku=\''+elem['sku']+'\'';
                    console.log(querytext2);
                    Goodscontent.query(querytext2, function(err,results2) {
                        if (err) {
                            retData['code']=4001;
                            retData['data']=querytext2;
                            return res.json(retData);
                        }
                        counter++;
                        if(results2.length>0){
                            results[key]['name']=results2[0]['name'];
                            results[key]['status']=results2[0]['status'];
                            results[key]['stock']=results2[0]['stock'];
                            results[key]['price']=results2[0]['price'];
                            results[key]['pricepoint']=results2[0]['pricepoint'];
                            results[key]['pricepromotion']=results2[0]['pricepromotion'];
                            results[key]['type']=results2[0]['type'];
                            results[key]['seckillingsell']=results2[0]['seckillingsell'];
                            results[key]['seckillingstock']=results2[0]['seckillingstock'];
                            results[key]['seckillingprice']=results2[0]['seckillingprice'];
                            results[key]['seckillingtime']=results2[0]['seckillingtime'];
                            //results[key]['storename']=utility.mSellerlist[elem['storeid']];
                            if(finalData[elem['storeid']]){
                                finalData[elem['storeid']]['storename']=merNameList[elem['storeid']];
                                finalData[elem['storeid']]['object'].push(results[key]);
                            }else{
                                finalData[elem['storeid']]={};
                                finalData[elem['storeid']]['storename']=merNameList[elem['storeid']];
                                finalData[elem['storeid']]['object']=[];
                                finalData[elem['storeid']]['object'].push(results[key]);
                            }
                        }
                        if(results.length==counter){
                            for(var p in finalData){
                                retData['data'].push(finalData[p]);
                            }

                            retData['curtime'] = (new Date()).getTime();
                            return res.json(retData);
                        }
                    });
                });
            }else{
                return res.json(retData);
            }

        });
    },

    clientDeleteStoreItemsFormCart: function(req, res) {


        console.log(req.path);
        console.log(req.allParams());
        var itemData =req.allParams();

        var retData={'code':200,'codeInfo':'ok'};

        var tableno = itemData.userid%10;
        if(tableno<0 || tableno >9){
            retData['code']=4000;
            retData['data']='cart table no exist';
            return res.json(retData);
        }
        var tableName ="cart_"+tableno;

        var deleinfo=eval('(' + itemData.deleinfo + ')');
        var counter=0;
        if(deleinfo.length>0){
            for (var i = 0; i < deleinfo.length; i++) {

                if(deleinfo[i]['id'].length>0 && deleinfo[i]['storeid']){
                    var querytext = 'DELETE FROM '+tableName+' where userid='+itemData.userid+
                    ' and storeid='+deleinfo[i]['storeid']+'  and id in('+ deleinfo[i]['id'].join(',') +')';
                    console.log(querytext);
                    Cart.query(querytext, function(err,results) {
                        counter++;
                        if (err) {
                            retData['code']=4000;
                            retData['data']=err;
                            return res.json(retData);
                        }
                        if (counter==deleinfo.length) {
                            return res.json(retData);
                        };
                    });
                }else{
                    counter++;
                }
            };

        }
    },

    clientDeleteItemFormCart: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        var itemData =req.allParams();

        var retData={'code':200,'codeInfo':'ok'};

        var tableno = itemData.userid%10;
        if(tableno<0 || tableno >9){
            retData['code']=4000;
            retData['data']='cart table no exist';
            return res.json(retData);
        }

        var tableName ="cart_"+tableno;
        var querytext = 'DELETE FROM '+tableName+' WHERE id='+ itemData.id;
        console.log(querytext);
        Cart.query(querytext, function(err,results) {
            if (err) {
                retData['code']=4000;
                retData['data']=err;
                return res.json(retData);
            }
            return res.json(retData);
        });
    },
    merShowlist: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());

        var storeid =req.param('storeid');
        var retcode = utility2.getSqlSelectUnionSort(' * ','cart_',10,storeid);

        //var querytext   = 'select * from '+tablename + serchStr+' order by createdAt desc';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
        if (err) {
        retData['code']=4000;
        return res.serverError(err);
        }
        recrodData.push(1);
        tempData = tempData.concat(results)
        if(recrodData.length==10){
        // utility.client.set(rediskey, JSON.stringify(retData));
        retData['data']=tempData;
        return res.json(retData);
        }
        });
    },

    updateItemFormCart: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        var deleteInfo =[{'storeid':217,'itemlist':[{gid:1,cid:2,num:4,isdelete:0},{gid:1,cid:2,num:4,isdelete:1}]},
                    {'storeid':218,'itemlist':[{gid:11,cid:12,num:14,isdelete:0},{gid:21,cid:22,num:24,isdelete:1}]}];
        for (var i = 0; i < deleteInfo.length; i++) {
            var storeid = deleteInfo[i]['storeid'];
            var querytext = 'SELECT * from '+tableName+ ' ORDER BY  createdAt DESC'
                Cart.query(querytext, function(err,results) {
                  if (err) return res.serverError(err);
                  return res.json(results);
                });
        };
    },
// 商户修改了商品的价格后  同步更新到 AB双方的购物车中
    merUpdateItemInfo: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        // 添加到商户
        var itemData = {};
        var whereData = [];
        var selectData = ['userid'];


        if(req.param('sku') == undefined){
            return res.json(500, { error: 'no sku' });
        }else{
            whereData.push(' sku = '+'\''+req.param('sku')+'\'');
            whereData.push(' and ');
        }


        if(req.param('price') != undefined){
            itemData['price']      = req.param('price');
        }
        if(req.param('paymentprice') != undefined){
            itemData['paymentprice']      = req.param('paymentprice');
        }
        if(req.param('isdelete') != undefined){
            itemData['isdelete']      = req.param('isdelete');
        }

        if(req.param('picurl') != undefined){
            itemData['picurl']      = req.param('picurl');
        }

        var tableName ="mercart"+req.param('sellerid');
        var querytext = utility.updateToTable(itemData,tableName,whereData);
        Cart.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          console.log(querytext);
        });

        var querytext2 = utility.selectToTable(selectData,tableName,whereData);


        Cart.query(querytext2, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(querytext);
          for (var i = 0; i < results.length; i++) {
              var tableName3 ="cart"+results[i]['userid'];
              var querytext3=utility.updateToTable(itemData,tableName3,whereData);
              Cart.query(querytext3, function(err, results) {
                  if (err) return res.serverError(err);
                  console.log(querytext3);
                });
          };

        });


    },
    saveUserToken22: function (req, res) {
      //  console.log(req.path);
     //   console.log(req.allParams());
        //var itemData =req.allParams();

       // var retData={'code':200,'codeInfo':'ok'};
        // var dateInfo = new Date();
        // var timestr = dateInfo.Format("yyyy-MM-dd hh:mm:ss.S");
        // //if (req.session.user) {
        // //    console.log('addNewItem_addNewItem',req.session.user);
        // //}

        //   console.log(req.path);
        // console.log(req.allParams());
        // if (itemData.psecret) {delete itemData.psecret;}

        // if (itemData.tokenId) {delete itemData.tokenId;}
        // if (itemData.mId) {delete itemData.mId;}
        // console.log('I am here');
        // itemData['createdAt']         = timestr;
        // itemData['updatedAt']         = timestr;
        // itemData['isdelete']         = 0;
        // var tableno = itemData.userid%10;
        // if(tableno<0 || tableno >9){
        //     retData['code']=4000;
        //     retData['codeInfo']='cart table no exist';
        //     console.log(retData);
        // }
       // return res.json(retData);
       console.log('subscription2');
       var sub3 = function subscription2(){
            console.log('subscription2_2');
                    }
                    var timeOut = setTimeout(sub3, 10*1000);
        return "ok";
    },
    saveUserToken: function (req, res) {

        var obj={};
        obj.coupon_amount=0;
        obj.coupon_number=0;
        obj.freight=0;
        obj.paymentid=6;
        obj.paymentalias=req.param('getway');
        obj.ordernumber='600000000013674';
        obj.outordernumber='600000000013674';
        obj.tablenameofitem='orderchilditem201704';
        obj.ordertype=0;
        obj.buyerid=1041;
        obj.buyername='何苗苗';
        obj.storeid=4;
        obj.remark='';
        obj.status=0;
        obj.paystatus=0;
        obj.paytype=0;

        obj.logisticsid=0;
        obj.logisticsnumber=0;
        obj.consigneename='何苗苗';
        obj.consignee_region_id='重庆市';
        obj.consignee_region_name='万州区';
        obj.consignee_address='1111111111111111';
        obj.consignee_zipcode='1111111111111111';
        obj.consignee_email='重庆市';
        obj.consignee_mobile='15999685974';
        obj.invoice_tax=0;
        obj.isinvoice=0;
        obj.invoice_belong='打令智能';
        obj.promotion_amount=0;
        obj.is_cancel=0;
        obj.is_urgent=0;
        obj.refund_amount=0;
        obj.is_refund=0;
        obj.isdelete=0;
        obj.is_del_user=0;
        obj.pay_time='2017-04-26 14:37:18';
        obj.pay_time2='2017-04-26 14:37:18';
        obj.delivery_time='2017-04-26 14:37:18';
        obj.presale_endtime='2017-04-26 14:37:18';

        obj.finished_time='2017-04-26 14:37:18';
        obj.payment_amount='5737.5';

        obj.total_amount='5737.5';
        obj.count='5737.5';
        obj.createdAt='2017-04-26 14:37:18';
        obj.updatedAt='2017-04-26 14:37:18';


        console.log(req.path);
        console.log(req.allParams());
        var condition = {};
        console.log(Ordermain.attributes);

        Ordermain.create(obj).exec(function (err, records) {
            console.log(err);
            console.log(records);
            return res.json({
                code: 400,
                msg:records
            });
        });
    }

};

/*

*/
