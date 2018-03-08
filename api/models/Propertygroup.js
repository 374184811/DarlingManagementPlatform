module.exports = {
  attributes: {
    groupname:{type:'string',size:'50'},//属性组名称
    description:{type:'string',size: '100'},//属性组描述
    sortorder:{type:'integer',size:'8'},//属性组排序
    status :{type:'boolean',size:'1'}//是否开启该属性组
  },
  autoPK: true,//属性组id
  autoCreatedAt:false,
  autoUpdatedAt:false
};