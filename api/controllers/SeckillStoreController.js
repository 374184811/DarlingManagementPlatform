var exec = require('child_process').exec;
var queryString = require('querystring');
module.exports = {
    _base:'/usr/bin/curl',
    /**
     * 时间存储
     * SeckillStore/addTimes
     * times 存储的时间数据，例如：[{firsttime:'',lasttime:''}]
     * @param req
     * @param res
       */
    addTimes: function(req, res) {
        console.log(req.ip,req.path);

        var allParams = req.allParams();
        var mine = req.session.mine;
        var params = {
            times: JSON.stringify(allParams['times'])
        };
        params.userId = mine.userId;
        params.storeid = mine.storeid;

        var postData = queryString.stringify(params);
        var cmdStr = this._base +' -l ';
        cmdStr += '-H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: '+ Buffer.byteLength(postData) +'" ';
        cmdStr += '-X POST -d \''+ postData +'\' ';
        cmdStr += 'http://localhost:1338/Seckill/addTimes';

        console.log('SeckillStore/addTimes === >',cmdStr);
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                return res.serverError(err);
            }

            return res.json(JSON.parse(stdout));
        });
    },
    /**
     * 查询时间数据
     * SeckillStore/selectTimes
     * @param req
     * @param res
       */
    selectTimes:function(req,res){
        console.log(req.ip,req.path);

        var mine = req.session.mine;
        storeid = mine.storeid;

        var cmdStr = this._base+' http://localhost:1338/Seckill/selectTimes?storeid='+storeid;

        console.log('SeckillStore/selectTimes === >',cmdStr);
        exec(cmdStr, function(err,stdout,stderr) {
            if (err) {
                return res.serverError(err);
            }

            return res.json(JSON.parse(stdout));
        });
    },

};
