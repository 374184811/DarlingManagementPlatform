/**
* Navigation.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    parentid: {type:'integer',defaultsTo:0},//父id 添加者id
    hid: {type: 'string',size: 100,defaultsTo: ''},//层级关系字符串
    name: {type: 'string',size: 100,defaultsTo: ''},//名字描述
    description: {type: 'string',size: 100,defaultsTo: ''},//描述
    icon: {type: 'string',size: 250,defaultsTo: ''},//导航图标路径

    link: {type: 'string',size: 250,defaultsTo: ''},//链接
    serverlink: {type: 'string',size: 250,defaultsTo: ''},//服务器链接
    loadtype: {type:'integer',defaultsTo:0},//加载方式1:ajax加载 2:客户端路由
    sortorder: {type:'integer',defaultsTo:0},//所在组id 默认0
    status: {type:'boolean',size:'1'},//是否启用。1：是；0：否
  },
  autoPK: true,//navigation id
  autoCreatedAt:true,
  autoUpdatedAt:true
};