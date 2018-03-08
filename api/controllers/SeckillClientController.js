var exec = require('child_process').exec;
var queryString = require('querystring');
module.exports = {
    _base:'/usr/bin/curl',
    /**
     * 用户提醒数据列表 SeckillClient/userWarns
     * tokenId
     * mId
     * psecret
     */
    userWarns: function (req, res) {
        console.log(req.ip,req.path);

        var userInfo = redis.getUserInfo();

        var cmdStr = this._base +' http://localhost:1338/Seckill/userWarns?userId='+userInfo.id;

        console.log('SeckillClient/warns === >',cmdStr);
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                return res.serverError(err);
            }

            return res.json({
                code:200,
                data:JSON.parse(stdout).data
            });
        });
    },
    /**
     * 关闭提醒 SeckillClient/cancelWarn
     * id 提醒的消息id
     * tokenId
     * mId
     * psecret
     */
    cancelWarn:function(req,res){
        console.log(req.ip,req.path);

        var allParams = req.allParams();

        var cmdStr = this._base +' http://localhost:1338/Seckill/cancelWarn?id='+allParams.id;

        console.log('SeckillClient/cancelWarn === >',cmdStr);
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                return res.serverError(err);
            }

            return res.json(JSON.parse(stdout));
        });
    },
    /**
     * 开启提醒  SeckillClient/openWarn
     * sku  商品的货号
     * storeid   商铺id
     * time   商品秒杀时间
     * tokenId
     * mId
     * psecret
     */
    openWarn: function (req, res) {
        console.log(req.ip,req.path);

        var allParams = req.allParams();
        var userInfo = redis.getUserInfo();

        var params = {
            storeid:allParams.storeid,
            sku:allParams.sku,
            userId:userInfo.id||allParams.mId,
            usermobile:userInfo.usermobile,
            time:(new Date(parseInt(allParams.time))).Format('yyyy-MM-dd hh:mm:ss')
        };
        var postData = queryString.stringify(params);
        var cmdStr = this._base +' -l ';
        cmdStr += '-H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: '+ Buffer.byteLength(postData) +'" ';
        cmdStr += '-X POST -d \''+ postData +'\' ';
        cmdStr += 'http://localhost:1338/Seckill/openWarn';

        console.log('SeckillClient/openWarn === >',cmdStr);
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                return res.serverError(err);
            }

            return res.json(JSON.parse(stdout));
        });
    },

};
