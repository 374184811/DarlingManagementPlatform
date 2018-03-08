/**
 * MerchantMsg.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'merchant_message',
    attributes: {
        //公告添加者id,若无发送者默认为-1
        sid: {type: 'integer', defaultsTo: 0},
        //發送者姓名
        sendname: {type: 'string', defaultsTo: ''},
        //發送者圖像
        sendavatar: {type: 'string', defaultsTo: ''},
        rid: {type: "integer", defaultsTo: 0},//接受者id
        rname: {type: "string", defaultsTo: ""}, //接受者名字
        rstore: {type: "integer", defaultsTo: 0},//接受者店铺id
        //公告标题
        title: {type: 'string', size: 200, defaultsTo: ''},
        //公告详细内容
        detailbody: {type: 'text', defaultsTo: ''},
        //1 查看,0未查看,2已操作
        status: {type: 'integer', size: 0},
        //type: 0 是普通消息,
        //type: 1 是异业联盟申请 
        //type: 2 其他运营商统一或拒绝该运营商的申请 
        //type: 3 异业联盟分润比例调整申请,
        //type: 4 用户生成订单且支付 
        //type: 5 商品审核通过/不通过,
        //type: 6 商品总库存 
        //type: 7 用户发起退换货申请 
        //type: 8 平台方编辑了该商户信息/商品信息/删除了评论/删除商品
        type: {type: 'integer', size: 0},
    },
    autoPK: true,// ID
    autoCreatedAt: true,
    autoUpdatedAt: true,

    loadData:function (obj) {
        var _this=this;
        var dat={};
        for(var key in obj){
            for(var prioprity in _this.attributes){
                if(key==prioprity){
                   dat[prioprity]= obj[key];
                }
            }
        }
        delete dat.status;
         return dat;
    },


};

