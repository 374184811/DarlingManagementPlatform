module.exports={
attributes:{
  //商户 ID
  storeid: {type: 'integer',defaultsTo:0},
  limitnum: {type: 'integer',defaultsTo:0},//限购的数目
  sku: {type: 'string',size: 100,defaultsTo: ''},//商品编号
  isopen: {type: 'integer',defaultsTo:0}//限购是否开启
  },
  autoPK: true,// ID
  autoCreatedAt:false,
  autoUpdatedAt:false
};
