var mysql = require("sails-mysql");
var Passwords = require('machinepack-passwords');
var crypto = require("crypto");
var fs = require("fs");
var merchantController = require('../publicController/merchantController');
module.exports = {
    goodsListView: function (req, res) {
        return merchantController.goodsListView(req, res);
    },
    /**
     * 运营商登录
     * @param req
     * @param res
     */
    login: function (req, res) {
        return merchantController.login(req, res);
    },
    /**
     * 退出登录
     * @param req
     * @param res
     */
    logout: function (req, res) {
        return merchantController.logout(req, res);
    },
    /**
     * 运营商注册
     * @param req
     * @param res
     */
    registerOnesetup: function (req, res) {
        return merchantController.registerOnesetup(req, res);
    },
    registerTwosetup: function (req, res) {
        return merchantController.registerTwosetup(req, res);
    },
    registerThreesetup: function (req, res) {
        return merchantController.registerThreesetup(req, res);
    },
    /**
     * 上传商户各种图片
     * @param req
     * @param res
     */
    uploadImage: function (req, res) {
        return merchantController.uploadImage(req, res);
    },
    /**
     * 商户后台入驻发送验证码
     * @param usermobile 手机号码
     * @param res
     */
    sendSmsCode: function (req, res) {
        return merchantController.sendSmsCode(req, res);
    },
    /**
     * 验证手机号是否已注册
     * @param usermobile 手机号码
     */
    validUser:function(req,res){
        return merchantController.validUser(req, res);
    },
    /**
     * 商户后台验证码有效性验证
     * @param usermobile 手机号码
     * @param mobilecode 验证码
     * @param res
     */
    validSms:function(){
        return merchantController.validSms(req, res);
    },
    checkIsPost: function (req, res) {
        return merchantController.validSms(req, res);
    },
    /**
     * 商户详情
     * @param sku storeid 任传一个
     * @param req
     * @param res
     */
    detail: function (req, res) {
        return merchantController.detail(req, res);
    },
    /**
     * 运营商默认密码设置
     *pwd 密码
     * @param req
     * @param res
     */
    defaultPwd: function (req, res) {
        return merchantController.defaultPwd(req, res);
    },
    /**
     * 判断用户密码是否设置
     * @param req
     * @param res
     */
    getDefaultPwd:function (req,res) {
        return merchantController.getDefaultPwd(req, res);
    },
    /**
     * 运营商状态修改
     * @param storeid int  店铺id 必须
     * @param status  int  状态[0=>审核失败,1审核成功] 必须
     * @param mark string 审核备注 非必须
     * @param req
     * @param res
     */
    examine: function (req, res) {
        return merchantController.examine(req, res);
    },
    /**
     * 搜索设置
     * home string 主页搜索提示 非必传
     * mall string 商城搜索提示 非必传
     * shop string 商家搜索提示 非必传
     * customer string 退款售后提示 非必传
     * num int 历史搜索条数 非必传
     * @param req
     * @param res
     */
    searchSet: function (req, res) {
        return merchantController.searchSet(req, res);
    },
    /**
     * 获取搜索配置
     * searchGet获取搜索设置
     * storeid int 店铺id
     * @param req
     * @param res
     */
    searchGet: function (req, res) {
        return merchantController.searchGet(req, res);
    },
    /**
     * 设置提示信息
     * @param topics json数组{money:"你的合约金金额为:"}
     * @param req
     * @param res
     */
    setTopic:function (req,res) {
        return merchantController.setTopic(req,res);
    },
    /**
     * 获取消息提示
     * @param tokenId 用户登录tokenId 非必传,不传默认是后台登陆用户
     * @param mId int 用户的id 非必传,不传默认是后台登陆用户
     * @param req
     * @param res
     */
    getTopic:function (req,res) {
        return merchantController.getTopic(req,res);
    },
    /**
     * 运营商建立异业联盟和利润比例调整
     * @param storeid int 发起请求的店铺id
     * @param store_name int 发起请求的店铺店铺名称
     * @param type int 请求类型:1建立异业联盟，2利润分成比例
     * @param status int 状态 1是同意，0是不同意
     * @param msgId int 消息id
     * @param profit int 利润分成比例
     *
     * @param req
     * @param res
     */
    trade:function (req,res) {
        return merchantController.trade(req,res);
    },
    /**
     * 修改密码
     * @param req
     * @param res
     */
    modifyPwd: function (req, res) {
        return merchantController.modifyPwd(req,res);
    },
    /**
     * 存储发票须知
     * @param invoiceNotice  发票须知内容
     * @param mine  登录用户,session
     */
    setInvoiceNotice: function(req, res){
        return merchantController.setInvoiceNotice(req,res);
    },
     /**
     * 获取发票须知
     * @param tokenId  用户传入的tokenId
     * @param mine  session中的值
      * @param storeid  购买商品所属运营商的storeid(客户端必传)
     * @param mId  登录用户
     */
    getInvoiceNotice: function(req, res){
        return merchantController.getInvoiceNotice(req,res);
    },
    /**
     * 存储发票限制额度和提示信息
     * @param invoicelimit  额度
     * @param invoiceinfo  提示信息
     * @param
     */
    setInvLimitInfo: function(req, res){
        return merchantController.setInvLimitInfo(req,res);
    },
    /**
     * 获取发票限制额度和提示信息
     * @param tokenId  用户传入的tokenId
     * @param mine  session中的值
     * @param mId  登录用户
     */
    getInvLimitInfo: function(req, res){
        return merchantController.getInvLimitInfo(req,res);
    },
    /**
     * 存储优惠卷兑换码规则
     * merchant/setExchangeRule
     * @param rule  惠卷兑换码规则内容
     */
    setExchangeRule: function(req, res){
        return merchantController.setExchangeRule(req,res);
    },
    /**
    * 获取兑换码规则
    * @param tokenId  用户传入的tokenId
    * @param mine  session中的值
    * @param storeid  商品所属的storeid
    * @param mId  登录用户
    */
    getExchangeRule: function(req, res){
        return merchantController.getExchangeRule(req,res);
    },
    /*获取确认时间
    * @param ordernumber  订单号或退单号
    * @param type  1-订单详情，2-售后订单详情
    */
    getConfirmTime: function(req, res){
        return merchantController.getConfirmTime(req,res);
    },
    /**
    *增加确认时间
    * @param ordernumber  订单号或退单号
    * @param tablenameofitem  子表表名
    * @param type  1-订单详情，2-售后订单详情
    */
    addConfirmTime: function(req, res){
        return merchantController.addConfirmTime(req,res);
    },
    /**
     *设置商户后台默认密码是否已标识
     * @param storeid  商户id
     */
    setDefPasswordFlag:function(req,res){
        return merchantController.setDefPasswordFlag(req,res);
    },
    /**
     *检测商户后台默认密码设置标识
     * @param storeid  商户id
     */
    checkPasswordFlag:function(req,res){
        return merchantController.checkPasswordFlag(req,res);
    },
    /**
     * 运营商建立异业联盟和利润比例调整
     * @param storeid int 发起请求的店铺id
     * @param store_name int 发起请求的店铺店铺名称
     * @param type int 请求类型:1建立异业联盟，2利润分成比例
     * @param status int 状态 1是同意，0是不同意
     * @param msgId int 消息id
     * @param profit int 利润分成比例
     *
     * @param req
     * @param res
     */
    trade:function (req,res) {
        return merchantController.trade(req,res);

    },
    verifyCode: function (req, res) {
        return merchantController.verifyCode(req,res);
    },
    verifyCode1: function (req, res) {
        return merchantController.verifyCode1(req,res);
    },
}
;

