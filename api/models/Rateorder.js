// 评价表
module.exports={
attributes:{
  //买家 ID
  userid: {type: 'integer',defaultsTo:0},
  buyername: {type: 'string',size: 100,defaultsTo: ''},//买家名
  goods_property: {type: 'string',size: 100,defaultsTo: ''},//商品属性
  //卖家 ID
  storeid: {type: 'integer',defaultsTo:0},
  ordernumber: {type: 'string',size: 100,defaultsTo: ''},//父订单号
  orderdetailid: {type: 'integer',defaultsTo:0},//子订详情表中的id
  tablenameofitem: {type: 'string',size: 100,defaultsTo: ''},//详细商品信息存放的表名:按月变化
  mobile: {type: 'string',size: 100,defaultsTo: ''},//买家电话
  goodsname: {type: 'string',size: 100,defaultsTo: ''},//商品名称
  //5star  几颗星 1,2,3,4,5
  starnum: {type:'integer',defaultsTo:0},
  //商品货号
  sku: {type: 'string',size: 150,defaultsTo: ''},
  //评价上传图片
  picurl: {type: 'text',defaultsTo: ''},
  //vr图片配置文件地址
  vrxmlurl: {type: 'text',defaultsTo: ''},
  isdelete: {type:'boolean',size:'1'},//是否标记为删除状态。1是 0否
  ratetext: {type:'text',defaultsTo:''},//评价详细内容
  },
  autoPK: true,//ID
  autoCreatedAt:true,
  autoUpdatedAt:true
};
