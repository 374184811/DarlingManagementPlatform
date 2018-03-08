/**
* Merchantrecommendation.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
  	storeid: {type:'integer',defaultsTo:0},//运营商id
  	goodsid: {type:'integer',defaultsTo:0},//商品id
  	storecategoryid: {type:'integer',defaultsTo:0},//商品类别id
  	order: {type:'integer',defaultsTo:0},//运营商推荐的商品排序
    imagedefault: {type: 'string',size: 250,defaultsTo:''},//默认图片，即封面
    goodsname: {type: 'string',size: 50,defaultsTo: ''}//商品名称
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};
/*
    
*/