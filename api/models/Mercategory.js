module.exports = {
  attributes: {
    //categoryid:{type:'integer',primaryKey:true},
    parentid:{type:'integer',size:'10',defaultsTo:0},//父类别id
    hid:{type:'string',size:'255'},//层级描述字符串
    categoryname:{type:'string',size:'100'},//商品类别名称
    description:{type:'string',size: '255'},//详细描述
    sortorder:{type:'integer',size:'8'},//类别排序
    storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
    status :{type:'boolean',size:'1',defaultsTo:0},//状态1:启用  0:不启用
    ischannel :{type:'boolean',size:'1',defaultsTo:0}//用户id
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};
