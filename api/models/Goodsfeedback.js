/**
* Goodsfeedback.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models

*/

module.exports = {
  attributes: {
    storeid: {type:'integer',defaultsTo:0},                //运营商id
    mark: {type:'integer',defaultsTo:0},                      //评价等级
    goodsid: {type:'integer',defaultsTo:0},                   //商品id
    categoryid: {type:'integer',defaultsTo:0},                //商品类别id
    sku: {type: 'string',size: 200,defaultsTo: ''},           //商品货号
    goodsname: {type: 'string',size: 200,defaultsTo: ''},     //商品名称
    userid: {type:'integer',defaultsTo:0},                    //购买者id
    usermobile: {type:'integer',defaultsTo:0},                //购买者手机号
    content: {type:'text',defaultsTo:''}                      //评价内容
  },
  autoPK: true,// id
  autoCreatedAt:true,
  autoUpdatedAt:true
};
