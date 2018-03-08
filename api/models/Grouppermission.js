/**
* Loguser.js
* 
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  attributes: {
    groupid:{type:'integer',defaultsTo:0},//组id
    permission: {type:'text',defaultsTo:''},//权限列表 每个权限用:相连   1001:1002:1003
  },
  autoPK: true,
  autoCreatedAt:true,
  autoUpdatedAt:true
};
/*
    
*/