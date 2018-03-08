/**
* Navigation.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
提示文字：主页搜索：商城搜索：商家搜索：退款售后
*/

module.exports = {
  attributes: {
    storeid: {type:'integer',defaultsTo:0},               //运营商id
    mainhint: {type: 'string',size: 200,defaultsTo: ''},     //主页搜索提示
    merchanthint: {type: 'string',size: 200,defaultsTo: ''}, //商家搜索提示
    mallhint: {type: 'string',size: 200,defaultsTo: ''},     //商城搜索提示
    refundhint: {type: 'string',size: 200,defaultsTo: ''},   //退款售后搜索提示
  },
  autoPK: true,// id
  autoCreatedAt:true,
  autoUpdatedAt:true
};