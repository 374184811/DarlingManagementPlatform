/**
 * SettingController
 * @description :: Server-side logic for managing settings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var xss=require("xss");
var settingController = require('../publicController/settingController');
module.exports = {
    /**
     * 要设置的键值
     *@param name 键名
     *@param title 键的名称
     *@param val 值
     */
    update: function (req, res) {
        return settingController.update(req,res);
    },
    /**
     * name 要获取的数据名称
     * @param req
     * @param res
     */
    get: function (req, res) {
        return settingController.get(req,res);
    },
    /**
     * 上传图片文件
     * @param req
     * @param res
     */
    uploadImg: function (req, res) {
        return settingController.uploadImg(req,res);
    },
    /**
     * 通用设置多行设置
     * @param setting string[array] 必传 [合约金=>contractGold,商品分享=>goodShare,自定义内容分享=>customContent,评价等级=>evaluationScore,首页第一模块背景图片=>firstModuleBackground,用户协议=>userAgreement]
     * @param req
     * @param res
     */
    multiSet:function(req,res){
        return settingController.multiSet(req,res);
    },
    /**
     * @param type int [1系统设置,2通用设置] 必传
     * @param req
     * @param res
     */
    multiGet: function (req, res) {
        return settingController.multiGet(req,res);
    },
    /**
     * @agreement 上传用户协议
     * agreement file 协议文件docx类型
     * @param req
     * @param res
     */
    uploadAgreement:function(req,res){
        return settingController.uploadAgreement(req,res);
    },

};

