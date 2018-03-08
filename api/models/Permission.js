module.exports = {
  attributes: {
  	parentid: {type:'integer',defaultsTo:0},//父权限id
    hid: {type: 'string',size: 200,defaultsTo: ''},//权限层级关系字符串
    name: {type: 'string',size: 100,defaultsTo: ''},//权限名称
    description: {type: 'string',size: 100,defaultsTo: ''},//权限描述
    controller: {type: 'string',size: 50,defaultsTo: ''},//控制器名称
    action: {type: 'string',size: 50,defaultsTo: ''},//控制器方法名
    sortorder:{type:'integer',size:'8'},//属性组排序
    is_store:{type:'integer',size:'1'} //1,3标示运营商权限 0,1,4标示总后台权限
  },
  autoPK: true,//权限id
  autoCreatedAt:true,
  autoUpdatedAt:true
};