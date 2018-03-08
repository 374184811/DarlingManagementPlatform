/**
* Navigationshopping.js
* 商城导航
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    name: {type: 'string',size: 100,defaultsTo: ''},//名字描述
    description:  {type:'text',defaultsTo:''},//描述 cid:gid:name:picurl,
    icon: {type: 'string',size: 250,defaultsTo: ''},//导航图标路径

    link: {type: 'string',size: 250,defaultsTo: ''},//链接
    serverlink: {type: 'string',size: 250,defaultsTo: ''},//服务器链接
    storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
    sortorder: {type:'integer',defaultsTo:0},//排序
    isedit: {type:'boolean',size:'1'},//是否可编辑。1：是；0：否
    isdelete: {type:'boolean',size:'1'},//是否可删除。1：是；0：否
    status: {type:'boolean',size:'1'},//是否启用。1：是；0：否
  },
  autoPK: true,//navigation id
  autoCreatedAt:true,
  autoUpdatedAt:true
};