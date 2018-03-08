var merchantNotifyController = require('../publicController/merchantNotifyController');


/**
 * MerchantNotifyController
 *
 * @description :: Server-side logic for managing Merchantnotifies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    /**
     * 显示运营商公告列表
     *@param start datetime 起始时间 非必须
     *@param end   datetime 起始时间 非必须
     *@param title  string 标题  非必须
     *@param destroy int 是否已经删除  非必须
     *@param num  int 每次显示多少页  非必须
     *@param page  int 页码  非必须
     * `MerchantNotifyController.index()`
     */
    index: function (req, res) {
        return merchantNotifyController.index(req, res)
    },
    /**
     * 运营商获取自己公告列表
     * `MerchantNotifyController.index()`
     */
    merchant: function (req, res) {
        return merchantNotifyController.merchant(req, res)
    },

    /**
     * 添加公告
     * publishtype int 0立即发布 1定时发布 非必须
     * publishtime  datetime 发布时间 非必须
     * title  string 标题 非必须
     * detailbody  string 内容 必须
     * `MerchantNotifyController.add()`
     */
    add: function (req, res) {
        return merchantNotifyController.add(req, res)
    },
    /**
     * update 更新公告
     * publishtype int 0立即发布 1定时发布 非必须
     * publishtime  datetime 发布时间 非必须
     * title  string 标题 非必须
     * detailbody  string 内容 非必须
     * id int 公告id 必须
     * `MerchantNotifyController.update()`
     */
    update: function (req, res) {
        return merchantNotifyController.update(req, res)
    },
    /**
     * 删除公告
     * id int 公告id 必须
     * `MerchantNotifyController.delete()`
     */
    delete: function (req, res) {
        return merchantNotifyController.delete(req, res)
    },
    /**
     * @param id int 公告id
     * 发布
     * @param req
     * @param res
     */
    publish:function(req,res){
        return merchantNotifyController.publish(req, res)
    },
    /**
     * 查看公告
     * id int 公告id 必须
     * `MerchantNotifyController.view()`
     */
    view: function (req, res) {
        return merchantNotifyController.view(req, res)
    },
    /**
     *更改商户后台公告消息阅读状态
     * @param noticeid 公告id
     * @param readstore 公告readstore的值
     */
    updateNoticeFlag:function(req,res){
        return merchantNotifyController.updateNoticeFlag(req, res)
    },
};

