
var orderController = require('../publicController/orderController');

module.exports = {

    serviceSign: function(req, res){
        return orderController.serviceSign(req, res)
    },

    authorizationWeixin: function(req, res){
        return orderController.authorizationWeixin(req, res)
    },
   
    deleteAuthorizationWeixin: function(req, res){
        return orderController.deleteAuthorizationWeixin(req, res)
    },

    sqlDeleteBugTest: function(req, res){
        return orderController.sqlDeleteBugTest(req, res)
    },
   
    wxAuthForCoupon: function(req, res){
        return orderController.wxAuthForCoupon(req, res)
    },

    wxAuthForCouponInfo: function(req, res){
        return orderController.wxAuthForCouponInfo(req, res)
    },
   
    getWeichatInfo3: function(req, res){
        return orderController.getWeichatInfo3(req, res)
    },
    getWeichatOpenid3: function(req, res){
        return orderController.getWeichatOpenid3(req, res)
    },
    getWeichatOpenid4: function(req, res){
        return orderController.getWeichatOpenid4(req, res)
    },
    getWeichatOpenid5: function(req, res){
        return orderController.getWeichatOpenid5(req, res)
    },
    getWeichatOpenid6: function(req, res){
        return orderController.getWeichatOpenid6(req, res)
    },
    getWeichatOpenid8: function(req, res){
        return orderController.getWeichatOpenid8(req, res)
    },
    getWeichatOpenid7: function(req, res){
        return orderController.getWeichatOpenid7(req, res)
    },
    
    qrPolling: function(req, res){
        return orderController.qrPolling(req, res)
    },

    pingPayNotice: function(req, res){
        return orderController.pingPayNotice(req, res)
    },

    createOrder: function (req, res) {
       return orderController.createOrder(req, res)
    },

    createOrderWithSecond: function(req, res){
        return orderController.createOrderWithSecond(req, res)
    },
    paylimittest: function(req, res){
       return orderController.paylimittest(req, res)
    },
    
    getMerRefundOrderList: function(req, res){
        return orderController.getMerRefundOrderList(req, res)
    },

    exportMerRefundOrderList: function(req, res){
       return orderController.exportMerRefundOrderList(req, res)
    },

    updateLogisticsInfo: function(req, res) {
        return orderController.updateLogisticsInfo(req, res)
    },
    userShowList: function(req, res) {
        return orderController.userShowList(req, res)
    },
    getOrderDetail: function(req, res) {
        return orderController.getOrderDetail(req, res)
    },

    getMerOrderList: function(req, res) {
        return orderController.getMerOrderList(req, res)
    },
  
    updateOrderStatus: function(req, res){
        return orderController.updateOrderStatus(req, res)
    },

    adminRefundPre: function(req, res){
        return orderController.adminRefundPre(req, res)
    },
    
    merConfromRefund: function(req, res){
        return orderController.merConfromRefund(req, res)
       
    },

    findChargeid: function(req, res){
        return orderController.findChargeid(req, res)
    },
   
    adminRefund: function(req, res){
        return orderController.adminRefund(req, res)
    },

    merGetRefundOrder: function(req, res){
        return orderController.merGetRefundOrder(req, res)
    },

    clientDeleteOrder: function(req, res){
        return orderController.clientDeleteOrder(req, res)
    },

    afterSaleInfo: function (req, res) {
        return orderController.afterSaleInfo(req, res)
    },

    h5ExtraSave: function (req, res) {
        return orderController.h5ExtraSave(req, res)
    },
   
    h5ExtraGet: function (req, res) {
        return orderController.h5ExtraGet(req, res)
    },

    merDeleteOrder: function(req, res){
        return orderController.merDeleteOrder(req, res)
    },

    exportExcel: function (req, res) {
        return orderController.exportExcel(req, res);
    },

};