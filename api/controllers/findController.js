var tasks = require('../lib/tasks');

module.exports = {
    
    

    //订单的查询   各种过滤   以及
    // 序号   订单号   用户手机号  状态    发货状态    交易渠道    交易金额         创建时间              操作
    // 03      0003    123123123  待收货   未发货      合约支付     123123    2016-02-02  12:20:20      详情 发货
    /*
    商户在后台查看 所有的订单
    */
    /**
     * 192.168.0.60:1337/find/getMerOrderList?ordernumber=1&mobile=1&createdAt1=1&createdAt2=1
     *
     * @param  ordernumber              //订单号id
     * @param  mobile                   //手机号码
     * @param  paymentid                //用户id
     * @param  createdAt1               //查询起始时间
     * @param  createdAt2               //查询结束时间
     * @param  status                   //订单状态
     * @param  isdeliver                //订单状态
     * @param  userid                   //用户id
     * @param  username                 //交易金额起始值
     * @param  payamount1               //交易金额起始值
     * @param  payamount2               //交易金额结束值
     *
     * @return {}                       //返回结果集
        [
          {"ordernumber": "201608051142100000000103","storeid": 10,"consignee_mobile": "07558324987",
            "status": 1,"paymentid": 11,"total_amount": 15.031,"tablenameofitem": null
          },
          {
            "ordernumber": "201608051138100000000101","storeid": 10,"consignee_mobile": "07558324987",
            "status": 1,"paymentid": 10,"total_amount": 15.031,"tablenameofitem": null
          }]

          select createdAt,consignee_mobile,total_amount,
          paymentid,paystatus,status,ordernumber,storeid,
          tablenameofitem,buyerid from  ordermain_0 where
          ordernumber like  '%1%'  and
             consignee_mobile = 15626453532  and
                paymentid = 15626453532  and
                createdAt > 2016-08-02T16:00:00.000Z and createdAt < 2016-08-24T16:00:00.000Z  and   status = 1  and   payment_amount > 123 and payment_amount < 123 order by createdAt desc


{ storeid: -1,
  ordernumber: null,
  mobile: null,
  status: -1,
  paymentid: -1,
  payamount1: null,
  payamount2: null }

          
     */
     mysavettt: function(req, res) {
      utility2.savePaylimit(req.param('userid'),req.param('sku'),req.param('num'));
      return res.json('fff');
     },

    mysavettt3: function(req, res) {
        async.auto({
            result1:function(callback,data){
                console.log('1');
                //console.log(data);
                callback(null,'functionResult2');
            },
            result2:function(callback,data){
                console.log('2');
                //console.log(data);
                setTimeout(function(){callback(null,'functionResult1')},2000)
            },
            result3:['result1','result2',function(callback,data){
                console.log('3');
                //console.log(data);
                callback(null,'result3');
            }],
            result4:function(callback){
                console.log('4');
                callback(null,'functionResult2');
            },
            result5:['result1','result2',function(callback,replyData){
                console.log('5');
                //console.log(replyData);
                callback(null,replyData.result1+replyData.result2,1);
            }]
        },
        function(err,data){
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!data')
            //console.log(data)
            return res.json(data);
        });
     },

    mysavettt2: function(req, res) {
        utility2.checkPaylimit44(req.param('userid'),req.param('sku'),req.param('num'));
        return res.json('fff');
    },

    getAdmOrderList: function(req, res) {
        return this.getMerOrderList(req, res)
    },

    getMerOrderList: function(req, res) {

        var retData={ 'code':200,'data':[]};
        console.log(req.path);
        console.log(req.allParams());
       
        var serchArray = [];
        var serchStr='';
        serchArray.push(' where ');
       // console.log(req.allParams());
        var mine = req.session.mine;
        //console.log(mine);
        if (!mine) {
            retData['code']=4001;
            retData['codeInfo']="用户未登录";
            return res.json(retData);
        }
        if(mine.storeid==0){
            if( req.param('storeid') ){
                if( req.param('storeid')!=-1 )
                {
                    //console.log('hehe 总后台');
                    serchStr = ' storeid = '+req.param('storeid');
                    serchArray.push(serchStr);
                    serchArray.push(' and ');
                }
            }
        }else{
            serchStr = ' storeid = '+mine.storeid;
            //serchStr = ' storeid = '+req.param('storeid');
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }

            serchArray.push('a.buyerid=b.id');
            serchArray.push(' and ');

        if(req.param('ordernumber') != undefined){
            if( req.param('ordernumber').length<20 )
            {
                serchStr = ' ordernumber like  \'%' + req.param('ordernumber') +'%\'';
            }
            else{
                serchStr = ' ordernumber = '+req.param('ordernumber');
            }
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }
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
        var querytext   = 'select a.*,b.usermobile from ordermain as a, account as b '+ serchStr+'  order by a.createdAt desc';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if (err) {
                retData['code']=4000;
                return res.serverError(err);
            }

            // for (var i = 0; i < results.length; i++) {

                // if(results[i]['ordertype']<10){
                //   results[i]['ordertype']=1;
                // }
                // if(results[i]['ordertype']>=10){
                //   results[i]['ordertype']=2;
                // }
                // if(results[i]['paymentid']==3 || results[i]['paymentid']==4 ){
                //     results[i]['paymentid']=2;
                // }else if(results[i]['paymentid']>=5 && results[i]['paymentid']<=7 ){
                //     results[i]['paymentid']=3;
                // }else if(results[i]['paymentid']>7 ){
                //     results[i]['paymentid']=4;
                // }
            // };
            retData['data']=results;
            return res.json(retData);
        });
    },

    getMerOrderListExport: function(req, res) {

        var retData={ 'code':200,'data':[]};
        console.log(req.path);
        console.log(req.allParams());
        var merNameList=seller.getStoreArray();
        var serchArray = [];
        var serchStr='';
        serchArray.push(' where ');
       // console.log(req.allParams());
        var mine = req.session.mine;
        //console.log(mine);
        if (!mine) {
            retData['code']=4001;
            retData['codeInfo']="用户未登录";
            return res.json(retData);
        }
        if(mine.storeid==0){
            if( req.param('storeid') ){
                if( req.param('storeid')!=-1 )
                {
                    //console.log('hehe 总后台');
                    serchStr = ' storeid = '+req.param('storeid');
                    serchArray.push(serchStr);
                    serchArray.push(' and ');
                }
            }
        }else{
            serchStr = ' storeid = '+mine.storeid;
            //serchStr = ' storeid = '+req.param('storeid');
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }

            serchArray.push('a.buyerid=b.id');
            serchArray.push(' and ');

        if(req.param('ordernumber') != undefined){
            if( req.param('ordernumber').length<20 )
            {
                serchStr = ' ordernumber like  \'%' + req.param('ordernumber') +'%\'';
            }
            else{
                serchStr = ' ordernumber = '+req.param('ordernumber');
            }
            serchArray.push(serchStr);
            serchArray.push(' and ');
        }
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
            //console.log('req.paramlength=',req.param('createdAt1').length );
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
        var querytext   = 'select a.*,b.usermobile from ordermain as a, account as b '+ serchStr+'  order by a.createdAt desc';
        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if (err) {
                retData['code']=4000;
                return res.serverError(err);
            }
            var innerCount = 0;
            var innerLenght = results.length;

            results.forEach(function(elem,key){
                var querytext2   = 'select *  from '+ elem['tablenameofitem'] +' where ordernumber=\''+ elem['ordernumber'] +'\'';
                console.log(querytext2);
                Ordermain.query(querytext2, function(err, results2) {
                    innerCount++;
                    if (err) {
                        retData['code']=4000;
                        return res.serverError(err);
                    }

                    results[key]['storename']=merNameList[elem['storeid']];
                    results[key]['innerData']=results2;
                    if(innerCount == innerLenght){
                        retData['data']=results;

                        console.log('getMerOrderListExport');
                        return res.json(retData);
                    }
                });
            });


        });
    },

    getUserOrderList2: function(req, res) {

        var orderchilditemobj = [];
        var sqlQueryOrdermain = "";
        var allParams = req.allParams();
        var seller = seller.getStoreArray();

        var status = allParams.status;
        var buyerid = allParams.buyerid;

        switch(status) {
            case -1:
                //sqlQueryOrdermain = "select * from ordermain where isdelete = 0 and buyerid = \'" + buyerid + '\' ' + " order by createdAt desc";
                break;
            case 0:
                sqlQueryOrdermain = "select * from ordermain where isdelete = 0 and buyerid = " + buyerid + " and ordertype <= 10 and status = 0 order by createdAt desc";
                break;
            case 1:
                sqlQueryOrdermain = "select * from ordermain where isdelete = 0 and buyerid = " + buyerid + " and status >= 1 and  status < 3  order by createdAt desc";
                break;
            case 2:
                sqlQueryOrdermain = "select * from ordermain where isdelete = 0 and buyerid = " + buyerid + " and status = 3 order by createdAt desc";
                break;
            case 4:
                sqlQueryOrdermain = "select * from ordermain where isdelete = 0 and buyerid = " + buyerid + " and (status >= 1 or ordertype > 10) order by createdAt desc";
                break;
            case 5:
                sqlQueryOrdermain = "select * from ordermain where isdelete = 0 and buyerid = " + buyerid + " and ordertype = 11 order by createdAt desc";
                break;
            case 5:
                sqlQueryOrdermain = "select * from ordermain where isdelete = 0 and buyerid = " + buyerid + " and ordertype=12 order by createdAt desc";
                break;
            default:
                console.log('err: status. ',status);
        }


        fn0 = function(cb) {
            console.log('sqlQueryOrdermain. check it out. ',sqlQueryOrdermain);
            Ordermain.query(sqlQueryOrdermain, function(err, list) {
                console.log("cb_tag1: The result of this query is shown came out. check it out: ", list.length);

                var queryOrdermainChildList = [];
                for(var i = 0; i<list.length; i++) {

                    var orderNum,tabName;
                    var sqlQueryOrdermainChild;

                    orderNum = list[i].ordernumber;
                    tabName = list[i].tablenameofitem;

                    sqlQueryOrdermainChild = "";
                    sqlQueryOrdermainChild += "select * from " + tabName;
                    sqlQueryOrdermainChild += " where ordernumber = " + orderNum;

                    queryOrdermainChildList.push(sqlQueryOrdermainChild);
                    console.log("sqlQueryOrdermainChild. check it out. ", sqlQueryOrdermainChild);
                }

                cb(err,{list,queryOrdermainChildList});
            });
        };

        fn1 = function(cb, result) {

            var r = result.z,list;
            var sqlQueryOrdermainChildList = r.queryOrdermainChildList.slice();

            for(var i = 0; i<sqlQueryOrdermainChildList.length; i++) {

                var sqlQueryOrdermainChild = sqlQueryOrdermainChildList[i];
                Orderchilditem.query(sqlQueryOrdermainChild, function(err, element) {
                    console.log("cb_tag2: The result of this query is shown came out. check it out: ", element.length);

                    for (var i = 0; i < element.length; i++) {

                        element[i].redFlag = element[i].redFlag || 0;
                        element[i].finalpay = element[i].finalpay || 0;
                        element[i].buy_price = element[i].buy_price || 0;
                        element[i].pre_price = element[i].pre_price || 0;
                        element[i].storename = element[i].storename || "";

                        element[i].redFlag = 0;
                        element[i].storename = seller[element[i].storeid];
                        element[i].finalpay = (element[i].buy_price - element[i].pre_price).toFixed(2);
                    }

                    list = list || [];
                    list.push(element);

                    if (list.length === sqlQueryOrdermainChildList.length) {
                        cb(err,list);
                    }
                });
            }
        };

        fn2 = function(cb, result) {

            var list = [];
            var z = result.z;
            var b = result.b;
            var queryViewUserChatMsgList = [];


            for(var i = 0; i<z.list.length; i++) {
                var elem = z.list[i];
                var tabName = "view_userchatmsg" + elem.tablenameofitem.substring(14,18);

                for(var j = 0; j<b.length; j++) {
                    
                    var e = b[j];
                    var userInfo = redis.getUserInfo();
                    var usermobile = userInfo.usermobile;
                    var refundrnumber = e.refundrnumber;
                    var sqlQueryViewUserChatMsg = ""; 

                    sqlQueryViewUserChatMsgList = "";
                    sqlQueryViewUserChatMsgList = "select * from " + tableName;
                    sqlQueryViewUserChatMsgList = " as a where a.refundrnumber = " + refundrnumber;
                    sqlQueryViewUserChatMsgList += " and a.receiver = '" + usermobile + "' and a.isRead=0 order by a.createdAt asc";

                    queryViewUserChatMsgList.push(sqlQueryViewUserChatMsg);
                    console.log("sqlQueryViewUserChatMsg. check it out. ", sqlQueryViewUserChatMsg);
                }
            }

            for(var i = 0; i<queryViewUserChatMsgList.length; i++) {
                
                 var sqltext = queryViewUserChatMsgList[i];
                 UserchatMsg.query(sqltext, function(err, element) {

                    list.push(element);
                    console.log("cb_tag3: The result of this query is shown came out. check it out: ", element.length);

                    if (list.length === queryViewUserChatMsgList.length) {
                        cb(err,list); 
                    }
                 });
            }
        };

        fn3 = function(cb, result) {
            cb(null,null);
        };

        callback = function(err, reuslts){
            return res.json({
                data:reuslts,
                err:err,
                code:200,
                msg:"正常"
            });
        };

        tasks.series({
            z:fn0,
            a:fn1,
            b:fn2,
            c:fn3,
        }, callback);
    },

//getUserOrderList?buyerid=22&status=-1
    getUserOrderList: function(req, res) {
        var merNameList=seller.getStoreArray();
        console.log(req.path);
        //var selectData  = ['createdAt','consignee_mobile','payment_amount','paymentid','paystatus','status','ordernumber','storeid','tablenameofitem','buyerid'];
        console.log(req.allParams());
        var status   = req.param('status');
        var wherestr = '';
        if(status==-1){
          wherestr='';
        }else if(status==0){
          wherestr=' and ordertype<=10 and status=0';
        }else if(status==1){
          wherestr=' and  status>='+status+' and  status<3 ';
        }else if(status==2){
          wherestr=' and  status=3';
        }else if(status==4){
          wherestr=' and  (status>=1 or ordertype>10) ';
        }else if(status==5){
          wherestr=' and  ordertype=11 ';
        }else if(status==6){
          wherestr=' and  ordertype=12 ';
        }

        var querytext   = 'select * from ordermain where isdelete=0 and buyerid=\''+req.param('buyerid')+'\' '+wherestr+' order by createdAt desc';
        var recrodData   =[];
        var dateInfo = new Date();
        var timestr = dateInfo.getTime();
        var retData={ 'code':200,'data':[],'serverCurTime':timestr};
        var tempData=[],len = 0;

        console.log(querytext);
        Ordermain.query(querytext, function(err, results) {
            if (err) {
              retData['code']=4000;
              return res.serverError(err);
            }
            retData['data']=results;
             console.log('results.length : ',results.length);
            if(results.length){

              results.forEach(function(elem,key){
                var tablename2 = elem['tablenameofitem'];
                var ordernumber =elem['ordernumber'];

                var tableName = "view_userchatmsg" + elem['tablenameofitem'].substring(14,18);
                var querytext2   = 'select * from '+tablename2 +' where ordernumber=\''+ordernumber+'\' ';

                console.log(querytext2);
                Orderchilditem.query(querytext2, function(err, results2) {
                    if (err) {
                        retData['code']=4000;
                        return res.serverError(err); 
                    }
                
                    len += results2.length;
                    results2.forEach(function(eleme,i){
                   
                        results2[i]['finalpay']=(results2[i]['buy_price']-results2[i]['pre_price']).toFixed(2);
                        results2[i]['redFlag'] = 0;
                        results2[i]['tableName']="";

                        var refundrnumber = results2[i]['refundrnumber'] || 0;
                        var sqltext = 'select * from '+tableName+' as a where a.refundrnumber="'+refundrnumber+'" and a.receiver="'+redis.getUserInfo().usermobile+'" and a.isRead=0 order by a.createdAt asc';
                        
                        //console.log(sqltext);
                        UserchatMsg.query(sqltext, function(err, result) {
                            if (err) return res.negotiate(err);

                            if (result.length) {
                                results2[i]['redFlag']=1;
                                results2[i]['tableName']=result[0].tableName;
                            }

                            //console.log("len. ", len);
                            //console.log(results2[i]['refundrnumber']," is redFlag. ",results2[i]['redFlag']); 

                            //if (len==results2.length){
                                recrodData.push(1);
                                //console.log('处理数据. '.yellow)

                                retData['data'][key]['itemData'] = {};
                                retData['data'][key]['itemData'] = results2 || -1;
                                retData['data'][key]['storename']=merNameList[retData['data'][key]['storeid']];
                                 if(recrodData.length==len){
                                    console.log('发送数据成功.len ',len)
                                    console.log('发送数据成功. ',recrodData.length)

                                    console.log('iinfo ',retData)
                                    return res.json(retData);
                                 }
                            //}
                        });
                       
                    });

                    //if (len==results2.length){

                    //retData['data'][key]['itemData']=results2;
                    //console.log(merNameList[retData['data'][key]['storeid']]);
                    //retData['data'][key]['storename']=merNameList[retData['data'][key]['storeid']];
                    // if(recrodData.length==results.length){
                    //     return res.json(retData);
                    // }
                    //}
                    //console.log(recrodData.length+':'+results.length);
                    //if(recrodData.length==results.length){
                        // var len = 0;
                        // retData['data'].forEach(function(elem,key){
                        //     var tableName = "view_userchatmsg" + retData['data'][key]['tablenameofitem'].substring(14,18);
                        //     retData['data'][key]['itemData'].forEach(function(eleme,i){
                        //         var refundrnumber = retData['data'][key]['itemData'][i]['refundrnumber'];
                        //         if (refundrnumber) {
                        //             var sqltext = 'select * from '+tableName+' as a where a.refundrnumber='+refundrnumber+' and a.receiver="'+redis.getUserInfo().usermobile+'" and a.isRead=0 order by a.createdAt asc';
                        //             UserchatMsg.query(sqltext, function(err, result) {
                        //                 if (err) return res.negotiate(err);

                        //                 if (result.length) {
                        //                     retData['data'][key]['itemData'][i]['redFlag']=1;
                        //                 }
                        //                 console.log('---------------------redFlag: ---------------------------------'); 
                        //                 console.log(retData['data'][key]['itemData'][i]['refundrnumber']); 
                        //                 console.log(retData['data'][key]['itemData'][i]['redFlag']); 
                        //                 console.log('---------------------redFlag: --------------------------------'); 
                        //             });
                        //         }
                        //         len++;
                        //     });
                        // });
                        //if (len==retData['data'].length)
                            //return res.json(retData);
                    //}
                });

              });

            }else{
              return res.json(retData);
            }
        });
    },
    clientUserOrderNo: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        var retData={ 'code':200,'data':{'all':0,'waitpay':0,'diliver':0,'needcomment':0,'deposit':0,'finalpayment':0}};

        var querytext   = 'select * from ordermain where isdelete=0 and buyerid=\''+req.param('buyerid')+'\'  order by createdAt desc';
        Ordermain.query(querytext, function(err, results) {
            if (err) {
              retData['code']=4000;
              return res.serverError(err);
            }
        
            for (var i = 0; i < results.length; i++) {
              retData['data']['all']+=1;
              if(results[i]['status']==0 && results[i]['ordertype']<=10){
                retData['data']['waitpay']+=1;
              }else if(results[i]['status']>=1 && results[i]['status']<3){
                retData['data']['diliver']+=1;
              }else if(results[i]['status']==3){
                retData['data']['needcomment']+=1;
              }

              if(results[i]['ordertype']==11){
                retData['data']['deposit']+=1;
              }else if(results[i]['ordertype']==12){
                retData['data']['finalpayment']+=1;
              }
            };

            //console.log(results);
            console.log(retData);
            return res.json(retData);
        });
    },

    clientUserOrderNoNew: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        var retData={ 'code':200,'data':{'all':0,'waitpay':0,'diliver':0,'needcomment':0}};
        var donelength=0,conuter=0;
        var returnData=[];
        var done = function(data2){
            returnData.push(data2);
            conuter++;
            if(conuter==donelength){
                utility.emitter.removeListener('clientUserOrderNo', done);
                for (var i = 0; i < returnData.length; i++) {
                  for (var j = 0; j < returnData[i].length; j++) {
                    if(returnData[i][j]['is_comment']==0){
                        retData['data']['needcomment']+=1;
                    }
                  };
                };

              return res.json(retData);
            }
          };

        utility.emitter.on('clientUserOrderNo', done);

        var querytext   = 'select * from ordermain where buyerid=\''+req.param('buyerid')+'\'  order by createdAt desc';
        Ordermain.query(querytext, function(err, results) {
            if (err) {
              retData['code']=4000;
              return res.serverError(err);
            }
            donelength=results.length;
            for (var i = 0; i < results.length; i++) {

              var querytext2   = 'select * from '+results[i]['tablenameofitem'] +' where ordernumber=\''+results[i]['ordernumber']+'\' ';
              console.log(querytext2);
              Orderchilditem.query(querytext2, function(err, results2) {
                if (err) {
                  retData['code']=4000;
                  return res.serverError(err);
                }
                utility.emitter.emit('clientUserOrderNo',results2);
              });


              retData['data']['all']+=1;
              if(results[i]['status']==0){
                retData['data']['waitpay']+=1;
              }else if(results[i]['status']>=1 && results[i]['status']<3){
                retData['data']['diliver']+=1;
              }else if(results[i]['status']==3){
              }
            };
        });
    },
    //   http://localhost:1337/find/getDetailOrderInfo?ordernumber=201608051138100000000101&buyerid=20
    getDetailOrderInfo: function(req, res){
        var merNameList=seller.getStoreArray();
        console.log(req.path);
        console.log(req.allParams());
        var ordernumber   =req.param('ordernumber');
        var retData={ 'code':200,'data':[],'goodsInfo':[]};
        if(ordernumber != undefined){
          //console.log(ordernumber);
            //if( ordernumber.length==20 ){
            var querytext   = 'select * from ordermain where ordernumber=\''+ordernumber+'\' order by createdAt desc';
            console.log(querytext);
            Ordermain.query(querytext, function(err, results) {
                if (err) {
                  retData['code']=4001;// 查询订单详情有问题
                  return res.serverError(err);
                }
                if(results.length==1){
                    
                    if(results[0]['ordertype']==11){
                      results[0]['presale']='待付款(已付定金)';
                    }else{
                      results[0]['presale']='';
                    }
                    results[0]['storename']=merNameList[results[0]['storeid']];
                    retData['data']=results;
                    var querytext2   = 'select * from '+results[0]['tablenameofitem'] + ' where ordernumber=\''+ordernumber+'\' order by createdAt desc';
                    //var querytext2 = 'select * from '+results[0]['tablenameofitem'] + ' where ordernumber=\''+ordernumber+'\' order by createdAt desc';
                    console.log(querytext2);
                    Orderchilditem.query(querytext2, function(err, results2) {
                        if (err) {
                            retData['code']=4002;// 查询订单详情有问题
                            return res.serverError(err);
                        }
                        if(results[0].ordertype>0){
                            results2[0]['finalpay']=(results2[0]['buy_price']-results2[0]['pre_price']).toFixed(2);
                        }

                        retData['goodsInfo']=results2;
                        retData['couponInfo']=[];
                        if(results[0].coupon_number>0 ){
                            var couponLoseNum=0;
                            var couponLoseAmount=0;
                            var newCouponArr=[];
                            coupon.getCouponDetail(0,results[0].coupon_id,results[0]['buyerid'],ordernumber,function(err,couponData){
                                //console.log('getCouponOfOrder',couponData);
                                                                if(!err){
                                    retData['couponInfo']=couponData.data;
                                    if(results[0].status==0){
                                        for (var i = 0; i < couponData.data.length; i++) {
                                            if(couponData.data[i].isexpired==1 || couponData.data[i].isdel==1  || couponData.data[i].isvalid==2){

                                                couponLoseNum+=1;
                                                couponLoseAmount+=couponData.data[i].parvalue;
                                                var myCoupon={};
                                                myCoupon.status=1;
                                                myCoupon.orderid=0;
                                                myCoupon.usedAt=null;
                                                if(couponData.data[i].couponmode==1){
                                                    UserCoupon.destroy({id:couponData.data[i].aid}).exec(function (err) {
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
                                        if (couponLoseNum>0) {
                                            var newCouponAmount = results[0]['coupon_amount'] - couponLoseAmount;
                                            var newCouponNum = results[0]['coupon_number'] - couponLoseNum;
                                            if (newCouponAmount<0) {newCouponAmount=0};
                                            var querytextnew   = ' UPDATE ordermain SET payment_amount= payment_amount+'+couponLoseAmount +',total_amount= total_amount+'+couponLoseAmount +',coupon_number = '+newCouponNum+',coupon_amount = '+newCouponAmount+',coupon_id=\''+newCouponArr.toString()+'\' WHERE (id='+results[0].id+')';
                                            Ordermain.query(querytextnew, function(err, results) {
                                                if (err) {
                                                  retData['code']=4011;// 查询订单详情有问题
                                                  return res.serverError(err);
                                                }
                                            });
                                        };
                                    }

                                    return res.json(retData);
                                }else{
                                    return res.json(retData);
                                }
                            });
                        }else{
                            return res.json(retData);
                        }
                    });
                }
            });
           
        }else{
           return res.json('ook2');
        }
    },
/*
{
    find/clientGetDetailOrderInfo
  ordernumber: '100000000003658',
  buyerid: '304',
  tablenameofitem: 'orderchilditemXXXXXXX'
  tokenId=AFC5312ADEF44F64B93005C7F99BE552,
  }
*/
    clientGetDetailOrderInfo: function(req, res){
     var merNameList=seller.getStoreArray();
        console.log(req.path);
        console.log(req.allParams());
        var ordernumber   =req.param('ordernumber');
        var dateInfo = new Date();
        var timestr = dateInfo.getTime();
        var retData={ 'code':200,'data':[],'goodsInfo':[],'serverCurTime':timestr};
        if(ordernumber != undefined){
          //console.log(ordernumber);
            //if( ordernumber.length==20 ){
            var querytext   = 'select * from ordermain where ordernumber=\''+ordernumber+'\' order by createdAt desc';
            console.log(querytext);
            Ordermain.query(querytext, function(err, results) {
                if (err) {
                  retData['code']=4001;// 查询订单详情有问题
                  return res.serverError(err);
                }
                if(results.length==1){
                    
                    if(results[0]['ordertype']==11){
                      results[0]['presale']='待付款(已付定金)';
                    }else{
                      results[0]['presale']='';
                    }

                    results[0]['storename']=merNameList[results[0]['storeid']];
                    retData['data']=results;
                    var querytext2   = 'select * from '+results[0]['tablenameofitem'] + ' where ordernumber=\''+ordernumber+'\' order by createdAt desc';
                    //var querytext2   = 'select * from '+results[0]['tablenameofitem'] + ' where ordernumber=\''+ordernumber+'\' order by createdAt desc';
                    console.log(querytext2);
                    Orderchilditem.query(querytext2, function(err, results2) {
                        if (err) {
                            retData['code']=4002;// 查询订单详情有问题
                            return res.serverError(err);
                        }
                        if(results[0].ordertype>0){
                            results2[0]['finalpay']=(results2[0]['buy_price']-results2[0]['pre_price']).toFixed(2);
                        }

                        retData['goodsInfo']=results2;
                        retData['couponInfo']=[];
                        if(results[0].coupon_number>0 ){
                            //var couponList = results[0].coupon_id.split(',');
                            //console.log('couponList',couponList);
                            var couponLoseNum=0;
                            var couponLoseAmount=0;
                            var newCouponArr=[];
                            coupon.getCouponDetail(0,results[0].coupon_id,results[0]['buyerid'],ordernumber,function(err,couponData){
                                console.log('getCouponOfOrder',couponData);
                                console.log('getCouponDetailerr',err);
                                console.log('results',results);
                                if(!err){
                                    retData['couponInfo']=couponData.data;
                                    if(results[0].status==0){
                                        for (var i = 0; i < couponData.data.length; i++) {
                                            if(couponData.data[i].isexpired==1 || couponData.data[i].isdel==1 || couponData.data[i].isvalid==2 ){

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
                                        var querytextnew   = ' UPDATE ordermain SET payment_amount= payment_amount+'+couponLoseAmount +',total_amount= total_amount+'+couponLoseAmount +',coupon_number = '+newCouponNum+',coupon_amount = '+newCouponAmount+',coupon_id=\''+newCouponArr.toString()+'\' WHERE (id='+results[0].id+')';
                                        Ordermain.query(querytextnew, function(err, results) {
                                            if (err) {
                                              retData['code']=4011;// 查询订单详情有问题
                                              return res.serverError(err);
                                            }
                                        });
                                    };
                                    return res.json(retData);
                                }else{
                                    return res.json(retData);
                                }
                            });
                        }else{
                            return res.json(retData);
                        }
                    });
                }
            });
           
        }else{
           return res.json('ook2');
        }
    },
    //   http://localhost:1337/find/updateOrderDeliver?ordernumber=201608051138100000000101&buyerid=20&logisticsid=1&logisticsnumber=1
    updateOrderDeliver: function(req, res){
        console.log(req.path);
        console.log(req.allParams());
        var ordernumber   =req.param('ordernumber');
        var logisticsid   =req.param('logisticsid');
        var logisticsnumber   =req.param('logisticsnumber');
        var retData={ 'code':200};
        var dateInfo = new Date();
        logisticsid = dateInfo.getMonth() + 1;
        if(ordernumber != undefined){
            var querytext   = 'UPDATE  ordermain set  logisticsid='+logisticsid +',logisticsnumber='+logisticsnumber+' where ordernumber=\''+ordernumber+'\'';
            console.log(querytext);
            Ordermain.query(querytext, function(err, results) {
                if (err) {
                retData['code']=4001;// 查询订单详情有问题
                return res.serverError(err);
                }
                return res.json(retData);
            });
        }else{
            retData['code']=4000;
            return res.json(retData);
        }
    },
    //身份证银行卡信息认证接口
    pingppIdentification: function(req, res){
    
        console.log(req.path);
        console.log(req.allParams());
        var pingxx_appid=sails.config.connections.pingppAppids[4];
            
        //utility.mPingpp.setPrivateKey("");
        utility.mPingpp.identification.identify(
        {
            type: 'id_card',
            app: pingxx_appid,
            data: {
                id_name: '黄鹏',
                id_number: '4223011983'
            }
        },
        function(err, result) {
            err && console.log(err.message);
            //result && console.log(result);
            return res.json(result);
            // YOUR CODE
        }
        );
    },


    updatePaylimit: function(req, res) {
        console.log('updatePaylimit');
        utility2.updatePaylimit();
        return res.json('updatePaylimit');
    },

    updateBping: function(req, res) {
        console.log('updateBping');
        utility2.updateBping();
        return res.json('updateBping');
    },


    updateSchedule: function(req, res) {
        console.log('updateSchedule');
        utility2.updateSchedule();
        return res.json('updateSchedule');
    },
    /**
    接口 获取优惠卷详细数据
    /find/getCouponOfOrder?couponList=[优惠券id数组]
    返回值
      *@returns  {code：200 ，data:[]}
      data数组   数组中每个元素包含如下属性
      id        优惠卷id
      couponname优惠卷名称
      coupontype优惠卷类型
      parvalue  优惠卷面值
      couponmode优惠卷模式
      couponnum  优惠卷编码
      */
    
    getCouponOfOrder: function(req, res) {


    },

    orderTestFun: function(req, res) {
        utiorder.updateOrderHasFinished(req.param('ordernum'),req.param('finishCode'));
        return res.json('orderTestFun');
    },

    orderTestFunSign: function(req, res) {
        utiorder.updateOrderHasSign(req.param('ordernum'));
        return res.json('orderTestFunSign');
    },
};
