
var serchController = require('../publicController/serchController')

module.exports = {

    /**
     * 搜索用户
     *
     *
     * @return { 返回结果集 }                   
     */
    serchUser: function (req, res) {
        return serchController.serchUser(req,res);
    },

    /**
     * 搜索商户
     *
     *
     * @return { 返回结果集 }                   
     */
    serchMer: function (req, res) {
        return serchController.serchMer(req,res);
    },


    /**
     * 商户上架商品验证规格类别，验证通过直接上架
     * 
     *
     * @return { 返回结果集 }                   
     */
    serchCategoryWithProval: function(req, res) {
        return serchController.serchCategoryWithProval(req,res);
    },

     /**
     * 所有商户
     *
     *
     * @return { 返回结果集 }                   
     */
    serchAllMer: function (req, res) {
        return serchController.serchAllMer(req,res);
    },

    /**
     * 商户类别
     *
     *
     * @return { 返回结果集 }                   
     */
    serchStoreidCategory: function (req, res) {
        return serchController.serchStoreidCategory(req,res);
    },


    /**
     * 商户详情
     *
     *
     * @return { 返回结果集 }                   
     */
    serchMerDetal: function (req, res) {
        return serchController.serchMerDetal(req,res);
    },

    /**
     * 用户详情
     *
     *
     * @return { 返回结果集 }                   
     */
    serchUserDetal: function (req, res) {
        return serchController.serchUserDetal(req,res);
    },

    /**
     * 添加用户
     *
     *
     * @return { 返回结果集 }                   
     */
    addUser: function (req, res) {
        return serchController.serchUserDetal(req,res);
    },

    /**
     * 商品详情
     *
     *
     * @return { 返回结果集 }                   
     */
    serchGoodsDetails: function (req, res) {
        return serchController.serchGoodsDetails(req,res);
    },

    /**
     * 商户商品
     *
     *
     * @return { 返回结果集 }                   
     */
    serchStoreGoods: function (req, res) {
        return serchController.serchStoreGoods(req,res);
    },

    /**
     * 规格和类别
     *
     *
     * @return { 返回结果集 }                   
     */
    serchNormsWithClassify: function (req, res) {
        return serchController.serchNormsWithClassify(req,res);
    },

    /**
     * 状态编辑
     *
     *
     * @return { 返回结果集 }                   
     */
    statusOperate: function (req, res) {
        return serchController.statusOperate(req,res);
    },

    /**
     * 用户冻结
     * *ids string 用户id组成的字符串，用,分割
     * @return { 返回结果集 }
     */
    frozenUser: function (req, res) {
        return serchController.frozenUser(req,res);
    },
    /**
     * 解冻用户
     * *ids string 用户id组成的字符串，用,分割
     * @param req
     * @param res
     */
    thawUser:function(req,res) {
        return serchController.thawUser(req,res);
    },
    /**
     * 用户停用
     * ids string 用户id组成的字符串，用,分割
     * @param req
     * @param res
     */
    disableUser:function (req,res) {
        return serchController.disableUser(req,res);
    },
    /**
     * 用户解除停用
     *  ids string 用户id组成的字符串，用,分割
     * @param req
     * @param res
     * @returns {*}
     */
    enableUser:function (req,res) {
        return serchController.enableUser(req,res);
    },
    /**
     * 重置密码
     * @param req
     * @param res
     */
    resetPwd: function (req, res) {
        return serchController.resetPwd(req,res);
    },

    /**
     * 搜索商品
     *
     *
     * @return { 返回结果集 }                
     */
    serchGoods: function (req, res) {
        return serchController.serchGoods(req,res);
    },

    serchSellerGoods: function(goods, req, res) {
        return serchController.serchSellerGoods(req,res);
    },

    /**
     * 商城管理
     *
     *
     * @return { 返回结果集 }                
     */
    serchGoodsClassify: function(req, res){
        return serchController.serchGoodsClassify(req,res);
    },

     /**
     * 搜索店铺内商品
     *
     *
     * @return { 返回结果集 }                
     */
    serchMeShops: function (req, res) {
        return serchController.serchMeShops(req,res);
    },

     /**
     * 搜索店铺类别商品
     *
     *
     * @return { 返回结果集 }                
     */
    serchShopsClassify: function(req, res) {
        return serchController.serchShopsClassify(req,res);
    },

    /**
     * 搜索店铺内类别
     *
     *
     * @return { 返回结果集 }                
     */
    serchMeShopsClassify: function (req, res) {
        return serchController.serchMeShopsClassify(req,res);
    },

     /**
     * 搜索店铺内所有类别
     *
     *
     * @return { 返回结果集 }                
     */
    serchMeShopsCategory: function (req, res) {
        return serchController.serchMeShopsCategory(req,res);
    },

    /**
     * 搜索规格主类关联商品数量
     *
     *
     * @return { 返回结果集 }                
     */
    serchNormsGoods: function (req, res) {
        return serchController.serchNormsGoods(req,res);
    },

    /**
     * 搜索规格主类关联商品数量
     *
     *
     * @return { 返回结果集 }                
     */
    serchCategoryGoods: function (req, res) {
        return serchController.serchNormsGoods(req,res);
    },    
};