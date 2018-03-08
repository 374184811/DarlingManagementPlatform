/**
* Sysconstant.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports={
attributes:{
  //运营商 ID
  storeid: {type: 'integer',defaultsTo:0},
  //5星名称
  star1: {type: 'string',size: 30,defaultsTo: ''},
  star2: {type: 'string',size: 30,defaultsTo: ''},
  star3: {type: 'string',size: 30,defaultsTo: ''},
  star4: {type: 'string',size: 30,defaultsTo: ''},
  star5: {type: 'string',size: 30,defaultsTo: ''},
  //合约金额的名称
  vipmoneyname: {type: 'string',size: 80,defaultsTo: ''},
  //商品分享 类型 0 商品标题+内容输入框 ， 1 自定义内容
  sharetype: {type:'integer',defaultsTo:0},
  //商品分享内容
  sharecontent: {type: 'string',size: 250,defaultsTo: ''},
  //首页第一模块随机分配背景图片（最高6张）图片路径
  bgpicpath1: {type: 'string',size: 250,defaultsTo: ''},
  bgpicpath2: {type: 'string',size: 250,defaultsTo: ''},
  bgpicpath3: {type: 'string',size: 250,defaultsTo: ''},
  bgpicpath4: {type: 'string',size: 250,defaultsTo: ''},
  bgpicpath5: {type: 'string',size: 250,defaultsTo: ''},
  bgpicpath6: {type: 'string',size: 250,defaultsTo: ''},
  //客户端相关协议管理文件路径
  protocolfilepath: {type: 'string',size: 250,defaultsTo: ''},
  },
  autoPK: true,// ID
  autoCreatedAt:true,
  autoUpdatedAt:false
};
 