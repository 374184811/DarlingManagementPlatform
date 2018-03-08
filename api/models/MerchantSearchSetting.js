/**
 * MerchantSearchSetting.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: "setting_merchant_search",
    attributes: {
        home: {type: "string", defaultsTo: ""}, //主页搜索设置
        mall: {type: "string", defaultsTo: ""},//商城搜索设置
        shop: {type: "string", defaultsTo: ""},//店铺搜索设置
        customer: {type: "string", defaultsTo: ""},//自定义搜索设置
        num: {type: "integer", defaultsTo: 0},//每次显示数据条数
        storeid: {type: "integer", defaultsTo: 0},//店铺id
        addid: {type: "integer", defaultsTo: 0},//添加人id
        updateid: {type: "integer", defaultsTo: 0}//更新人id
    },
    autoPK: true,//id
    autoCreatedAt: true,//创建时间
    autoUpdatedAt: true,//更新时间
};

