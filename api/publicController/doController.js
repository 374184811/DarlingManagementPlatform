
var exec = require('child_process').exec;
var queryString = require('querystring');

module.exports = {
    _base:'/usr/bin/curl',
    it: function (req, res, service_type,action_type) {

        var self = this;
        const goods_type = 1;
        const serch_type = 2;
        const add = 1,del = 2,edt = 3,que = 4;

        if (_.isEqual(service_type,goods_type)) {
            switch(action_type) {
                 case add:
                    return self.addGoods(req, res);
                 case del:
                    return self.delGoods(req, res); 
                 case edt:
                    return self.edtGoods(req, res);
                 case que:
                    return self.queGoods(req, res);
                 default:
                    console.log("it: ",action_type);
            }
        }else
        if (_.isEqual(service_type,serch_type)) {
            
        }else{
            console.log("未知服务类型: ",service_type);
        }
    },

    /**
     * 添加   /add
     *
     *
     * @return { 返回结果集 }
     */
    addGoods: function (req, res) {
        var self = this;
        var allParams = req.allParams();
        self.gotoReady(queryString.stringify(allParams))
    },

    /**
     * 删除   /delete
     *
     *
     * @return { 返回结果集 }
     */
    delGoods: function (req, res) {
        var self = this;
        var allParams = req.allParams();
        self.gotoReady(queryString.stringify(allParams))
    },

    /**
     * 修改   /edit
     *
     *
     * @return { 返回结果集 }
     */
    edtGoods: function (req, res) {
        var self = this;
        var allParams = req.allParams();
        self.gotoReady(queryString.stringify(allParams))
    },

    /**
     * 查询   /query
     *
     *
     * @return { 返回结果集 }
     */
    queGoods: function (req, res) {
        var self = this;
        var allParams = req.allParams();
        self.gotoReady(queryString.stringify(allParams))
    },

    gotoReady: function(data) {

        if (!_.isString(data)) 
            return

        var cmdPost = "",self = this;
        cmdPost += self._base +' -l -H "Content-type: application/x-www-form-urlencoded" -H "Content-Length: '
        cmdPost += Buffer.byteLength(data) +'" ' + '-X POST -d \''+ data +'\' ';
        cmdPost += 'http://localhost:1338/Seckill/openWarn';

        console.log("gotoReady. ",cmdPost);
        exec(cmdPost, function(err,stdout,stderr) {
            if (err) {
                console.log("gotoReady. 通知服务异常: \n",err)
                return;
            }

            console.log("gotoReady. 通知服务完成.")
        });
    }
};
