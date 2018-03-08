module.exports = {
  attributes: {
    propertyid:{type:'integer',size:'11'},//属性id
    propertyvalue:{type:'string',size:'255'},//属性值
    propertyimage:{type:'string',size: '255'},//属性值对应的图片
    sortsorder:{type:'integer',size:'8'},//排序
    status :{type:'boolean',size:'1'}//状态 1启用 0不启用
  },
  autoPK: true,
  autoCreatedAt:false,
  autoUpdatedAt:false
};
