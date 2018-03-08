//评价控制器
var rateController = require('../publicController/rateController');
module.exports = {
    /**
     * 更新某个商品的 评论
     * @param req
     * @param res
     * @returns {*}
     */
    updateRate: function(req, res) {
        return rateController.updateRate(req,res);
    },
    /**
     * 用户查看 某个商品的所有评论
     * @param req
     * @param res
     */
    showGoodsRateList: function(req, res) {
        return rateController.showGoodsRateList(req,res);
    },
    /**
     * 用户查看自己的一条评论
     * @param req
     * @param res
     * @returns {*}
     */
    showUserOneRate: function(req, res) {
        return rateController.showUserOneRate(req,res);
    },
    /**
     * 删除评论接口
     * @param req
     * @param res
     */
    deleteRate: function(req, res) {
        return rateController.deleteRate(req,res);
    },
    /**
     * 获取商品评论接口
     * @param req
     * @param res
     */
    clientGetGoodsRate: function(req, res) {
        console.log(req.ip,req.path);
        console.log(req.allParams());
        var retData={'code':200,'codeInfo':'ok','data':null};
        if(!req.param('sku')){
            retData['codeInfo']='error sku:'+sku;
            retData['code']=4000;
            return res.json(retData);
        }
        var sku = req.param('sku');
        var skuArr = sku.split('-');
        var storeid = skuArr[1];

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
                    if(results[i]['vrxmlurl']){
                        results[i]['vrxmlurl'] = results[i]['vrxmlurl'].split(',');
                    }else{
                        results[i]['vrxmlurl'] = [];
                    }
                }
                retData['data']=results;
                return res.json(retData);
            });

        }else{
            retData['codeInfo']='error sku:'+sku;
            retData['data']=[];
            return res.json(retData);
        }
    },
    /**
     * 创建评论
     * @param req
     * @param res
     */
    createRate: function(req, res) {
        console.log(req.path);
        console.log(req.allParams());

        var data1 = req.allParams();
        utils2.insertAssess(data1,function(data){
            res.json(data);
        });
    },
    /**
     * 评价图片上传
     * @param req
     * @param res
     */
    uploadImage: function (req, res) {
        var msg = msg || {};
        console.log('uploadImage: This is the function entry.  check it out: ', msg);
        upload.uploadFile(req,res,'pic','rate');
    },
  
};
