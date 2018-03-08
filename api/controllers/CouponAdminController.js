var couponController = require('../publicController/couponController');
module.exports = {
    /**
     * 优惠券修改
     * @param req
     * @param res
     * @returns {*}
     */
    modifyCoupon: function(req, res) {
        return couponController.modifyCoupon(req,res);
    },
    /**
     * 管理查询
     * @param req
     * @param res
     */
    selectCoupon: function(req, res) {
        return couponController.selectCoupon(req,res);
    },
    /**
     * 删除优惠券
     * @param req
     * @param res
     */
    deleteCoupon: function(req, res) {
        return couponController.deleteCoupon(req,res);
    },
    /**
     * 详情数据
     * @param id int 优惠券id
     * @param req
     * @param res
     */
    detail:function (req,res) {
        return couponController.detail(req,res);
    },
    /**
     * 后台获取优惠券分发记录
     * @param req
     * @param res
     */
    getCouponRecord:function (req,res) {
        return couponController.getCouponRecord(req,res);
    },

};
