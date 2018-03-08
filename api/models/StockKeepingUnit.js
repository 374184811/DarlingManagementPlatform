/**
 * StockKeepingUnit.js
 * 用户（买家信息表）
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    attributes: {
        sku: {//商品SKU
            type: 'string',
            size: 64,
            defaultsTo: ''
        },
        isuse: {//是否使用 0未使用 1已使用
            type: 'integer',
            defaultsTo: 0
        },
    },
    autoPK: true,
    autoCreatedAt: true,
    autoUpdatedAt: true,
};