/*
Orderchild
子订单表
orderchild217
orderchild218
orderchild219
*/
module.exports={
  autoPK: true,//子订单id
attributes:{
  parentordernumber: {type: 'string',size: 100,defaultsTo: ''},//父订单号
  childordernumber: {type: 'string',size: 100,defaultsTo: ''},//子订单号生成公式为：主订单号+storeid+id

  tablenameofitem: {type: 'string',size: 100,defaultsTo: ''},//详细商品信息存放的表名:按月变化

  storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
  paymentid: {type: 'integer',defaultsTo:0},//1 合约金 2 支付宝 3 微信
  outordernumber: {type: 'string',size: 100,defaultsTo: ''},//外部交易流水号
  buyerid: {type: 'integer',defaultsTo:0},//用户ID
  buyername: {type: 'string',size: 100,defaultsTo: ''},//用户名
  remark: {type: 'string',size: 100,defaultsTo: ''},//订单备注
  status: {type: 'integer',defaultsTo:0},//订单状态。0未支付 1待发货 2待确认收货 3待评价 4交易完成  -1已取消
  paystatus: {type: 'integer',defaultsTo:0},//支付状态。1已支付   0待支付
  
  logisticsid: {type: 'integer',defaultsTo:0},//物流 ID，对应物流表id
  logisticsnumber: {type: 'string',size: 150,defaultsTo: ''},//物流单号
  consigneename: {type: 'string',size: 100,defaultsTo: ''},//收货人姓名
  consignee_region_id: {type: 'string',size: 100,defaultsTo: ''},//收货人所在地区 ID，填写最后一级
  consignee_region_name: {type: 'string',size: 100,defaultsTo: ''},//地区名称
  consignee_address: {type: 'string',size: 100,defaultsTo: ''},//收货人详细地址
  consignee_zipcode: {type: 'string',size: 100,defaultsTo: ''},//收货人邮编
  consignee_email: {type: 'string',size: 100,defaultsTo: ''},//收货人邮箱
  consignee_mobile: {type: 'string',size: 100,defaultsTo: ''},//收货人电话

  isinvoice: {type:'boolean',size:'1'},//是否有发票。1：有；0：无
  invoice_tax: {type: 'float',size:'15,4',required: true},//发票税额
  invoice_belong: {type: 'string',size: 100,defaultsTo: ''},//发票抬头

  freight: {type: 'float',size:'15,4',required: true},//运费
  count: {type: 'float',size:'15,4',required: true},//数量
  total_amount: {type: 'float',size:'15,4',required: true},//总金额
  payment_amount: {type: 'float',size:'15,4',required: true},//实付金额
  is_delivery: {type:'boolean',size:'1'},//是否收货（该字段暂时不用）
//退货状态 1 已成功退货2 等待审核(已申请退货)3 已审核/待退货4 用户已退货5 等待用户补交保证金 6用户已交保证金
  is_refund: {type: 'integer',defaultsTo:0},
  isdelete: {type:'boolean',size:'1'},//是否标记为删除状态。1是 0否
  is_del_user: {type:'boolean',size:'1'},//用户操作，是否标记为删除状态。1：是；0：否；-1：彻底删除
 
  pay_time: {type: 'datetime',defaultsTo:''},//支付时间
  delivery_time: {type: 'datetime',defaultsTo:''},//签收时间
  },
  autoCreatedAt:true,//创建时间
  autoUpdatedAt:true//更新时间
};