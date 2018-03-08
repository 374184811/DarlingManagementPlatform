/*
Orderbuyer  + buyerID
用户的订单表动态创建原型表
*/
module.exports={
attributes:{
  tablenameofitem: {type: 'string',size: 100,defaultsTo: ''},//详细商品信息存放的表名:按月变化
  parentordernumber: {type: 'string',size: 100,defaultsTo: ''},//父订单号
  childordernumber: {type: 'string',size: 100,defaultsTo: ''},//子订单号
  storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
  },
  autoPK: true,//id
  autoCreatedAt:true,//创建时间
  autoUpdatedAt:false//更新时间
};
