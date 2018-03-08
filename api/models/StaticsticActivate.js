/**
 * StaticsticActivate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName:"statistic_activate",
  attributes: {
    id: {
      type: "integer",
      size: 11,
      primaryKey: true,
    },
    dev:{
      type: "string",
      size:100
    },
    model:{
      type: "string",
      size:20,
    },
    os:{
      type: "integer",
    },
    ov:{
      type: "string",
      size:10
    },
    version:{
      type:"string",
      size:10,
    },
    platform:{
      type:"string",
      size:20
    }
  },
  autoPk:false,
  autoCreatedAt:true,
  autoUpdatedAt:false,
};

