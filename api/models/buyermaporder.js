/**
* Buyermaporder.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports={
attributes:{
  parentordernumber: {type: 'string',size: 100,defaultsTo: ''},//父订单号
  childordernumber: {type: 'string',size: 100,defaultsTo: ''},//子订单号
  storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
  },
  autoPK: true,//id
  autoCreatedAt:true,//创建时间
  autoUpdatedAt:true//更新时间
};