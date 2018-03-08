/**
* Departmentgroup.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    parentid: {type:'integer',defaultsTo:0},//父id 部门id
    hid: {type: 'string',size: 100,defaultsTo: ''},//权限层级关系字符串
    name: {type: 'string',size: 50,defaultsTo: ''},//部门或者组的名称描述
    storeid: {type:'integer',defaultsTo:0},//运营商id
    addid: {type:'integer',defaultsTo:0},//添加者id
    permission: {type: 'string',defaultsTo: ''},//权限列表 每个权限用:相连   1001:1002:1003
    menus:{type: 'string',defaultsTo: '*'},
    isdelete: {type:'boolean',size:'1'},//是否删除
    updateid: {type:'integer',defaultsTo:0},//更新者id
    description:{type: 'string',defaultsTo: ''}//描述
  },
  autoPK: true,//部门或者组的id
  autoCreatedAt:true,
  autoUpdatedAt:true
};
/*
    
*/