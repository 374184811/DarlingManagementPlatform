//评价控制器
var rateController = require('../publicController/rateController');
module.exports = {
    /**
     * 删除评论接口
     * @param req
     * @param res
     */
    deleteRate: function(req, res) {
        return rateController.deleteRate(req,res);
    },
    /**
     * 获取所有评价数据
     * @param req
     * @param res
     */
    getMerchatRateList: function(req, res) {
        return rateController.getMerchatRateList(req,res);
    },
};
