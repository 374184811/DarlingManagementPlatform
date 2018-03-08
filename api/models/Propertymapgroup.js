module.exports = {
  attributes: {
    propertyid:{type:'integer',size:'11'},//属性id
    groupid:{type:'integer',size:'11'},//属性组id
    sortorder:{type:'integer',size:'8'}//排序
  },
  autoPK: true,
  autoCreatedAt:false,
  autoUpdatedAt:false
};