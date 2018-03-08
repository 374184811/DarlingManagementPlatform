/**
* Loguser.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    name: {type: 'string',size: 50,defaultsTo: ''},//部门名称
    storeid: {type: 'integer',defaultsTo:0},//运营商商家商户 ID
  
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};
/*
    
*/