module.exports={
attributes:{
  //买家 ID
  userid: {type: 'integer',defaultsTo:0},
  //商户 ID
  storeid: {type: 'integer',defaultsTo:0},
  
  //商品货号
  sku: {type: 'string',size: 150,defaultsTo: ''},
  // 商品单价
  price: {type: 'float',size:'15,4',required: true},//金额
 //商品点卷价格  即 合约价格
 pricepoint:{type: 'float',size:'15,4',required: true},
 //商品活动价格
 pricepromotion:{type: 'float',size:'15,4',required: true},

  //商品图片
  picurl: {type: 'string',size: 150,defaultsTo: ''},
  isdelete: {type:'boolean',size:'1'},//是否标记为删除状态。1是 0否
  //数量
  num:{type:'integer',defaultsTo:0}
  },
  autoPK: true,//购物车 ID
  autoCreatedAt:true,
  autoUpdatedAt:true
};
