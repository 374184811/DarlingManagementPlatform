//评价控制器
module.exports = {

    //  更新某个商品的 评论
    updateRate: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        console.log('updateRate action');
        var data={},wheredata={};
        var timestr = (new Date()).Format("yyyy-MM-dd hh:mm:ss.S");

        data['starnum']=4;
        data['ratetext']='this is a nice thing';
        data['updatedAt']=timestr;
        wheredata['sellerid']=4;
        wheredata['childordernumber']=4;
        var tablename = 'merrateorder'+4;
        var querytext = utility.updateToTable(data,tablename,wheredata);

        console.log(querytext);
        Rateorder.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(results);
        });
    },
    // 用户查看 某个商品的所有评论
    showGoodsRateList: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        console.log('showGoodsRateList action');

        var storeid = req.param('storeid');
        var gid = req.param('gid');
        var cid = req.param('cid');
        var page = req.param('page') * 20;
        var querytext = 'select * from merrateorder'+storeid+' where goodsid='+gid+' and categoryid= '+cid+' limit '+page+',20 order by updatedAt desc';

        console.log(querytext);
        Rateorder.query(querytext, function(err, results) {

          if (err) return res.serverError(err);
          //console.log(results);
        });
    },
    // 用户查看自己的一条评论
    showUserOneRate: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        console.log('showUserOneRate action');
        var storeid = req.param('storeid');
        var childordernumber = req.param('childordernumber');
        var querytext = 'select * from merrateorder'+storeid+' where childordernumber='+childordernumber +' limit 1';
        console.log(querytext);
        Rateorder.query(querytext, function(err, results) {
          if (err) return res.serverError(err);
          //console.log(results);
        });
    },
    /*
    删除评论接口
    url:
    http://localhost:1337/rate/deleteRate?storeid=1&id=13
    参数：
    storeid      商户id
    id           评论号
    返回值：
    {
        "code": 200,            //200成功  非200表示失败
        "codeInfo": "ok"
    }
    */
    deleteRate: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        console.log('deleteRate action');
        var retData={'code':200,'codeInfo':'ok'}
        if(req.param('storeid') && req.param('id') ){
            //DELETE FROM `merrateorder5` WHERE (`id`='8')
            var querytext = 'delete from merrateorder'+req.param('storeid')+ ' where id='+req.param('id');

            console.log(querytext);
            Rateorder.query(querytext, function(err, results) {
                if (err) {
                    retData['code']=4001;
                    retData['codeInfo']="query table err";
                    retData['data']=err;
                    return res.json(retData);
                }
                //console.log(results);
                retData['data']=results;
                return res.json(retData);
            });
        }else{
            retData['code']=4002;
            retData['codeInfo']="param err";
            return res.json(retData);
        }
    },

    /*
    检索评论接口
    url:
    http://localhost:1337/rate/getMerchatRateList?storeid=1&createtime1=2016-08-31 10:31:01&createtime2=2016-08-31 11:31:01&mobile=1300541897
    参数：
    storeid      商户id
    id          评价流水号
    goodsname   商品名称
    sku         商品编号
    mobile      买家手机
    starnum     评价等级
    createtime1 创建起始时间
    createtime2 创建结束时间
    返回值：
    {
        "code": 200,            //200成功  非200表示失败
        "codeInfo": "ok",
        "data": [element1,element2,element3]    //评价列表
    }
    element1 对象属性如下
    {
      "userid": 1,
      "storeid": 1,
      "ordernumber": "101",                         //订单流水号
      "orderdetailid": "101",
      "tablenameofitem": "good",
      "mobile": "13005418975",                      //买家手机
      "goodsname": "nike",                          //商品名称
      "starnum": 4,                                 //评价等级
      "sku": "123",                                 //商品编号
      "ratetext": "this is a nice thing",           //评价详情
      "id": 2,                                      //评价流水号
      "createdAt": "2016-08-31T02:32:07.000Z",
      "updatedAt": "2016-08-31T02:32:07.000Z",
    }
    */
    getMerchatRateList: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        console.log('getMerchatRateList action');
        var retData={'code':200,'codeInfo':'ok'}
        var mine = req.session.mine;
        //var mine={storeid:0};
        
        //console.log(req.session.mine);
        var values = req.allParams();
        var storeid=-1;
        if (parseInt(mine.storeid) == 0) {
            if (parseInt(values.storeid)!=-1) {
                wherestr += ' storeid= \''+values.storeid+'\' and ';
                storeid = values.storeid;
            }
        }else{
            storeid=mine.storeid;
        }


        delete values.storeid;


        console.log('storeid :',storeid);
        var childordernumber = req.param('childordernumber');

        var wherestr=' where ';

        if(values.createtime1 && values.createtime2){
            wherestr += ' createdAt>=\''+values.createtime1+'\'  and  createdAt<=\''+values.createtime2+'\' and ';
            delete values.createtime1;
            delete values.createtime2;
        }

        if(values.mobile ){
            wherestr += ' mobile  like \'%'+values.mobile+'%\' and ';
            delete values.mobile;
        }

        if(values.id ){
            wherestr += ' id  like \'%'+values.id+'%\' and ';
            delete values.id;
        }

        if(values.goodsname && (values.goodsname !=-1)){
            wherestr += ' goodsname= \''+values.goodsname+'\' and ';
        }
        delete values.goodsname;


        if (values.starnum && (values.starnum!=-1)){
            wherestr += ' starnum= \''+values.starnum+'\' and ';
        }
        delete values.starnum;
        
        if (values.sku){
            wherestr += ' sku = \''+values.sku+'\' and ';
        }
        delete values.sku;

        for(var p in values){
            if( values[p] && values[p].length>0&&values[p] !=-1  ){
                wherestr+= p +'='+ values[p] +' and ';
            }
        }
        if(wherestr.length>8){
            wherestr = wherestr.slice(0,wherestr.length-5);
        }else{
            wherestr='';
        }
        var querytext = '';
        if (storeid==-1) {

            //console.log('utility2.mStoreIds.length',utility2.mStoreIds);
            for (var i = 0; i < utility2.mStoreIds.length; i++) {
                if(utility2.mStoreIds[i]['operatorno']!=0){
                    if(i==utility2.mStoreIds.length-1){
                        querytext+='select * from merrateorder'+utility2.mStoreIds[i]['operatorno']+wherestr;
                    }else{
                        querytext+='select * from merrateorder'+utility2.mStoreIds[i]['operatorno']+wherestr + ' union all ';
                    }
                }
            };
        }else{
            querytext = 'select * from merrateorder'+storeid+wherestr;
        }
            console.log(querytext);
        Rateorder.query(querytext, function(err, results) {
            if (err) {
                //retData['data']=err;
                retData['code']=4000;
                return res.json(retData);
            }
           // console.log(results);
            retData['data']=results;
            return res.json(retData);
        });
    },

    clientGetGoodsRate: function(req, res) {

        console.log(req.path);
        console.log(req.allParams());
        var retData={'code':200,'codeInfo':'ok','data':null};
        if(!req.param('sku')){

            retData['codeInfo']='error sku:'+sku;
            retData['code']=4000;
            return res.json(retData);
        }
        var sku         = req.param('sku');
        var skuArr= sku.split('-');
        var storeid     = skuArr[1];

        //var storeid     = req.param('storeid');
        var tablename = 'merrateorder'+storeid;
        if(skuArr.length>=3){
            sku=skuArr[0]+'-'+skuArr[1]+'-'+skuArr[2];

            var querytext = 'select * from '+tablename+' where sku=\''+sku+'\' order by createdAt desc';
            console.log(querytext);
            Rateorder.query(querytext, function(err, results) {
                if (err){
                    return res.serverError(err);
                }
                for (var i = 0; i < results.length; i++) {
                    if(results[i]['picurl']){
                        results[i]['picurl'] = results[i]['picurl'].split(',');
                    }else{
                        results[i]['picurl'] = [];
                    }
                };
                retData['data']=results;
                return res.json(retData);
            });

        }else{

            retData['codeInfo']='error sku:'+sku;
            retData['data']=[];
            return res.json(retData);
        }


    },
    /*
    每个评价和一个订单关联 添加一个评论
    createRate?ordernumber=1000000000002422&orderitemid=44&tablenameofitem=orderchilditem201608&starnum=4&ratetext=xixi
    */
    createRate: function(req, res) {
        console.log(req.path);
        console.log(req.allParams());

        var data1 = req.allParams();
        utils2.insertAssess(data1,function(data){
            res.json(data);
        });
    },
    /*
    异步上传评论图片接口
    url:
    http://localhost:1347/rate/uploadImage
    参数：
    sku          评价流水号
    rate         评论图片字段名
    type         0 评论  1  售后
    返回值：
     图片路径地址
    */
    uploadImage: function (req, res) {
        var msg = msg || {};
        console.log('uploadImage: This is the function entry.  check it out: ', msg);
        upload.uploadFile(req,res,'rate','rate');

    },



};

/*

*/
