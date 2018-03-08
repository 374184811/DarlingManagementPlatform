//邮费控制器
module.exports = {
    
    //  更新某个商品的 评论
    getEsmmoney: function(req, res) {
        var retData={ 'code':200,'codeinfo':'ok','data':null};
        var mine = req.session.mine;
        
        var querytext = 'select * from emsmoney  where   storeid= '+mine.storeid+' limit 1';
        Emsmoney.query(querytext, function(err, results) {
            if (err) {
                retData['code']=401;
                console.log(err);
                retData['codeinfo']='mysql error';
                return res.json(retData);
            }
            if(results.length==1){
                retData['data']=results[0];
            }else{
                retData['code']=402;
                retData['codeinfo']='商户没有设置运费';
            }
            return res.json(retData);

        });
    },

    
    clientGetEsmmoney: function(req, res) {
        var retData={ 'code':200,'codeinfo':'ok','data':null};
        
        var reqData=req.allParams();
        var querytext = 'select * from emsmoney  where   storeid= '+reqData.storeid+' limit 1';
        Emsmoney.query(querytext, function(err, results) {
            if (err) {
                retData['code']=401;
                console.log(err);
                retData['codeinfo']='mysql error';
                return res.json(retData);
            }
            if(results.length==1){
                retData['data']=results[0];
            }else{
                retData['code']=402;
                retData['codeinfo']='商户没有设置运费';
            }
            return res.json(retData);

        });
    },

    // 用户查看 某个商品的所有评论
    updateEsmmoney: function(req, res) {
        console.log('updateEsmmoney action');
        var retData={ 'code':200,'codeinfo':'ok'};
        var reqData=req.allParams();
        console.log(reqData);
        if (req.param('storeid')) {
            var querytext = 'select * from emsmoney  where   storeid= '+reqData.storeid+' limit 1';
            Emsmoney.query(querytext, function(err, results) {
                var querytext2 ='';
                var wherestr ='';
                if (err) {
                    retData['code']=402;
                    console.log(err);
                    retData['codeinfo']='写入数据error';
                    return res.json(retData);
                }

                if(results.length==1){
                    for(var p in reqData){
                        wherestr+= p + ' = '+reqData[p]+','
                    }
                    wherestr = wherestr.slice(0,wherestr.length-1);
                
                    querytext2= 'update emsmoney  set  '+ wherestr +' where   storeid= '+reqData.storeid;
                    
                }else if(results.length==0){
                    var keyarr=[],valuearr=[];
                    for(var p in reqData){
                        keyarr.push(p);
                        valuearr.push(reqData[p]);
                    }
                    wherestr = wherestr.slice(0,wherestr.length-1);
                    querytext2= 'INSERT INTO emsmoney ( '+ keyarr.join(',')+')  VALUES ( '+ valuearr.join(',')+')';
                }
                console.log(querytext2);
                Emsmoney.query(querytext2, function(err, results) {
                    if (err) {
                        retData['code']=403;
                        console.log(err);
                        retData['codeinfo']='写入数据error';
                        return res.json(retData);
                    }
                    return res.json(retData);
                });
            });
        }else{
            retData['code']=401;
            retData['codeinfo']='参数错误';
            return res.json(retData);
        }
    }


};

/*

*/