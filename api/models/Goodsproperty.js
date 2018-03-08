module.exports = {
  attributes: {
    name:{type:'string',size:'50'},//参数名
    //参数值输入标签类型
    valueoftype:{type:'string',enum:['text','select','checkbox','radio','textarea','file'],defaultsTo:'text'},
    aliasname:{type:'string',size:'50'},//标签名称
    description:{type:'string',size:'50'},//参数说明
    sortorder:{type:'integer',size:'8'},//序号

    storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
    isenable:{type:'integer',size:'8'},//是否开启规格（开启后将和价格、库存等相关联）1是 0否
    status :{type:'boolean',size:'1'},//状态 1启用 0不启用
  },
  autoPK: true,//  属性参数id
  autoCreatedAt:false,
  autoUpdatedAt:false
};
