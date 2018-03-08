/**
 * LogOperateUser.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName:"log_operate_user",
  attributes: {
    id:{
      type:"integer",
      size:11
    },
    uid:{
      type:"integer",
      size:11,
    },
    type:{
      type:"integer",
      size:1,
    },
    opname:{
      type:"string",
      size:50,
    },
    end_time:{
      type:"datetime"
    },
    rec_name:{
      type:"string",
      size:50,
    },
    rec_time:{
      type:"datetime"
    },
    createdAt:{
      type:"datetime",
    },
  },
  autoCreatedAt:true,
  autoUpdatedAt:false,
};

