/**
 * DashboardStoreController
 * @description :: Server-side logic for managing dashboards
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var dashboardController = require('../publicController/dashboardController')
module.exports = {
    /**
     * 后台首页显示用户总数，昨日订单数，总商户数量,今日订单数量
     * @param req
     * @param res
     */
    index: function (req, res) {
        return dashboardController.index(req,res);
    },
  
};

